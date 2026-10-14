// The front view: the table top's upper face 0.75 m above the floor and 1.4 m long, and the chair
// seat 0.45 m above the floor.
import { views, drawMesh, translate, dimension } from '../../../diagrams/mesh.mjs';
import { table, chair } from './parts.mjs';

export default (kit) => {
  const v = views.front({ scale: 170, at: [230, 205], target: [0, 0, 0] });
  const c = translate(chair(), [1.25, 0, 0]);
  return kit.svg({ width: 580, height: 250 },
    kit.line(60, 205, 560, 205, { cls: 'd-guide', width: 1.2 }),
    drawMesh(kit, table(), v, { width: 1.4 }),
    drawMesh(kit, c, v, { width: 1.4 }),
    dimension(kit, v, [-0.7, 0, 0], [-0.7, 0, 0.75], { offset: [-0.14, 0, 0], label: '0.75 m' }),
    dimension(kit, v, [1.475, 0, 0], [1.475, 0, 0.45], { offset: [0.12, 0, 0], label: '0.45 m' }),
    dimension(kit, v, [-0.7, 0, 0.75], [0.7, 0, 0.75], { offset: [0, 0, 0.12], label: '1.4 m' }),
  );
};
