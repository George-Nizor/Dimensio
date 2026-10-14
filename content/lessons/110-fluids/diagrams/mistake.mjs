// Wrong: the torch moved after Quick Smoke, so its flow cube pokes out of the domain and the
// flame is cut off flat at the domain's wall. Right: the domain moved to enclose the torch with
// room above it.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { torch, domain, flame } from './scene.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const cell = (x, box) => {
    const v = view({ azimuth: 30, elevation: 16, at: [x + 110, 186], scale: 80, target: [0, 0, 0] });
    const top = v.project([0, 0, 0.96]);
    const cut = v.project([0, 0, box[1][2] + box[0][2] / 2]);
    return [
      panel(kit, x, 10, 220, 196),
      drawMesh(kit, domain(...box), v, { mode: 'wire', cls: 'd-guide', width: 1.1 }),
      drawMesh(kit, torch(), v, { width: 1.2 }),
      `<clipPath id="flame-${x}"><rect x="${x}" y="${cut[1]}" width="220" height="200"/></clipPath>`,
      `<g clip-path="url(#flame-${x})">`, flame(kit, top[0], top[1], 70), '</g>',
    ];
  };
  return kit.svg({ width: 480, height: 240 },
    cell(10, [[1, 1, 1.25], [0.45, 0, 0.625]]),
    kit.tag(120, 230, 'flow outside the domain', { tone: 'bad' }),
    cell(250, [[1, 1, 1.8], [0, 0, 0.9]]),
    kit.tag(360, 230, 'domain round the flow'),
  );
};
