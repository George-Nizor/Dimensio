// The Screw modifier turns the outline 360 degrees round the object's Z axis. With Steps 12 the
// goblet has twelve sides.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { lathe, panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';
import { goblet, gobletMesh } from './shapes.mjs';

export default (kit) => {
  const v1 = view({ at: [114, 196], scale: 150, elevation: 20, target: [0, 0, 0] });
  const v2 = view({ at: [386, 196], scale: 150, elevation: 20, target: [0, 0, 0] });
  const line = goblet.map(([r, z]) => v1.project([r, 0, z]));
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 200, 196, 'the outline'),
    kit.line(...v1.project([0, 0, -0.05]), ...v1.project([0, 0, 1.1]), { cls: 'd-axis-z', width: 1.2, dash: '5 4' }),
    kit.polyline(line, { cls: 'd-ink', width: 1.8 }),
    pageArrow(kit, 226, 112, 274, 112),
    panel(kit, 286, 14, 200, 196, 'Screw, Steps 12'),
    drawMesh(kit, gobletMesh(12), v2, { width: 0.9 }),
  );
};
