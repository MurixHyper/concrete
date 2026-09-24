"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { COLORS, photoSrc, sizeLabel, SHIPPING } from "@/lib/products";
import { price } from "@/lib/format";
import { newOrderId, saveOrder } from "@/lib/orders";
import { Photo } from "../Photo";
import { Summary, shippingCost } from "../cart/Summary";
import styles from "./Checkout.module.css";

type Field = "email" | "firstName" | "lastName" | "address" | "city" | "postcode" | "country";
type Values = Record<Field, string>;

const COUNTRIES = ["Ukraine", "Poland", "Germany", "Netherlands", "France", "Portugal", "Spain", "Italy", "Other EU"];

const LABELS: Record<Field, string> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  address: "Address",
  city: "City",
  postcode: "Postcode",
  country: "Country",
};
const AUTOCOMPLETE: Record<Field, string> = {
  email: "email",
  firstName: "given-name",
  lastName: "family-name",
  address: "street-address",
  city: "address-level2",
  postcode: "postal-code",
  country: "country-name",
};

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email, like name@example.com";
  if (!v.firstName.trim()) e.firstName = "Enter your first name";
  if (!v.lastName.trim()) e.lastName = "Enter your last name";
  if (v.address.trim().length < 5) e.address = "Enter a street and house number";
  if (!v.city.trim()) e.city = "Enter a city";
  if (!/^[A-Za-z0-9\- ]{3,10}$/.test(v.postcode.trim())) e.postcode = "Enter a valid postcode";
  if (!v.country) e.country = "Choose a country";
  return e;
}

const PAYMENTS = [
  { value: "card", label: "Card", note: "Visa, Mastercard, Amex" },
  { value: "paypal", label: "PayPal", note: "You’d be redirected to PayPal" },
  { value: "applepay", label: "Apple Pay", note: "On supported devices" },
];

export function CheckoutView() {
  const router = useRouter();
  const { ready, items, totals, clear } = useStore();
  const [values, setValues] = useState<Values>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    country: "Ukraine",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [method, setMethod] = useState<keyof typeof SHIPPING>("standard");
  const [payment, setPayment] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!ready) {
    return (
      <div className={`container ${styles.page}`} aria-busy="true">
        <h1 className="display">Checkout</h1>
      </div>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className={`container ${styles.page}`}>
        <h1 className="display">Checkout</h1>
        <div className={styles.empty}>
          <p className="title">Nothing to check out</p>
          <p className="muted">Your cart is empty</p>
          <Link href="/shop" className="btn btn-primary">
            Shop the drop
          </Link>
        </div>
      </div>
    );
  }

  const update = (f: Field, value: string) => {
    setValues((v) => ({ ...v, [f]: value }));
    if (errors[f]) setErrors((e) => ({ ...e, [f]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    const shipping = shippingCost(method, totals.freeShipping);
    const id = newOrderId();
    saveOrder({
      id,
      date: new Date().toISOString(),
      email: values.email.trim(),
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      city: values.city.trim(),
      method,
      payment: PAYMENTS.find((p) => p.value === payment)!.label,
      lines: items.map((i) => ({
        slug: i.slug,
        name: i.product.name,
        color: i.color,
        size: i.size,
        qty: i.qty,
        price: i.product.price,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping,
      total: totals.merchandise + shipping,
    });
    // Short pause so the button state reads as "placing", then hand over
    window.setTimeout(() => {
      router.push(`/checkout/success?order=${id}`);
      clear();
    }, 800);
  };

  const field = (f: Field, opts: { type?: string; half?: boolean } = {}) => (
    <label className={`field ${opts.half ? styles.half : ""}`} key={f}>
      <span>{LABELS[f]}</span>
      {f === "country" ? (
        <select
          name={f}
          className="input"
          value={values[f]}
          autoComplete={AUTOCOMPLETE[f]}
          onChange={(e) => update(f, e.target.value)}
        >
          {COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      ) : (
        <input
          name={f}
          type={opts.type ?? "text"}
          className="input"
          value={values[f]}
          autoComplete={AUTOCOMPLETE[f]}
          aria-invalid={!!errors[f]}
          aria-describedby={errors[f] ? `err-${f}` : undefined}
          onChange={(e) => update(f, e.target.value)}
        />
      )}
      {errors[f] && (
        <span id={`err-${f}`} className="field-error">
          {errors[f]}
        </span>
      )}
    </label>
  );

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className={`container ${styles.page}`}>
      <p className={styles.demo} role="note">
        Demo checkout — this is a portfolio concept. No payment is taken and nothing ships
      </p>
      <h1 className="display">Checkout</h1>

      <div className={styles.layout}>
        <form ref={formRef} className={styles.form} onSubmit={submit} noValidate>
          {errorCount > 0 && (
            <p className={styles.errorBox} role="alert">
              Check {errorCount === 1 ? "one field" : `${errorCount} fields`} below
            </p>
          )}

          <fieldset className={styles.step}>
            <legend>
              <span className={styles.num}>01</span> Contact
            </legend>
            <div className={styles.fields}>{field("email", { type: "email" })}</div>
          </fieldset>

          <fieldset className={styles.step}>
            <legend>
              <span className={styles.num}>02</span> Shipping address
            </legend>
            <div className={styles.fields}>
              {field("firstName", { half: true })}
              {field("lastName", { half: true })}
              {field("address")}
              {field("city", { half: true })}
              {field("postcode", { half: true })}
              {field("country")}
            </div>
          </fieldset>

          <fieldset className={styles.step}>
            <legend>
              <span className={styles.num}>03</span> Delivery
            </legend>
            <div className={styles.options}>
              {(["standard", "express"] as const).map((m) => {
                const cost = shippingCost(m, totals.freeShipping);
                return (
                  <label key={m} className={styles.option}>
                    <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} />
                    <span className={styles.optText}>
                      <strong>{m === "standard" ? "Standard" : "Express"}</strong>
                      <span className="muted">{m === "standard" ? "3–5 working days" : "1–2 working days"}</span>
                    </span>
                    <span className={styles.optPrice}>{cost === 0 ? "Free" : price(cost)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className={styles.step}>
            <legend>
              <span className={styles.num}>04</span> Payment
            </legend>
            <div className={styles.options}>
              {PAYMENTS.map((p) => (
                <label key={p.value} className={styles.option}>
                  <input
                    type="radio"
                    name="payment"
                    value={p.value}
                    checked={payment === p.value}
                    onChange={() => setPayment(p.value)}
                  />
                  <span className={styles.optText}>
                    <strong>{p.label}</strong>
                    <span className="muted">{p.note}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className={styles.payNote}>
              In a live store the payment form would appear here. This demo never asks for card details
            </p>
          </fieldset>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Placing order…" : `Place order · ${price(totals.merchandise + shippingCost(method, totals.freeShipping))}`}
          </button>
        </form>

        <aside className={styles.aside}>
          <Summary
            method={method}
            top={
            <ul className={styles.mini}>
              {items.map((i) => (
                <li key={`${i.slug}-${i.color}-${i.size}`}>
                  <div className={styles.miniThumb}>
                    <Photo src={photoSrc(i.slug, 1)} alt={i.product.shots[0]} sizes="64px" />
                    <span className={styles.qty} aria-label={`Quantity ${i.qty}`}>
                      {i.qty}
                    </span>
                  </div>
                  <div>
                    <p className={styles.miniName}>{i.product.name}</p>
                    <p className="muted">
                      {COLORS[i.color].name} · {sizeLabel(i.product, i.size)}
                    </p>
                  </div>
                  <p>{price(i.lineTotal)}</p>
                </li>
              ))}
            </ul>
            }
          >
            <Link href="/cart" className={styles.edit}>
              Edit cart
            </Link>
          </Summary>
        </aside>
      </div>
    </div>
  );
}
