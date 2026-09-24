import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: "var(--s8)", display: "grid", gap: "var(--s3)", justifyItems: "start" }}>
      <p className="eyebrow muted">404</p>
      <h1 className="display">Nothing here</h1>
      <p className="muted" style={{ maxWidth: "44ch" }}>
        This page was moved, sold out or never existed
      </p>
      <Link href="/shop" className="btn btn-primary">
        Back to the shop
      </Link>
    </div>
  );
}
