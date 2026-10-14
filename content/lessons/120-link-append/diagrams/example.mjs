// Two files: a props library holding a crate, a barrel and a lamp, and a scene that has appended a
// copy of the crate and linked the barrel, which keeps pointing back at the library.
import { fileCard, chain } from './files.mjs';

export default (kit) => {
  const lib = fileCard(kit, 20, 40, 'props-library.blend', ['Crate', 'Barrel', 'Lamp'], { w: 170 });
  const scene = fileCard(kit, 320, 40, 'scene.blend', ['Crate (a copy)', 'Barrel (linked)'], { w: 160 });
  return kit.svg({ width: 500, height: 190 },
    lib.svg, scene.svg,
    kit.arcArrow(196, 83, 316, 83, { lift: -16 }),
    kit.text(256, 62, 'append: a copy', { anchor: 'middle', size: 12 }),
    kit.line(196, 103, 316, 103, { cls: 'd-mark', width: 1.8, dash: '6 4' }),
    chain(kit, 256, 103, { cls: 'd-mark' }),
    kit.text(256, 128, 'link: a reference', { anchor: 'middle', size: 12 }),
    kit.text(250, 176, 'the linked barrel follows changes made in the library', { anchor: 'middle', size: 11 }),
  );
};
