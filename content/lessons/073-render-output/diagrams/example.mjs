// Six of the 48 frames of the turntable, each turned a little further, saved as numbered PNG files.
import { turntableFrame } from './stage.mjs';

export default (kit) => {
  const frames = [1, 9, 17, 25, 33, 41];
  return kit.svg({ width: 540, height: 110 }, frames.map((f, i) => [
    turntableFrame(kit, 6 + i * 89, 14, 84, ((f - 1) * 360) / 48, `output-example-${i}`),
    kit.text(48 + i * 89, 80, `${String(f).padStart(4, '0')}.png`, { anchor: 'middle', size: 11 }),
  ]), kit.text(270, 104, '48 frames, one full turn', { anchor: 'middle', size: 12, cls: 'd-label' }));
};
