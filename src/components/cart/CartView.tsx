"use client";

import Link from "next/link";
import { useStore, lineKey } from "@/lib/store";
import { COLORS, photoSrc, sizesFor, sizeLabel, products, type Size } from "@/lib/products";
import { price } from "@/lib/format";
import { Photo } from "../Photo";
import { QtyStepper } from "../QtyStepper";
import { ProductCard } from "../ProductCard";
import { ChevronIcon } from "../Icons";
import { Summary } from "./Summary";
import styles from "./CartView.module.css";

export function CartView() {
  const { ready, items, totals, setQty, setSize, remove, toggleWish, wishlist } = useStore();

  if (!ready) {
    return (
      <div className={`container ${styles.page}`} aria-busy="true">
        <h1 className="display">Cart</h1>
      </div>
    );
  }

  if (items.length === 0) {
    const picks = products.filter((p) => p.badges.includes("bestseller") || p.badges.includes("limited")).slice(0, 4);
    return (
      <div className={`container ${styles.page}`}>
        <h1 className="display">Cart</h1>
        <div className={styles.empty}>
          <p className="title">Your cart is empty</p>
          <p className="muted">Drop 01 is live. Limited run, no restock</p>
          <Link href="/shop" className="btn btn-primary">
            Shop the drop
          </Link>
        </div>
        <h2 className={`headline ${styles.pickTitle}`}>Most wanted</h2>
        <ul className={styles.picks}>
          {picks.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className="display">
        Cart <span className={styles.count}>({totals.count})</span>
      </h1>

      <div className={styles.layout}>
        <section aria-label="Items in your cart">
          <ul className={styles.list}>
            {items.map((item) => {
              const key = lineKey(item);
              const p = item.product;
              const saved = wishlist.includes(p.slug);
              return (
                <li key={key} className={styles.item}>
                  <Link href={`/product/${p.slug}`} className={styles.thumb} tabIndex={-1} aria-hidden="true">
                    <Photo src={photoSrc(p.slug, 1)} alt={p.shots[0]} sizes="160px" />
                  </Link>
                  <div className={styles.info}>
                    <div className={styles.top}>
                      <div>
                        <h2 className={styles.name}>
                          <Link href={`/product/${p.slug}`}>{p.name}</Link>
                        </h2>
                        <p className="muted">
                          {COLORS[item.color].name} · {price(p.price)}
                        </p>
                      </div>
                      <p className={styles.lineTotal}>{price(item.lineTotal)}</p>
                    </div>

                    <div className={styles.controls}>
                      {p.oneSize ? (
                        <span className={styles.oneSize}>One size</span>
                      ) : (
                        <label className={styles.sizeSel}>
                          <span className="sr-only">Size for {p.name}</span>
                          <select value={item.size} onChange={(e) => setSize(key, e.target.value as Size)}>
                            {sizesFor(p).map((s) => {
                              const left = p.stock[s] ?? 0;
                              return (
                                <option key={s} value={s} disabled={left === 0 && s !== item.size}>
                                  {sizeLabel(p, s)}
                                  {left === 0 ? " — sold out" : left <= 2 ? ` — ${left} left` : ""}
                                </option>
                              );
                            })}
                          </select>
                          <ChevronIcon width={14} height={14} />
                        </label>
                      )}
                      <QtyStepper value={item.qty} max={item.maxQty} label={p.name} onChange={(q) => setQty(key, q)} />
                    </div>
                    {item.qty >= item.maxQty && (
                      <p className={styles.note}>Last {item.maxQty === 1 ? "piece" : `${item.maxQty} pieces`} in this size</p>
                    )}

                    <div className={styles.links}>
                      <button type="button" onClick={() => remove(key)}>
                        Remove
                      </button>
                      {!saved && (
                        <button
                          type="button"
                          onClick={() => {
                            toggleWish(p.slug);
                            remove(key);
                          }}
                        >
                          Move to wishlist
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href="/shop" className={`link ${styles.back}`}>
            Continue shopping
          </Link>
        </section>

        <aside className={styles.aside}>
          <Summary>
            <Link href="/checkout" className="btn btn-primary btn-block">
              Checkout
            </Link>
          </Summary>
        </aside>
      </div>
    </div>
  );
}
