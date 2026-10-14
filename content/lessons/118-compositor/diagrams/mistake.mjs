// Wrong: the Vignette feeds only the Viewer, while the Group Output still takes the Glare, so the
// saved render has no vignette. Right: the Vignette feeds the Group Output and the Viewer.
import { node, wire } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

const chain = (kit, x, good) => {
  const glare = node(kit, { x, y: 50, w: 90, title: 'Glare', outputs: ['Image'], inputs: [{ name: 'Image', linked: true }] });
  const vg = node(kit, { x: x + 110, y: 20, w: 90, title: 'Vignette', outputs: ['Image'], inputs: [{ name: 'Image', linked: true }] });
  const out = node(kit, { x: x + 110, y: 110, w: 100, title: 'Group Output', inputs: [{ name: 'Image', linked: true }], mark: true });
  const view = node(kit, { x: x + 110, y: 180, w: 100, title: 'Viewer', inputs: [{ name: 'Image', linked: true }] });
  return [
    wire(kit, glare.out('Image'), vg.in('Image')),
    good ? wire(kit, vg.out('Image'), out.in('Image'), { cls: 'd-mark' }) : wire(kit, glare.out('Image'), out.in('Image'), { cls: 'd-bad' }),
    wire(kit, vg.out('Image'), view.in('Image')),
    glare.svg, vg.svg, out.svg, view.svg,
  ];
};

export default (kit) => kit.svg({ width: 500, height: 270 },
  chain(kit, 10, false),
  kit.tag(120, 260, 'render has no vignette', { tone: 'bad' }),
  chain(kit, 260, true),
  kit.tag(370, 260, 'render has the vignette'),
);
