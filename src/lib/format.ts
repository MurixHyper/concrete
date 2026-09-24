const eur = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** €130 / €6.90 — whole euros without decimals, cents when there are any. */
export function price(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded)
    ? eur.format(rounded)
    : new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(rounded);
}
