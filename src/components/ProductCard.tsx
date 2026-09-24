import Link from "next/link";
import { COLORS, isSoldOut, photoSrc, totalStock, type Product } from "@/lib/products";
import { Photo } from "./Photo";
import { WishButton } from "./WishButton";
import { PriceTag } from "./PriceTag";
import styles from "./ProductCard.module.css";

const BADGE_LABEL = { new: "New in", limited: "Limited", bestseller: "Bestseller" } as const;

export function ProductCard({
  product: p,
  eager,
  sizes = "(min-width: 1200px) 25vw, (min-width: 700px) 33vw, 50vw",
}: {
  product: Product;
  eager?: boolean;
  sizes?: string;
}) {
  const soldOut = isSoldOut(p);
  const low = !soldOut && totalStock(p) <= 6;
  const badge = soldOut
    ? { label: "Sold out", cls: "badge" }
    : p.drop === "Archive"
      ? { label: "Archive", cls: "badge badge-light" }
      : p.badges[0]
        ? { label: BADGE_LABEL[p.badges[0]], cls: p.badges[0] === "new" ? "badge badge-light" : "badge" }
        : low
          ? { label: "Low stock", cls: "badge badge-low" }
          : null;

  return (
    <article className={styles.card} data-soldout={soldOut}>
      <div className={styles.media}>
        <Link href={`/product/${p.slug}`} tabIndex={-1} aria-hidden="true" className={styles.imgLink}>
          <Photo src={photoSrc(p.slug, 1)} alt={p.shots[0]} sizes={sizes} eager={eager} />
        </Link>
        {badge && <span className={`${badge.cls} ${styles.badge}`}>{badge.label}</span>}
        <WishButton slug={p.slug} name={p.name} className={styles.wish} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link href={`/product/${p.slug}`} className={styles.link}>
            {p.name}
          </Link>
        </h3>
        <PriceTag price={p.price} compareAt={p.compareAt} className={styles.price} />
        <ul className={styles.swatches} aria-label={`${p.colors.length} colours`}>
          {p.colors.map((c) => (
            <li key={c} title={COLORS[c].name} style={{ background: COLORS[c].hex }} />
          ))}
        </ul>
      </div>
    </article>
  );
}
