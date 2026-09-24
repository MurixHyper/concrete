"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { products, CATEGORY_LABEL } from "@/lib/products";
import { price } from "@/lib/format";
import { Dialog } from "./Dialog";
import { CloseIcon, SearchIcon } from "./Icons";
import styles from "./SearchOverlay.module.css";

const SUGGESTIONS = ["Hoodie", "Crewneck", "Olive", "Archive"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const titleId = useId();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return products.filter((p) =>
      [p.name, CATEGORY_LABEL[p.category], p.gender, p.drop, ...p.colors, p.tagline]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [q]);

  const term = q.trim();

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} labelledBy={titleId}>
      <div className={`container ${styles.inner}`}>
        <h2 id={titleId} className="sr-only">
          Search
        </h2>
        <form
          role="search"
          className={styles.form}
          onSubmit={(e) => e.preventDefault()}
        >
          <SearchIcon width={24} height={24} />
          <input
            className={styles.input}
            type="search"
            placeholder="Search the drop"
            aria-label="Search products"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </button>
        </form>

        {term.length < 2 ? (
          <div className={styles.suggest}>
            <p className="eyebrow muted">Popular</p>
            <ul>
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => setQ(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <p className={styles.empty} role="status">
            Nothing matches “{term}”. Try “hoodie” or a colour like “olive”
          </p>
        ) : (
          <>
            <p className="eyebrow muted" role="status">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            <ul className={styles.results}>
              {results.map((p) => (
                <li key={p.slug}>
                  <Link href={`/product/${p.slug}`} onClick={onClose}>
                    <span className={styles.name}>{p.name}</span>
                    <span className="muted">
                      {CATEGORY_LABEL[p.category]} · {p.drop}
                    </span>
                    <span className={styles.price}>{price(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Dialog>
  );
}
