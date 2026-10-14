// The banner's corner with Fill Rim off and on. Off, the two surfaces are separate skins with a gap
// along the edge; on, faces close the gap.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { solidify, panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { standingPlane } from './shapes.mjs';

export default (kit) => {
  const p = standingPlane(1.6, 1.6);
  const v1 = view({ at: [114, 160], scale: 70, azimuth: 55, elevation: 32 });
  const v2 = view({ at: [386, 160], scale: 70, azimuth: 55, elevation: 32 });
  const open = solidify(p, 0.4, { rim: false });
  const both = { verts: open.verts, faces: [...open.faces, ...open.faces.map((f) => [...f].reverse())] };
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 200, 186, 'Fill Rim off'),
    drawMesh(kit, both, v1, { width: 1.6 }),
    panel(kit, 286, 14, 200, 186, 'Fill Rim on'),
    drawMesh(kit, solidify(p, 0.4), v2, { width: 1.6 }),
  );
};
