// The floor: a second Set Position takes each point's Position apart with Separate XYZ, keeps
// the larger of Z and 0 with a Math node set to Maximum, and puts it back with Combine XYZ, so
// no point goes below the floor.
import { node, link } from './helpers.mjs';

export default (kit) => {
  const fall = node(kit, 10, 14, 96, 'Set Position', { inputs: ['Geometry', 'Offset'], outputs: ['Geometry'], size: 10 });
  const pos = node(kit, 10, 150, 70, 'Position', { outputs: ['Position'], size: 10 });
  const sep = node(kit, 104, 150, 90, 'Separate XYZ', { inputs: ['Vector'], outputs: ['X', 'Y', 'Z'], tone: 'mark', size: 10 });
  const max = node(kit, 218, 230, 90, 'Maximum', { inputs: ['Value', '0'], outputs: ['Value'], tone: 'mark', size: 10 });
  const comb = node(kit, 332, 150, 96, 'Combine XYZ', { inputs: ['X', 'Y', 'Z'], outputs: ['Vector'], tone: 'mark', size: 10 });
  const floor = node(kit, 452, 14, 96, 'Set Position', { inputs: ['Geometry', 'Position'], outputs: ['Geometry'], tone: 'mark', size: 10 });
  const hot = { cls: 'd-mark', width: 2 };
  return kit.svg({ width: 560, height: 330 },
    fall.svg, pos.svg, sep.svg, max.svg, comb.svg, floor.svg,
    link(kit, fall.at['out:Geometry'], floor.at['in:Geometry']),
    link(kit, pos.at['out:Position'], sep.at['in:Vector'], hot),
    link(kit, sep.at['out:X'], comb.at['in:X'], hot),
    link(kit, sep.at['out:Y'], comb.at['in:Y'], hot),
    link(kit, sep.at['out:Z'], max.at['in:Value'], hot),
    link(kit, max.at['out:Value'], comb.at['in:Z'], hot),
    link(kit, comb.at['out:Vector'], floor.at['in:Position'], hot),
    kit.text(263, 326, 'Math set to Maximum, second value 0', { anchor: 'middle', size: 11 }),
  );
};
