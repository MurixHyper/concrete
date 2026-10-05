"use client";

import { useRef, useState } from "react";
import { COLORS, photoAlt, photoSrc, type ColorKey, type Product } from "@/lib/products";
import { useProductVariant } from "./ProductVariant";
import { Photo } from "../Photo";
import styles from "./Gallery.module.css";

/**
 * Mobile: a swipeable scroll-snap strip with a position counter.
 * Desktop: all shots stacked in a two-column editorial grid, first one wide.
 */
export function Gallery({ product: p }: { product: Product }) {
  const { color } = useProductVariant();
  // Remount the strip so a colour change resets mobile scroll and its counter.
  return <ColorGallery key={color} product={p} color={color} />;
}

function ColorGallery({ product: p, color }: { product: Product; color: ColorKey }) {
  const [index, setIndex] = useState(0);
  const strip = useRef<HTMLUListElement>(null);
  const shots = Array.from({ length: p.photos }, (_, i) => i + 1);

  const onScroll = () => {
    const el = strip.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className={styles.gallery}>
      <ul
        ref={strip}
        className={styles.strip}
        data-odd={shots.length % 2 === 1}
        onScroll={onScroll}
        aria-label={`${p.name} ${COLORS[color].name} photos`}
        tabIndex={0}
      >
        {shots.map((n, i) => (
          <li key={n} className={i === 0 ? styles.first : undefined}>
            <Photo
              src={photoSrc(p.slug, n, color)}
              alt={photoAlt(p, n, color)}
              sizes="(min-width: 1000px) 30vw, 100vw"
              eager={i === 0}
            />
          </li>
        ))}
      </ul>
      {shots.length > 1 && (
        <p className={styles.counter} aria-hidden="true">
          {index + 1} / {shots.length}
        </p>
      )}
    </div>
  );
}
