// Armature > Symmetrize: the .L bones, selected, copied across X 0 as .R bones in matching places,
// with matching parents. The new right side is picked out.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { character, skeleton, drawBones, frame } from '../../097-character-modelling/diagrams/charkit.mjs';

export default (kit) => {
  const v = views.front({ at: [240, 150], scale: 130, target: [0, 0, 0.9] });
  const bones = skeleton();
  const right = bones.filter((b) => b.name.endsWith('.R')).map((b) => b.name);
  return kit.svg({ width: 480, height: 300 },
    frame(kit, 14, 14, 452, 272),
    drawMesh(kit, character().mesh, v, { cls: 'd-guide', width: 0.6 }),
    drawBones(kit, v, bones, { marked: right }),
    kit.text(110, 268, '.R: made by Symmetrize', { anchor: 'middle', size: 12 }),
    kit.text(370, 268, '.L: built by hand', { anchor: 'middle', size: 12 }),
    kit.line(240, 30, 240, 250, { cls: 'd-guide', width: 1, dash: '5 5' }),
  );
};
