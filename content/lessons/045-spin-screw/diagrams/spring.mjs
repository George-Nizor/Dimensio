// A spring: a small upright circle 0.3 m from the axis, turned by the Screw modifier with Screw 0.2 m
// and Iterations 5, so it climbs 0.2 m every turn for five turns.
import { view, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { panel, pageArrow, lathe } from '../../037-modifiers/diagrams/modkit.mjs';
import { spring } from './shapes.mjs';

export default (kit) => {
  const ring = Array.from({ length: 8 }, (_, i) => { const t = (i / 8) * Math.PI * 2; return [0.3 + 0.05 * Math.cos(t), 0.05 * Math.sin(t)]; });
  const v1 = view({ at: [70, 130], scale: 300, elevation: 0, azimuth: 0, target: [0, 0, 0] });
  const v2 = view({ at: [400, 216], scale: 150, elevation: 14, target: [0, 0, 0] });
  return kit.svg({ width: 520, height: 250 },
    panel(kit, 14, 14, 200, 210, 'a circle beside the axis'),
    kit.line(...v1.project([0, 0, -0.3]), ...v1.project([0, 0, 0.3]), { cls: 'd-axis-z', width: 1.2, dash: '5 4' }),
    kit.dot(...v1.project([0, 0, 0]), { r: 4, cls: 'd-mark-fill' }),
    kit.text(70, 196, 'origin', { anchor: 'middle', size: 12 }),
    kit.polyline([...ring, ring[0]].map(([r, z]) => v1.project([r, 0, z])), { cls: 'd-ink', width: 1.8 }),
    pageArrow(kit, 226, 120, 262, 120),
    drawMesh(kit, spring(), v2, { width: 0.6 }),
    dimension(kit, v2, [-0.35, 0, 0], [-0.35, 0, 0.2], { offset: [-0.12, 0, 0], label: 'Screw 0.2 m' }),
  );
};
