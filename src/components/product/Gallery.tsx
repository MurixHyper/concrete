"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { COLORS, photoAlt, photoSrc, type ColorKey, type Product } from "@/lib/products";
import { useProductVariant } from "./ProductVariant";
import { Photo } from "../Photo";
import styles from "./Gallery.module.css";

const gallerySizes = "(min-width: 1000px) 30vw, 100vw";

/**
 * Mobile: a swipeable scroll-snap strip with a position counter.
 * Desktop: all shots stacked in a two-column editorial grid, first one wide.
 */
export function Gallery({ product: p }: { product: Product }) {
  const { color } = useProductVariant();
  const gallery = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const active = new Set<HTMLImageElement>();
    // Warm only this product, using the same responsive optimizer URLs as Photo.
    // Other colours' first shots come first, then the rest of every gallery.
    const queue = Array.from({ length: p.photos }, (_, i) => i + 1)
      .flatMap((n) => p.colors.map((variant) => photoSrc(p.slug, n, variant)))
      .filter((src) => src !== photoSrc(p.slug, 1, p.colors[0]));

    const next = () => {
      if (cancelled) return;
      const src = queue.shift();
      if (!src) return;
      const { props } = getImageProps({ src, alt: "", fill: true, sizes: gallerySizes });
      const image = new window.Image();
      active.add(image);
      image.fetchPriority = "low";
      const finish = () => {
        active.delete(image);
        next();
      };
      image.onload = () => { void image.decode().catch(() => {}).then(finish); };
      image.onerror = finish;
      image.sizes = props.sizes ?? gallerySizes;
      image.srcset = props.srcSet ?? "";
      image.src = props.src;
    };
    const start = () => { next(); next(); };
    const first = gallery.current?.querySelector("img");
    if (first?.complete) start();
    else {
      first?.addEventListener("load", start, { once: true });
      first?.addEventListener("error", start, { once: true });
    }
    return () => {
      cancelled = true;
      first?.removeEventListener("load", start);
      first?.removeEventListener("error", start);
      for (const image of active) {
        image.onload = null;
        image.onerror = null;
        image.removeAttribute("srcset");
        image.removeAttribute("src");
      }
    };
  }, [p]);

  // Remount the strip so a colour change resets mobile scroll and its counter.
  return <div ref={gallery}><ColorGallery key={color} product={p} color={color} /></div>;
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
              sizes={gallerySizes}
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
