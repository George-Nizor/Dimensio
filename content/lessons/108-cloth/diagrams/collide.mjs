// Collisions: Collision turned on for the table (and the floor), with its thin collision zone
// drawn dashed round the top, and Self Collisions ticked in the cloth's Collisions panel.
import { view, drawMesh, box } from '../../../diagrams/mesh.mjs';
import { table, sheet } from './scene.mjs';
import { checkbox } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: 35, elevation: 22, at: [150, 140], scale: 120, target: [0, 0, 0.5] });
  return kit.svg({ width: 500, height: 240 },
    drawMesh(kit, table(), v, { width: 1.3 }),
    drawMesh(kit, box({ size: [1.24, 0.84, 0.09], center: [0, 0, 0.745] }), v, { mode: 'wire', cls: 'd-mark', width: 1.2 }),
    drawMesh(kit, sheet([12, 10]), v, { width: 0.8 }),
    kit.text(320, 176, 'Table: Physics tab >', { size: 12 }),
    kit.text(320, 194, 'Collision (zone outlined)', { size: 12 }),
    `<rect x="320" y="70" width="170" height="80" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(330, 90, 'Tablecloth, Collisions', { size: 11 }),
    checkbox(kit, 330, 102, 'Object Collisions', true),
    checkbox(kit, 330, 124, 'Self Collisions', true),
  );
};
