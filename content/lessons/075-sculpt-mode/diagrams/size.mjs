// The brush cursor on the ball: F changes the outer ring, the size; Shift+F changes the inner
// ring, the strength.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { ball, drawSculpt, brushCursor } from './sculpt.mjs';

export default (kit) => kit.svg({ width: 480, height: 230 },
  drawSculpt(kit, ball(), view({ at: [150, 115], scale: 90 })),
  brushCursor(kit, 150, 100, 46, { strength: 0.5 }),
  keycap(kit, 330, 70, 'F'), kit.text(360, 75, 'size: the outer ring', { size: 12 }),
  keycap(kit, 330, 140, 'Shift+F', { size: 12 }), kit.text(370, 145, 'strength:', { size: 12 }),
  kit.text(370, 162, 'the inner ring', { size: 12 }),
  kit.line(196, 100, 300, 74, { cls: 'd-guide', width: 1 }),
  kit.line(173, 104, 292, 140, { cls: 'd-guide', width: 1 }),
);
