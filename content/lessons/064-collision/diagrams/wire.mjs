// The Object properties' Viewport Display panel with Display As set to Wire, and the result:
// the crate solid inside its collision box drawn as edges only.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { crate, crateCollision } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 28, elevation: 22, scale: 150, at: [390, 118], target: [0, 0, 0.42] });
  return kit.svg({ width: 500, height: 230 },
    `<rect x="14" y="30" width="230" height="150" rx="5" class="d-ui" stroke-width="1"/>`,
    kit.text(26, 52, 'Viewport Display', { size: 12, cls: 'd-key-text' }),
    kit.text(26, 80, 'Show', { size: 11 }), kit.text(120, 80, 'Name, Axes ...', { size: 11 }),
    `<rect x="22" y="94" width="214" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(30, 109, 'Display As', { size: 11 }),
    `<rect x="120" y="97" width="108" height="16" rx="3" class="d-key" stroke-width="1"/>`,
    kit.text(128, 109, 'Wire', { size: 11, cls: 'd-key-text' }),
    kit.text(26, 140, 'Color', { size: 11 }),
    drawMesh(kit, crate(), v, { width: 1.3 }),
    drawMesh(kit, crateCollision(), v, { mode: 'wire', cls: 'd-mark', width: 1.6 }),
  );
};
