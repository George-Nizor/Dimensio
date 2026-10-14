// The Timeline with Start 1 and End 48: at 24 frames a second, two seconds of animation. Dragging in
// the numbers along the top moves the playhead, the blue line at the current frame.
import { strip } from './anim.mjs';

export default (kit) => {
  const field = (x, label, value) => [kit.text(x, 30, label, { anchor: 'end', size: 12 }), `<rect x="${x + 6}" y="16" width="44" height="20" rx="4" class="d-sunk" stroke-width="1"/>`, kit.text(x + 28, 30, value, { anchor: 'middle', size: 12, cls: 'd-key-text' })];
  const t = strip(kit, { x: 26, y: 54, w: 470, h: 64, start: 0, end: 50, every: 10, frame: 20 });
  return kit.svg({ width: 520, height: 160 },
    field(340, 'Start', '1'), field(440, 'End', '48'),
    t.svg,
    kit.text(260, 146, 'drag in the numbers to move the playhead', { anchor: 'middle', size: 12 }),
  );
};
