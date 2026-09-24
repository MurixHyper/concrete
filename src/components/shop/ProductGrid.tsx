"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { getProduct } from "@/lib/products";
import { ProductCard } from "../ProductCard";
import styles from "./ProductGrid.module.css";

// 12 closes evenly in 2, 3 and 4 columns
const PAGE = 12;

export function ProductGrid({ slugs }: { slugs: string[] }) {
  const [shown, setShown] = useState(PAGE);
  const listRef = useRef<HTMLUListElement>(null);

  if (!slugs.length) {
    return (
      <div className={styles.empty}>
        <p className="title">Nothing in this combination</p>
        <p className="muted">Try removing a filter — sizes sell out fast in a limited run</p>
        <Link href="/shop" className="btn btn-secondary">
          Reset filters
        </Link>
      </div>
    );
  }

  const visible = slugs.slice(0, shown);
  const more = () => {
    const firstNew = shown;
    setShown((n) => n + PAGE);
    // Move focus to the first newly loaded card so keyboard users continue from there
    requestAnimationFrame(() =>
      listRef.current?.querySelectorAll<HTMLAnchorElement>("h3 a")[firstNew]?.focus(),
    );
  };

  return (
    <>
      <ul className={styles.grid} ref={listRef}>
        {visible.map((slug, i) => {
          const p = getProduct(slug);
          return p ? (
            <li key={slug} className={i >= PAGE ? styles.appear : undefined}>
              <ProductCard product={p} eager={i < 3} sizes="(min-width: 1200px) 25vw, (min-width: 700px) 33vw, 50vw" />
            </li>
          ) : null;
        })}
      </ul>
      {shown < slugs.length && (
        <div className={styles.more}>
          <p className="muted">
            Showing {visible.length} of {slugs.length}
          </p>
          <button type="button" className="btn btn-secondary" onClick={more}>
            Load more
          </button>
        </div>
      )}
    </>
  );
}
