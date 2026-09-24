"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useStore } from "@/lib/store";
import { price } from "@/lib/format";
import { formatDate, loadOrders, type Order } from "@/lib/orders";
import styles from "./Account.module.css";

/** Demo member — a fictional person, not a real customer. */
const DEMO_USER = {
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  phone: "+380 44 000 0000",
  since: "2025",
};

/** A past order so the history isn't empty on first visit. */
const DEMO_ORDER: Order = {
  id: "CN-104233",
  date: "2026-03-14T10:00:00.000Z",
  email: DEMO_USER.email,
  name: "Alex Morgan",
  city: "Kyiv",
  method: "standard",
  payment: "Card",
  lines: [
    { slug: "drift-hoodie", name: "Drift Hoodie", color: "navy", size: "L", qty: 1, price: 120 },
    { slug: "logo-tee", name: "Concrete Logo Tee", color: "white", size: "L", qty: 2, price: 55 },
  ],
  subtotal: 230,
  discount: 0,
  shipping: 0,
  total: 230,
};

type Tab = "orders" | "details";

export function AccountView() {
  const { wishlist, ready } = useStore();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const ids = { orders: useId(), details: useId() };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage after mount
    setOrders(loadOrders());
  }, []);

  const all = [...orders, DEMO_ORDER];

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next: Tab = tab === "orders" ? "details" : "orders";
    setTab(next);
    document.getElementById(`${ids[next]}-tab`)?.focus();
  };

  return (
    <div className={`container ${styles.page}`}>
      <p className={styles.demo} role="note">
        Demo account — Alex is a fictional member
      </p>
      <div className={styles.top}>
        <div>
          <p className="eyebrow muted">Member since {DEMO_USER.since}</p>
          <h1 className="display">Hi, {DEMO_USER.firstName}</h1>
        </div>
        <dl className={styles.stats}>
          <div>
            <dt>Orders</dt>
            <dd>{all.length}</dd>
          </div>
          <div>
            <dt>Saved</dt>
            <dd>
              <Link href="/wishlist">{ready ? wishlist.length : 0}</Link>
            </dd>
          </div>
        </dl>
      </div>

      <div role="tablist" aria-label="Account" className={styles.tabs} onKeyDown={onTabKey}>
        {(["orders", "details"] as const).map((t) => (
          <button
            key={t}
            id={`${ids[t]}-tab`}
            type="button"
            role="tab"
            aria-selected={tab === t}
            aria-controls={`${ids[t]}-panel`}
            tabIndex={tab === t ? 0 : -1}
            className={styles.tab}
            onClick={() => setTab(t)}
          >
            {t === "orders" ? "Orders" : "Personal info"}
          </button>
        ))}
      </div>

      <div
        id={`${ids.orders}-panel`}
        role="tabpanel"
        aria-labelledby={`${ids.orders}-tab`}
        hidden={tab !== "orders"}
        className={styles.panel}
      >
        <ul className={styles.orders}>
          {all.map((o) => (
            <li key={o.id} className={styles.order}>
              <div className={styles.orderHead}>
                <div>
                  <p className={styles.orderId}>{o.id}</p>
                  <p className="muted">{formatDate(o.date)}</p>
                </div>
                <span className={styles.status} data-status={o === DEMO_ORDER ? "delivered" : "processing"}>
                  {o === DEMO_ORDER ? "Delivered" : "Processing"}
                </span>
              </div>
              <ul className={styles.lines}>
                {o.lines.map((l) => (
                  <li key={`${l.slug}-${l.size}-${l.color}`}>
                    <Link href={`/product/${l.slug}`}>
                      {l.qty} × {l.name}
                    </Link>
                    <span className="muted">{l.size}</span>
                  </li>
                ))}
              </ul>
              <p className={styles.orderTotal}>
                <span className="muted">Total</span> {price(o.total)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div
        id={`${ids.details}-panel`}
        role="tabpanel"
        aria-labelledby={`${ids.details}-tab`}
        hidden={tab !== "details"}
        className={styles.panel}
      >
        <Details />
      </div>
    </div>
  );
}

function Details() {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState(DEMO_USER);
  const [draft, setDraft] = useState(DEMO_USER);
  const [saved, setSaved] = useState(false);
  const fields: { key: keyof typeof DEMO_USER; label: string; type?: string; auto: string }[] = [
    { key: "firstName", label: "First name", auto: "given-name" },
    { key: "lastName", label: "Last name", auto: "family-name" },
    { key: "email", label: "Email", type: "email", auto: "email" },
    { key: "phone", label: "Phone", type: "tel", auto: "tel" },
  ];

  if (!editing) {
    return (
      <div className={styles.details}>
        <dl className={styles.info}>
          {fields.map((f) => (
            <div key={f.key}>
              <dt>{f.label}</dt>
              <dd>{data[f.key]}</dd>
            </div>
          ))}
        </dl>
        {saved && (
          <p role="status" className="muted">
            Saved for this session
          </p>
        )}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setDraft(data);
            setEditing(true);
            setSaved(false);
          }}
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <form
      className={styles.details}
      onSubmit={(e) => {
        e.preventDefault();
        setData(draft);
        setEditing(false);
        setSaved(true);
      }}
    >
      <div className={styles.formGrid}>
        {fields.map((f) => (
          <label key={f.key} className="field">
            <span>{f.label}</span>
            <input
              className="input"
              type={f.type ?? "text"}
              autoComplete={f.auto}
              required
              value={draft[f.key]}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
            />
          </label>
        ))}
      </div>
      <div className={styles.formActions}>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
