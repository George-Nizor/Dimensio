// The Particles tab with a new particle system: Type Emitter, and the defaults Number 1000,
// Frame Start 1, End 200 and Lifetime 50. Beside it, particles dropping from the canopy's faces.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { tree } from './scene.mjs';
import { field } from './helpers.mjs';
import { random } from '../../../diagrams/lib.mjs';

export default (kit) => {
  const v = view({ azimuth: 10, elevation: 12, at: [110, 220], scale: 40, target: [0, 0, 0] });
  const next = random(11);
  const dots = Array.from({ length: 40 }, () => {
    const a = next() * Math.PI * 2;
    return v.project([Math.cos(a) * 1.1 * next(), 0, 2.4 - next() * 2.2]);
  });
  return kit.svg({ width: 500, height: 240 },
    drawMesh(kit, tree(), v, { width: 1.2 }),
    dots.map(([x, y]) => kit.dot(x, y, { r: 2.4, cls: 'd-mark-fill' })),
    `<rect x="250" y="16" width="240" height="196" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(262, 36, 'Particles tab, Canopy', { size: 11 }),
    field(kit, 260, 48, 220, 'Type', 'Emitter', { labelWidth: 0.45 }),
    kit.text(262, 92, 'Emission', { size: 11 }),
    field(kit, 260, 102, 220, 'Number', '1000', { labelWidth: 0.45 }),
    field(kit, 260, 128, 220, 'Frame Start', '1', { labelWidth: 0.45 }),
    field(kit, 260, 154, 220, 'End', '200', { labelWidth: 0.45 }),
    field(kit, 260, 180, 220, 'Lifetime', '50', { labelWidth: 0.45 }),
  );
};
