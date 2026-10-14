// With Emulate Numpad, the number row stands in for the numpad: 1, 3, 5 and 7 on the row do what
// the same keys on the numpad did.
import { numpad } from '../../../diagrams/mesh.mjs';
import { keyboard } from './laptop.mjs';

export default (kit) => {
  const k = 30;
  const kb = keyboard(kit, 16, 34, { k, mark: ['1', '3', '5', '7'], rows: 1 });
  const keyX = (i) => 16 + i * (k + k * 0.14) + k / 2;
  const labels = [['1', 'front'], ['3', 'right'], ['5', 'projection'], ['7', 'top']];
  return kit.svg({ width: 540, height: 270 },
    kit.text(16, 22, 'the number row, with Emulate Numpad', { size: 12 }),
    kb.svg,
    labels.map(([key, label], j) => {
      const x = keyX(Number(key));
      const y = 96 + j * 24;
      return [kit.line(x, 68, x, y - 4, { cls: 'd-guide', width: 1.2 }), kit.text(x + 6, y, label, { size: 12 })];
    }),
    kit.text(270, 214, 'does what these did', { anchor: 'middle', size: 12 }),
    kit.line(270, 226, 368, 226, { cls: 'd-mark', width: 2 }), kit.arrowhead(368, 226, 0, { size: 8 }),
    numpad(kit, 392, 104, { highlight: ['1', '3', '5', '7'], size: 1 }),
    kit.text(448, 94, 'the numpad', { anchor: 'middle', size: 12 }),
  );
};
