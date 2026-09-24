"use client";

import { MinusIcon, PlusIcon } from "./Icons";
import styles from "./QtyStepper.module.css";

type Props = {
  value: number;
  max: number;
  onChange: (qty: number) => void;
  label: string;
  /** Allow going down to 0 (removes the line) */
  allowZero?: boolean;
};

export function QtyStepper({ value, max, onChange, label, allowZero }: Props) {
  const min = allowZero ? 0 : 1;
  return (
    <div className={styles.stepper} role="group" aria-label={`Quantity, ${label}`}>
      <button
        type="button"
        aria-label={value === 1 && allowZero ? `Remove ${label}` : "Decrease quantity"}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon width={16} height={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        title={value >= max ? "No more in stock for this size" : undefined}
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
