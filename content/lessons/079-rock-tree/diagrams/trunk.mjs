// Add > Mesh > Cylinder with Vertices 6, Radius 0.08 m and Depth 0.8 m in the Adjust Last Operation
// panel, then the top face scaled down so the trunk tapers.
import { view, drawMesh, cylinder, facesWhere } from '../../../diagrams/mesh.mjs';
import { trunk } from './shapes.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const straight = cylinder({ vertices: 6, radius: 0.08, depth: 0.8, center: [0, 0, 0.4] });
  const tapered = trunk();
  const top = facesWhere(tapered, (c, n) => n[2] > 0.9);
  return kit.svg({ width: 480, height: 230 },
    `<rect x="14" y="20" width="200" height="104" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 42, 'Add Cylinder', { size: 12 }),
    propRow(kit, 22, 52, 'Vertices', '6', { width: 184, split: 0.42, mark: true }),
    propRow(kit, 22, 76, 'Radius', '0.08 m', { width: 184, split: 0.42 }),
    propRow(kit, 22, 100, 'Depth', '0.8 m', { width: 184, split: 0.42 }),
    drawMesh(kit, straight, view({ scale: 220, elevation: 20, target: [0, 0, 0.4], at: [290, 112] }), { width: 1.4 }),
    kit.line(318, 112, 350, 112, { cls: 'd-mark', width: 2 }), kit.arrowhead(352, 112, 0, { size: 8 }),
    drawMesh(kit, tapered, view({ scale: 220, elevation: 20, target: [0, 0, 0.4], at: [400, 112] }), { width: 1.4, select: { faces: top } }),
    kit.text(400, 220, 'top face scaled with S', { anchor: 'middle', size: 12 }),
  );
};
