// Resize + compress originals in photos/ into public/img/ (WebP + JPEG), stripping metadata.
// CROPS adds extra cropped variants (pixel box in the original image).
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photos";
const OUT = "public/img";
const WIDTHS = [640, 1280];

/** name suffix → crop box, keyed by lower-case base filename */
const CROPS = {
  // Gutter + pool only; cuts off the photographer's shadow below.
  img_0986: { pano: { left: 0, top: 40, width: 1280, height: 420 } },
};

async function emit(pipeline, base) {
  for (const w of WIDTHS) {
    const img = pipeline.clone().resize({ width: w, withoutEnlargement: true });
    await img.clone().webp({ quality: 66, effort: 6 }).toFile(path.join(OUT, `${base}-${w}.webp`));
    await img.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${base}-${w}.jpg`));
  }
}

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f));

for (const file of files) {
  const base = path.parse(file).name.toLowerCase();
  const src = sharp(path.join(SRC, file)).rotate();
  await emit(src, base);
  for (const [suffix, box] of Object.entries(CROPS[base] ?? {})) {
    await emit(src.clone().extract(box), `${base}-${suffix}`);
  }
  console.log(`✓ ${file}`);
}
