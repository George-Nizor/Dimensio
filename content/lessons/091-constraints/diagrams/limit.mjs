// Seen from the side. Limit Rotation on a lid with Limit X from 0 to 110 degrees: the lid opens as
// far as 110 degrees and no further.
import { panel } from './yard.mjs';

export default (kit) => {
  const hinge = [150, 150];
  const lid = (deg, cls, dash) => {
    const a = (-deg * Math.PI) / 180;
    return kit.line(hinge[0], hinge[1], hinge[0] + Math.cos(a) * 100, hinge[1] + Math.sin(a) * 100, { cls, width: 6, dash });
  };
  const arc = (from, to) => {
    const pts = Array.from({ length: 31 }, (_, i) => { const d = from + ((to - from) * i) / 30; const a = (-d * Math.PI) / 180; return [hinge[0] + Math.cos(a) * 60, hinge[1] + Math.sin(a) * 60]; });
    return kit.polyline(pts, { cls: 'd-mark', width: 2 });
  };
  return kit.svg({ width: 500, height: 200 },
    panel(kit, 14, 14, 300, 172),
    `<rect x="${hinge[0]}" y="${hinge[1]}" width="110" height="26" class="d-face-2 d-ink" stroke-width="1.6"/>`,
    arc(0, 110), lid(0, 'd-guide', '6 4'), lid(110, 'd-ink'), lid(140, 'd-bad', '2 8'),
    kit.dot(hinge[0], hinge[1], { r: 4, cls: 'd-mark-fill' }),
    kit.text(220, 70, '0° to 110°', { size: 12, cls: 'd-tag' }),
    kit.text(40, 84, 'no further', { size: 12, cls: 'd-tag d-tag-bad' }),
    `<rect x="330" y="40" width="160" height="96" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(342, 60, 'Limit Rotation', { size: 12 }),
    `<rect x="342" y="70" width="12" height="12" rx="2" class="d-key-mark" stroke-width="1"/>`, kit.text(360, 81, 'Limit X', { size: 12 }),
    kit.text(342, 104, 'Min 0°', { size: 12, cls: 'd-key-text' }), kit.text(420, 104, 'Max 110°', { size: 12, cls: 'd-key-text' }),
    kit.text(342, 126, 'Affect Transform', { size: 11 }),
  );
};
