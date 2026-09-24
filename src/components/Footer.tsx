import Link from "next/link";
import { Newsletter } from "./Newsletter";
import styles from "./Footer.module.css";

const SHOP = [
  { href: "/shop?gender=men", label: "Men" },
  { href: "/shop?gender=women", label: "Women" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/shop?drop=archive", label: "Archive" },
];
const INFO = [
  { href: "/account", label: "Account" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/#about", label: "About" },
];
const FOLLOW = ["Instagram", "TikTok", "Pinterest"];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.news}>
          <p className="headline">Be first</p>
          <p className="muted">Early access to every drop. One email, no noise</p>
          <Newsletter />
        </div>

        <nav className={styles.col} aria-label="Shop">
          <p className="eyebrow muted">Shop</p>
          <ul>
            {SHOP.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className={styles.col} aria-label="Info">
          <p className="eyebrow muted">Info</p>
          <ul>
            {INFO.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.col}>
          <p className="eyebrow muted">Follow</p>
          {/* Concept store: the social accounts don't exist, so these aren't links */}
          <ul>
            {FOLLOW.map((f) => (
              <li key={f} className="muted">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.base}`}>
        <span className={styles.logo}>CONCRETE</span>
        <span className="muted">
          © {new Date().getFullYear()} Concrete · Concept store, portfolio project. No real orders
        </span>
      </div>
    </footer>
  );
}
