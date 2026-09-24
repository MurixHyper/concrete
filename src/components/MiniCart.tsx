"use client";

import Link from "next/link";
import { useId } from "react";
import { useStore, lineKey } from "@/lib/store";
import { COLORS, photoSrc, sizeLabel, FREE_SHIPPING_THRESHOLD } from "@/lib/products";
import { price } from "@/lib/format";
import { Dialog } from "./Dialog";
import { Photo } from "./Photo";
import { QtyStepper } from "./QtyStepper";
import { CloseIcon } from "./Icons";
import { ShippingBar } from "./ShippingBar";
import styles from "./MiniCart.module.css";

export function MiniCart() {
  const { cartOpen, closeCart, items, totals, setQty, remove } = useStore();
  const titleId = useId();

  return (
    <Dialog open={cartOpen} onClose={closeCart} className={styles.drawer} labelledBy={titleId}>
      <div className={styles.panel}>
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            Cart {totals.count > 0 && <span className="muted">({totals.count})</span>}
          </h2>
          <button type="button" className={styles.close} onClick={closeCart} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className="title">Your cart is empty</p>
            <p className="muted">Drop 01 is live. Limited run, no restock</p>
            <Link href="/shop" className="btn btn-primary" onClick={closeCart}>
              Shop the drop
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.ship}>
              <ShippingBar left={totals.freeShippingLeft} threshold={FREE_SHIPPING_THRESHOLD} />
            </div>
            <ul className={styles.list}>
              {items.map((item) => {
                const key = lineKey(item);
                const p = item.product;
                return (
                  <li key={key} className={styles.item}>
                    <Link href={`/product/${p.slug}`} onClick={closeCart} className={styles.thumb} tabIndex={-1} aria-hidden="true">
                      <Photo src={photoSrc(p.slug, 1)} alt={p.shots[0]} sizes="96px" ratio="4 / 5" />
                    </Link>
                    <div className={styles.info}>
                      <Link href={`/product/${p.slug}`} onClick={closeCart} className={styles.name}>
                        {p.name}
                      </Link>
                      <p className="muted">
                        {COLORS[item.color].name} · {sizeLabel(p, item.size)}
                      </p>
                      <div className={styles.row}>
                        <QtyStepper
                          value={item.qty}
                          max={item.maxQty}
                          label={p.name}
                          allowZero
                          onChange={(q) => setQty(key, q)}
                        />
                        <span className={styles.price}>{price(item.lineTotal)}</span>
                      </div>
                      <button type="button" className={styles.remove} onClick={() => remove(key)}>
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className={styles.foot}>
              <div className={styles.sum}>
                <span>Subtotal</span>
                <span>{price(totals.subtotal)}</span>
              </div>
              <p className="muted">Shipping calculated at checkout</p>
              <Link href="/checkout" className="btn btn-primary btn-block" onClick={closeCart}>
                Checkout
              </Link>
              <Link href="/cart" className="btn btn-secondary btn-block" onClick={closeCart}>
                View cart
              </Link>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
