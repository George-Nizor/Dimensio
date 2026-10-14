// Left, panning: Shift and the middle mouse button slide the view. Right, zooming: the wheel brings
// the view closer or further away.
import { cube, view, drawMesh, mouse, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const left = view({ at: [110, 96], scale: 28 });
  const small = view({ at: [300, 100], scale: 14 });
  const large = view({ at: [410, 96], scale: 30 });
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, cube(), left, { width: 1.6 }),
    kit.line(30, 96, 54, 96, { cls: 'd-mark', width: 2 }), kit.arrowhead(30, 96, Math.PI, { size: 8 }),
    kit.line(166, 96, 190, 96, { cls: 'd-mark', width: 2 }), kit.arrowhead(190, 96, 0, { size: 8 }),
    keycap(kit, 56, 196, 'Shift'), kit.text(94, 201, '+', { anchor: 'middle', size: 14 }),
    mouse(kit, 130, 190, { button: 'middle', size: 0.62 }),
    kit.text(110, 245, 'pan', { anchor: 'middle', size: 12 }),
    drawMesh(kit, cube(), small, { width: 1.4 }),
    drawMesh(kit, cube(), large, { width: 1.8 }),
    kit.line(326, 100, 366, 100, { cls: 'd-mark', width: 2 }), kit.arrowhead(366, 100, 0, { size: 8 }),
    mouse(kit, 356, 190, { button: 'wheel', size: 0.62 }),
    kit.text(356, 245, 'zoom', { anchor: 'middle', size: 12 }),
  );
};
