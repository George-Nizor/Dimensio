// Quick Smoke on the torch's top cube: the menu path, Smoke Style set to Fire in the Adjust Last
// Operation panel, and the Smoke Domain box Blender adds around the cube.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { torch, domain } from './scene.mjs';
import { menuPath, field } from './helpers.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 18, at: [110, 196], scale: 42, target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 240 },
    drawMesh(kit, domain([2.16, 2.16, 4.16], [0, 0, 1.88]), v, { mode: 'wire', cls: 'd-mark', width: 1.2 }),
    drawMesh(kit, torch(), v, { width: 1.2 }),
    kit.text(230, 40, 'Smoke Domain, added round the cube', { size: 12, cls: 'd-tag' }),
    menuPath(kit, 230, 70, ['Object', 'Quick Effects', 'Quick Smoke'], { size: 10 }).svg,
    `<rect x="230" y="120" width="250" height="60" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(240, 138, 'Adjust Last Operation', { size: 11 }),
    field(kit, 240, 148, 230, 'Smoke Style', 'Fire', { on: true, labelWidth: 0.42 }),
  );
};
