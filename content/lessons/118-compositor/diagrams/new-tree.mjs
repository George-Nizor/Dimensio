// The Compositor's header with its New button, and the tree New makes: Render Layers joined
// through a reroute point to the Group Output and to a Viewer.
import { node, wire, button, box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const rl = node(kit, { x: 30, y: 90, w: 120, title: 'Render Layers', outputs: ['Image', 'Alpha'] });
  const out = node(kit, { x: 300, y: 70, w: 120, title: 'Group Output', inputs: [{ name: 'Image', linked: true }] });
  const view = node(kit, { x: 300, y: 150, w: 120, title: 'Viewer', inputs: [{ name: 'Image', linked: true }] });
  const re = [220, rl.out('Image')[1]];
  return kit.svg({ width: 450, height: 230 },
    box(16, 14, 418, 30, { cls: 'd-sunk', rx: 4 }),
    kit.text(28, 34, 'View   Select   Add   Node', { size: 11 }),
    button(kit, 220, 19, 'New', { mark: true, width: 60 }),
    wire(kit, rl.out('Image'), re),
    wire(kit, re, out.in('Image')),
    wire(kit, re, view.in('Image')),
    `<circle cx="${re[0]}" cy="${re[1]}" r="4" class="d-key" stroke-width="1.4"/>`,
    rl.svg, out.svg, view.svg,
  );
};
