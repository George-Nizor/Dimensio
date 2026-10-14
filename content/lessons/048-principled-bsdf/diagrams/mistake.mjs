// Wrong: Emission Color set to blue but Strength left at 0, and the sphere does not glow. Right:
// Strength 3, and it glows.
import { field, sphere } from './spheres.mjs';

const half = (kit, x, strength, glowing) => [
  field(kit, x, 30, 200, 'Color', { swatch: 'd-gizmo-z' }),
  field(kit, x, 56, 200, 'Strength', { value: strength, mark: glowing, bad: !glowing }),
  glowing
    ? sphere(kit, x + 100, 140, 34, { body: 'd-gizmo-z', glow: true })
    : sphere(kit, x + 100, 140, 34, { body: 'd-face-2', roughness: 0.5 }),
  kit.tag(x + 100, 220, glowing ? 'Strength 3: it glows' : 'Strength 0: no glow', { tone: glowing ? 'mark' : 'bad' }),
];

export default (kit) => kit.svg({ width: 480, height: 236 }, half(kit, 20, '0.000', false), half(kit, 260, '3.000', true));
