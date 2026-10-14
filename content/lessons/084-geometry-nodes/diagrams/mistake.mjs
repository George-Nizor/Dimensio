// Only what reaches Group Output shows. Wrong: Join Geometry isn't linked to Group Output, so the
// object shows nothing. Right: linked, the tower appears.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { node, link, groupOutput, panel } from './nodes.mjs';
import { tower } from './shapes.mjs';

const half = (kit, x, linked) => {
  const j = node(kit, { x: x + 4, y: 24, w: 100, title: 'Join Geometry', outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo', multi: true }] });
  const b = groupOutput(kit, x + 140, 24, { w: 96 });
  const v = view({ at: [x + 120, 150], scale: 14, target: [0, 0, 1.2] });
  return [
    j.svg, b.svg, linked ? link(kit, j.out.Geometry, b.in.Geometry) : '',
    panel(kit, x + 40, 112, 160, 80),
    linked ? drawMesh(kit, tower(), v, { width: 1 }) : kit.text(x + 120, 157, 'nothing shown', { anchor: 'middle', size: 12 }),
  ];
};

export default (kit) => kit.svg({ width: 500, height: 240 },
  half(kit, 0, false), kit.tag(120, 226, 'not linked to the output', { tone: 'bad' }),
  half(kit, 252, true), kit.tag(372, 226, 'linked'),
);
