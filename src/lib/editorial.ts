/**
 * Editorial (non-product) photos used on the home page.
 * Same convention as products: drop a file with this exact name into
 * /public/images/home and it replaces the placeholder. See docs/IMAGES.md.
 */
export const HOME_IMAGES = {
  hero: {
    src: "/images/home/hero.webp",
    alt: "Two models in Drop 01 hoodies standing in a brutalist concrete underpass, cold daylight",
    brief:
      "Wide landscape shot, 16:9 or wider (min 2400px). Two models in Arch and Void hoodies, full or 3/4 length, standing in a raw concrete underpass or stairwell. Overcast, cold light, desaturated. Keep the lower-left third calm for the headline, and keep the models near the centre so the crop still works on a tall phone screen. No logos from other brands anywhere in frame.",
  },
  men: {
    src: "/images/home/category-men.webp",
    alt: "Male model in the olive Structure Hoodie against board-marked concrete",
    brief: "Portrait 4:5. Male model, waist-up, olive hoodie, board-marked concrete wall, soft side light.",
  },
  women: {
    src: "/images/home/category-women.webp",
    alt: "Female model in the ash Plinth Hoodie on pale concrete steps",
    brief: "Portrait 4:5. Female model in the ash cropped hoodie sitting on pale concrete steps.",
  },
  unisex: {
    src: "/images/home/category-unisex.webp",
    alt: "Two models side by side in matching graphite crewnecks",
    brief: "Portrait 4:5. Two models (any genders) in matching graphite crewnecks, same pose, neutral wall.",
  },
  accessories: {
    src: "/images/home/category-accessories.webp",
    alt: "The black Concrete Cap resting on a concrete block",
    brief: "Portrait 4:5. Still life: black cap on a rough concrete block, hard side light, deep shadow.",
  },
  fabric: {
    src: "/images/home/fabric-400gsm.webp",
    alt: "Extreme close-up of heavyweight brushed cotton fleece",
    brief: "Square 1:1. Macro shot of the brushed inside of the 400gsm fleece, folded edge, raking light that shows the texture.",
  },
  capsule: {
    src: "/images/home/capsule-olive.webp",
    alt: "Model in the full olive capsule — hoodie and cargo pants — on a concrete rooftop",
    brief: "Portrait 4:5 (min 1600px tall). Full-length, model in the olive Structure Hoodie and olive Cargo Pants on a rooftop, city haze behind.",
  },
} as const;
