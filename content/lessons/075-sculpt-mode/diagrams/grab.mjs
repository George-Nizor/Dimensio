// Grab: the part of the ball under the brush at the start of the stroke follows the mouse, pulling
// the surface out.
import { view } from '../../../diagrams/mesh.mjs';
import { ball, bump, drawSculpt, brushCursor } from './sculpt.mjs';

export default (kit) => {
  const v = view({ at: [160, 120], scale: 70 });
  const pulled = bump(ball(), [0.77, 0.64, 0.15], 0.7, 0.6);
  return kit.svg({ width: 480, height: 230 },
    drawSculpt(kit, pulled, v),
    brushCursor(kit, 262, 112, 28, { strength: 0.5 }),
    kit.line(206, 114, 300, 112, { cls: 'd-mark', width: 2, dash: '5 4' }), kit.arrowhead(302, 112, 0, { size: 8 }),
    kit.text(320, 156, 'drag with Grab:', { size: 12 }),
    kit.text(320, 174, 'the surface follows', { size: 12 }),
  );
};
