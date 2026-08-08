const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const images = [
  ['monet-water-lilies.jpg', 'monet-water-lilies.webp', 400 * 1024],
  ['monet-parliament.jpg', 'monet-parliament.webp', 500 * 1024],
  ['monet-sunrise.jpg', 'monet-sunrise.webp', 400 * 1024],
  ['monet-seine.jpg', 'monet-seine.webp', 400 * 1024],
];

async function compress(inputName, outputName, maxBytes) {
  const imageDir = path.join(__dirname, 'assets', 'images');
  const input = path.join(imageDir, inputName);
  const output = path.join(imageDir, outputName);

  try {
    const existing = await fs.stat(output);
    const metadata = await sharp(output).metadata();
    if (existing.size <= maxBytes && metadata.width >= 1920) {
      console.log(`${outputName}: ${existing.size} bytes, ${metadata.width}x${metadata.height}, reused`);
      return;
    }
  } catch {
    // Generate a fresh asset when no valid output exists.
  }

  let quality = 82;
  let buffer;

  while (quality >= 12) {
    buffer = await sharp(input)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality, smartSubsample: true, effort: 6 })
      .toBuffer();

    if (buffer.length <= maxBytes) break;
    quality -= 2;
  }

  if (buffer.length > maxBytes) {
    throw new Error(`${outputName} is ${buffer.length} bytes, above ${maxBytes}`);
  }

  await fs.writeFile(output, buffer);
  const metadata = await sharp(buffer).metadata();
  console.log(`${outputName}: ${buffer.length} bytes, ${metadata.width}x${metadata.height}, quality ${quality}`);
}

Promise.all(images.map((image) => compress(...image))).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
