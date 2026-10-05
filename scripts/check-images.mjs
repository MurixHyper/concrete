import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import sharp from 'sharp';
import { products, COLORS, photoSrc, photoAlt } from '../src/lib/products.ts';
import { HOME_IMAGES } from '../src/lib/editorial.ts';

const paths = new Set(Object.values(HOME_IMAGES).map(i => i.src));
let galleryShots = 0;
for (const p of products) {
  assert.equal(p.photos, p.shots.length, p.slug);
  for (const color of p.colors) {
    for (let n = 1; n <= p.photos; n++) {
      const src = photoSrc(p.slug, n, color);
      paths.add(src);
      assert(photoAlt(p, n, color).includes(COLORS[color].name));
      galleryShots++;
    }
  }
}
assert.equal(photoSrc('mass-hoodie',2,'brown'),'/images/products/mass-hoodie-2.webp');
assert.equal(photoSrc('mass-hoodie',2,'black'),'/images/products/mass-hoodie-black-2.webp');
const core = products.find(p => p.slug === 'core-crewneck');
assert(core.tagline.startsWith('380gsm'));
assert(core.details[0].startsWith('380gsm'));
const results = [];
for (const src of paths) {
  const file = `public${src}`;
  assert(existsSync(file), `Missing ${src}`);
  const metadata = await sharp(file).metadata();
  assert.equal(metadata.format,'webp',src);
  assert(metadata.width > 0 && metadata.height > 0,src);
  await sharp(file).stats();
  if (process.env.IMAGE_CHECK_URL) {
    const response = await fetch(`${process.env.IMAGE_CHECK_URL}${src}`);
    assert.equal(response.status,200,src);
    assert.match(response.headers.get('content-type') ?? '',/image\/webp/,src);
    const optimized = await fetch(`${process.env.IMAGE_CHECK_URL}/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`);
    assert.equal(optimized.status,200,`Optimized ${src}`);
    const buffer = Buffer.from(await optimized.arrayBuffer());
    const optimizedMetadata = await sharp(buffer).metadata();
    assert.equal(optimizedMetadata.width,640,`Optimized ${src}`);
    await sharp(buffer).stats();
  }
  results.push({src,width:metadata.width,height:metadata.height});
}
const variants = JSON.parse(readFileSync('docs/color-generation-jobs.json','utf8'));
assert.equal(variants.length,73);
assert.equal(new Set(variants.map(j=>j.output)).size,73);
for (const job of variants) {
  assert(job.prompt && existsSync(job.source),job.output);
  assert.equal(job.output,`public${photoSrc(job.slug,job.n,job.color)}`);
}
for (const folder of ['home','products']) {
  const filenames = readdirSync(`public/images/${folder}`);
  for (const src of paths) {
    if (src.startsWith(`/images/${folder}/`)) assert(filenames.includes(src.split('/').pop()),`Filename case ${src}`);
  }
}
console.log(JSON.stringify({products:products.length,colorways:products.reduce((n,p)=>n+p.colors.length,0),galleryShots,uniqueImages:paths.size,newImages:variants.length,httpChecked:Boolean(process.env.IMAGE_CHECK_URL),results},null,2));
