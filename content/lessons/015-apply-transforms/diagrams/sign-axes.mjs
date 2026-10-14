// The sign standing upright. Left, before applying: its own axes are turned, with Y pointing up, so
// its Dimensions read 1.2, 0.8, 0.24. Right, after Rotation & Scale: its axes match the world's and
// its Dimensions read 1.2, 0.24, 0.8.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, localAxes, originDot } from './helpers.mjs';

export default (kit) => {
  const sign = () => box({ size: [1.2, 0.24, 0.8], center: [0, 0.12, 0.4] });
  const left = view({ at: [140, 120], scale: 110, target: [0, 0, 0.4] });
  const right = view({ at: [410, 120], scale: 110, target: [0, 0, 0.4] });
  return kit.svg({ width: 550, height: 240 },
    panel(kit, 14, 14, 252, 190, 'Dimensions 1.2, 0.8, 0.24'),
    drawMesh(kit, sign(), left, { width: 1.4 }),
    localAxes(kit, left, [0, 0, 0], [[1, 0, 0], [0, 0, 1], [0, -1, 0]], { length: 0.55 }),
    originDot(kit, left, [0, 0, 0]),
    panel(kit, 284, 14, 252, 190, 'Dimensions 1.2, 0.24, 0.8'),
    drawMesh(kit, sign(), right, { width: 1.4 }),
    localAxes(kit, right, [0, 0, 0], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], { length: 0.55 }),
    originDot(kit, right, [0, 0, 0]),
  );
};
