"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  getProduct,
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  type ColorKey,
  type Product,
  type Size,
} from "./products";

export type CartLine = { slug: string; color: ColorKey; size: Size; qty: number };
export type CartItem = CartLine & { product: Product; lineTotal: number; maxQty: number };

type Persisted = { lines: CartLine[]; wishlist: string[]; promo: string | null };
type State = Persisted & { ready: boolean };

type Action =
  | { type: "hydrate"; state: Persisted }
  | { type: "add"; line: CartLine }
  | { type: "qty"; key: string; qty: number }
  | { type: "size"; key: string; size: Size }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "toggleWish"; slug: string }
  | { type: "promo"; code: string | null };

const STORAGE_KEY = "concrete-store-v1";
const empty: State = { lines: [], wishlist: [], promo: null, ready: false };

export const lineKey = (l: Pick<CartLine, "slug" | "color" | "size">) =>
  `${l.slug}|${l.color}|${l.size}`;

const stockOf = (slug: string, size: Size) => getProduct(slug)?.stock[size] ?? 0;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...action.state, ready: true };
    case "add": {
      const key = lineKey(action.line);
      const max = stockOf(action.line.slug, action.line.size);
      const existing = state.lines.find((l) => lineKey(l) === key);
      const lines = existing
        ? state.lines.map((l) =>
            lineKey(l) === key ? { ...l, qty: Math.min(max, l.qty + action.line.qty) } : l,
          )
        : [...state.lines, { ...action.line, qty: Math.min(max, action.line.qty) }];
      return { ...state, lines };
    }
    case "qty":
      return {
        ...state,
        lines: state.lines
          .map((l) =>
            lineKey(l) === action.key
              ? { ...l, qty: Math.max(0, Math.min(stockOf(l.slug, l.size), action.qty)) }
              : l,
          )
          .filter((l) => l.qty > 0),
      };
    case "size": {
      const current = state.lines.find((l) => lineKey(l) === action.key);
      if (!current) return state;
      const moved = { ...current, size: action.size };
      const rest = state.lines.filter((l) => lineKey(l) !== action.key);
      const merged = rest.find((l) => lineKey(l) === lineKey(moved));
      const max = stockOf(moved.slug, moved.size);
      if (merged) {
        return {
          ...state,
          lines: rest.map((l) =>
            l === merged ? { ...l, qty: Math.min(max, l.qty + moved.qty) } : l,
          ),
        };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          lineKey(l) === action.key ? { ...moved, qty: Math.min(max, moved.qty) } : l,
        ),
      };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => lineKey(l) !== action.key) };
    case "clear":
      return { ...state, lines: [], promo: null };
    case "toggleWish":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.slug)
          ? state.wishlist.filter((s) => s !== action.slug)
          : [action.slug, ...state.wishlist],
      };
    case "promo":
      return { ...state, promo: action.code };
  }
}

type Totals = {
  count: number;
  subtotal: number;
  discount: number;
  /** subtotal − discount, before shipping */
  merchandise: number;
  freeShippingLeft: number;
  freeShipping: boolean;
};

type Store = {
  ready: boolean;
  items: CartItem[];
  wishlist: string[];
  promo: string | null;
  totals: Totals;
  add: (line: CartLine) => void;
  setQty: (key: string, qty: number) => void;
  setSize: (key: string, size: Size) => void;
  remove: (key: string) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  /** Mini-cart drawer */
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, empty);
  const [cartOpen, setCartOpen] = useState(false);

  // Load after mount (never during render) so server and client HTML match.
  useEffect(() => {
    let restored: Persisted = { lines: [], wishlist: [], promo: null };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Persisted>;
        const lines = (parsed.lines ?? []).filter(
          (l) => getProduct(l.slug) && l.qty > 0 && stockOf(l.slug, l.size) > 0,
        );
        const wishlist = (parsed.wishlist ?? []).filter((s) => getProduct(s));
        const promo = parsed.promo && PROMO_CODES[parsed.promo] ? parsed.promo : null;
        restored = { lines, wishlist, promo };
      }
    } catch {
      /* Storage is optional: a private window simply starts empty. */
    }
    dispatch({ type: "hydrate", state: restored });
  }, []);

  const { ready } = state;
  useEffect(() => {
    if (!ready) return;
    try {
      const { lines, wishlist, promo } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, wishlist, promo }));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const items = useMemo<CartItem[]>(
    () =>
      state.lines.flatMap((l) => {
        const product = getProduct(l.slug);
        if (!product) return [];
        return [{ ...l, product, lineTotal: product.price * l.qty, maxQty: stockOf(l.slug, l.size) }];
      }),
    [state.lines],
  );

  const totals = useMemo<Totals>(() => {
    const subtotal = items.reduce((a, i) => a + i.lineTotal, 0);
    const rate = state.promo ? (PROMO_CODES[state.promo] ?? 0) : 0;
    const discount = Math.round(subtotal * rate * 100) / 100;
    const merchandise = subtotal - discount;
    return {
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal,
      discount,
      merchandise,
      freeShippingLeft: Math.max(0, FREE_SHIPPING_THRESHOLD - merchandise),
      freeShipping: merchandise >= FREE_SHIPPING_THRESHOLD,
    };
  }, [items, state.promo]);

  const add = useCallback((line: CartLine) => dispatch({ type: "add", line }), []);
  const setQty = useCallback((key: string, qty: number) => dispatch({ type: "qty", key, qty }), []);
  const setSize = useCallback((key: string, size: Size) => dispatch({ type: "size", key, size }), []);
  const remove = useCallback((key: string) => dispatch({ type: "remove", key }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const toggleWish = useCallback((slug: string) => dispatch({ type: "toggleWish", slug }), []);
  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!PROMO_CODES[normalized]) return false;
    dispatch({ type: "promo", code: normalized });
    return true;
  }, []);
  const clearPromo = useCallback(() => dispatch({ type: "promo", code: null }), []);

  const value: Store = {
    ready,
    items,
    wishlist: state.wishlist,
    promo: state.promo,
    totals,
    add,
    setQty,
    setSize,
    remove,
    clear,
    toggleWish,
    applyPromo,
    clearPromo,
    cartOpen,
    openCart: useCallback(() => setCartOpen(true), []),
    closeCart: useCallback(() => setCartOpen(false), []),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside <StoreProvider>");
  return store;
}
