// The left arm and leg added in Edit Mode. Each limb starts with Shift+A at the 3D cursor, then
// extrudes along. Ctrl+P with Keep Offset makes the upper arm a child of the chest and the thigh a
// child of the hips: dashed relationship lines join each to its parent without connecting them.
import { views, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { menu } from '../../092-drivers/diagrams/animkit.mjs';
import { character, skeleton, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const v = views.front({ at: [142, 150], scale: 120, target: [0, 0, 0.9] });
  const bones = skeleton().filter((b) => !b.name.endsWith('.R'));
  const p = (q) => v.project(q);
  const dashed = (a, b) => kit.line(...p(a), ...p(b), { cls: 'd-mark', width: 1.4, dash: '4 4' });
  return kit.svg({ width: 480, height: 290 },
    frame(kit, 14, 14, 452, 262),
    drawMesh(kit, character().mesh, v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, bones, { marked: ['upper_arm.L', 'thigh.L'] }),
    dashed([0, 0, 1.45], [0.22, 0, 1.38]),
    dashed([0, 0, 1.08], [0.1175, 0, 0.92]),
    keycap(kit, 330, 60, 'Ctrl+P', { size: 13 }),
    menu(kit, 290, 84, ['Connected', 'Keep Offset'], { w: 160, mark: 'Keep Offset', title: 'Make Parent' }),
  );
};
