// The modifier stack: Bevel above Subdivision Surface. Blender works from the top down, so the
// cube is bevelled first and then subdivided.
import { cube, bevelledBox, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { subdivide, modPanel, pageArrow } from './modkit.mjs';

export default (kit) => {
  const bevel = modPanel(kit, 20, 40, { w: 250, name: 'Bevel', rows: [['Amount', '0.1 m'], ['Segments', '1']] });
  const subsurf = modPanel(kit, 20, 40 + bevel.height + 34, { w: 250, name: 'Subdivision', rows: [['Levels Viewport', '2'], ['Render', '2']] });
  const bevelled = bevelledBox({ size: [2, 2, 2], width: 0.1 });
  const shape = (m, x, y, label) => [drawMesh(kit, m, view({ at: [x, y], scale: 21 }), { width: m.faces.length > 50 ? 0.5 : 1.3 }), kit.text(x, y + 56, label, { anchor: 'middle', size: 11 })];
  return kit.svg({ width: 520, height: 300 },
    kit.text(20, 26, 'the stack, top to bottom', { size: 12 }),
    bevel.svg, subsurf.svg,
    pageArrow(kit, 145, 40 + bevel.height + 6, 145, 40 + bevel.height + 28, { cls: 'd-guide' }),
    shape(cube(), 330, 80, 'mesh'),
    pageArrow(kit, 362, 80, 386, 80),
    shape(bevelled, 420, 80, 'after Bevel'),
    pageArrow(kit, 420, 146, 420, 176),
    shape(subdivide(bevelled, 2), 420, 226, 'after Subdivision'),
  );
};
