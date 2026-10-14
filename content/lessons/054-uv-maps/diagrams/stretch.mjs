// The ramp from the exercise. Left, its test grid: square cells on the sides and long cells on the
// slope. Right, its UV map with the UV Stretch overlay on: even faces blue, the slope red.
import { view } from '../../../diagrams/mesh.mjs';
import { drawTextured, uvSquare, drawUVs, stretch } from './uv.mjs';
import { ramp } from './props.mjs';

export default (kit) => {
  const { mesh: m, uvs } = ramp();
  const ratio = stretch(m, uvs);
  const v = view({ at: [120, 170], scale: 80, target: [0, 0, 0.75], azimuth: 35, elevation: 22 });
  return kit.svg({ width: 500, height: 290 },
    drawTextured(kit, m, v, uvs, { cells: 12 }),
    kit.text(120, 280, 'long cells on the slope', { anchor: 'middle', size: 12 }),
    uvSquare(kit, 270, 30, 210, { labels: false }),
    drawUVs(kit, uvs, 270, 30, 210, { fill: (i) => (Math.abs(Math.log(ratio[i])) > 0.3 ? 'd-gizmo-x' : 'd-gizmo-z') }),
    kit.text(375, 280, 'UV Stretch: the slope red', { anchor: 'middle', size: 12 }),
  );
};
