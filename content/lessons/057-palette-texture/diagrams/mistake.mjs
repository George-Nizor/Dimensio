// Wrong: the band's UVs only shrunk part way, so they cover two swatches and one band shows two
// colours. Right: shrunk to a point inside one swatch, and the band is one flat grey.
import { view } from '../../../diagrams/mesh.mjs';
import { palette, barrel, drawFaces, swatchStyle, ROWS, COLS } from './palette.mjs';

function half(kit, x, bad) {
  const { mesh: m, parts } = barrel();
  const size = 140;
  const y = 20;
  const w = size / COLS;
  const h = size / ROWS.length;
  // The island: across the line between the grey and the red rows, or a point inside grey.
  const island = bad ? [[x + 0.8 * w, y + 1.55 * h], [x + 1.9 * w, y + 1.55 * h], [x + 1.9 * w, y + 2.4 * h], [x + 0.8 * w, y + 2.4 * h]] : null;
  const v = view({ at: [x + 75, 250], scale: 110, target: [0, 0, 0.6], azimuth: 30, elevation: 22 });
  const lowerBand = parts.bands.slice(0, 12);
  const style = (f) => {
    if (!parts.bands.includes(f)) return { cls: 'd-face-1', dark: 0 };
    if (!bad) return swatchStyle(1, 1);
    // Some of the lower band's faces land on the red swatch and the rest on grey: the island
    // straddles two swatches.
    return lowerBand.includes(f) && f % 12 >= 5 && f % 12 <= 10 ? swatchStyle(2, 1) : swatchStyle(1, 1);
  };
  return [
    palette(kit, x, y, size),
    island ? kit.polyline([...island, island[0]], { cls: 'd-bad', width: 2.2 }) : kit.dot(x + 1.5 * w, y + 1.5 * h, { r: 4.5, cls: 'd-mark-fill' }),
    drawFaces(kit, m, v, style),
    kit.tag(x + 75, 352, bad ? 'across two swatches' : 'a point in one swatch', { tone: bad ? 'bad' : 'mark' }),
  ];
}

export default (kit) => kit.svg({ width: 400, height: 366 }, half(kit, 30, true), half(kit, 230, false));
