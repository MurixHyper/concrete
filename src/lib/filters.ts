import {
  products,
  COLORS,
  CATEGORY_LABEL,
  SIZES,
  isSoldOut,
  type Category,
  type ColorKey,
  type Gender,
  type Product,
  type Size,
} from "./products";

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];
export const DROPS = [
  { value: "drop-01", label: "Drop 01" },
  { value: "archive", label: "Archive" },
] as const;
export type DropKey = (typeof DROPS)[number]["value"];

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "Newest" },
  { value: "popular", label: "Most wanted" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;
export type SortKey = (typeof SORTS)[number]["value"];

export type Filters = {
  gender: Gender[];
  category: Category[];
  color: ColorKey[];
  size: Size[];
  drop: DropKey[];
  sort: SortKey;
};

type Raw = Record<string, string | string[] | undefined>;

function list<T extends string>(raw: Raw, key: string, allowed: readonly T[]): T[] {
  const v = raw[key];
  const str = Array.isArray(v) ? v.join(",") : (v ?? "");
  const out = str
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is T => (allowed as readonly string[]).includes(s));
  return [...new Set(out)];
}

const CATEGORY_KEYS = Object.keys(CATEGORY_LABEL) as Category[];
const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];
const SIZE_KEYS = SIZES.map((s) => s.toLowerCase());

/** Unknown or malformed params are ignored rather than breaking the page. */
export function parseFilters(raw: Raw): Filters {
  const sortRaw = typeof raw.sort === "string" ? raw.sort : "";
  return {
    gender: list(raw, "gender", GENDERS.map((g) => g.value)),
    category: list(raw, "category", CATEGORY_KEYS),
    color: list(raw, "color", COLOR_KEYS),
    size: list(raw, "size", SIZE_KEYS).map((s) => s.toUpperCase() as Size),
    drop: list(raw, "drop", DROPS.map((d) => d.value)),
    sort: (SORTS.some((s) => s.value === sortRaw) ? sortRaw : "featured") as SortKey,
  };
}

export function toQuery(f: Filters): string {
  const q = new URLSearchParams();
  if (f.gender.length) q.set("gender", f.gender.join(","));
  if (f.category.length) q.set("category", f.category.join(","));
  if (f.color.length) q.set("color", f.color.join(","));
  if (f.size.length) q.set("size", f.size.map((s) => s.toLowerCase()).join(","));
  if (f.drop.length) q.set("drop", f.drop.join(","));
  if (f.sort !== "featured") q.set("sort", f.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}

const dropKey = (p: Product): DropKey => (p.drop === "Archive" ? "archive" : "drop-01");

export function applyFilters(f: Filters): Product[] {
  const out = products.filter(
    (p) =>
      (!f.gender.length || f.gender.includes(p.gender)) &&
      (!f.category.length || f.category.includes(p.category)) &&
      (!f.color.length || p.colors.some((c) => f.color.includes(c))) &&
      // A size filter means "available in this size", not just "made in it"
      (!f.size.length || f.size.some((s) => (p.oneSize ? false : (p.stock[s] ?? 0) > 0))) &&
      (!f.drop.length || f.drop.includes(dropKey(p))),
  );
  const idx = (p: Product) => products.indexOf(p);
  const sorted = [...out];
  switch (f.sort) {
    case "new":
      sorted.sort((a, b) => Number(b.badges.includes("new")) - Number(a.badges.includes("new")) || idx(a) - idx(b));
      break;
    case "popular":
      sorted.sort(
        (a, b) =>
          Number(b.badges.includes("bestseller")) - Number(a.badges.includes("bestseller")) ||
          Number(b.badges.includes("limited")) - Number(a.badges.includes("limited")) ||
          idx(a) - idx(b),
      );
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
  }
  // Sold-out pieces always sink to the end
  return sorted.sort((a, b) => Number(isSoldOut(a)) - Number(isSoldOut(b)));
}

export function activeCount(f: Filters) {
  return f.gender.length + f.category.length + f.color.length + f.size.length + f.drop.length;
}

export function pageTitle(f: Filters) {
  if (f.drop.length === 1 && f.drop[0] === "archive") return "Archive";
  if (f.category.length === 1 && !f.gender.length) return CATEGORY_LABEL[f.category[0]];
  if (f.gender.length === 1 && !f.category.length) return GENDERS.find((g) => g.value === f.gender[0])!.label;
  return "Shop all";
}
