// Left, an orange sphere with Metallic 0: orange underneath, a white highlight on top. Right, the
// same Base Color with Metallic 1 and Roughness 0.2: no orange of its own, only tinted reflections,
// which is how gold looks.
import { sphere } from './spheres.mjs';

export default (kit) => kit.svg({ width: 380, height: 176 },
  sphere(kit, 100, 72, 48, { body: 'd-mark-fill', roughness: 0.15 }),
  kit.text(100, 146, 'Metallic 0', { anchor: 'middle', size: 12 }),
  kit.text(100, 164, 'orange paint', { anchor: 'middle', size: 12, cls: 'd-label' }),
  sphere(kit, 280, 72, 48, { body: 'd-mark-fill', roughness: 0.15, metal: true }),
  kit.text(280, 146, 'Metallic 1', { anchor: 'middle', size: 12 }),
  kit.text(280, 164, 'gold', { anchor: 'middle', size: 12, cls: 'd-label' }),
);
