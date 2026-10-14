// The blade with Mirror and then Solidify, Thickness 0.06 m and Offset 0: both halves, 6 cm thick,
// centred on the picture.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, pageArrow, modPanel } from '../../037-modifiers/diagrams/modkit.mjs';
import { blade } from './shapes.mjs';

export default (kit) => {
  const mirror = modPanel(kit, 14, 20, { w: 200, name: 'Mirror', rows: [['Clipping', true]], s: 0.9 });
  const solid = modPanel(kit, 14, 20 + mirror.height + 8, { w: 200, name: 'Solidify', rows: [['Thickness', '0.06 m'], ['Offset', '0']], s: 0.9 });
  return kit.svg({ width: 460, height: 230 },
    mirror.svg, solid.svg,
    pageArrow(kit, 224, 110, 256, 110),
    drawMesh(kit, blade(), view({ at: [356, 118], scale: 290, target: [0, 0, 0.69] }), { width: 1.4 }),
  );
};
