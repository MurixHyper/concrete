import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';

const jobs = JSON.parse(readFileSync('tmp/generated-colors.json','utf8'));
for (const job of jobs) {
  if (existsSync(job.output)) continue;
  await sharp(job.generatedPath).webp({quality:85}).toFile(job.output);
}
writeFileSync('docs/color-generation-jobs.json',JSON.stringify(jobs.map(job => Object.fromEntries(Object.entries(job).filter(([key]) => key !== 'generatedPath'))),null,2)+'\n');
console.log(`Imported ${jobs.length} colour photographs`);
