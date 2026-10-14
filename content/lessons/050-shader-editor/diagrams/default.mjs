// A new material in the Shader Editor: the Principled BSDF's BSDF output linked to the Surface input
// of the Material Output. Inputs and panels as Blender 5.2.2 lists them.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const bsdf = node(kit, {
    x: 20, y: 16, w: 176, title: 'Principled BSDF', outputs: ['BSDF'],
    inputs: [
      { name: 'Base Color', swatch: 'd-face-2' }, { name: 'Metallic', value: '0.000' }, { name: 'Roughness', value: '0.500' },
      { name: 'IOR', value: '1.500' }, { name: 'Alpha', value: '1.000' }, 'Normal',
      ...['Diffuse', 'Subsurface', 'Specular', 'Transmission', 'Coat', 'Sheen', 'Emission', 'Thin Film'].map((name) => ({ name, panel: true })),
    ],
  });
  const output = node(kit, { x: 280, y: 16, w: 140, title: 'Material Output', fields: ['All'], inputs: ['Surface', 'Volume', 'Displacement', 'Thickness'] });
  return kit.svg({ width: 440, height: bsdf.h + 32 },
    link(kit, bsdf.sockets['out:BSDF'], output.sockets['in:Surface']),
    bsdf.svg, output.svg,
  );
};
