import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { products, COLORS } from '../src/lib/products.ts';

mkdirSync('tmp', { recursive: true });
const frames = [];
for (const p of products) {
  for (let n = 1; n <= p.photos; n++) {
    const filename = `${p.slug}-${n}.webp`;
    const label = Buffer.from(`<svg width="168" height="24"><rect width="168" height="24" fill="#eeeeee"/><text x="2" y="17" font-size="10">${filename}</text></svg>`);
    const input = await sharp(`public/images/products/${filename}`).resize(168,210).extend({ bottom:24, background:'#eee' }).composite([{input:label,left:0,top:210}]).png().toBuffer();
    const i = frames.length;
    frames.push({input,left:(i%8)*168,top:Math.floor(i/8)*234});
  }
}
await sharp({create:{width:1344,height:Math.ceil(frames.length/8)*234,channels:3,background:'#eee'}}).composite(frames).png().toFile('tmp/contact-before.png');
const jobs = [];
for (const p of products) {
  for (const color of p.colors) {
    for (let n = 1; n <= p.photos; n++) {
      const sourceColor = p.photoColors?.[n-1] ?? p.colors[0];
      if (sourceColor === color) continue;
      jobs.push({slug:p.slug,name:p.name,color,colorName:COLORS[color].name,hex:COLORS[color].hex,n,source:`public/images/products/${p.slug}-${n}.webp`,output:`public/images/products/${p.slug}-${color}-${n}.webp`,brief:p.shots[n-1]});
    }
  }
}
writeFileSync('tmp/color-jobs.json',JSON.stringify(jobs,null,2)+'\n');
console.log(JSON.stringify({products:products.length,colorways:products.reduce((n,p)=>n+p.colors.length,0),additionalShots:jobs.length,variants:products.map(p=>({name:p.name,colors:p.colors.map(color=>({color,additionalShots:jobs.filter(j=>j.slug===p.slug && j.color===color).length}))}))},null,2));
