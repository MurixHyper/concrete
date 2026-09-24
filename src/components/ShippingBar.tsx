import { price } from "@/lib/format";
import styles from "./ShippingBar.module.css";

/** One message only: either "X away" or "unlocked" — never both (a bug in the Figma cart). */
export function ShippingBar({ left, threshold }: { left: number; threshold: number }) {
  const done = left <= 0;
  const pct = Math.min(100, Math.round(((threshold - left) / threshold) * 100));
  return (
    <div className={styles.wrap}>
      <p className={styles.text} aria-live="polite">
        {done ? (
          <>Free standard shipping unlocked</>
        ) : (
          <>
            <strong>{price(left)}</strong> away from free shipping
          </>
        )}
      </p>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <span style={{ scale: `${pct / 100} 1` }} data-done={done} />
      </div>
    </div>
  );
}
