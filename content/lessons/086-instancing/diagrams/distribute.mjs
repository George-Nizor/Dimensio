// Distribute Points on Faces scatters points over the hill: Density points per square metre, in a
// pattern set by Seed.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { node, link, groupInput } from './nodes.mjs';
import { hill, points } from './scene.mjs';

export default (kit) => {
  const a = groupInput(kit, 10, 30, [], { w: 100 });
  const d = node(kit, { x: 132, y: 14, w: 186, title: 'Distribute Points on Faces', mark: true, settings: ['Random'], outputs: [{ name: 'Points', type: 'geo' }, { name: 'Normal', type: 'vector', field: true }, { name: 'Rotation', type: 'rotation', field: true }], inputs: [{ name: 'Mesh', type: 'geo' }, { name: 'Density', type: 'float', field: true, value: '0.4' }, { name: 'Seed', type: 'int', value: '0' }] });
  const v = view({ azimuth: 30, elevation: 30, at: [434, 104], scale: 11, target: [0, 0, 1] });
  return kit.svg({ width: 540, height: 230 },
    a.svg, d.svg, link(kit, a.out.Geometry, d.in.Mesh),
    drawMesh(kit, hill(8), v, { width: 0.6, cls: 'd-guide' }),
    points().map(({ p }) => { const [x, y] = v.project(p); return kit.dot(x, y, { r: 2.4, cls: 'd-mark-fill' }); }),
    kit.text(430, 200, 'points on the hill', { anchor: 'middle', size: 12 }),
  );
};
