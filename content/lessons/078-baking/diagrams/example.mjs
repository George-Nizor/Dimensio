// The low-poly stone before and after baking: plain flat faces, then the same 192 triangles shaded
// with the sculpt's bumps from its baked normal map.
import { view, drawMesh, edges, normal } from '../../../diagrams/mesh.mjs';
import { sculpt, lowStone } from './stone.mjs';

export default (kit) => {
  const left = view({ at: [130, 110], scale: 72, elevation: 24 });
  const right = view({ at: [380, 110], scale: 72, elevation: 24 });
  const low = lowStone();
  const facing = (m, v, f) => { const n = normal(m, m.faces[f]); return n[0] * v.toward[0] + n[1] * v.toward[1] + n[2] * v.toward[2] > 0; };
  const outline = (m, v) => edges(m).filter((e) => e.faces.length === 2 && facing(m, v, e.faces[0]) !== facing(m, v, e.faces[1])).map((e) => {
    const a = v.project(m.verts[e.a]);
    const b = v.project(m.verts[e.b]);
    return kit.line(a[0], a[1], b[0], b[1], { cls: 'd-ink', width: 1.8 });
  });
  return kit.svg({ width: 520, height: 230 },
    drawMesh(kit, low, left, { width: 1.2 }),
    kit.text(130, 218, 'low-poly stone', { anchor: 'middle', size: 12 }),
    `<clipPath id="baking-example-clip">${low.faces.map((f, i) => (facing(low, right, i) ? `<path d="M ${f.map((j) => right.project(low.verts[j]).map((n) => n.toFixed(1)).join(' ')).join(' L ')} Z"/>` : '')).join('')}</clipPath>`,
    '<g clip-path="url(#baking-example-clip)">', drawMesh(kit, sculpt(), right, { width: 0.4, cls: 'd-guide' }), '</g>',
    outline(low, right),
    kit.text(380, 218, 'the same stone with baked maps', { anchor: 'middle', size: 12 }),
  );
};
