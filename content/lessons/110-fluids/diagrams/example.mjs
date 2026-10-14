// Left, a torch burning inside its smoke domain, the box the simulation lives in. Right, a ball of
// water dropped into a tub, splashing up its sides inside the liquid domain.
import { view, drawMesh, uvSphere } from '../../../diagrams/mesh.mjs';
import { torch, tub, domain, flame, puff } from './scene.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const a = view({ azimuth: 30, elevation: 18, at: [120, 206], scale: 100, target: [0, 0, 0] });
  const b = view({ azimuth: 30, elevation: 30, at: [360, 140], scale: 88, target: [0, 0, 0.4] });
  const top = a.project([0, 0, 0.96]);
  const water = b.project([0, 0, 0.34]);
  return kit.svg({ width: 480, height: 260 },
    panel(kit, 10, 10, 220, 220, 'fire and smoke'),
    drawMesh(kit, domain([0.6, 0.6, 1.6], [0, 0, 0.8]), a, { mode: 'wire', cls: 'd-guide', width: 1 }),
    puff(kit, top[0] + 8, top[1] - 80, 11),
    drawMesh(kit, torch(), a, { width: 1.3 }),
    flame(kit, top[0], top[1], 58),
    panel(kit, 250, 10, 220, 220, 'water'),
    drawMesh(kit, domain([1.4, 1.4, 1.0], [0, 0, 0.5]), b, { mode: 'wire', cls: 'd-guide', width: 1 }),
    drawMesh(kit, tub(), b, { width: 1.2 }),
    `<ellipse cx="${water[0]}" cy="${water[1]}" rx="36" ry="14" class="d-face-2 d-ink" stroke-width="1.4"/>`,
    kit.path(`M ${water[0] - 24} ${water[1] - 1} q 8 -9 16 0 q 8 9 16 0 q 8 -9 16 0`, { cls: 'd-ink', width: 1.2 }),
    [[-20, -34], [8, -46], [26, -28]].map(([dx, dy]) => kit.circle(water[0] + dx, water[1] + dy, 3.5, { cls: 'd-ink', width: 1.2 })),
  );
};
