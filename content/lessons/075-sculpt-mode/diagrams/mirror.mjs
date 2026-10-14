// The X toggle beside the mirror icon in the Sculpt Mode header, and a stroke on one side of the
// ball repeated on the other side of its X axis.
import { view } from '../../../diagrams/mesh.mjs';
import { ball, bump, drawSculpt } from './sculpt.mjs';

export default (kit) => {
  const v = view({ azimuth: 0, elevation: 10, at: [300, 128], scale: 80 });
  const both = bump(bump(ball(), [0.85, -0.2, 0.5], 0.45, 0.35), [-0.85, -0.2, 0.5], 0.45, 0.35);
  return kit.svg({ width: 480, height: 230 },
    `<rect x="16" y="20" width="132" height="28" rx="4" class="d-ui" stroke-width="1"/>`,
    kit.path('M 30 26 L 30 42 M 24 30 L 20 34 L 24 38 M 36 30 L 40 34 L 36 38', { cls: 'd-ink', width: 1.6 }),
    ['X', 'Y', 'Z'].map((a, i) => [
      `<rect x="${52 + i * 30}" y="24" width="28" height="20" rx="3" class="${a === 'X' ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
      kit.text(66 + i * 30, 38, a, { anchor: 'middle', size: 11, cls: a === 'X' ? 'd-key-text d-key-text-mark' : 'd-key-text' }),
    ]),
    drawSculpt(kit, both, v),
    kit.line(300, 30, 300, 226, { cls: 'd-axis-x', width: 1.4, dash: '6 5' }),
    kit.text(368, 34, 'your stroke', { anchor: 'middle', size: 12 }),
    kit.text(232, 34, 'the mirrored copy', { anchor: 'middle', size: 12 }),
  );
};
