"use client";

import { useId, useState } from "react";
import { CheckIcon } from "../Icons";

/** Shown instead of "Add to cart" when every size is gone. Concept: nothing is sent. */
export function NotifyMe({ productName }: { productName: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const id = useId();

  if (state === "done") {
    return (
      <p role="status" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <CheckIcon /> We&apos;ll email you if {productName} comes back
      </p>
    );
  }

  return (
    <form
      noValidate
      style={{ display: "grid", gap: 12 }}
      onSubmit={(e) => {
        e.preventDefault();
        setState(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? "done" : "error");
      }}
    >
      <p>
        <strong>Sold out in every size.</strong>{" "}
        <span className="muted">Leave your email and we&apos;ll tell you if it returns</span>
      </p>
      <label className="field" htmlFor={id}>
        <span>Email</span>
        <input
          id={id}
          className="input"
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? `${id}-e` : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
        />
      </label>
      {state === "error" && (
        <p id={`${id}-e`} className="field-error" role="alert">
          Enter a valid email, like name@example.com
        </p>
      )}
      <button type="submit" className="btn btn-secondary">
        Notify me
      </button>
    </form>
  );
}
