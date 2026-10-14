// The Position node gives every point its own location. Separate XYZ splits it; along one row of
// the grid, X runs from -2 to 2 m. Field links are dashed.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const p = node(kit, { x: 16, y: 30, w: 100, title: 'Position', mark: true, outputs: [{ name: 'Position', type: 'vector', field: true }] });
  const s = node(kit, { x: 156, y: 22, w: 110, title: 'Separate XYZ', outputs: [{ name: 'X', type: 'float', field: true }, { name: 'Y', type: 'float', field: true }, { name: 'Z', type: 'float', field: true }], inputs: [{ name: 'Vector', type: 'vector', field: true }] });
  const dots = [-2, -1, 0, 1, 2].map((x, i) => {
    const px = 316 + i * 46;
    return [kit.dot(px, 80, { r: 5, cls: 'd-mark-fill' }), kit.text(px, 106, `${x}`, { anchor: 'middle', size: 12 })];
  });
  return kit.svg({ width: 540, height: 170 },
    p.svg, s.svg, link(kit, p.out.Position, s.in.Vector, { field: true }),
    kit.line(300, 80, 516, 80, { cls: 'd-guide', width: 1.4 }), dots,
    kit.text(408, 132, 'X of each point along one row', { anchor: 'middle', size: 12 }),
  );
};
