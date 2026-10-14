// Wrong: exported with Apply Modifiers off, so the game gets the one leg that was modelled.
// Right: Apply Modifiers on, and all four legs arrive.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { table, tableTop, tableLeg, panel } from './parts.mjs';

export default (kit) => {
  const left = view({ azimuth: 32, elevation: 22, scale: 105, at: [125, 118], target: [0, 0, 0.35] });
  const right = view({ azimuth: 32, elevation: 22, scale: 105, at: [375, 118], target: [0, 0, 0.35] });
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196),
    drawMesh(kit, tableTop(), left, { width: 1.4 }),
    drawMesh(kit, tableLeg(1, 1), left, { width: 1.4 }),
    kit.tag(125, 236, 'Apply Modifiers off', { tone: 'bad' }),
    panel(kit, 264, 14, 222, 196),
    drawMesh(kit, table(), right, { width: 1.4 }),
    kit.tag(375, 236, 'Apply Modifiers on'),
  );
};
