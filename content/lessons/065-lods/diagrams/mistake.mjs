// Wrong: Decimate on a hand-built crate, where every face holds the shape; Collapse removes faces
// and opens holes. Right: Decimate on the dense rock, which keeps its shape at half the triangles.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { crate, rock, panel, drawOpen } from './shapes.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 24, scale: 140, at: [125, 120], target: [0, 0, 0.4] });
  const right = view({ azimuth: 25, elevation: 22, scale: 120, at: [375, 120], target: [0, 0, 0.3] });
  const c = crate();
  // Two of the faces the viewer would see are gone, so the inside shows.
  const broken = { verts: c.verts, faces: c.faces.filter((f, i) => i !== 2 && i !== 5) };
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 196),
    drawOpen(kit, broken, left, { width: 1.4 }),
    kit.tag(125, 236, 'crate: holes open', { tone: 'bad' }),
    panel(kit, 264, 14, 222, 196),
    drawMesh(kit, rock(2), right, { width: 0.8 }),
    kit.tag(375, 236, 'rock: shape kept'),
  );
};
