// The Add menu after Shift+A in the Shader Editor, with Texture open and Gradient Texture picked
// out. Categories and texture nodes in Blender 5.2.2's order.
import { keycap } from '../../../diagrams/mesh.mjs';

const ROW = 19;

function menu(kit, x, y, w, items, mark) {
  const rows = items.filter((item) => item !== '-').length;
  const gaps = items.filter((item) => item === '-').length;
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${rows * ROW + gaps * 7 + 10}" rx="5" class="d-paper" stroke-width="1.4"/>`];
  let top = y + 5;
  for (const item of items) {
    if (item === '-') {
      out.push(kit.line(x + 8, top + 3, x + w - 8, top + 3, { cls: 'd-guide', width: 1 }));
      top += 7;
      continue;
    }
    const [label, sub] = Array.isArray(item) ? item : [item, false];
    if (label === mark) out.push(`<rect x="${x + 4}" y="${top}" width="${w - 8}" height="${ROW - 1}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(x + 12, top + 13, label, { size: 11 }));
    if (sub) out.push(kit.path(`M ${x + w - 16} ${top + 5} L ${x + w - 12} ${top + 9} L ${x + w - 16} ${top + 13}`, { cls: 'd-ink', width: 1.3 }));
    top += ROW;
  }
  return out;
}

export default (kit) => {
  const root = [['Input', 1], ['Output', 1], '-', ['Shader', 1], ['Displacement', 1], '-', ['Color', 1], ['Texture', 1], ['Utilities', 1], '-', ['Group', 1], ['Layout', 1]];
  const textures = ['Brick Texture', 'Checker Texture', 'Environment Texture', 'Gabor Texture', 'Gradient Texture', 'IES Texture', 'Image Texture', 'Magic Texture', 'Noise Texture', 'Sky Texture', 'Voronoi Texture', 'Wave Texture', 'White Noise Texture'];
  return kit.svg({ width: 420, height: 380 },
    keycap(kit, 46, 30, 'Shift+A', { size: 11 }),
    menu(kit, 90, 14, 130, root, 'Texture'),
    menu(kit, 226, 14 + 5 * ROW + 2 * 7 - 4, 170, textures, 'Gradient Texture'),
  );
};
