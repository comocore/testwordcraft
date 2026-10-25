import sharp from 'sharp';

const HUES = [210, 20, 140, 280, 50, 330];

/**
 * A test picture: gradient, grid, a yellow dot in the top-right corner and a large "F".
 * The F and the dot make cropping, rotation and flips easy to see.
 */
export function pictureSvg(w = 800, h = 600, variant = 0) {
  const hue = HUES[variant % HUES.length];
  const grid = [];
  for (let i = 1; i < 10; i++) {
    grid.push(`<line x1="${(w * i) / 10}" y1="0" x2="${(w * i) / 10}" y2="${h}"/>`);
    grid.push(`<line x1="0" y1="${(h * i) / 10}" x2="${w}" y2="${(h * i) / 10}"/>`);
  }
  const u = Math.min(w, h) / 10;
  const fx = w * 0.3;
  const fy = h * 0.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue},70%,82%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360},60%,55%)"/>
</linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<g stroke="rgba(255,255,255,0.55)" stroke-width="${Math.max(1, u / 20)}">${grid.join('')}</g>
<rect x="${fx}" y="${fy}" width="${u * 1.2}" height="${h * 0.6}" fill="#1f2a44"/>
<rect x="${fx}" y="${fy}" width="${u * 4}" height="${u * 1.2}" fill="#1f2a44"/>
<rect x="${fx}" y="${fy + h * 0.25}" width="${u * 3}" height="${u * 1.1}" fill="#1f2a44"/>
<circle cx="${w - u * 1.4}" cy="${u * 1.4}" r="${u * 0.9}" fill="#ffd400" stroke="#1f2a44" stroke-width="${u / 8}"/>
<rect x="${u / 8}" y="${u / 8}" width="${w - u / 4}" height="${h - u / 4}" fill="none" stroke="#1f2a44" stroke-width="${u / 4}"/>
</svg>`;
}

/** A filled circle on a transparent background, for tight and through wrapping. */
export function circleSvg(size = 600) {
  const r = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
<circle cx="${r}" cy="${r}" r="${r * 0.96}" fill="#2f6fbf"/>
<circle cx="${r}" cy="${r}" r="${r * 0.45}" fill="#ffd400"/></svg>`;
}

/** Photo-like noise, so JPEG sizes resemble real photographs. */
export function photoSvg(w = 1600, h = 1200, seed = 1) {
  const hue = HUES[seed % HUES.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<defs>
<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="${seed}"/>
<feColorMatrix type="saturate" values="0.6"/></filter>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="hsl(${hue},55%,70%)"/><stop offset="1" stop-color="hsl(${(hue + 60) % 360},45%,35%)"/>
</linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<rect width="${w}" height="${h}" filter="url(#n)" opacity="0.55"/>
</svg>`;
}

/** A small two-colour logo for headers. */
export function logoSvg(w = 360, h = 120) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<rect width="${w}" height="${h}" rx="${h / 6}" fill="#1f5135"/>
<rect x="${h * 0.25}" y="${h * 0.25}" width="${h * 0.5}" height="${h * 0.5}" fill="#f2efe6"/>
<rect x="${h * 0.95}" y="${h * 0.38}" width="${w - h * 1.2}" height="${h * 0.24}" fill="#f2efe6"/></svg>`;
}

/**
 * Renders an SVG string to png, jpeg, gif, tiff or bmp.
 * `grain` adds seeded per-pixel noise, which brings JPEG sizes close to real photographs.
 */
export async function render(svg, format, { quality = 82, grain = 0, seed = 1 } = {}) {
  let img = sharp(Buffer.from(svg));
  if (grain) {
    const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let a = seed >>> 0;
    for (let i = 0; i < data.length; i++) {
      a = (Math.imul(a, 1664525) + 1013904223) >>> 0;
      const v = data[i] + Math.round(((a / 4294967296) * 2 - 1) * grain);
      data[i] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
    img = sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });
  }
  switch (format) {
    case 'png':
      return img.png({ compressionLevel: 9 }).toBuffer();
    case 'jpeg':
      return img.flatten({ background: '#ffffff' }).jpeg({ quality }).toBuffer();
    case 'gif':
      return img.gif().toBuffer();
    case 'tiff':
      return img.tiff({ compression: 'lzw' }).toBuffer();
    case 'bmp': {
      const { data, info } = await img.flatten({ background: '#ffffff' }).raw().toBuffer({ resolveWithObject: true });
      return bmp(data, info.width, info.height, info.channels);
    }
    default:
      throw new Error(`unknown image format ${format}`);
  }
}

function bmp(pixels, width, height, channels) {
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const size = 54 + rowSize * height;
  const out = Buffer.alloc(size);
  out.write('BM', 0, 'ascii');
  out.writeUInt32LE(size, 2);
  out.writeUInt32LE(54, 10);
  out.writeUInt32LE(40, 14);
  out.writeInt32LE(width, 18);
  out.writeInt32LE(height, 22);
  out.writeUInt16LE(1, 26);
  out.writeUInt16LE(24, 28);
  out.writeUInt32LE(rowSize * height, 34);
  out.writeInt32LE(3780, 38);
  out.writeInt32LE(3780, 42);
  for (let y = 0; y < height; y++) {
    const row = 54 + (height - 1 - y) * rowSize;
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * channels;
      out[row + x * 3] = pixels[src + 2];
      out[row + x * 3 + 1] = pixels[src + 1];
      out[row + x * 3 + 2] = pixels[src];
    }
  }
  return out;
}
