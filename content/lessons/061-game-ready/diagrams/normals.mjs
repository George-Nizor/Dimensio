// Face Orientation on. Left, the barrel inside out: every face shows red. Right, after selecting
// all and pressing Shift+N, every face shows blue.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { barrel, insideOut, panel, drawFacing } from './parts.mjs';

export default (kit) => {
  const left = view({ azimuth: 20, elevation: 22, scale: 170, at: [125, 112], target: [0, 0, 0.45] });
  const right = view({ azimuth: 20, elevation: 22, scale: 170, at: [375, 112], target: [0, 0, 0.45] });
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 200, 196, 'inside out'),
    drawFacing(kit, insideOut(barrel()), left, { width: 1.1 }),
    keycap(kit, 250, 112, 'Shift+N', { size: 12 }),
    panel(kit, 286, 14, 200, 196, 'pointing out'),
    drawFacing(kit, barrel(), right, { width: 1.1 }),
  );
};
