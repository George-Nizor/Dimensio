// The Emission panel open in the Material tab: Color set to blue and Strength raised to 3, and the
// sphere glowing.
import { field, panelHeader, sphere } from './spheres.mjs';

export default (kit) => kit.svg({ width: 470, height: 170 },
  panelHeader(kit, 20, 30, 250, 'Emission', { open: true }),
  field(kit, 20, 60, 250, 'Color', { swatch: 'd-gizmo-z' }),
  field(kit, 20, 86, 250, 'Strength', { value: '3.000', mark: true }),
  kit.text(20, 140, 'Strength starts at 0', { size: 12, cls: 'd-label' }),
  sphere(kit, 380, 80, 40, { body: 'd-gizmo-z', glow: true }),
);
