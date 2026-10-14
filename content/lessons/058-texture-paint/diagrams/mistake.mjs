// Wrong: two faces whose UVs overlap share the same pixels, so one stroke shows on both. Right: each
// face has its own space on the image, and the stroke shows once.
import { uvSquare } from './uvsquare.mjs';
import { crate } from './crate.mjs';

function half(kit, x, overlap) {
  const stroke = (face) => kit.smooth([[0.15, 0.55], [0.35, 0.62], [0.55, 0.5], [0.8, 0.6]].map(([s, t]) => face.map(s, t)), { cls: 'd-axis-z', width: 7 });
  const paint = (face) => {
    if (face.n[1] < -0.5) return stroke(face);
    if (overlap && face.n[0] > 0.5) return stroke(face);
    return [];
  };
  return [
    crate(kit, { at: [x + 110, 110], scale: 80, paint }),
    uvSquare(kit, x + 40, 190, 70, overlap),
    kit.tag(x + 110, 292, overlap ? 'UVs overlap: painted twice' : 'own islands: painted once', { tone: overlap ? 'bad' : 'mark' }),
  ];
}

export default (kit) => kit.svg({ width: 500, height: 306 }, half(kit, 20, true), half(kit, 270, false));
