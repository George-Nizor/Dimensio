// The Compositor after New, with a Glare node set to Bloom dropped on the link between Render
// Layers and Group Output.
import { node, link } from './stage.mjs';

export default (kit) => {
  const rl = node(kit, 14, 50, 'Render Layers', { width: 120, outputs: ['Image', 'Alpha'] });
  const glare = node(kit, 178, 40, 'Glare', { width: 130, outputs: ['Image'], fields: [['Type', 'Bloom'], ['Threshold', '1.000']], inputs: ['Image'], mark: true });
  const out = node(kit, 352, 62, 'Group Output', { width: 120, inputs: ['Image'] });
  return kit.svg({ width: 486, height: 190 },
    link(kit, rl.outs.Image, glare.ins.Image), link(kit, glare.outs.Image, out.ins.Image),
    rl.svg, glare.svg, out.svg,
    kit.text(243, 178, 'Shift+A > Filter > Glare > Bloom', { anchor: 'middle', size: 12, cls: 'd-label' }),
  );
};
