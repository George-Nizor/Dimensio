// Pinning, for cloth that hangs: a banner with its top row of vertices in a vertex group called
// pin (picked out), chosen as the Pin Group in Cloth > Shape. The rest hangs and sways.
import { plane, transform, views, drawMesh, vertsWhere } from '../../../diagrams/mesh.mjs';
import { field } from './helpers.mjs';

export default (kit) => {
  const banner = transform(plane({ size: [1.2, 1.6], segments: [8, 10] }), ([x, y]) => {
    const down = (0.8 - y) / 1.6;
    return [x * (1 - 0.12 * down) + 0.16 * down * down, 0, 1 + y * 0.98];
  });
  const v = views.front({ at: [130, 120], scale: 110, target: [0, 0, 1] });
  const top = vertsWhere(banner, ([, , z]) => z > 1.77);
  return kit.svg({ width: 480, height: 240 },
    kit.line(40, v.project([0, 0, 1.8])[1] - 4, 220, v.project([0, 0, 1.8])[1] - 4, { cls: 'd-ink', width: 4 }),
    drawMesh(kit, banner, v, { mode: 'wire', width: 1, select: { verts: top } }),
    kit.text(130, 228, 'top row in the pin group', { anchor: 'middle', size: 12 }),
    `<rect x="270" y="80" width="200" height="70" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(280, 100, 'Cloth > Shape', { size: 11 }),
    field(kit, 280, 112, 180, 'Pin Group', 'pin', { on: true, labelWidth: 0.42 }),
  );
};
