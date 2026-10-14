// Wrong: All Transforms also applies Location, so the crate's origin jumps to the centre of the
// world. Right: Rotation & Scale leaves the origin at the middle of the crate's base.
import { box, view, drawMesh, axes } from '../../../diagrams/mesh.mjs';
import { panel, originDot } from './helpers.mjs';

export default (kit) => {
  const crate = () => box({ size: [1, 1, 1], center: [2.5, 0, 0.5] });
  const left = view({ at: [60, 140], scale: 50, target: [0, 0, 0] });
  const right = view({ at: [316, 140], scale: 50, target: [0, 0, 0] });
  return kit.svg({ width: 520, height: 250 },
    panel(kit, 14, 14, 236, 190),
    axes(kit, left, { length: 1, labels: false, width: 1.6 }),
    drawMesh(kit, crate(), left, { width: 1.6 }),
    originDot(kit, left, [0, 0, 0]),
    kit.text(60, 172, 'origin', { anchor: 'middle', size: 11 }),
    kit.tag(132, 230, 'All Transforms', { tone: 'bad' }),
    panel(kit, 270, 14, 236, 190),
    axes(kit, right, { length: 1, labels: false, width: 1.6 }),
    drawMesh(kit, crate(), right, { width: 1.6 }),
    originDot(kit, right, [2.5, 0, 0]),
    kit.tag(388, 230, 'Rotation & Scale'),
  );
};
