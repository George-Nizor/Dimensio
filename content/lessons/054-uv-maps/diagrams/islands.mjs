// The barrel's UV map after an unwrap with seams: its side is one strip and each end is a disc, so
// it has three UV islands. U runs across the square and V up it, from 0 to 1.
import { uvSquare, drawUVs } from './uv.mjs';
import { barrel } from './props.mjs';

export default (kit) => {
  const { uvs } = barrel({ bad: false });
  const fill = (i) => (i < 12 ? 'd-face-2' : i % 2 ? 'd-face-sel' : 'd-face-1');
  return kit.svg({ width: 420, height: 280 },
    uvSquare(kit, 60, 20, 220),
    drawUVs(kit, uvs, 60, 20, 220, { fill }),
    kit.text(300, 20 + (1 - 0.83) * 220 + 4, 'top: one island', { size: 12 }),
    kit.text(300, 20 + (1 - 0.525) * 220 + 4, 'side: one island', { size: 12 }),
    kit.text(300, 20 + (1 - 0.17) * 220 + 4, 'bottom: one island', { size: 12 }),
  );
};
