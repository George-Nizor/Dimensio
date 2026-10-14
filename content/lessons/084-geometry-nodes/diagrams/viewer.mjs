// Shift+Ctrl and a left click on a node links it to a Viewer node, which shows that node's result
// in the 3D Viewport and the Spreadsheet.
import { keycap, mouse } from '../../../diagrams/mesh.mjs';
import { node, link } from './nodes.mjs';

export default (kit) => {
  const t = node(kit, { x: 20, y: 30, w: 160, title: 'Transform Geometry', mark: true, outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }, { name: 'Translation', type: 'vector', value: 'Z 1.7 m' }, { name: 'Scale', type: 'vector', value: '0.7' }] });
  const v = node(kit, { x: 250, y: 30, w: 100, title: 'Viewer', inputs: [{ name: 'Geometry', type: 'geo' }] });
  return kit.svg({ width: 520, height: 176 },
    t.svg, v.svg, link(kit, t.out.Geometry, v.in.Geometry, { cls: 'd-mark' }),
    keycap(kit, 398, 54, 'Shift'), kit.text(438, 59, '+', { anchor: 'middle', size: 14 }), keycap(kit, 474, 54, 'Ctrl'),
    mouse(kit, 438, 112, { button: 'left', size: 0.55 }),
    kit.text(265, 162, 'shown in the 3D Viewport and the Spreadsheet', { anchor: 'middle', size: 12 }),
  );
};
