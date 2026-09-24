"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Photo.module.css";

type Props = {
  src: string;
  alt: string;
  /** Responsive sizes hint for next/image */
  sizes: string;
  /** Aspect ratio of the frame, e.g. "4 / 5" */
  ratio?: string;
  /** Above-the-fold image: load eagerly with high priority */
  eager?: boolean;
  className?: string;
  /** Where the placeholder caption sits — top-right keeps it clear of overlaid text */
  caption?: "bottom-left" | "top-right";
};

/**
 * Product and editorial photo with a built-in placeholder.
 *
 * Until the real photo exists at `src`, the frame shows a concrete-toned
 * placeholder with the alt text and the expected file name, so the layout
 * reads correctly and it's obvious which file goes where. Drop a correctly
 * named file into /public and it replaces the placeholder with no code change.
 * The list of every expected file is in docs/IMAGES.md.
 */
export function Photo({ src, alt, sizes, ratio = "4 / 5", eager, className, caption = "bottom-left" }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The error can fire before React hydrates and attaches onError,
  // so check the element once on mount as well.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete) {
      if (img.naturalWidth === 0) setFailed(true);
      else setLoaded(true);
    }
  }, [src]);

  const file = src.split("/").pop();

  return (
    <div
      className={`${styles.frame} ${className ?? ""}`}
      style={{ aspectRatio: ratio }}
      data-state={failed ? "placeholder" : loaded ? "loaded" : "loading"}
    >
      {failed ? (
        <div className={styles.placeholder} data-caption={caption} role="img" aria-label={alt}>
          <span className={styles.file} aria-hidden="true">
            {file}
          </span>
          <span className={styles.alt} aria-hidden="true">
            {alt}
          </span>
        </div>
      ) : (
        <Image
          ref={ref}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className={styles.img}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
