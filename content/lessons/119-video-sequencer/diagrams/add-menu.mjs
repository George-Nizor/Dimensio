// The Sequencer's Add menu (Shift+A) with Movie picked out, above Sound, Image/Sequence and Text.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const add = menu(kit, 100, 16, ['Scene', 'Clip', 'Mask', '-', { label: 'Movie...', mark: true }, 'Sound...', 'Image/Sequence...', '-', 'Color', 'Text', 'Adjustment Layer'], { width: 180, title: 'Add' });
  return kit.svg({ width: 320, height: 290 }, keycap(kit, 50, 30, 'Shift+A', { size: 11 }), add.svg);
};
