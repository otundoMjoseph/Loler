import sharp from 'sharp';

/**
 * Trivial grayscale preview from raw TIFF buffer placeholder.
 * In production, parse real GeoTIFF pixels (e.g., geotiff.js) and map to PNG.
 * Here we just downscale a dummy buffer to create a PNG placeholder.
 */
export async function tiffToPng(tiffBuffer) {
  // Placeholder: generate a 256x256 neutral PNG (since we don't decode TIFF here)
  const width = 256, height = 256;
  const raw = Buffer.alloc(width * height, 180); // mid-gray
  const png = await sharp(raw, { raw: { width, height, channels: 1 } }).png().toBuffer();
  return png;
}
