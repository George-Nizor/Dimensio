// The bounce in the bounce-even starter, and the same bounce retimed. Not a diagram itself.
// Even: a key every 12 frames. Retimed: each rise and fall shorter than the last, in proportion to
// the square root of the height, rounded to whole frames.
export const EVEN = [1, 13, 25, 37, 49, 61, 73, 85];
export const RETIMED = [1, 13, 23, 33, 41, 49, 56, 63];
export const HEIGHTS = [3, 0.25, 2.2, 0.25, 1.5, 0.25, 0.9, 0.25];
export const GROUND = (frames) => frames.filter((_, i) => i % 2 === 1);

// Marker triangles along the bottom of a Dope Sheet, with an optional name beside each.
export function markers(kit, fx, y, frames, { name = '' } = {}) {
  return frames.map((f) => {
    const x = fx(f);
    return [kit.line(x, y - 60, x, y - 6, { cls: 'd-guide', width: 1, dash: '3 3' }), `<path d="M ${x - 5} ${y} L ${x + 5} ${y} L ${x} ${y - 7} Z" class="d-dot"/>`, name ? kit.text(x + 6, y + 1, name, { size: 9.5 }) : ''];
  });
}
