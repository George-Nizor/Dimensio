// A ray from the camera bouncing twice, off the floor and then the crate, before it reaches the
// light. Max Bounces Total limits how many bounces a ray may make.
import { propRow } from './stage.mjs';

export default (kit) => {
  const path = [[70, 62], [236, 180], [320, 118], [196, 40]];
  return kit.svg({ width: 500, height: 214 },
    kit.line(20, 180, 480, 180, { cls: 'd-ink', width: 2 }),
    `<rect x="320" y="96" width="90" height="84" class="d-face-2" stroke-width="0"/>`,
    kit.polyline([[320, 180], [320, 96], [410, 96], [410, 180]], { cls: 'd-ink', width: 2 }),
    `<rect x="30" y="40" width="40" height="26" rx="4" class="d-key" stroke-width="1.4"/>`,
    kit.text(50, 84, 'camera', { anchor: 'middle', size: 11 }),
    `<rect x="160" y="22" width="48" height="12" rx="2" class="d-mark-fill"/>`,
    kit.text(146, 32, 'light', { anchor: 'end', size: 11 }),
    kit.polyline(path, { cls: 'd-mark', width: 2 }),
    kit.arrowhead(196, 40, Math.atan2(40 - 118, 196 - 320), { size: 8 }),
    kit.dot(236, 180, { r: 4, cls: 'd-mark-fill' }), kit.text(236, 202, '1', { anchor: 'middle', size: 13, cls: 'd-tag' }),
    kit.dot(320, 118, { r: 4, cls: 'd-mark-fill' }), kit.text(306, 122, '2', { anchor: 'end', size: 13, cls: 'd-tag' }),
    `<rect x="280" y="14" width="200" height="30" rx="4" class="d-paper" stroke-width="1.2"/>`,
    propRow(kit, 288, 20, 'Max Bounces Total', '12', { width: 184, split: 0.72 }),
  );
};
