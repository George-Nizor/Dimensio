// The panel's menu open at Apply, and the mesh in Edit Mode before and after: a cube, then a cube
// with the bevel's faces along every edge.
import { cube, bevelledBox, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { modPanel, menu, panel, pageArrow } from './modkit.mjs';

export default (kit) => {
  const p = modPanel(kit, 14, 20, { w: 230, name: 'Bevel', mark: 'menu' });
  const [mx] = p.at.menu;
  return kit.svg({ width: 520, height: 250 },
    p.svg,
    menu(kit, mx - 160, 52, [['Apply', 'Ctrl A'], ['Duplicate', 'Shift D'], 'Copy to Selected', 'Move to First', 'Move to Last'], { w: 180, mark: 'Apply' }),
    panel(kit, 256, 20, 120, 150, 'before'),
    drawMesh(kit, cube(), view({ at: [316, 95], scale: 22 }), { mode: 'xray', width: 1.3 }),
    pageArrow(kit, 380, 95, 394, 95),
    panel(kit, 398, 20, 120, 150, 'after Apply'),
    drawMesh(kit, bevelledBox({ size: [2, 2, 2], width: 0.2 }), view({ at: [458, 95], scale: 22 }), { mode: 'xray', width: 1 }),
  );
};
