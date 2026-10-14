// The three props as they should look in Godot: the sign's board one flat red and its post one
// flat brown, the crate solid, and the bush green from its vertex colours.
import { view } from '../../../diagrams/mesh.mjs';
import { sign, crate, bush, translate, drawPainted } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 22, elevation: 16, scale: 120, at: [250, 160], target: [0, 0, 0.5] });
  const s = sign();
  return kit.svg({ width: 500, height: 250 },
    drawPainted(kit, translate(s.mesh, [-1.5, 0, 0]), v, (i) => (s.isBoard(i) ? 'd-gizmo-x' : 'd-key-mark')),
    drawPainted(kit, crate(), v, () => null),
    drawPainted(kit, translate(bush(), [1.5, 0, 0]), v, () => 'd-gizmo-y', { width: 1 }),
  );
};
