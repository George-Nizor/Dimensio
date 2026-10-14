// Wrong: the body clicked first and a wheel last, so the body becomes the wheel's child. Right: the
// wheel clicked first and the body last, so the wheel is the body's child.
import { outliner } from './helpers.mjs';

export default (kit) => kit.svg({ width: 460, height: 150 },
  outliner(kit, 14, 20, 200, [
    { name: 'Wheel FL', icon: 'mesh', depth: 0, eye: true },
    { name: 'Body', icon: 'mesh', depth: 1, eye: true },
  ]),
  kit.tag(114, 100, 'body clicked first', { tone: 'bad' }),
  outliner(kit, 246, 20, 200, [
    { name: 'Body', icon: 'mesh', depth: 0, eye: true },
    { name: 'Wheel FL', icon: 'mesh', depth: 1, eye: true },
  ]),
  kit.tag(346, 100, 'body clicked last'),
);
