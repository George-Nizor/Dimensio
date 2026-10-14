// The Move to Collection menu after M in the 3D Viewport, with New Collection picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu } from './helpers.mjs';

export default (kit) => kit.svg({ width: 360, height: 170 },
  keycap(kit, 50, 40, 'M'),
  menu(kit, 110, 14, { title: 'Move to Collection', items: ['+ New Collection', '-', 'Scene Collection', 'Collection'], pick: '+ New Collection', width: 200 }),
);
