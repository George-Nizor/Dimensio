// A close view of the left arm in Edit Mode, front view. The scaled meta-rig's arm bones sit
// short and high (dashed); arrows show each joint moved into the middle of the arm. With X-Axis
// Mirror ticked in the Sidebar's Tool tab, the right arm follows.
import { silhouette, bone, panel, push, checkbox } from './helpers.mjs';
import { front, metaBones, bodyParts, K, fitted } from './rig.mjs';

export default (kit) => {
  // Zoom in on the arm: 400 pixels per metre, shoulder near the left of the panel.
  const p = front(-40, 625, 400);
  const arm = (name) => ['shoulder.L', 'upper_arm.L', 'forearm.L', 'hand.L'].includes(name);
  const before = metaBones(p, { k: K }).filter(([n]) => arm(n));
  const after = metaBones(p, { k: K, edit: fitted }).filter(([n]) => arm(n));
  const joints = (list) => [list[1][1], list[1][2], list[2][2], list[3][2]];
  const from = joints(before);
  const to = joints(after);
  return kit.svg({ width: 480, height: 250 },
    panel(kit, 10, 10, 300, 190),
    `<clipPath id="arm-clip"><rect x="10" y="10" width="300" height="190" rx="6"/></clipPath>`,
    `<g clip-path="url(#arm-clip)">`,
    silhouette(kit, bodyParts(p), { width: 1.4 }),
    before.map(([, h, t]) => kit.line(h[0], h[1], t[0], t[1], { cls: 'd-guide', width: 2, dash: '5 4' })),
    after.map(([, h, t]) => bone(kit, h, t, { width: 1.4 })),
    from.map((a, i) => push(kit, a[0], a[1], to[i][0], to[i][1], { width: 2, size: 7 })),
    `</g>`,
    kit.text(160, 222, 'joints moved into the arm', { anchor: 'middle', size: 12 }),
    `<rect x="330" y="60" width="140" height="90" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(340, 80, 'Tool > Options', { size: 11 }),
    checkbox(kit, 340, 96, 'X-Axis Mirror', true),
    kit.text(340, 136, 'right side follows', { size: 11 }),
  );
};
