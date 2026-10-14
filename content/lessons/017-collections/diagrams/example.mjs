// The Outliner of the market after sorting: Props, Lights and Reference collections, with
// Reference hidden by its eye and its objects greyed out.
import { outliner } from './helpers.mjs';

export default (kit) => kit.svg({ width: 300, height: 330 },
  outliner(kit, 30, 14, 240, [
    { name: 'Scene Collection', icon: 'scene', depth: 0 },
    { name: 'Collection', icon: 'collection', depth: 1, check: true, eye: true },
    { name: 'Camera', icon: 'camera', depth: 2, eye: true },
    { name: 'Props', icon: 'collection', depth: 1, check: true, eye: true },
    { name: 'Barrel 1', icon: 'mesh', depth: 2, eye: true },
    { name: 'Barrel 2', icon: 'mesh', depth: 2, eye: true },
    { name: 'Crate 1', icon: 'mesh', depth: 2, eye: true },
    { name: 'Crate 2', icon: 'mesh', depth: 2, eye: true },
    { name: 'Table top', icon: 'mesh', depth: 2, eye: true },
    { name: 'Lights', icon: 'collection', depth: 1, check: true, eye: true },
    { name: 'Lamp 1', icon: 'light', depth: 2, eye: true },
    { name: 'Light', icon: 'light', depth: 2, eye: true },
    { name: 'Reference', icon: 'collection', depth: 1, check: true, eye: false },
    { name: 'Figure', icon: 'mesh', depth: 2, eye: true, grey: true },
    { name: 'Pole', icon: 'mesh', depth: 2, eye: true, grey: true },
  ], { row: 20 }),
);
