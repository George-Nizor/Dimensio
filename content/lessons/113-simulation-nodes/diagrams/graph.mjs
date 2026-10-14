// The coin tree's nodes, laid out once so every step's diagram draws the same graph and picks
// out its own part. Not a diagram itself. The zone is the shaded band between the Simulation
// Input and Simulation Output nodes.
import { node, link } from './helpers.mjs';

// Each node: [key, x, y, width, title, inputs, outputs].
const NODES = [
  ['group-in', 10, 150, 96, 'Group Input', [], ['Geometry']],
  ['time', 10, 40, 96, 'Scene Time', [], ['Frame']],
  ['sim-in', 130, 210, 110, 'Simulation Input', ['Geometry'], ['Delta Time', 'Geometry']],
  ['dist', 130, 40, 150, 'Distribute Points on Faces', ['Mesh', 'Seed'], ['Points']],
  ['join', 300, 120, 96, 'Join Geometry', ['Geometry'], ['Geometry']],
  ['scale', 280, 220, 96, 'Vector Math', ['Vector', 'Scale'], ['Vector']],
  ['fall', 400, 120, 96, 'Set Position', ['Geometry', 'Offset'], ['Geometry']],
  ['pos', 400, 250, 70, 'Position', [], ['Position']],
  ['sep', 490, 250, 86, 'Separate XYZ', ['Vector'], ['X', 'Y', 'Z']],
  ['max', 600, 290, 86, 'Maximum', ['Z', '0'], ['Value']],
  ['comb', 710, 250, 92, 'Combine XYZ', ['X', 'Y', 'Z'], ['Vector']],
  ['floor', 710, 120, 96, 'Set Position', ['Geometry', 'Position'], ['Geometry']],
  ['sim-out', 830, 120, 116, 'Simulation Output', ['Geometry'], ['Geometry']],
  ['cyl', 830, 220, 96, 'Cylinder', [], ['Mesh']],
  ['inst', 970, 120, 116, 'Instance on Points', ['Points', 'Instance'], ['Instances']],
  ['group-out', 1110, 120, 96, 'Group Output', ['Geometry'], []],
];

const LINKS = [
  ['group-in', 'out:Geometry', 'dist', 'in:Mesh'],
  ['time', 'out:Frame', 'dist', 'in:Seed'],
  ['sim-in', 'out:Geometry', 'join', 'in:Geometry'],
  ['dist', 'out:Points', 'join', 'in:Geometry'],
  ['join', 'out:Geometry', 'fall', 'in:Geometry'],
  ['sim-in', 'out:Delta Time', 'scale', 'in:Scale'],
  ['scale', 'out:Vector', 'fall', 'in:Offset'],
  ['fall', 'out:Geometry', 'floor', 'in:Geometry'],
  ['pos', 'out:Position', 'sep', 'in:Vector'],
  ['sep', 'out:X', 'comb', 'in:X'],
  ['sep', 'out:Y', 'comb', 'in:Y'],
  ['sep', 'out:Z', 'max', 'in:Z'],
  ['max', 'out:Value', 'comb', 'in:Z'],
  ['comb', 'out:Vector', 'floor', 'in:Position'],
  ['floor', 'out:Geometry', 'sim-out', 'in:Geometry'],
  ['sim-out', 'out:Geometry', 'inst', 'in:Points'],
  ['cyl', 'out:Mesh', 'inst', 'in:Instance'],
  ['inst', 'out:Instances', 'group-out', 'in:Geometry'],
];

// Draws the part of the graph whose node keys are in `show`, the ones in `mark` picked out,
// shifted left by `dx`. Links between two shown nodes are drawn; ones touching a marked node
// are drawn in the accent colour.
export function graph(kit, { show, mark = [], dx = 0, dy = 0, zone = true } = {}) {
  const placed = new Map();
  const out = [];
  if (zone && show.includes('sim-in') && show.includes('sim-out')) {
    out.push(`<rect x="${120 - dx}" y="20" width="${836}" height="320" rx="10" class="d-sunk" stroke-width="1"/>`);
    out.push(kit.text(130 - dx, 336, 'simulation zone', { size: 11 }));
  }
  for (const [key, x, y, w, title, inputs, outputs] of NODES) {
    if (!show.includes(key)) continue;
    const n = node(kit, x - dx, y - dy, w, title, { inputs, outputs, tone: mark.includes(key) ? 'mark' : undefined, size: 10 });
    placed.set(key, n);
    out.push(n.svg);
  }
  for (const [a, sa, b, sb] of LINKS) {
    if (!placed.has(a) || !placed.has(b)) continue;
    const hot = mark.includes(a) || mark.includes(b);
    out.push(link(kit, placed.get(a).at[sa], placed.get(b).at[sb], { cls: hot ? 'd-mark' : 'd-ink', width: hot ? 2 : 1.4 }));
  }
  return out;
}
