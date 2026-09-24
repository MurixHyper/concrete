"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { getProduct, isSoldOut, photoSrc, sizesFor, sizeLabel, type Product, type Size } from "@/lib/products";
import { Photo } from "../Photo";
import { PriceTag } from "../PriceTag";
import { CloseIcon } from "../Icons";
import styles from "./Wishlist.module.css";

export function WishlistView() {
  const { ready, wishlist } = useStore();
  const items = wishlist.map(getProduct).filter((p): p is Product => !!p);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className="display">
        Wishlist {ready && items.length > 0 && <span className={styles.count}>({items.length})</span>}
      </h1>

      {!ready ? null : items.length === 0 ? (
        <div className={styles.empty}>
          <p className="title">Nothing saved yet</p>
          <p className="muted">Tap the heart on any piece to keep it here</p>
          <Link href="/shop" className="btn btn-primary">
            Browse the drop
          </Link>
        </div>
      ) : (
        <ul className={styles.grid}>
          {items.map((p) => (
            <li key={p.slug}>
              <WishItem product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WishItem({ product: p }: { product: Product }) {
  const { add, openCart, toggleWish } = useStore();
  const [size, setSize] = useState<Size | null>(p.oneSize ? "M" : null);
  const [error, setError] = useState(false);
  const soldOut = isSoldOut(p);

  return (
    <article className={styles.item}>
      <div className={styles.media}>
        <Link href={`/product/${p.slug}`} tabIndex={-1} aria-hidden="true">
          <Photo src={photoSrc(p.slug, 1)} alt={p.shots[0]} sizes="(min-width: 1000px) 25vw, 50vw" />
        </Link>
        <button
          type="button"
          className={styles.remove}
          aria-label={`Remove ${p.name} from wishlist`}
          onClick={() => toggleWish(p.slug)}
        >
          <CloseIcon width={16} height={16} />
        </button>
      </div>
      <div className={styles.head}>
        <h2 className={styles.name}>
          <Link href={`/product/${p.slug}`}>{p.name}</Link>
        </h2>
        <PriceTag price={p.price} compareAt={p.compareAt} />
      </div>

      {soldOut ? (
        <>
          <p className="muted">Sold out in every size</p>
          <Link href={`/product/${p.slug}`} className="btn btn-secondary btn-block">
            Notify me
          </Link>
        </>
      ) : (
        <>
          {!p.oneSize && (
            <fieldset className={styles.sizes}>
              <legend className="sr-only">Size for {p.name}</legend>
              {sizesFor(p).map((s) => {
                const out = (p.stock[s] ?? 0) === 0;
                return (
                  <label key={s} className={styles.size} data-out={out}>
                    <input
                      type="radio"
                      name={`wish-${p.slug}-size`}
                      className="sr-only"
                      checked={size === s}
                      disabled={out}
                      onChange={() => {
                        setSize(s);
                        setError(false);
                      }}
                    />
                    <span aria-hidden="true">{sizeLabel(p, s)}</span>
                    <span className="sr-only">
                      {s}
                      {out ? ", sold out" : ""}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          )}
          {error && (
            <p className="field-error" role="alert">
              Choose a size first
            </p>
          )}
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => {
              if (!size) return setError(true);
              add({ slug: p.slug, color: p.colors[0], size, qty: 1 });
              openCart();
            }}
          >
            Add to cart
          </button>
        </>
      )}
    </article>
  );
}
