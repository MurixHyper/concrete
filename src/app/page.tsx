import Link from "next/link";
import { products, type Gender, type Category } from "@/lib/products";
import { HOME_IMAGES } from "@/lib/editorial";
import { Photo } from "@/components/Photo";
import { ProductCard } from "@/components/ProductCard";
import { ArrowIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import styles from "./home.module.css";

const justDropped = products.filter((p) => p.drop === "Drop 01" && p.badges.includes("new")).slice(0, 4);
const wantedFirst = products.filter(
  (p) =>
    p.drop === "Drop 01" &&
    !justDropped.includes(p) &&
    (p.badges.includes("bestseller") || p.badges.includes("limited")),
);
// Always a full row of four: top up with the rest of the drop
const mostWanted = [
  ...wantedFirst,
  ...products.filter((p) => p.drop === "Drop 01" && !justDropped.includes(p) && !wantedFirst.includes(p)),
].slice(0, 4);
const archive = products.filter((p) => p.drop === "Archive");

const CATEGORIES: { label: string; href: string; img: keyof typeof HOME_IMAGES; count: number }[] = [
  { label: "Men", href: "/shop?gender=men", img: "men", count: countBy("gender", "men") },
  { label: "Women", href: "/shop?gender=women", img: "women", count: countBy("gender", "women") },
  { label: "Unisex", href: "/shop?gender=unisex", img: "unisex", count: countBy("gender", "unisex") },
  {
    label: "Accessories",
    href: "/shop?category=accessories",
    img: "accessories",
    count: countBy("category", "accessories"),
  },
];

function countBy(key: "gender", v: Gender): number;
function countBy(key: "category", v: Category): number;
function countBy(key: "gender" | "category", v: string) {
  return products.filter((p) => p[key] === v).length;
}

export default function Home() {
  const drop01 = products.filter((p) => p.drop === "Drop 01").length;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroMedia}>
          <Photo src={HOME_IMAGES.hero.src} alt={HOME_IMAGES.hero.alt} sizes="100vw" ratio="auto" eager caption="top-right" />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <p className={`eyebrow ${styles.live}`}>
            <span className={styles.dot} aria-hidden="true" /> Drop 01 · Live now
          </p>
          <h1 id="hero-title" className={`display ${styles.heroTitle}`}>
            <span>Built for</span> <span>the concrete</span>
          </h1>
          <p className={styles.heroLead}>
            Heavyweight hoodies and crewnecks in a limited first run. {drop01} pieces. No restock
          </p>
          <div className={styles.ctas}>
            <Link href="/shop" className="btn btn-primary">
              Shop Drop 01
            </Link>
            <Link href="/shop?drop=archive" className="btn btn-secondary">
              Archive
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Categories ───────── */}
      <section className="section" aria-labelledby="cat-title">
        <div className="container">
          <h2 id="cat-title" className={`headline ${styles.sectionTitle}`}>
            Shop by
          </h2>
          <ul className={styles.cats}>
            {CATEGORIES.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 70}>
                <Link href={c.href} className={styles.cat}>
                  <Photo
                    src={HOME_IMAGES[c.img].src}
                    alt={HOME_IMAGES[c.img].alt}
                    sizes="(min-width: 900px) 25vw, 50vw"
                    caption="top-right"
                  />
                  <span className={styles.catLabel}>
                    <span>{c.label}</span>
                    <span className={styles.catCount}>{c.count}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Just dropped ───────── */}
      <section className="section" aria-labelledby="new-title">
        <div className="container">
          <div className={styles.head}>
            <h2 id="new-title" className="headline">
              Just dropped
            </h2>
            <Link href="/shop?sort=new" className="link">
              View all <ArrowIcon width={16} height={16} />
            </Link>
          </div>
          <ul className={styles.grid}>
            {justDropped.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Brand: 400gsm ───────── */}
      <section id="about" className={`section ${styles.brand}`} aria-labelledby="brand-title">
        <div className={`container ${styles.brandGrid}`}>
          <Reveal className={styles.brandText}>
            <p className="eyebrow muted">The standard</p>
            <h2 id="brand-title" className={styles.bigNumber}>
              400<span>gsm</span>
            </h2>
            <p className={styles.brandLead}>
              Twice the weight of an average hoodie. Brushed cotton fleece, cut and sewn in Portugal,
              made to hold its shape for years
            </p>
            <dl className={styles.facts}>
              <div>
                <dt className="muted">Fabric</dt>
                <dd>100% cotton fleece</dd>
              </div>
              <div>
                <dt className="muted">Made in</dt>
                <dd>Porto, Portugal</dd>
              </div>
              <div>
                <dt className="muted">Run</dt>
                <dd>Limited, no restock</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal className={styles.brandMedia} delay={120}>
            <Photo src={HOME_IMAGES.fabric.src} alt={HOME_IMAGES.fabric.alt} sizes="(min-width: 900px) 45vw, 100vw" ratio="1 / 1" />
          </Reveal>
        </div>
      </section>

      {/* ───────── Most wanted ───────── */}
      <section className="section" aria-labelledby="wanted-title">
        <div className="container">
          <div className={styles.head}>
            <h2 id="wanted-title" className="headline">
              Most wanted
            </h2>
            <Link href="/shop?sort=popular" className="link">
              View all <ArrowIcon width={16} height={16} />
            </Link>
          </div>
          <ul className={styles.grid}>
            {mostWanted.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Capsule ───────── */}
      <section className="section" aria-labelledby="capsule-title">
        <div className={`container ${styles.capsule}`}>
          <Reveal className={styles.capsuleMedia}>
            <Photo src={HOME_IMAGES.capsule.src} alt={HOME_IMAGES.capsule.alt} sizes="(min-width: 900px) 50vw, 100vw" />
          </Reveal>
          <Reveal className={styles.capsuleText} delay={120}>
            <p className="eyebrow muted">Capsule · Muted Olive</p>
            <h2 id="capsule-title" className="headline">
              One colour, head to toe
            </h2>
            <p className={styles.lead}>
              Hoodie, cargos and cap in the same muted olive. Built to be worn together, sold separately
            </p>
            <Link href="/shop?color=olive" className="btn btn-secondary">
              Shop the capsule
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────── Archive ───────── */}
      <section className={`section ${styles.archive}`} aria-labelledby="archive-title">
        <div className={`container ${styles.archiveGrid}`}>
          <div className={styles.archiveText}>
            <p className="eyebrow muted">Past drops · Final pieces</p>
            <h2 id="archive-title" className="headline">
              Archive
            </h2>
            <p className={styles.lead}>
              What&apos;s left from earlier runs, at archive prices. When a size is gone, it&apos;s gone
            </p>
            <Link href="/shop?drop=archive" className="btn btn-primary">
              Enter the archive
            </Link>
          </div>
          <ul className={styles.archiveList}>
            {archive.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} sizes="(min-width: 900px) 25vw, 50vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
