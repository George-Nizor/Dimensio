// The settings that decide how a body moves: Mass in Settings, and Friction and Bounciness in
// Collisions > Surface Response. A 10 kg ball barely slows when it hits 1 kg blocks.
import { field } from './helpers.mjs';
import { view, drawMesh, join } from '../../../diagrams/mesh.mjs';
import { block, ball } from './scene.mjs';

export default (kit) => {
  const v = view({ azimuth: -20, elevation: 16, at: [130, 120], scale: 70, target: [-0.6, 0, 0.3] });
  const b = v.project([-1.3, 0, 0]);
  const k = v.project([0, 0, 0]);
  return kit.svg({ width: 500, height: 210 },
    drawMesh(kit, join(block(0, 0, 0.25), ball(-1.3)), v, { width: 1.5 }),
    kit.text(b[0], b[1] + 24, '10 kg', { anchor: 'middle', size: 12, cls: 'd-tag' }),
    kit.text(k[0], k[1] + 24, '1 kg', { anchor: 'middle', size: 12 }),
    kit.text(250, 40, 'Physics tab, Rigid Body', { size: 12 }),
    field(kit, 250, 56, 230, 'Mass', '10 kg', { on: true }),
    field(kit, 250, 90, 230, 'Friction', '0.5'),
    field(kit, 250, 124, 230, 'Bounciness', '0'),
  );
};
