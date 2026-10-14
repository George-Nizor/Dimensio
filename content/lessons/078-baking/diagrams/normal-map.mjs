// The baked normal map in use: Image Texture (stone-normal, Non-Color) into a Normal Map node, into
// the Normal input of the Principled BSDF.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const tex = node(kit, 10, 40, 'Image Texture', { width: 150, outputs: ['Color'], fields: [['', 'stone-normal'], ['', 'Non-Color']] });
  const nm = node(kit, 196, 56, 'Normal Map', { width: 120, outputs: ['Normal'], inputs: ['Color'] });
  const bsdf = node(kit, 352, 30, 'Principled BSDF', { width: 130, inputs: ['Base Color', 'Roughness', 'Normal'] });
  return kit.svg({ width: 492, height: 180 },
    link(kit, tex.outs.Color, nm.ins.Color), link(kit, nm.outs.Normal, bsdf.ins.Normal),
    tex.svg, nm.svg, bsdf.svg,
    kit.text(246, 172, 'Shift+A > Displacement > Normal Map', { anchor: 'middle', size: 12, cls: 'd-label' }),
  );
};
