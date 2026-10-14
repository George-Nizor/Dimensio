// Backface Culling on, so Godot's Cull Mode is Back. Left, the crate inside out: its near faces
// point away and vanish, so you see into it. Right, after Shift+N in Blender: solid.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { crate, drawPainted, panel } from './shapes.mjs';

const insideOut = (m) => ({ verts: m.verts, faces: m.faces.map((f) => [...f].reverse()) });

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 24, scale: 110, at: [125, 120], target: [0, 0, 0.4] });
  const right = view({ azimuth: 30, elevation: 24, scale: 110, at: [375, 120], target: [0, 0, 0.4] });
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 200, 190, 'inside out: see-through'),
    drawPainted(kit, insideOut(crate()), left, () => null),
    keycap(kit, 250, 110, 'Shift+N', { size: 12 }),
    panel(kit, 286, 14, 200, 190, 'normals out: solid'),
    drawPainted(kit, crate(), right, () => null),
    kit.text(250, 244, 'Backface Culling on in Blender = Cull Mode Back in Godot', { size: 12, anchor: 'middle' }),
  );
};
