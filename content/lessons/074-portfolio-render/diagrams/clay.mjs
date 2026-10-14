// The Shading popover in Solid mode with Lighting set to Studio and Color set to Custom, a light
// grey, and the clay picture View > Render Viewport Preview gives.
import { popover, shot } from './assets.mjs';

export default (kit) => kit.svg({ width: 500, height: 190 },
  popover(kit, 14, 14, 210, 'Shading: Solid', [['Lighting', 'Studio'], ['Color', 'Custom']], { mark: ['Lighting', 'Color'] }),
  kit.text(119, 128, 'Custom: one colour for everything', { anchor: 'middle', size: 11, cls: 'd-label' }),
  shot(kit, 246, 20, 240, { clip: 'portfolio-clay' }),
  kit.text(366, 176, 'View > Render Viewport Preview', { anchor: 'middle', size: 12, cls: 'd-label' }),
);
