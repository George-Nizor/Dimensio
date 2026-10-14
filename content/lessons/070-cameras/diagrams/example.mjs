// The three shots of the exercise, as their camera frames show them: a wide shot of the whole group,
// a close-up of the lantern at 85 mm, and an orthographic view straight from the front.
import { drawMesh } from '../../../diagrams/mesh.mjs';
import { props, cameraPanel, shot } from './stage.mjs';

export default (kit) => {
  const m = props();
  const cells = [
    ['wide, 50 mm', [3.4, -5.0, 1.9], { lens: 50 }],
    ['close-up, 85 mm', [1.2, -3.6, 1.6], { lens: 85, target: [-0.55, 0.2, 0.8] }],
    ['orthographic front', [0, -6, 0.45], { ortho: 2.6 }],
  ];
  return kit.svg({ width: 540, height: 150 }, cells.map(([label, from, options], i) => {
    const p = cameraPanel(kit, 6 + i * 178, 12, 172, 104, { frame: 0.94, label, clip: `cameras-example-${i}` });
    const v = shot(p.frame, from, options);
    return [p.svg, p.inside(drawMesh(kit, m, v, { width: 1.3 })), p.border, p.label];
  }));
};
