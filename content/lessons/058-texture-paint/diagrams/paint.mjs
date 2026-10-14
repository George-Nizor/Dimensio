// Painting dirt: the brush circle on the crate's lower edge, a dark stroke behind it, and Mirror X
// on so the other side gets the same stroke.
import { cursor } from '../../../diagrams/mesh.mjs';
import { crate, dirt } from './crate.mjs';

export default (kit) => {
  const shapes = crate(kit, { at: [170, 140], scale: 110, paint: (face) => (face.n[1] < -0.5 ? dirt(face, { height: 0.24 }) : []) });
  return kit.svg({ width: 440, height: 270 },
    shapes,
    kit.circle(150, 222, 18, { cls: 'd-ink', width: 1.4 }),
    cursor(kit, 150, 222, { size: 0.8 }),
    `<rect x="330" y="40" width="96" height="58" rx="5" class="d-paper" stroke-width="1.2"/>`,
    kit.text(340, 58, 'Symmetry', { size: 11 }),
    ['X', 'Y', 'Z'].map((axis, i) => [
      `<rect x="${340 + i * 28}" y="66" width="24" height="22" rx="4" class="${i === 0 ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
      kit.text(352 + i * 28, 81, axis, { size: 12, anchor: 'middle', cls: i === 0 ? 'd-key-text d-key-text-mark' : 'd-key-text' }),
    ]),
  );
};
