// The Overlays popover with Wireframe ticked and Floor, Axes and 3D Cursor unticked, and the clay
// picture with every edge drawn on it.
import { popover, shot } from './assets.mjs';

export default (kit) => kit.svg({ width: 500, height: 190 },
  popover(kit, 14, 14, 200, 'Overlays', [['Floor', false], ['Axes', false], ['3D Cursor', false], ['Wireframe', true]], { mark: ['Wireframe'] }),
  shot(kit, 246, 20, 240, { wire: true, clip: 'portfolio-wire' }),
  kit.text(366, 176, 'deselected, then rendered again', { anchor: 'middle', size: 12, cls: 'd-label' }),
);
