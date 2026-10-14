// Wrong: Root Scale changed in the Import dock, then another file clicked, so the change is
// thrown away. Right: Reimport clicked first, so the change applies.
import { cursor } from '../../../diagrams/mesh.mjs';
import { dock, option, button, file } from './godot.mjs';

const half = (kit, x, wrong) => [
  dock(kit, { x, y: 14, w: 222, h: 190, tabs: ['Import'] }),
  option(kit, x, 58, 222, 'crate.glb', ''),
  option(kit, x, 84, 222, 'Root Scale', '2', { mark: true }),
  wrong ? [file(kit, x + 16, 140, 'barrel.glb', { mark: true }), cursor(kit, x + 70, 136)] : [],
  button(kit, x + 112, 170, 98, 'Reimport', { mark: !wrong }),
  wrong ? [] : cursor(kit, x + 170, 178),
];

export default (kit) => kit.svg({ width: 500, height: 250 },
  half(kit, 14, true),
  kit.tag(125, 236, 'clicked another file', { tone: 'bad' }),
  half(kit, 264, false),
  kit.tag(375, 236, 'Reimport first'),
);
