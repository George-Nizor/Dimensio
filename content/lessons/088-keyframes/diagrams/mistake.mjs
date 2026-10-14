// Wrong: the coin is keyed on frame 1 only. Moved up on frame 24 without pressing I, it goes back
// down as soon as the frame changes. Right: I on frame 24 adds a key, and the move stays.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { coin } from './coin.mjs';
import { strip, panel } from './anim.mjs';

const half = (kit, x0, keyed) => {
  const v = view({ azimuth: 10, elevation: 12, at: [x0 + 110, 120], scale: 60 });
  const t = strip(kit, { x: x0 + 18, y: 150, w: 184, h: 36, start: 0, end: 50, every: 10, keys: keyed ? [1, 24] : [1], frame: 24 });
  return [
    panel(kit, x0, 10, 220, 130),
    keyed ? drawMesh(kit, coin(0, 1), v, { width: 1.2 }) : [drawMesh(kit, coin(0, 1), v, { mode: 'wire', cls: 'd-guide', width: 1 }), drawMesh(kit, coin(0, 0), v, { width: 1.2 }), kit.arcArrow(x0 + 160, 50, x0 + 160, 104, { lift: -14, cls: 'd-bad' })],
    t.svg,
  ];
};

export default (kit) => kit.svg({ width: 500, height: 232 },
  half(kit, 14, false), kit.tag(124, 220, 'not keyed: it drops back', { tone: 'bad' }),
  half(kit, 266, true), kit.tag(376, 220, 'keyed with I'),
);
