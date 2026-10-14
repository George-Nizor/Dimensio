// The Layers panel in the Object Data properties: Lines above Fills, Lines selected, each with its
// eye and lock icons, and the + button for a new layer.
import { box, area } from './ui-kit.mjs';

const eye = (kit, x, y) => [kit.ellipse(x, y, 7, 4, { cls: 'd-ink', width: 1.3 }), kit.dot(x, y, { r: 2 })];
const lock = (kit, x, y) => [box(x - 5, y - 1, 10, 8, { cls: 'd-key', rx: 1.5, stroke: 1.2 }), kit.path(`M ${x - 3} ${y - 1} L ${x - 3} ${y - 4} A 3 3 0 0 1 ${x + 3} ${y - 4} L ${x + 3} ${y - 1}`, { cls: 'd-ink', width: 1.2 })];

export default (kit) => {
  const rows = [{ name: 'Lines', on: true }, { name: 'Fills' }];
  return kit.svg({ width: 420, height: 200 },
    area(kit, 20, 16, 380, 168, { title: 'Layers' }),
    box(30, 46, 310, 70, { cls: 'd-sunk', rx: 3 }),
    rows.map((row, i) => {
      const y = 52 + i * 30;
      return [
        box(34, y, 302, 26, { cls: row.on ? 'd-ui-mark' : 'd-paper', rx: 3 }),
        kit.text(46, y + 17, row.name, { size: 12 }),
        eye(kit, 290, y + 13),
        lock(kit, 318, y + 13),
      ];
    }),
    box(350, 50, 40, 26, { cls: 'd-key-mark', rx: 3, stroke: 1.2 }),
    kit.text(370, 68, '+', { anchor: 'middle', size: 16, cls: 'd-key-text d-key-text-mark' }),
    box(350, 82, 40, 26, { cls: 'd-key', rx: 3, stroke: 1.2 }),
    kit.text(370, 100, '-', { anchor: 'middle', size: 16, cls: 'd-key-text' }),
    kit.text(46, 146, 'new strokes go onto the selected layer', { size: 12 }),
    kit.text(46, 166, 'the top layer draws over the ones below', { size: 12 }),
  );
};
