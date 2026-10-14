// The finished compositing tree: Render Layers into Glare (Bloom), then Color Balance, then
// Vignette, and from there into the Group Output, with a Viewer on the same wire.
import { node, wire } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const rl = node(kit, { x: 10, y: 20, w: 120, title: 'Render Layers', outputs: ['Image', 'Alpha'] });
  const glare = node(kit, { x: 170, y: 20, w: 120, title: 'Glare', outputs: ['Image'], inputs: [{ name: 'Image', linked: true }, { name: 'Type', value: 'Bloom', noSocket: true }] });
  const cb = node(kit, { x: 330, y: 20, w: 130, title: 'Color Balance', outputs: ['Image'], inputs: [{ name: 'Image', linked: true }, { name: 'Factor', value: '1.000' }] });
  const vg = node(kit, { x: 170, y: 140, w: 120, title: 'Vignette', outputs: ['Image'], inputs: [{ name: 'Image', linked: true }, { name: 'Factor', value: '0.4' }] });
  const out = node(kit, { x: 340, y: 130, w: 120, title: 'Group Output', inputs: [{ name: 'Image', linked: true }], mark: true });
  const view = node(kit, { x: 340, y: 200, w: 120, title: 'Viewer', inputs: [{ name: 'Image', linked: true }] });
  const [cx, cy] = cb.out('Image');
  const [vx, vy] = vg.in('Image');
  return kit.svg({ width: 480, height: 260 },
    wire(kit, rl.out('Image'), glare.in('Image')),
    wire(kit, glare.out('Image'), cb.in('Image')),
    kit.path(`M ${cx} ${cy} C ${cx + 20} ${cy} ${cx + 20} 118 ${cx - 10} 118 L ${vx + 10} 118 C ${vx - 25} 118 ${vx - 25} ${vy} ${vx} ${vy}`, { cls: 'd-ink', width: 1.8 }),
    wire(kit, vg.out('Image'), out.in('Image')),
    wire(kit, vg.out('Image'), view.in('Image')),
    rl.svg, glare.svg, cb.svg, vg.svg, out.svg, view.svg,
  );
};
