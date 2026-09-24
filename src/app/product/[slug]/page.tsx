import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, CATEGORY_LABEL } from "@/lib/products";
import { Gallery } from "@/components/product/Gallery";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductCard } from "@/components/ProductCard";
import { PriceTag } from "@/components/PriceTag";
import styles from "./product.module.css";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: p.name, description: `${p.tagline}. ${p.description}` };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const p = getProduct(slug);
  if (!p) notFound();

  // Complete the look: same drop, different category first, then the rest
  const related = products
    .filter((o) => o.slug !== p.slug && o.drop === "Drop 01")
    .sort((a, b) => Number(a.category === p.category) - Number(b.category === p.category))
    .slice(0, 4);

  const genderLabel = p.gender === "unisex" ? "Unisex" : p.gender === "men" ? "Men" : "Women";

  return (
    <>
      <div className={`container ${styles.page}`}>
        <nav aria-label="Breadcrumb" className={`breadcrumbs ${styles.crumbs}`}>
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href={p.drop === "Archive" ? "/shop?drop=archive" : `/shop?category=${p.category}`}>
                {p.drop === "Archive" ? "Archive" : CATEGORY_LABEL[p.category]}
              </Link>
            </li>
            <li aria-current="page">{p.name}</li>
          </ol>
        </nav>

        <div className={styles.layout}>
          <Gallery product={p} />

          <div className={styles.info}>
            <div className={styles.sticky}>
              <p className="eyebrow muted">
                {p.drop} · {genderLabel}
              </p>
              <h1 className={`headline ${styles.title}`}>{p.name}</h1>
              <PriceTag price={p.price} compareAt={p.compareAt} className={styles.price} />
              <p className={styles.tagline}>{p.tagline}</p>

              <BuyBox product={p} />

              <div className={styles.accordion}>
                <details open>
                  <summary>Description</summary>
                  <p>{p.description}</p>
                </details>
                <details>
                  <summary>Details and care</summary>
                  <ul className={styles.bullets}>
                    {p.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                    <li>Wash cold, inside out. Dry flat</li>
                  </ul>
                </details>
                <details>
                  <summary>Shipping and returns</summary>
                  <ul className={styles.bullets}>
                    <li>Free standard shipping on orders over €100</li>
                    <li>Standard 3–5 working days, €6.90</li>
                    <li>Express 1–2 working days, €14.90</li>
                    <li>Free returns within 30 days</li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" aria-labelledby="look-title">
        <div className="container">
          <h2 id="look-title" className={`headline ${styles.lookTitle}`}>
            Complete the look
          </h2>
          <ul className={styles.look}>
            {related.map((r) => (
              <li key={r.slug}>
                <ProductCard product={r} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
