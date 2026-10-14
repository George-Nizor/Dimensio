// The File > New menu with the 2D Animation template picked out.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const file = menu(kit, 20, 20, [{ label: 'New', mark: true, arrow: true }, 'Open...', 'Open Recent', 'Revert', '-', 'Save', 'Save As...'], { width: 150, title: 'File' });
  const sub = menu(kit, 176, 44, ['General', { label: '2D Animation', mark: true }, 'Sculpting', 'Storyboarding', 'VFX', 'Video Editing'], { width: 160 });
  return kit.svg({ width: 360, height: 220 }, file.svg, sub.svg);
};
