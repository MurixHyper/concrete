"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COLORS, getProduct, sizeLabel } from "@/lib/products";
import { price } from "@/lib/format";
import { loadOrders, type Order } from "@/lib/orders";
import { CheckIcon } from "../Icons";
import styles from "./Success.module.css";

export function SuccessView({ orderId }: { orderId: string | null }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage after mount
    setOrder(loadOrders().find((o) => o.id === orderId) ?? null);
  }, [orderId]);

  if (order === undefined) {
    return <div className={`container ${styles.page}`} aria-busy="true" />;
  }

  if (!order) {
    return (
      <div className={`container ${styles.page}`}>
        <h1 className="display">No order found</h1>
        <p className={styles.lead}>This link doesn&apos;t match an order placed in this browser</p>
        <Link href="/shop" className="btn btn-primary">
          Back to the shop
        </Link>
      </div>
    );
  }

  const first = order.name.split(" ")[0];

  return (
    <div className={`container ${styles.page}`}>
      <span className={styles.check} aria-hidden="true">
        <CheckIcon width={28} height={28} />
      </span>
      <p className="eyebrow muted">Order {order.id}</p>
      <h1 className="display">Thank you, {first}</h1>
      <p className={styles.lead}>
        A confirmation would go to <strong>{order.email}</strong>. This is a demo store, so nothing was charged and
        nothing ships
      </p>

      <div className={styles.card}>
        <dl className={styles.meta}>
          <div>
            <dt>Delivery</dt>
            <dd>
              {order.method === "express" ? "Express, 1–2 days" : "Standard, 3–5 days"} · {order.city}
            </dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>{order.payment}</dd>
          </div>
        </dl>
        <ul className={styles.lines}>
          {order.lines.map((l) => (
            <li key={`${l.slug}-${l.color}-${l.size}`}>
              <span>
                {l.qty} × {l.name}
                <span className="muted">
                  {" "}
                  · {COLORS[l.color]?.name} · {getProduct(l.slug) ? sizeLabel(getProduct(l.slug)!, l.size) : l.size}
                </span>
              </span>
              <span>{price(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className={styles.totals}>
          {order.discount > 0 && (
            <div>
              <dt>Discount</dt>
              <dd>−{price(order.discount)}</dd>
            </div>
          )}
          <div>
            <dt>Shipping</dt>
            <dd>{order.shipping === 0 ? "Free" : price(order.shipping)}</dd>
          </div>
          <div className={styles.total}>
            <dt>Total</dt>
            <dd>{price(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.ctas}>
        <Link href="/account" className="btn btn-secondary">
          View orders
        </Link>
        <Link href="/shop" className="btn btn-primary">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
