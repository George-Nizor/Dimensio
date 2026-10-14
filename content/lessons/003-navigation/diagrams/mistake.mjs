// Wrong: orbiting around a point in empty space, so the cube swings out of view. Right: the cube
// framed with Numpad . first, so the view orbits around it.
import { cube, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './shapes.mjs';

export default (kit) => {
  const off = view({ at: [52, 150], scale: 14 });
  const centred = view({ at: [370, 104], scale: 26 });
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 170),
    drawMesh(kit, cube(), off, { width: 1.4 }),
    kit.dot(160, 70, { r: 4, cls: 'd-mark-fill' }),
    kit.ellipse(160, 70, 60, 20, { cls: 'd-bad', width: 1.6, dash: '5 5' }),
    kit.arcArrow(104, 80, 214, 78, { lift: 26, cls: 'd-bad' }),
    kit.tag(124, 210, 'orbiting around nothing', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 170),
    drawMesh(kit, cube(), centred, { width: 1.8 }),
    kit.dot(370, 104, { r: 4, cls: 'd-mark-fill' }),
    kit.ellipse(370, 114, 88, 26, { cls: 'd-guide', width: 1.4, dash: '5 6' }),
    kit.arcArrow(286, 132, 454, 132, { lift: 30 }),
    kit.tag(376, 210, 'framed, then orbit'),
  );
};
