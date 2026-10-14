// Godot's material inspector, Vertex Color section. Left, Use as Albedo off: the bush shows the
// material's grey. Right, Use as Albedo ticked: it shows its painted greens.
import { view } from '../../../diagrams/mesh.mjs';
import { bush, drawPainted, panel } from './shapes.mjs';
import { option } from './godot.mjs';

export default (kit) => {
  const left = view({ azimuth: 22, elevation: 16, scale: 120, at: [125, 112], target: [0, 0, 0.45] });
  const right = view({ azimuth: 22, elevation: 16, scale: 120, at: [375, 112], target: [0, 0, 0.45] });
  return kit.svg({ width: 500, height: 262 },
    panel(kit, 14, 14, 222, 170),
    drawPainted(kit, bush(), left, () => null, { width: 1 }),
    option(kit, 14, 210, 222, 'Use as Albedo', false),
    kit.text(125, 240, 'grey from the material', { size: 12, anchor: 'middle' }),
    panel(kit, 264, 14, 222, 170),
    drawPainted(kit, bush(), right, () => 'd-gizmo-y', { width: 1 }),
    option(kit, 264, 210, 222, 'Use as Albedo', true, { mark: true }),
    kit.text(375, 240, 'green from the vertex colours', { size: 12, anchor: 'middle' }),
  );
};
