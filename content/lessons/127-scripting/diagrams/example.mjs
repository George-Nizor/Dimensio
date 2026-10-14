// What the script makes: four kit pieces from one .blend file, each written to its own .glb file in
// an export folder beside it.
import { view, box as boxMesh, join, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const v = view({ scale: 30, at: [160, 150] });
  const pieces = [
    ['Floor', translate(boxMesh({ size: [2, 2, 0.1], center: [0, 0, 0.05] }), [-4.2, 0, 0])],
    ['Wall', translate(boxMesh({ size: [2, 0.2, 2], center: [0, 0, 1] }), [-1.6, 0, 0])],
    ['Doorway', translate(join(boxMesh({ size: [0.55, 0.2, 2], center: [-0.725, 0, 1] }), boxMesh({ size: [0.55, 0.2, 2], center: [0.725, 0, 1] }), boxMesh({ size: [0.9, 0.2, 0.4], center: [0, 0, 1.8] })), [1, 0, 0])],
    ['Pillar', translate(boxMesh({ size: [0.4, 0.4, 2], center: [0, 0, 1] }), [3.4, 0, 0])],
  ];
  return kit.svg({ width: 500, height: 230 },
    pieces.map(([, m]) => drawMesh(kit, m, v, { width: 1.2 })),
    kit.text(150, 210, 'the Kit collection in kit.blend', { anchor: 'middle', size: 11 }),
    kit.arcArrow(300, 110, 340, 110, { lift: 0 }),
    box(350, 30, 140, 160, { cls: 'd-ui', rx: 4 }),
    kit.text(360, 50, 'export', { size: 12, cls: 'd-key-text' }),
    pieces.map(([name], i) => kit.text(372, 80 + i * 26, `${name}.glb`, { size: 12, cls: 'd-key-text' })),
  );
};
