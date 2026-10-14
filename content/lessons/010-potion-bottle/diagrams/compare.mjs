// The bottle's front outline drawn over the outline of Kenney's potion. They match closely except
// at the base, where Kenney's is flatter.
import { outline, kenneyHalf, bottleHalf } from './bottle.mjs';

export default (kit) => {
  const toPage = (x, z) => [200 + x * 560, 240 - z * 520];
  const shape = (half) => outline(half, toPage);
  return kit.svg({ width: 400, height: 270 },
    kit.polyline([...shape(kenneyHalf), shape(kenneyHalf)[0]], { cls: 'd-guide', width: 5 }),
    kit.polyline([...shape(bottleHalf), shape(bottleHalf)[0]], { cls: 'd-mark', width: 2 }),
    kit.line(300, 30, 330, 30, { cls: 'd-guide', width: 5 }), kit.text(338, 34, 'Kenney', { size: 12 }),
    kit.line(300, 52, 330, 52, { cls: 'd-mark', width: 2 }), kit.text(338, 56, 'yours', { size: 12 }),
  );
};
