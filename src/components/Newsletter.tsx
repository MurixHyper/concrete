"use client";

import { useId, useState } from "react";
import { ArrowIcon, CheckIcon } from "./Icons";
import styles from "./Footer.module.css";

type State = "idle" | "error" | "loading" | "done";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const id = useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("error");
      return;
    }
    setState("loading");
    // Concept: nothing is sent anywhere.
    window.setTimeout(() => setState("done"), 700);
  };

  if (state === "done") {
    return (
      <p className={styles.done} role="status">
        <CheckIcon /> You&apos;re on the list. See you at the next drop
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <label htmlFor={id} className="sr-only">
        Email
      </label>
      <div className={styles.inputRow}>
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email address"
          className={styles.input}
          value={email}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? `${id}-err` : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
        />
        <button type="submit" className={styles.submit} disabled={state === "loading"} aria-label="Subscribe">
          {state === "loading" ? <span className={styles.spinner} /> : <ArrowIcon />}
        </button>
      </div>
      {state === "error" && (
        <p id={`${id}-err`} className="field-error" role="alert">
          Enter a valid email, like name@example.com
        </p>
      )}
    </form>
  );
}
