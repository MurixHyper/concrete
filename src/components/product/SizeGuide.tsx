"use client";

import { useId } from "react";
import { Dialog } from "../Dialog";
import { CloseIcon } from "../Icons";
import styles from "./SizeGuide.module.css";

// Garment measurements, cm (flat, laid out)
const ROWS = [
  ["XS", 60, 68, 58],
  ["S", 63, 70, 59],
  ["M", 66, 72, 60],
  ["L", 69, 74, 61],
  ["XL", 72, 76, 62],
  ["XXL", 75, 78, 63],
] as const;

export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} labelledBy={titleId}>
      <div className={styles.head}>
        <h2 id={titleId} className={styles.title}>
          Size guide
        </h2>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close size guide">
          <CloseIcon />
        </button>
      </div>
      <div className={styles.body}>
        <p className="muted">
          Cut oversized. Take your usual size for the intended fit, one size down for a closer fit
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">Garment measurements in centimetres</caption>
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Chest</th>
                <th scope="col">Length</th>
                <th scope="col">Sleeve</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([s, c, l, sl]) => (
                <tr key={s}>
                  <th scope="row">{s}</th>
                  <td>{c}</td>
                  <td>{l}</td>
                  <td>{sl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>Measurements in cm, garment laid flat. Chest is measured 2 cm below the armhole</p>
      </div>
    </Dialog>
  );
}
