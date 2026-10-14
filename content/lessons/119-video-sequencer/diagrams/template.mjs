// File > New > Video Editing, and the Sequencer's header afterwards with its Sequencer Scene, Edit.
import { menu, box, button } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const file = menu(kit, 20, 20, [{ label: 'New', mark: true, arrow: true }, 'Open...', 'Open Recent', '-', 'Save', 'Save As...'], { width: 140, title: 'File' });
  const sub = menu(kit, 166, 44, ['General', '2D Animation', 'Sculpting', 'Storyboarding', 'VFX', { label: 'Video Editing', mark: true }], { width: 150 });
  return kit.svg({ width: 480, height: 270 },
    file.svg, sub.svg,
    box(20, 214, 440, 30, { cls: 'd-sunk', rx: 4 }),
    kit.text(32, 234, 'View   Select   Marker   Add   Strip', { size: 11 }),
    button(kit, 300, 219, 'Edit', { mark: true, width: 80 }),
    kit.text(400, 234, 'scene', { size: 11, cls: 'd-tag' }),
  );
};
