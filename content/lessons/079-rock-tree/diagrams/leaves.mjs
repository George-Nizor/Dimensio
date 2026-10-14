// An ico sphere with Subdivisions 2 (80 triangles) and the Displace modifier using a Clouds texture:
// the smooth ball turns lumpy.
import { view, drawMesh, scale } from '../../../diagrams/mesh.mjs';
import { icoSphere, displace } from './shapes.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const at = (x) => view({ scale: 56, elevation: 18, at: [x, 112] });
  return kit.svg({ width: 500, height: 230 },
    `<rect x="14" y="20" width="200" height="104" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 42, 'Displace', { size: 12 }),
    propRow(kit, 22, 52, 'Texture', 'Clouds', { width: 184, split: 0.42, mark: true }),
    propRow(kit, 22, 76, 'Strength', '0.3', { width: 184, split: 0.42, mark: true }),
    propRow(kit, 22, 100, 'Direction', 'Normal', { width: 184, split: 0.42 }),
    drawMesh(kit, scale(icoSphere(2), [1, 1, 1.25]), at(280), { width: 1.2 }),
    kit.line(342, 112, 372, 112, { cls: 'd-mark', width: 2 }), kit.arrowhead(374, 112, 0, { size: 8 }),
    drawMesh(kit, scale(displace(icoSphere(2), 0.16, 9), [1, 1, 1.25]), at(442), { width: 1.2 }),
    kit.text(280, 208, 'Subdivisions 2', { anchor: 'middle', size: 12 }),
    kit.text(442, 208, 'displaced', { anchor: 'middle', size: 12 }),
  );
};
