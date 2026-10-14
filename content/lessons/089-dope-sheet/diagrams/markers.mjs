// M adds a marker on the current frame. Here there is one on each frame where the retimed ball lands,
// named with F2. Markers show along the bottom of every animation editor.
import { sheet } from './anim.mjs';
import { RETIMED, GROUND, markers } from './bounce.mjs';

export default (kit) => {
  const s = sheet(kit, { x: 10, y: 14, w: 520, list: 110, start: 0, end: 70, every: 10, channels: [{ label: 'Summary', keys: RETIMED }, { label: 'Z Location', keys: RETIMED, indent: 1 }, { label: '' }] });
  return kit.svg({ width: 540, height: 120 },
    s.svg,
    markers(kit, s.fx, s.rowY(2) + 7, GROUND(RETIMED), { name: 'land' }),
  );
};
