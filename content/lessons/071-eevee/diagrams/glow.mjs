// Shared by this lesson's diagrams: the rendered stage with a soft glow round the lantern. Not a
// diagram itself.
import { drawMesh } from '../../../diagrams/mesh.mjs';
import { props, cameraPanel, shot } from './stage.mjs';

// The render fills a w-wide area at (x, y), 16:9, so it is w * 9 / 16 high.
export function renderedStage(kit, x, y, w, { glow = true, clip }) {
  const p = cameraPanel(kit, x, y, w, (w * 9) / 16, { frame: 1, clip });
  const v = shot(p.frame, [3.4, -5.0, 1.9]);
  const [gx, gy] = v.project([-0.55, 0.2, 0.86]);
  const rings = glow ? [18, 13, 8].map((r, i) => `<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="${(r * w) / 300}" class="d-mark-fill" opacity="${[0.12, 0.2, 0.35][i]}"/>`) : [];
  return [p.svg, p.inside(drawMesh(kit, props(), v, { width: 1.3 }), rings)];
}
