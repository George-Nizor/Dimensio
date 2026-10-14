// Excluding: the checkbox beside each collection. Reference's checkbox is unticked, so its objects
// leave the scene and the Outliner no longer lists them.
import { outliner } from './helpers.mjs';

export default (kit) => kit.svg({ width: 300, height: 200 },
  outliner(kit, 30, 14, 240, [
    { name: 'Props', icon: 'collection', depth: 0, check: true, eye: true },
    { name: 'Barrel 1', icon: 'mesh', depth: 1, eye: true },
    { name: 'Crate 1', icon: 'mesh', depth: 1, eye: true },
    { name: 'Lights', icon: 'collection', depth: 0, check: true, eye: true },
    { name: 'Light', icon: 'light', depth: 1, eye: true },
    { name: 'Reference', icon: 'collection', depth: 0, check: false, grey: true },
  ], { row: 24, markCheck: 'Reference' }),
  kit.text(150, 190, 'Reference unticked: excluded', { anchor: 'middle', size: 12 }),
);
