// Godot's view of the import. Wrong: exported without Selected Objects, so a sphere left hidden in
// the .blend file arrives beside the crate. Right: with Selected Objects ticked, the crate alone.
import { view } from '../../../diagrams/mesh.mjs';
import { grid, drawCrate, ball } from './godot.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 28, at: [124, 112], scale: 70, target: [0.5, 0, 0.2] });
  const right = view({ azimuth: 30, elevation: 28, at: [376, 112], scale: 70, target: [0.5, 0, 0.2] });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 184),
    grid(kit, left, 2), drawCrate(kit, left, 0), paint(kit, ball(1.1), left, { width: 1 }),
    kit.tag(124, 224, 'every mesh in the file', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 184),
    grid(kit, right, 2), drawCrate(kit, right, 0),
    kit.tag(376, 224, 'Selected Objects only'),
  );
};
