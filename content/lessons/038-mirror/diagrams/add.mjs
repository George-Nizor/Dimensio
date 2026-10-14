// The half cube with a Mirror modifier: the other half appears on the far side of a plane through
// the object's origin, across the X axis.
import { box, translate, view, drawMesh, axes } from '../../../diagrams/mesh.mjs';
import { mirrored } from './shapes.mjs';

export default (kit) => {
  const half = translate(box({ size: [1, 2, 2] }), [0.5, 0, 0]);
  const v = view({ at: [190, 130], scale: 52 });
  const plane = { verts: [[0, -1.4, -1.4], [0, 1.4, -1.4], [0, 1.4, 1.4], [0, -1.4, 1.4]], faces: [[0, 1, 2, 3]] };
  return kit.svg({ width: 400, height: 260 },
    drawMesh(kit, mirrored(half), v, { mode: 'wire', width: 1.3, cls: 'd-guide' }),
    drawMesh(kit, plane, v, { mode: 'wire', width: 1.2, cls: 'd-mark' }),
    drawMesh(kit, half, v, { width: 1.8 }),
    axes(kit, v, { length: 2.1, width: 1.6 }).slice(0, 3),
    kit.dot(...v.project([0, 0, 0]), { r: 4, cls: 'd-mark-fill' }),
    kit.text(300, 236, 'the half you kept', { anchor: 'middle', size: 12 }),
    kit.text(90, 236, 'the copy', { anchor: 'middle', size: 12 }),
  );
};
