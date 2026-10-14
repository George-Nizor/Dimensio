// Three boxes side by side from the front, each with its height measured: a door 2.1 m tall, a
// crate 1 m tall and a box 1.8 m tall for a person.
import { box, views, drawMesh, dimension } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const v = views.front({ at: [250, 230], scale: 90, target: [0, 0, 0] });
  const items = [
    [box({ size: [0.9, 0.1, 2.1], center: [-1.6, 0, 1.05] }), -1.6, -0.45, 2.1, 'door'],
    [box({ size: [1, 1, 1], center: [0, 0, 0.5] }), 0, 0.5, 1, 'crate'],
    [box({ size: [0.5, 0.3, 1.8], center: [1.6, 0, 0.9] }), 1.6, 0.25, 1.8, 'person'],
  ];
  return kit.svg({ width: 500, height: 270 },
    kit.line(40, 230, 470, 230, { cls: 'd-guide', width: 1.2 }),
    items.map(([m, x, half, h, label]) => [
      drawMesh(kit, m, v, { width: 1.6 }),
      dimension(kit, v, [x + half, 0, 0], [x + half, 0, h], { offset: [Math.sign(half) * 0.22, 0, 0], label: `${h} m` }),
      kit.text(...v.project([x, 0, 0]).map((c, i) => (i ? c + 18 : c)), label, { anchor: 'middle', size: 12 }),
    ]),
  );
};
