// The Shader Editor set to World: the Environment Texture node made by dragging in the .exr, its
// Color linked to the Background's Color, and the Background into the World Output.
import { node, link } from './parts.mjs';

export default (kit) => {
  const env = node(kit, 20, 50, 160, 'Environment Texture', { outputs: ['Color'], fields: ['kloofendal...exr', 'Equirectangular'], inputs: ['Vector'], mark: ['Color'] });
  const bg = node(kit, 220, 60, 130, 'Background', { outputs: ['Background'], inputs: ['Color', 'Strength'], mark: ['Color'] });
  const outNode = node(kit, 390, 70, 100, 'World Output', { inputs: ['Surface'] });
  return kit.svg({ width: 510, height: 200 },
    `<rect x="20" y="12" width="150" height="22" rx="4" class="d-key" stroke-width="1.2"/>`,
    kit.text(30, 27, 'Shader Type: World', { size: 11, cls: 'd-key-text' }),
    env.svg, bg.svg, outNode.svg,
    link(kit, env.at['out:Color'], bg.at['in:Color']),
    link(kit, bg.at['out:Background'], outNode.at['in:Surface']),
  );
};
