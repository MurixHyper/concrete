/**
 * Single source of truth for the catalogue: one price per product, one
 * currency (EUR), one size run. Every page reads from here, so the
 * inconsistencies from the Figma draft ($ vs €, €119 vs €120) can't come back.
 */

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export type Gender = "men" | "women" | "unisex";
export type Category =
  | "hoodies"
  | "sweatshirts"
  | "tees"
  | "pants"
  | "jackets"
  | "accessories";
export type Badge = "new" | "limited" | "bestseller";

export type ColorKey = "black" | "graphite" | "ash" | "white" | "olive" | "navy" | "brown";

export const COLORS: Record<ColorKey, { name: string; hex: string }> = {
  black: { name: "Black", hex: "#141414" },
  graphite: { name: "Graphite", hex: "#545454" },
  ash: { name: "Ash", hex: "#C7C7C7" },
  white: { name: "White", hex: "#F2F2F0" },
  olive: { name: "Muted Olive", hex: "#616652" },
  navy: { name: "Dark Navy", hex: "#2E3850" },
  brown: { name: "Washed Brown", hex: "#594739" },
};

export const CATEGORY_LABEL: Record<Category, string> = {
  hoodies: "Hoodies",
  sweatshirts: "Sweatshirts",
  tees: "Tees",
  pants: "Pants",
  jackets: "Jackets",
  accessories: "Accessories",
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  gender: Gender;
  /** EUR */
  price: number;
  /** EUR — only for Archive pieces, shown struck through in grey */
  compareAt?: number;
  drop: "Drop 01" | "Archive";
  badges: Badge[];
  colors: ColorKey[];
  /** Units left per size. 0 = sold out, 1–2 = low stock. One-size items use "M". */
  stock: Partial<Record<Size, number>>;
  oneSize?: boolean;
  /** Short line in the brand voice (moodboard: cold, short, confident). */
  tagline: string;
  description: string;
  details: string[];
  /** Which photos exist for this product (see docs/IMAGES.md). */
  photos: number;
  /** Photo brief — what each shot should show. Used for alt text and IMAGES.md. */
  shots: string[];
};

const hoodieDetails = [
  "400gsm brushed-back cotton fleece",
  "Oversized fit, dropped shoulders",
  "Double-layer hood, no drawcords",
  "Raw-edge hem, ribbed cuffs",
  "Made in Portugal",
];
const crewDetails = [
  "380gsm loopback cotton",
  "Boxy fit, dropped shoulders",
  "Raw hem, ribbed cuffs and collar",
  "Made in Portugal",
];

export const products: Product[] = [
  {
    slug: "arch-hoodie",
    name: "Arch Hoodie",
    category: "hoodies",
    gender: "men",
    price: 130,
    drop: "Drop 01",
    badges: ["new", "limited"],
    colors: ["black", "ash", "olive", "navy"],
    stock: { XS: 3, S: 6, M: 2, L: 5, XL: 4, XXL: 0 },
    tagline: "400gsm. Built for everyday wear",
    description:
      "Heavyweight cotton fleece with a double-layer hood and no drawcords. Cut oversized, meant to be worn every day and last for years.",
    details: hoodieDetails,
    photos: 4,
    shots: [
      "Model in the black Arch Hoodie, arms crossed, against a raw concrete wall",
      "Back view, hood down, same concrete setting",
      "Close-up of the brushed fleece and ribbed cuff",
      "Walking through an underpass, full outfit",
    ],
  },
  {
    slug: "void-hoodie",
    name: "Void Hoodie",
    category: "hoodies",
    gender: "men",
    price: 130,
    drop: "Drop 01",
    badges: ["bestseller"],
    colors: ["graphite", "olive", "navy", "brown"],
    stock: { XS: 0, S: 1, M: 4, L: 2, XL: 1, XXL: 2 },
    tagline: "Heavy, calm, lasting",
    description:
      "The first piece to sell out in Drop 01. Graphite fleece, clean front, dropped shoulders — built to disappear into a city at dusk.",
    details: hoodieDetails,
    photos: 4,
    shots: [
      "Back view of the graphite Void Hoodie in an empty parking deck at dusk",
      "Front view, hands in pocket",
      "Close-up of the hood seam",
      "Side profile under street lights",
    ],
  },
  {
    slug: "structure-hoodie",
    name: "Structure Hoodie",
    category: "hoodies",
    gender: "unisex",
    price: 130,
    drop: "Drop 01",
    badges: ["new", "limited"],
    colors: ["olive", "navy"],
    stock: { XS: 2, S: 3, M: 3, L: 1, XL: 2, XXL: 1 },
    tagline: "Structured streetwear. Architectural clarity",
    description:
      "Muted olive fleece with a stiff, structured hood that holds its shape. Unisex sizing — size down for a closer fit.",
    details: hoodieDetails,
    photos: 3,
    shots: [
      "Model in the olive Structure Hoodie on concrete stairs, overcast sky",
      "Front close-up of the structured hood",
      "Detail of the olive fleece texture",
    ],
  },
  {
    slug: "mass-hoodie",
    name: "Mass Hoodie",
    category: "hoodies",
    gender: "men",
    price: 140,
    drop: "Drop 01",
    badges: [],
    colors: ["black", "brown"],
    stock: { XS: 4, S: 4, M: 5, L: 6, XL: 3, XXL: 2 },
    tagline: "The heaviest piece in the drop",
    description:
      "Our heaviest fleece yet, with a deep hood that casts its own shadow. Black or washed brown.",
    details: ["480gsm brushed-back cotton fleece", ...hoodieDetails.slice(1)],
    photos: 3,
    shots: [
      "Model in the black Mass Hoodie, head down, strong shadow on a concrete wall",
      "Front view in the washed brown colourway",
      "Close-up of the deep hood",
    ],
  },
  {
    slug: "core-crewneck",
    name: "Core Crewneck",
    category: "sweatshirts",
    gender: "men",
    price: 110,
    drop: "Drop 01",
    badges: ["new"],
    colors: ["black", "graphite", "olive", "navy"],
    stock: { XS: 2, S: 5, M: 1, L: 4, XL: 3, XXL: 2 },
    tagline: "400gsm. Oversized. No restock",
    description:
      "Heavyweight cotton fleece. Oversized fit with dropped shoulders. Raw hem finish. Ribbed cuffs and hem. Unisex sizing.",
    details: crewDetails,
    photos: 4,
    shots: [
      "Model in the black Core Crewneck leaning on a concrete ledge, mountains behind",
      "Close-up of the black fleece and collar",
      "Back view against board-marked concrete",
      "Seated on a concrete block, full outfit",
    ],
  },
  {
    slug: "slab-crewneck",
    name: "Slab Crewneck",
    category: "sweatshirts",
    gender: "men",
    price: 110,
    drop: "Drop 01",
    badges: [],
    colors: ["brown", "olive", "white"],
    stock: { XS: 1, S: 3, M: 3, L: 3, XL: 2, XXL: 0 },
    tagline: "Washed brown. Worn in from day one",
    description:
      "Garment-dyed loopback in washed brown, with a soft, lived-in hand from the first wear.",
    details: crewDetails,
    photos: 3,
    shots: [
      "Model in the brown Slab Crewneck sitting in an industrial hall",
      "Front view, neutral background",
      "Close-up of the garment-dyed texture",
    ],
  },
  {
    slug: "weight-crewneck",
    name: "Weight Crewneck",
    category: "sweatshirts",
    gender: "men",
    price: 105,
    drop: "Drop 01",
    badges: [],
    colors: ["graphite", "brown"],
    stock: { XS: 3, S: 4, M: 4, L: 2, XL: 2, XXL: 1 },
    tagline: "Graphite. Nothing extra",
    description: "A clean graphite crewneck with a boxy cut. The one you reach for first.",
    details: crewDetails,
    photos: 2,
    shots: [
      "Model in the graphite Weight Crewneck against dark concrete",
      "Close-up of the ribbed collar",
    ],
  },
  {
    slug: "concrete-pullover",
    name: "Concrete Pullover",
    category: "sweatshirts",
    gender: "unisex",
    price: 115,
    drop: "Drop 01",
    badges: [],
    colors: ["graphite", "brown", "olive"],
    stock: { XS: 2, S: 2, M: 3, L: 3, XL: 2, XXL: 2 },
    tagline: "Named after the material. Built like it",
    description:
      "Marled grey fleece that looks like poured concrete. Relaxed fit, raw hem.",
    details: crewDetails,
    photos: 2,
    shots: [
      "Model in the marled grey Concrete Pullover on a rooftop, city behind",
      "Close-up of the marled fleece",
    ],
  },
  {
    slug: "plinth-hoodie",
    name: "Plinth Hoodie",
    category: "hoodies",
    gender: "women",
    price: 125,
    drop: "Drop 01",
    badges: ["new"],
    colors: ["ash", "black"],
    stock: { XS: 2, S: 3, M: 2, L: 1, XL: 0, XXL: 0 },
    tagline: "Cropped. Heavy. Calm",
    description:
      "A slightly cropped women's cut in ash fleece. Same 400gsm weight, shorter body, wider sleeve.",
    details: hoodieDetails,
    photos: 3,
    shots: [
      "Model in the ash Plinth Hoodie against a pale concrete wall",
      "Side view showing the cropped length",
      "Close-up of the wide sleeve and cuff",
    ],
  },
  {
    slug: "logo-tee",
    name: "Concrete Logo Tee",
    category: "tees",
    gender: "unisex",
    price: 55,
    drop: "Drop 01",
    badges: ["bestseller"],
    colors: ["white", "black"],
    stock: { XS: 5, S: 8, M: 6, L: 6, XL: 4, XXL: 3 },
    tagline: "260gsm. The wordmark, nothing else",
    description:
      "Heavy 260gsm jersey with a small tonal CONCRETE wordmark on the chest. Boxy fit.",
    details: ["260gsm cotton jersey", "Boxy fit", "Tonal chest print", "Made in Portugal"],
    photos: 2,
    shots: [
      "Model in the white Logo Tee against grey concrete",
      "Flat lay close-up of the tonal chest wordmark",
    ],
  },
  {
    slug: "cargo-utility-pants",
    name: "Cargo Utility Pants",
    category: "pants",
    gender: "men",
    price: 149,
    drop: "Drop 01",
    badges: ["limited"],
    colors: ["black", "olive"],
    stock: { XS: 1, S: 2, M: 2, L: 1, XL: 1, XXL: 0 },
    tagline: "Six pockets. No noise",
    description:
      "Heavy cotton twill cargos with flat, low-profile pockets and a tapered leg.",
    details: ["340gsm cotton twill", "Six flat pockets", "Tapered leg, adjustable hem", "Made in Portugal"],
    photos: 2,
    shots: [
      "Full-length shot of the black Cargo Utility Pants on concrete steps",
      "Close-up of the flat side pocket",
    ],
  },
  {
    slug: "studio-overshirt",
    name: "Studio Overshirt",
    category: "jackets",
    gender: "unisex",
    price: 189,
    drop: "Drop 01",
    badges: ["new"],
    colors: ["graphite", "navy"],
    stock: { XS: 1, S: 2, M: 2, L: 2, XL: 1, XXL: 1 },
    tagline: "A jacket for indoors. A shirt for outside",
    description:
      "Heavy wool-blend overshirt with concealed snaps. Layer it over a tee or under a coat.",
    details: ["Wool-blend melton", "Concealed snap placket", "Two chest pockets", "Made in Portugal"],
    photos: 2,
    shots: [
      "Model in the graphite Studio Overshirt, open, over a white tee",
      "Close-up of the concealed snap placket",
    ],
  },
  {
    slug: "concrete-cap",
    name: "Concrete Cap",
    category: "accessories",
    gender: "unisex",
    price: 45,
    drop: "Drop 01",
    badges: [],
    colors: ["black", "olive"],
    stock: { M: 7 },
    oneSize: true,
    tagline: "Washed twill. One size",
    description: "Six-panel washed twill cap with a tonal embroidered mark and a metal buckle.",
    details: ["Washed cotton twill", "Tonal embroidery", "Metal buckle, one size"],
    photos: 2,
    shots: [
      "The black Concrete Cap on a concrete block, side light",
      "Close-up of the tonal embroidery",
    ],
  },
  {
    slug: "drift-hoodie",
    name: "Drift Hoodie",
    category: "hoodies",
    gender: "men",
    price: 90,
    compareAt: 120,
    drop: "Archive",
    badges: [],
    colors: ["navy", "brown", "white", "black"],
    stock: { XS: 0, S: 0, M: 1, L: 2, XL: 0, XXL: 1 },
    tagline: "Last pieces from a past drop",
    description:
      "From our pre-launch run. Dark navy fleece, standard fit. What's left is all there is.",
    details: hoodieDetails,
    photos: 2,
    shots: [
      "Model in the navy Drift Hoodie walking through a brick alley",
      "Front close-up of the navy fleece",
    ],
  },
  {
    slug: "ribbed-knit-sweater",
    name: "Ribbed Knit Sweater",
    category: "sweatshirts",
    gender: "women",
    price: 95,
    compareAt: 129,
    drop: "Archive",
    badges: [],
    colors: ["ash", "brown"],
    stock: { XS: 1, S: 1, M: 0, L: 1, XL: 0, XXL: 0 },
    tagline: "Archive. Three left",
    description: "Heavy ribbed knit with a wide neck. From the archive — final pieces only.",
    details: ["Cotton-wool blend rib knit", "Relaxed fit, wide neck", "Made in Portugal"],
    photos: 2,
    shots: [
      "Model in the ash Ribbed Knit Sweater against a pale wall",
      "Close-up of the ribbed knit",
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const photoSrc = (slug: string, n = 1) => `/images/products/${slug}-${n}.webp`;

export const totalStock = (p: Product) =>
  Object.values(p.stock).reduce((a, b) => a + (b ?? 0), 0);

export const isSoldOut = (p: Product) => totalStock(p) === 0;

export const sizesFor = (p: Product): Size[] => (p.oneSize ? ["M"] : [...SIZES]);

export const sizeLabel = (p: Product, s: Size) => (p.oneSize ? "One size" : s);

export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING = { standard: 6.9, express: 14.9 } as const;
export const PROMO_CODES: Record<string, number> = { CONCRETE10: 0.1 };
