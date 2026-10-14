// Output Properties > Frame Range with End set to 48, and the timeline from 1 to 250 with frames 1
// to 48 picked out: two seconds at 24 fps.
import { propRow } from './stage.mjs';

export default (kit) => {
  const x0 = 40;
  const x1 = 460;
  const at = (f) => x0 + ((f - 1) / 249) * (x1 - x0);
  return kit.svg({ width: 500, height: 180 },
    `<rect x="14" y="14" width="220" height="96" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 36, 'Frame Range', { size: 12 }),
    propRow(kit, 24, 46, 'Frame Start', '1', { width: 200, split: 0.5 }),
    propRow(kit, 24, 70, 'End', '48', { width: 200, split: 0.5, mark: true }),
    `<rect x="250" y="34" width="234" height="42" rx="6" class="d-paper" stroke-width="1.2"/>`,
    propRow(kit, 258, 46, 'Frame Rate', '24 fps', { width: 218, split: 0.46 }),
    `<rect x="${x0}" y="130" width="${x1 - x0}" height="20" rx="3" class="d-ui" stroke-width="1"/>`,
    `<rect x="${x0}" y="130" width="${(at(48) - x0).toFixed(1)}" height="20" rx="3" class="d-ui-mark" stroke-width="1.4"/>`,
    [1, 48, 100, 150, 200, 250].map((f) => kit.text(at(f), 168, String(f), { anchor: 'middle', size: 11 })),
    kit.text(at(1), 122, 'frames 1 to 48: two seconds', { size: 11, cls: 'd-tag' }),
  );
};
