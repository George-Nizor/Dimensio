// The Raytracing panel ticked, with Method set to Screen-Trace. Beside it, light bouncing off the
// floor onto the side of the crate, which ray tracing works out from what is on screen.
import { propRow } from './stage.mjs';

export default (kit) => kit.svg({ width: 500, height: 200 },
  `<rect x="14" y="20" width="210" height="110" rx="5" class="d-paper" stroke-width="1.2"/>`,
  `<rect x="18" y="26" width="202" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  propRow(kit, 24, 29, '', 'Raytracing', { width: 180, split: 0.0, tick: true }),
  propRow(kit, 24, 64, 'Method', 'Screen-Trace', { width: 190, split: 0.38 }),
  propRow(kit, 24, 92, 'Resolution', '1:2', { width: 190, split: 0.38 }),
  kit.line(260, 160, 480, 160, { cls: 'd-ink', width: 2 }),
  `<rect x="380" y="90" width="70" height="70" class="d-face-2" stroke-width="0"/>`,
  kit.polyline([[380, 160], [380, 90], [450, 90], [450, 160]], { cls: 'd-ink', width: 2 }),
  kit.line(280, 40, 340, 158, { cls: 'd-mark', width: 2 }), kit.arrowhead(340, 158, Math.atan2(118, 60), { size: 8 }),
  kit.line(342, 156, 376, 118, { cls: 'd-mark', width: 2, dash: '5 4' }), kit.arrowhead(376, 118, Math.atan2(-38, 34), { size: 8 }),
  kit.text(370, 188, 'light bounced off the floor', { anchor: 'middle', size: 12 }),
);
