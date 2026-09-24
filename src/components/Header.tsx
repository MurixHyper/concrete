"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { SearchOverlay } from "./SearchOverlay";
import styles from "./Header.module.css";

export const NAV = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?gender=men", label: "Men" },
  { href: "/shop?gender=women", label: "Women" },
  { href: "/shop?drop=archive", label: "Archive" },
];

export function Header() {
  const { totals, wishlist, openCart, ready } = useStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Close overlays on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.classList.add("lock");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 900 && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("lock");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const count = ready ? totals.count : 0;
  const wishCount = ready ? wishlist.length : 0;

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled || menuOpen}>
        <div className={`container ${styles.bar}`}>
          <button
            ref={menuBtn}
            type="button"
            className={`${styles.icon} ${styles.menuBtn}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link href="/" className={styles.logo} aria-label="Concrete — home">
            CONCRETE
          </Link>

          <nav className={styles.nav} aria-label="Main">
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.icon}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <Link href="/account" className={`${styles.icon} ${styles.hideSm}`} aria-label="Account">
              <UserIcon />
            </Link>
            <Link
              href="/wishlist"
              className={`${styles.icon} ${styles.hideSm}`}
              aria-label={`Wishlist, ${wishCount} ${wishCount === 1 ? "item" : "items"}`}
            >
              <HeartIcon />
              {wishCount > 0 && <span className={styles.count}>{wishCount}</span>}
            </Link>
            <button
              type="button"
              className={styles.icon}
              aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
              onClick={openCart}
            >
              <BagIcon />
              {count > 0 && <span className={styles.count}>{count}</span>}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={styles.menu}
        data-open={menuOpen}
        inert={!menuOpen}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul className={styles.menuList}>
            {NAV.map((n, i) => (
              <li key={n.href} style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : "0ms" }}>
                <Link href={n.href} onClick={() => setMenuOpen(false)}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.menuSub}>
            <li>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
                Wishlist{wishCount > 0 ? ` (${wishCount})` : ""}
              </Link>
            </li>
            <li>
              <Link href="/account" onClick={() => setMenuOpen(false)}>
                Account
              </Link>
            </li>
            <li>
              <Link href="/cart" onClick={() => setMenuOpen(false)}>
                Cart{count > 0 ? ` (${count})` : ""}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
