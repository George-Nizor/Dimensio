// The sword as Godot shows it. Wrong: exported with its modifiers still in the stack and Apply
// Modifiers off, so the blade arrives as the half face you drew. Right: modifiers applied, and the
// whole sword arrives.
import { view, drawMesh, join } from '../../../diagrams/mesh.mjs';
import { panel, slab } from '../../037-modifiers/diagrams/modkit.mjs';
import { halfBlade, guard, grip, sword } from './shapes.mjs';

export default (kit) => {
  const half = slab(halfBlade, [[0, 1, 2, 3]], 0.002);
  const v1 = view({ at: [130, 214], scale: 170, target: [0, 0, 0] });
  const v2 = view({ at: [380, 214], scale: 170, target: [0, 0, 0] });
  return kit.svg({ width: 510, height: 262 },
    panel(kit, 14, 14, 232, 214),
    drawMesh(kit, join(half, guard(), grip()), v1, { width: 1.2 }),
    kit.tag(130, 250, 'modifiers left off', { tone: 'bad' }),
    panel(kit, 264, 14, 232, 214),
    drawMesh(kit, sword(), v2, { width: 1.2 }),
    kit.tag(380, 250, 'modifiers applied'),
  );
};
