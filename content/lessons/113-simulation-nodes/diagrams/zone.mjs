// A new simulation zone between Group Input and Group Output: the Simulation Input and
// Simulation Output nodes, with the shaded zone between them where each frame starts from the
// last frame's result.
import { node, link, menuPath } from './helpers.mjs';

export default (kit) => {
  const gi = node(kit, 10, 60, 96, 'Group Input', { outputs: ['Geometry'], size: 10 });
  const si = node(kit, 130, 60, 110, 'Simulation Input', { inputs: ['Geometry'], outputs: ['Delta Time', 'Geometry'], tone: 'mark', size: 10 });
  const so = node(kit, 300, 60, 116, 'Simulation Output', { inputs: ['Geometry'], outputs: ['Geometry'], tone: 'mark', size: 10 });
  const go = node(kit, 440, 60, 96, 'Group Output', { inputs: ['Geometry'], size: 10 });
  return kit.svg({ width: 550, height: 216 },
    `<rect x="120" y="40" width="306" height="130" rx="10" class="d-sunk" stroke-width="1"/>`,
    kit.text(416, 162, 'the zone: runs again every frame', { anchor: 'end', size: 11 }),
    gi.svg, si.svg, so.svg, go.svg,
    link(kit, si.at['out:Geometry'], so.at['in:Geometry'], { cls: 'd-mark', width: 2 }),
    link(kit, so.at['out:Geometry'], go.at['in:Geometry']),
    menuPath(kit, 10, 186, ['Add', 'Simulation', 'Simulation'], { size: 10 }).svg,
  );
};
