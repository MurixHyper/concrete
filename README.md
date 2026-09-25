# Concrete

Concept e-commerce store for heavyweight streetwear. Portfolio project by a UI/UX designer — no real orders, no payments.

Designed in Figma, built with **Next.js 16** (App Router, TypeScript, CSS Modules). Dark theme and type scale come from the Concrete moodboard.

## What works

- **Home** — Drop 01 hero, shop by category, Just dropped, 400gsm brand block, Most wanted, olive capsule, Archive
- **Shop** — filters by gender, category, colour, size (in stock only) and drop; sort; active filter chips; empty state; load more. Filters live in the URL, so every view is linkable
- **Product page** — gallery (swipe on mobile), colour and size pickers with sold-out and low-stock states, size guide, wishlist, complete the look
- **Cart** — mini cart drawer and full cart: change size and quantity, stock limits, move to wishlist, promo code `CONCRETE10`, free-shipping progress from €100
- **Checkout** — contact, address, delivery, payment method with inline validation. Demo only: no card fields, nothing is charged
- **Order confirmation, account (demo member), wishlist, search, 404**
- Cart, wishlist and demo orders persist in `localStorage`

Accessibility: native dialogs with focus trapping, keyboard-operable pickers, visible focus, skip link, `prefers-reduced-motion` respected.

## Photos

The site includes all 47 planned AI-generated editorial and product images, created with the built-in imagegen tool and saved as optimized WebP. These depict fictional adult models and illustrative concept garments. Generation briefs: `docs/generation-jobs.json`.
Full list with briefs: [`docs/IMAGES.md`](docs/IMAGES.md) (regenerate with `npm run images:doc`).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Structure

```
src/app            routes: /, /shop, /product/[slug], /cart, /checkout, /checkout/success, /wishlist, /account
src/components     UI (Header, MiniCart, ProductCard, Photo, Dialog…) grouped by page
src/lib            products.ts (catalogue), store.tsx (cart + wishlist), filters.ts, orders.ts
docs/IMAGES.md     photo list
```

Deployed on Vercel.

