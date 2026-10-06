# Concrete colour gallery audit

## Core Crewneck weight

Canonical value: **380gsm**. `crewDetails` specifies 380gsm loopback cotton; all four original Core Crewneck prompts in `generation-jobs.json` also specify 380gsm. The isolated 400gsm tagline was corrected. Other garments' 400gsm values are unchanged.

## Missing colour photographs before this change

All 15 products have multiple colours: 40 colourways in total. 24 colourways had no dedicated photographs. Mass Hoodie had mixed colours in its existing gallery: shots 1/3 black, shot 2 brown. Completing every gallery required 73 additional photographs.

| Product | Missing photographs / affected colours | Added shots |
|---|---|---:|
| Arch Hoodie | Ash, Muted Olive, Dark Navy — 4 each | 12 |
| Void Hoodie | Muted Olive, Dark Navy, Washed Brown — 4 each | 12 |
| Structure Hoodie | Dark Navy — 3 | 3 |
| Mass Hoodie | Black shot 2; Washed Brown shots 1/3 | 3 |
| Core Crewneck | Graphite, Muted Olive, Dark Navy — 4 each | 12 |
| Slab Crewneck | Muted Olive, White — 3 each | 6 |
| Weight Crewneck | Washed Brown — 2 | 2 |
| Concrete Pullover | Washed Brown, Muted Olive — 2 each | 4 |
| Plinth Hoodie | Black — 3 | 3 |
| Concrete Logo Tee | Black — 2 | 2 |
| Cargo Utility Pants | Muted Olive — 2 | 2 |
| Studio Overshirt | Dark Navy — 2 | 2 |
| Concrete Cap | Muted Olive — 2 | 2 |
| Drift Hoodie | Washed Brown, White, Black — 2 each | 6 |
| Ribbed Knit Sweater | Washed Brown — 2 | 2 |

## Art direction and integration

Each new photograph was edited with the built-in imagegen tool from its corresponding original shot. The prompts constrain edits to garment colour and preserve model identity, pose, crop, garment construction, texture, lighting, concrete surroundings and other clothing. Existing original photographs were retained. New files are WebP at quality 85, without upscaling. The complete source/output mapping and exact prompts are in `color-generation-jobs.json`.

The gallery and existing buy box share selected colour through `ProductVariant`. `photoSrc` resolves every shot, including the mixed original Mass Hoodie colours. Changing colour replaces the entire gallery and resets the mobile strip to shot 1. Size selection persists. Mini-cart, cart and checkout thumbnails use the chosen colour. Layout, typography and design tokens are preserved.

## Framing correction

The desktop gallery previously forced the first portrait into a landscape 5:4 frame when there were three shots. With `object-fit: cover`, this hid 36% of the portrait height, cutting off models' heads and feet. Structure Hoodie, Mass Hoodie, Slab Crewneck and Plinth Hoodie were affected across all nine colourways.

The forced landscape ratio was removed. The wide first shot retains its existing grid placement and the original 4:5 image ratio. All 40 colour galleries were checked at 1280px desktop and 390px mobile widths: 226 rendered frames retain 4:5 with no page overflow. The four affected products also pass at 999px, 1000px and 1440px widths. All 15 catalogue cards retain 4:5; home editorial portraits and the square fabric photograph use matching frames. The responsive home hero retains both models' faces.

## Validation

- 40 desktop colour selections at 1440 × 1000 and 40 mobile selections at 390 × 844: correct product, colour-labelled images, complete gallery mapping, no page overflow.
- Production preview: Core Crewneck gallery loads all four Dark Navy photos; mobile swipe reaches shot 2 and colour change resets to shot 1.
- Selected size S survives colour change. Muted Olive thumbnail verified in mini-cart, cart and checkout; test cart item removed afterwards.
- All 120 distinct image paths exist, match filename case, decode as WebP and return HTTP 200 with `image/webp`. All 120 Next.js optimized image URLs also return HTTP 200 and decode at the requested 640px width. 113 product photographs plus 7 editorial photographs.
- `npm run images:doc`: 120/120 present.
- `npm run lint`, `npm run build`: passed.
- Vercel preview deployed successfully; all four Core Crewneck Dark Navy images load in the authenticated browser. The full HTTP sweep ran against local production: unauthenticated requests to the protected Vercel preview return its authentication page.

Run `npm run images:check` for the file/decode check. Set `IMAGE_CHECK_URL` to a running local server to additionally check original and optimized HTTP responses.

## Product-scoped background loading

Opening a PDP warms only that product's colour galleries after its first photo loads. Two low-priority responsive image requests run at a time, with alternate colours' first shots first. The preloader uses the same Next Image srcset/sizes as the rendered gallery, decodes the images, and stops its queue on navigation. Desktop and 390px mobile colour switches were checked with all Core Crewneck gallery images already complete; no mobile overflow. Lint and production build pass.

