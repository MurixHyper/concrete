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

The gallery and existing buy box share selected colour through `ProductVariant`. `photoSrc` resolves every shot, including the mixed original Mass Hoodie colours. Changing colour replaces the entire gallery and resets the mobile strip to shot 1. Size selection persists. Mini-cart, cart and checkout thumbnails use the chosen colour. No CSS or design tokens changed.

## Validation

- 40 desktop colour selections at 1440 × 1000 and 40 mobile selections at 390 × 844: correct product, colour-labelled images, complete gallery mapping, no page overflow.
- Production preview: Core Crewneck gallery loads all four Dark Navy photos; mobile swipe reaches shot 2 and colour change resets to shot 1.
- Selected size S survives colour change. Muted Olive thumbnail verified in mini-cart, cart and checkout; test cart item removed afterwards.
- All 120 distinct image paths exist, match filename case, decode as WebP and return HTTP 200 with `image/webp`. All 120 Next.js optimized image URLs also return HTTP 200 and decode at the requested 640px width. 113 product photographs plus 7 editorial photographs.
- `npm run images:doc`: 120/120 present.
- `npm run lint`, `npm run build`: passed.

Run `npm run images:check` for the file/decode check. Set `IMAGE_CHECK_URL` to a running local server to additionally check original and optimized HTTP responses.
