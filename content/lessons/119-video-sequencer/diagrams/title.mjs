// The Strip tab of the Properties editor for a Text strip: the Effect Strip panel with its text,
// and the style presets with Main Title picked out.
import { area, menu, box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const presets = menu(kit, 240, 52, ['Corner Title', { label: 'Main Title', mark: true }, 'Subtitle'], { width: 140, title: 'Presets' });
  return kit.svg({ width: 420, height: 200 },
    area(kit, 20, 16, 380, 168, { title: 'Effect Strip' }),
    box(370, 20, 22, 14, { cls: 'd-key-mark', rx: 2 }),
    kit.text(36, 66, 'Text', { size: 11 }),
    box(36, 74, 190, 54, { cls: 'd-sunk', rx: 3 }),
    kit.text(46, 96, 'Props for a game', { size: 12, cls: 'd-key-text' }),
    kit.text(46, 116, 'by Sam', { size: 12, cls: 'd-key-text' }),
    presets.svg,
  );
};
