// Godot picks a lighter version of the rock as it covers fewer pixels on screen. A MeshInstance3D's
// LOD Bias above 1 keeps the detailed one for longer.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { rock } from './shapes.mjs';
import { option } from './godot.mjs';

export default (kit) => {
  const near = view({ azimuth: 25, elevation: 22, scale: 95, at: [80, 100], target: [0, 0, 0.3] });
  const mid = view({ azimuth: 25, elevation: 22, scale: 52, at: [210, 108], target: [0, 0, 0.3] });
  const far = view({ azimuth: 25, elevation: 22, scale: 26, at: [300, 112], target: [0, 0, 0.3] });
  return kit.svg({ width: 520, height: 210 },
    drawMesh(kit, rock(3), near, { width: 0.5 }),
    drawMesh(kit, rock(2), mid, { width: 0.7 }),
    drawMesh(kit, rock(1), far, { width: 0.7 }),
    kit.line(30, 160, 330, 160, { cls: 'd-guide', width: 1.2 }), kit.arrowhead(330, 160, 0, { size: 8, cls: 'd-guide' }),
    kit.text(180, 180, 'further from the camera', { size: 12, anchor: 'middle' }),
    `<rect x="350" y="70" width="160" height="60" rx="5" class="d-ui" stroke-width="1"/>`,
    kit.text(360, 90, 'MeshInstance3D', { size: 11 }),
    option(kit, 350, 116, 160, 'LOD Bias', '1', { mark: true }),
  );
};
