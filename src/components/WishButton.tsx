"use client";

import { useStore } from "@/lib/store";
import { HeartIcon } from "./Icons";
import styles from "./WishButton.module.css";

export function WishButton({
  slug,
  name,
  className,
  withLabel,
}: {
  slug: string;
  name: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { wishlist, toggleWish, ready } = useStore();
  const saved = ready && wishlist.includes(slug);
  return (
    <button
      type="button"
      className={`${withLabel ? styles.labelled : styles.round} ${className ?? ""}`}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={() => toggleWish(slug)}
      data-saved={saved}
    >
      <HeartIcon filled={saved} width={18} height={18} />
      {withLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
