// The Asset Browser as a schematic: the library and catalog list on the left, preview tiles of the
// course's props on the right. Not a diagram itself.
import { view, drawMesh, box as boxMesh, cylinder, join } from '../../../diagrams/mesh.mjs';
import { box, button } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

const PREVIEWS = {
  Crate: () => boxMesh({ size: [0.8, 0.8, 0.8], center: [0, 0, 0.4] }),
  Barrel: () => cylinder({ vertices: 12, radius: 0.36, depth: 0.9, center: [0, 0, 0.45] }),
  Lamp: () => join(boxMesh({ size: [0.1, 0.1, 1.6], center: [0, 0, 0.8] }), boxMesh({ size: [0.3, 0.3, 0.3], center: [0, 0, 1.75] })),
};

// One asset tile: a preview of the prop and its name.
export function tile(kit, x, y, name, { size = 74, mark = false } = {}) {
  const make = PREVIEWS[name];
  const m = make ? make() : null;
  const tall = name === 'Lamp' ? 1.9 : 0.9;
  const v = view({ scale: (size * 0.62) / tall, at: [x + size / 2, y + size * 0.82] });
  return [
    box(x, y, size, size, { cls: mark ? 'd-ui-mark' : 'd-paper', rx: 4, stroke: 1.2 }),
    m ? drawMesh(kit, m, v, { width: 1 }) : '',
    kit.text(x + size / 2, y + size + 14, name, { anchor: 'middle', size: 11 }),
  ];
}

// The whole browser: library name, catalogs (one picked out), tiles and the import method.
export function browser(kit, x, y, { w = 470, h = 200, library = 'My Props', catalogs = ['All', 'Props', 'Unassigned'], current = 'Props', tiles = ['Crate', 'Barrel', 'Lamp'], method = 'Append', markTiles = [] } = {}) {
  const side = 130;
  const out = [box(x, y, w, h, { cls: 'd-ui', rx: 5 }), box(x, y, w, 26, { cls: 'd-sunk', rx: 5 })];
  out.push(kit.text(x + 10, y + 17, 'Asset Browser', { size: 11 }));
  out.push(kit.text(x + w - 150, y + 17, 'Import', { size: 11, anchor: 'end' }));
  out.push(button(kit, x + w - 142, y + 4, method, { width: 130, height: 18 }));
  out.push(box(x + 6, y + 32, side - 12, 20, { cls: 'd-paper', rx: 3 }));
  out.push(kit.text(x + 14, y + 46, library, { size: 11 }));
  catalogs.forEach((name, i) => {
    const cy = y + 62 + i * 22;
    if (name === current) out.push(box(x + 6, cy, side - 12, 20, { cls: 'd-ui-mark', rx: 3 }));
    out.push(kit.text(x + 16 + (name === 'All' ? 0 : 10), cy + 14, name, { size: 11 }));
  });
  out.push(kit.line(x + side, y + 30, x + side, y + h - 6, { cls: 'd-guide', width: 1 }));
  tiles.forEach((name, i) => out.push(tile(kit, x + side + 14 + i * 98, y + 40, name, { mark: markTiles.includes(name) })));
  return { svg: out, side };
}
