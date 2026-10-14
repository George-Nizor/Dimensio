// A new Geometry Nodes modifier: Group Input, the mesh as it comes in, linked straight to Group
// Output, what the object shows.
import { link, groupInput, groupOutput } from './nodes.mjs';

export default (kit) => {
  const a = groupInput(kit, 40, 40);
  const b = groupOutput(kit, 340, 40);
  return kit.svg({ width: 500, height: 170 },
    a.svg, b.svg, link(kit, a.out.Geometry, b.in.Geometry),
    kit.text(100, 140, 'the mesh as it comes in', { anchor: 'middle', size: 12 }),
    kit.text(400, 140, 'what the object shows', { anchor: 'middle', size: 12 }),
  );
};
