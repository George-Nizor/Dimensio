// View Layer properties > Passes > Light with Ambient Occlusion ticked, and the Render Layers node
// with a new Ambient Occlusion output for it.
import { area, check, node } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const rl = node(kit, { x: 300, y: 50, w: 150, title: 'Render Layers', outputs: ['Image', 'Alpha', 'Ambient Occlusion'] });
  return kit.svg({ width: 470, height: 220 },
    area(kit, 16, 14, 250, 196, { title: 'Passes > Light' }),
    check(kit, 34, 46, 'Emission', false),
    check(kit, 34, 72, 'Environment', false),
    check(kit, 34, 98, 'Shadow', false),
    check(kit, 34, 124, 'Ambient Occlusion', true, { mark: true }),
    check(kit, 34, 150, 'Transparent', false),
    rl.svg,
    `<rect x="${rl.out('Ambient Occlusion')[0] - 150}" y="${rl.out('Ambient Occlusion')[1] - 9}" width="146" height="18" rx="3" class="d-ui-mark" stroke-width="1" style="fill:none"/>`,
    kit.arcArrow(240, 132, 296, 116, { lift: -12 }),
  );
};
