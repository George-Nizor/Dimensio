// Wrong: the scene seems to have vanished, but the viewport's text reads User Perspective (Local):
// it is in local view. Right: after Numpad / again, the text reads User Perspective and the whole
// market is back.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { market, barrel } from './shapes.mjs';

export default (kit) => {
  const scene = market();
  const left = view({ at: [126, 122], scale: 60, target: [2.4, -1.4, 0.5] });
  const right = view({ at: [382, 120], scale: 22, target: [0, -0.3, 0.5] });
  return kit.svg({ width: 510, height: 240 },
    panel(kit, 14, 14, 224, 184),
    kit.text(24, 32, 'User Perspective (Local)', { size: 11, cls: 'd-tag d-tag-bad' }),
    drawMesh(kit, barrel(2.4, -1.4), left, { width: 1.4 }),
    kit.tag(126, 224, 'in local view', { tone: 'bad' }),
    panel(kit, 270, 14, 224, 184),
    kit.text(280, 32, 'User Perspective', { size: 11 }),
    drawMesh(kit, scene.mesh, right, { width: 1 }),
    kit.tag(382, 224, 'Numpad / again'),
  );
};
