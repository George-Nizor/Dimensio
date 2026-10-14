// Wrong: a scene with no camera, where the Line Art modifier draws nothing. Right: the same scene
// with an active camera pointed at it, and its lines drawn.
import { view } from '../../../diagrams/mesh.mjs';
import { drawLineArt } from './lines.mjs';
import { pillar, crate } from './kit.mjs';

const camera = (kit, x, y) => [
  `<rect x="${x}" y="${y}" width="34" height="24" rx="3" class="d-key" stroke-width="1.4"/>`,
  kit.path(`M ${x + 34} ${y + 6} L ${x + 50} ${y - 2} L ${x + 50} ${y + 26} L ${x + 34} ${y + 18} Z`, { cls: 'd-ink', width: 1.4 }),
];

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 22, scale: 80, at: [120, 160] });
  const right = view({ azimuth: 30, elevation: 22, scale: 80, at: [380, 160] });
  return kit.svg({ width: 500, height: 240 },
    drawLineArt(kit, pillar(), left, { lines: false }),
    drawLineArt(kit, crate(), left, { lines: false }),
    kit.tag(120, 226, 'no camera, no lines', { tone: 'bad' }),
    drawLineArt(kit, pillar(), right, { threshold: 130 }),
    drawLineArt(kit, crate(), right, { threshold: 130 }),
    camera(kit, 270, 30),
    kit.tag(380, 226, 'an active camera'),
  );
};
