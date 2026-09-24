"use client";

import { useId, useState } from "react";
import { useStore } from "@/lib/store";
import { price } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, PROMO_CODES, SHIPPING } from "@/lib/products";
import { ShippingBar } from "../ShippingBar";
import styles from "./Summary.module.css";

type Props = {
  /** Selected delivery method; the cart page previews standard */
  method?: keyof typeof SHIPPING;
  children?: React.ReactNode;
  /** Rendered under the title, before the totals (e.g. the item list at checkout) */
  top?: React.ReactNode;
  /** Show the promo code field */
  promoField?: boolean;
};

export function shippingCost(method: keyof typeof SHIPPING, freeShipping: boolean) {
  if (method === "standard" && freeShipping) return 0;
  return SHIPPING[method];
}

export function Summary({ method = "standard", promoField = true, children, top }: Props) {
  const { totals, promo, applyPromo, clearPromo } = useStore();
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const id = useId();
  const ship = shippingCost(method, totals.freeShipping);
  const total = totals.merchandise + ship;

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Order summary</h2>
      {top}
      <ShippingBar left={totals.freeShippingLeft} threshold={FREE_SHIPPING_THRESHOLD} />

      <dl className={styles.rows}>
        <div>
          <dt>Subtotal</dt>
          <dd>{price(totals.subtotal)}</dd>
        </div>
        {promo && totals.discount > 0 && (
          <div>
            <dt>
              Promo <span className={styles.code}>{promo}</span>
            </dt>
            <dd>−{price(totals.discount)}</dd>
          </div>
        )}
        <div>
          <dt>{method === "express" ? "Express shipping" : "Standard shipping"}</dt>
          <dd>{ship === 0 ? "Free" : price(ship)}</dd>
        </div>
        <div className={styles.total}>
          <dt>Total</dt>
          <dd>{price(total)}</dd>
        </div>
      </dl>
      <p className={styles.vat}>Including VAT</p>

      {promoField &&
        (promo ? (
          <div className={styles.applied}>
            <span>
              <strong>{promo}</strong> applied · {Math.round((PROMO_CODES[promo] ?? 0) * 100)}% off
            </span>
            <button type="button" onClick={clearPromo} className={styles.textBtn}>
              Remove
            </button>
          </div>
        ) : (
          <form
            className={styles.promo}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!code.trim()) return;
              const ok = applyPromo(code);
              setErr(!ok);
              if (ok) setCode("");
            }}
          >
            <label htmlFor={id} className="sr-only">
              Promo code
            </label>
            <input
              id={id}
              className="input"
              placeholder="Promo code"
              value={code}
              autoCapitalize="characters"
              aria-invalid={err}
              aria-describedby={err ? `${id}-e` : `${id}-h`}
              onChange={(e) => {
                setCode(e.target.value);
                setErr(false);
              }}
            />
            <button type="submit" className="btn btn-secondary" disabled={!code.trim()}>
              Apply
            </button>
            {err ? (
              <p id={`${id}-e`} className={`field-error ${styles.full}`} role="alert">
                That code isn&apos;t valid
              </p>
            ) : (
              <p id={`${id}-h`} className={`${styles.hint} ${styles.full}`}>
                Demo code: CONCRETE10
              </p>
            )}
          </form>
        ))}

      {children}
    </div>
  );
}
