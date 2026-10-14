// The three props made game-ready: each stands on its origin at the base centre, with its front
// facing -Y, towards the viewer.
import { view, drawMesh, axes } from '../../../diagrams/mesh.mjs';
import { crate, barrel, chair, translate, origin } from './parts.mjs';

export default (kit) => {
  const v = view({ azimuth: 24, elevation: 18, scale: 110, at: [250, 150], target: [0, 0, 0.45] });
  const props = [[crate(), -1.6], [barrel(), 0], [chair(), 1.4]];
  return kit.svg({ width: 500, height: 240 },
    props.map(([m, x]) => drawMesh(kit, translate(m, [x, 0, 0]), v, { width: 1.4 })),
    props.map(([, x]) => origin(kit, ...v.project([x, 0, 0]))),
    axes(kit, view({ azimuth: 24, elevation: 18, scale: 40, at: [455, 205] }), { length: 0.8 }),
  );
};
