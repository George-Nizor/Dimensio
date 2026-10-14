// One end of the bench, close up. Left, scaled in Object Mode: the Bevel modifier's 8 cm bevel is
// squeezed to 2 cm along the sides. Right, after applying scale: 8 cm on every edge.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { closeUp } from './helpers.mjs';
import { benchBefore, benchAfter } from './shapes.mjs';

export default (kit) => {
  const opts = { scale: 300, target: [0.55, 0, 0.25], azimuth: 34, elevation: 30 };
  const left = view({ ...opts, at: [120, 110] });
  const right = view({ ...opts, at: [390, 110] });
  return kit.svg({ width: 550, height: 230 },
    closeUp(kit, 'd015-example-a', 14, 14, 252, 180, 'Scale 1, 0.25, 0.25', drawMesh(kit, benchBefore(), left, { width: 1.3 })),
    closeUp(kit, 'd015-example-b', 284, 14, 252, 180, 'Scale 1, 1, 1', drawMesh(kit, benchAfter(), right, { width: 1.3 })),
  );
};
