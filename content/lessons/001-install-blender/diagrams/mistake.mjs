// Wrong: Mouse Select on Right, copied from an older tutorial. Right: Left, Blender's default.
import { segmented } from './splash-kit.mjs';

export default (kit) => kit.svg({ width: 360, height: 130 },
  kit.text(90, 44, 'Mouse Select', { anchor: 'middle', size: 12 }),
  segmented(kit, 42, 56, ['Left', 'Right'], 'Right', { bad: true, width: 48 }),
  kit.tag(90, 108, 'an old tutorial', { tone: 'bad' }),
  kit.text(270, 44, 'Mouse Select', { anchor: 'middle', size: 12 }),
  segmented(kit, 222, 56, ['Left', 'Right'], 'Left', { width: 48 }),
  kit.tag(270, 108, 'the default'),
);
