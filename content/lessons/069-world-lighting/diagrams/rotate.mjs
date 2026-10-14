// Turning the sky: Texture Coordinate's Generated output into a Mapping node, and Mapping's Vector
// into the Environment Texture's Vector. Mapping's Rotation Z turns the HDRI around the props.
import { node, link } from './parts.mjs';

export default (kit) => {
  const tc = node(kit, 14, 40, 130, 'Texture Coordinate', { outputs: ['Generated', 'Normal', 'UV'], mark: ['Generated'] });
  const mp = node(kit, 180, 30, 150, 'Mapping', { outputs: ['Vector'], fields: ['Rotation Z  90°'], inputs: ['Vector'], mark: ['Rotation Z  90°'] });
  const env = node(kit, 366, 40, 136, 'Environment Texture', { outputs: ['Color'], inputs: ['Vector'], mark: ['Vector'] });
  return kit.svg({ width: 515, height: 170 },
    tc.svg, mp.svg, env.svg,
    link(kit, tc.at['out:Generated'], mp.at['in:Vector']),
    link(kit, mp.at['out:Vector'], env.at['in:Vector']),
  );
};
