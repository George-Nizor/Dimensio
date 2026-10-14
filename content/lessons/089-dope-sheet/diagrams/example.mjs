// The ball's Z Location keys in the Dope Sheet. Top, as the exercise starts: a key every 12 frames,
// so every bounce lasts 24 frames. Bottom, retimed: each bounce shorter than the one before.
import { sheet } from './anim.mjs';
import { EVEN, RETIMED } from './bounce.mjs';

export default (kit) => {
  const a = sheet(kit, { x: 10, y: 14, w: 520, list: 110, start: 0, end: 90, every: 10, channels: [{ label: 'Summary', keys: EVEN }, { label: 'Z Location', keys: EVEN, indent: 1 }] });
  const b = sheet(kit, { x: 10, y: 118, w: 520, list: 110, start: 0, end: 90, every: 10, channels: [{ label: 'Summary', keys: RETIMED }, { label: 'Z Location', keys: RETIMED, indent: 1 }] });
  return kit.svg({ width: 540, height: 210 },
    a.svg, kit.text(270, 100, 'before: every bounce 24 frames', { anchor: 'middle', size: 12 }),
    b.svg, kit.text(270, 204, 'after: each bounce shorter than the last', { anchor: 'middle', size: 12, cls: 'd-tag' }),
  );
};
