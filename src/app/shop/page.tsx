import type { Metadata } from "next";
import Link from "next/link";
import { applyFilters, parseFilters, pageTitle, shopSections, activeCount } from "@/lib/filters";
import { FilterPanel, ActiveChips, SortSelect, MobileFilters } from "@/components/shop/Filters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import styles from "./shop.module.css";

export async function generateMetadata(props: PageProps<"/shop">): Promise<Metadata> {
  const f = parseFilters(await props.searchParams);
  return { title: pageTitle(f) };
}

export default async function ShopPage(props: PageProps<"/shop">) {
  const f = parseFilters(await props.searchParams);
  const results = applyFilters(f);
  const title = pageTitle(f);
  const n = activeCount(f);
  const sections = shopSections(f);

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.top}>
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <ol>
            {n ? <li><Link href="/shop">Shop all</Link></li> : <li aria-current="page">Shop all</li>}
            {sections.map((section, index) => (
              index === sections.length - 1
                ? <li key={section.href} aria-current="page">{section.label}</li>
                : <li key={section.href}><Link href={section.href}>{section.label}</Link></li>
            ))}
            {n > 0 && !sections.length && <li aria-current="page">{title}</li>}
          </ol>
        </nav>
        <h1 className="display">{title}</h1>
      </header>

      <div className={styles.toolbar}>
        <MobileFilters filters={f} count={n} />
        <p className="muted" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
        <SortSelect filters={f} />
      </div>

      <div className={styles.layout}>
        <aside className={styles.side} aria-label="Filters">
          <FilterPanel filters={f} />
        </aside>
        <div className={styles.main}>
          <h2 className="sr-only">Products</h2>
          <ActiveChips filters={f} />
          <ProductGrid key={JSON.stringify(f)} slugs={results.map((p) => p.slug)} />
        </div>
      </div>
    </div>
  );
}
