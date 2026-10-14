// Freeing the foot in Edit Mode: foot.L selected, and Alt+P's Clear Parent menu with Clear Parent
// picked out. Afterwards the foot has no parent, so the shin no longer carries it.
import { views, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { menu } from '../../092-drivers/diagrams/animkit.mjs';
import { character, skeleton, drawBones } from '../../097-character-modelling/diagrams/charkit.mjs';
import { frame, partMesh } from './ikkit.mjs';

export default (kit) => {
  const v = views.right({ at: [150, 266], scale: 210, target: [0, 0, 0] });
  const leg = skeleton().filter((b) => /^(thigh|shin|foot)\.L$/.test(b.name));
  return kit.svg({ width: 480, height: 300 },
    frame(kit, 14, 14, 250, 272),
    drawMesh(kit, partMesh(character(), ['hips', 'thigh.L', 'shin.L', 'foot.L']), v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, leg, { marked: ['foot.L'], names: true }),
    keycap(kit, 330, 60, 'Alt+P', { size: 13 }),
    menu(kit, 284, 86, ['Clear Parent', 'Disconnect Bone'], { w: 180, mark: 'Clear Parent', title: 'Clear Parent' }),
  );
};
