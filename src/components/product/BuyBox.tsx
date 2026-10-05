"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { COLORS, isSoldOut, sizesFor, sizeLabel, type Product, type Size } from "@/lib/products";
import { useProductVariant } from "./ProductVariant";
import { price } from "@/lib/format";
import { WishButton } from "../WishButton";
import { CheckIcon } from "../Icons";
import { SizeGuide } from "./SizeGuide";
import { NotifyMe } from "./NotifyMe";
import styles from "./BuyBox.module.css";

export function BuyBox({ product: p }: { product: Product }) {
  const { add, openCart } = useStore();
  const { color, setColor } = useProductVariant();
  const [size, setSize] = useState<Size | null>(p.oneSize ? "M" : null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [guide, setGuide] = useState(false);
  const sizeGroup = useRef<HTMLDivElement>(null);
  const errId = useId();
  const soldOut = isSoldOut(p);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(t);
  }, [added]);

  const stock = size ? (p.stock[size] ?? 0) : 0;

  const onAdd = () => {
    if (!size) {
      setError(true);
      sizeGroup.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
      return;
    }
    add({ slug: p.slug, color, size, qty: 1 });
    setAdded(true);
    openCart();
  };

  return (
    <div className={styles.box}>
      {/* Colour */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          Colour <span className="muted">{COLORS[color].name}</span>
        </legend>
        <div className={styles.swatches}>
          {p.colors.map((c) => (
            <label key={c} className={styles.swatch} title={COLORS[c].name}>
              <input
                type="radio"
                name={`${p.slug}-color`}
                value={c}
                checked={color === c}
                onChange={() => setColor(c)}
                className="sr-only"
              />
              <span style={{ background: COLORS[c].hex }} aria-hidden="true" />
              <span className="sr-only">{COLORS[c].name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Size */}
      {!soldOut && (
        <fieldset
          className={`${styles.fieldset} ${styles.sizeSet}`}
          aria-describedby={error ? errId : undefined}
        >
          <legend className={`${styles.legend} ${styles.sizeLegend}`}>
            <span>
              Size{" "}
              {size && (
                <span className="muted">
                  {sizeLabel(p, size)}
                  {stock > 0 && stock <= 2 && ` · Only ${stock} left`}
                </span>
              )}
            </span>
            {!p.oneSize && (
              <button type="button" className={styles.guideBtn} onClick={() => setGuide(true)}>
                Size guide
              </button>
            )}
          </legend>
          <div className={styles.sizes} ref={sizeGroup} data-error={error}>
            {sizesFor(p).map((s) => {
              const left = p.stock[s] ?? 0;
              const out = left === 0;
              return (
                <label key={s} className={styles.size} data-out={out} data-low={!out && left <= 2}>
                  <input
                    type="radio"
                    name={`${p.slug}-size`}
                    value={s}
                    checked={size === s}
                    disabled={out}
                    onChange={() => {
                      setSize(s);
                      setError(false);
                    }}
                    className="sr-only"
                  />
                  <span aria-hidden="true">{sizeLabel(p, s)}</span>
                  <span className="sr-only">
                    {sizeLabel(p, s)}
                    {out ? ", sold out" : left <= 2 ? `, only ${left} left` : ""}
                  </span>
                </label>
              );
            })}
          </div>
          {error && (
            <p id={errId} className="field-error" role="alert">
              Choose a size first
            </p>
          )}
        </fieldset>
      )}

      {/* Actions */}
      {soldOut ? (
        <NotifyMe productName={p.name} />
      ) : (
        <div className={styles.actions}>
          <button
            type="button"
            className={`btn btn-primary ${styles.add}`}
            onClick={onAdd}
            data-added={added}
          >
            {added ? (
              <>
                <CheckIcon width={18} height={18} /> Added to cart
              </>
            ) : (
              <>Add to cart · {price(p.price)}</>
            )}
          </button>
          <WishButton slug={p.slug} name={p.name} withLabel />
        </div>
      )}

      <ul className={styles.perks}>
        <li>Free shipping over €100</li>
        <li>Free returns within 30 days</li>
      </ul>

      {!p.oneSize && <SizeGuide open={guide} onClose={() => setGuide(false)} />}
    </div>
  );
}
