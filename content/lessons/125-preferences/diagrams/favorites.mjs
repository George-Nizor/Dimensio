// Q over the 3D Viewport: the Quick Favorites menu with the two commands added to it.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const fav = menu(kit, 90, 20, ['Shade Auto Smooth', 'All Transforms'], { width: 200, title: 'Quick Favorites' });
  return kit.svg({ width: 320, height: 130 }, keycap(kit, 45, 34, 'Q', { size: 14 }), fav.svg);
};
