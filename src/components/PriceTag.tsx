import { price as fmt } from "@/lib/format";
import styles from "./PriceTag.module.css";

export function PriceTag({
  price,
  compareAt,
  className,
}: {
  price: number;
  compareAt?: number;
  className?: string;
}) {
  if (!compareAt) return <p className={`${styles.tag} ${className ?? ""}`}>{fmt(price)}</p>;
  return (
    <p className={`${styles.tag} ${className ?? ""}`}>
      <span className="sr-only">Now </span>
      <span className={styles.sale}>{fmt(price)}</span>{" "}
      <span className="sr-only">, was </span>
      <s className={styles.was}>{fmt(compareAt)}</s>
    </p>
  );
}
