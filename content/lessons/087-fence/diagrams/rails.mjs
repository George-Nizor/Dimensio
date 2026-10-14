// Curve to Mesh sweeps a Quadrilateral 0.04 by 0.1 m along the resampled curve, with Fill Caps
// ticked. Two Transform Geometry nodes lift copies of the rail to 0.4 and 0.8 m.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const r = node(kit, { x: 8, y: 14, w: 116, title: 'Resample Curve', outputs: [{ name: 'Curve', type: 'geo' }] });
  const q = node(kit, { x: 8, y: 92, w: 116, title: 'Quadrilateral', settings: ['Rectangle'], outputs: [{ name: 'Curve', type: 'geo' }], inputs: [{ name: 'Width', type: 'float', value: '0.04 m' }, { name: 'Height', type: 'float', value: '0.1 m' }] });
  const c = node(kit, { x: 160, y: 40, w: 126, title: 'Curve to Mesh', mark: true, outputs: [{ name: 'Mesh', type: 'geo' }], inputs: [{ name: 'Curve', type: 'geo' }, { name: 'Profile Curve', type: 'geo' }, { name: 'Fill Caps', check: true }] });
  const t1 = node(kit, { x: 324, y: 10, w: 150, title: 'Transform Geometry', outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }, { name: 'Translation', type: 'vector', value: 'Z 0.4 m' }] });
  const t2 = node(kit, { x: 324, y: 112, w: 150, title: 'Transform Geometry', outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }, { name: 'Translation', type: 'vector', value: 'Z 0.8 m' }] });
  return kit.svg({ width: 490, height: 214 },
    r.svg, q.svg, c.svg, t1.svg, t2.svg,
    link(kit, r.out.Curve, c.in.Curve), link(kit, q.out.Curve, c.in['Profile Curve']),
    link(kit, c.out.Mesh, t1.in.Geometry), link(kit, c.out.Mesh, t2.in.Geometry),
  );
};
