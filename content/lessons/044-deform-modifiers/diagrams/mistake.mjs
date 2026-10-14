// The sign bent 90 degrees, from above. Wrong: no loop cuts, so only the two ends can move and the
// box just skews. Right: ten loop cuts across it give the bend vertices to work with.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { sign } from './shapes.mjs';

export default (kit) => {
  const v = (x) => view({ at: [x, 110], scale: 82, elevation: 50, azimuth: 0, target: [0, 0.3, 0.3] });
  return kit.svg({ width: 510, height: 240 },
    panel(kit, 14, 14, 232, 190),
    drawMesh(kit, sign(0, 90), v(130), { width: 1.3 }),
    kit.tag(130, 228, 'no loop cuts', { tone: 'bad' }),
    panel(kit, 264, 14, 232, 190),
    drawMesh(kit, sign(10, 90), v(380), { width: 1.3 }),
    kit.tag(380, 228, 'ten loop cuts'),
  );
};
