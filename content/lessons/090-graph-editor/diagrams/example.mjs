// The exercise's two curves in the Graph Editor. Above, the door's Z rotation from 0 to 100 degrees,
// speeding up and stopping dead on frame 20. Below, the lamp's X rotation swinging from -15 to 15
// degrees and back every 48 frames, repeating to frame 96.
import { graph } from './anim.mjs';

export default (kit) => {
  const door = graph(kit, { x: 70, y: 14, w: 450, h: 90, f0: 0, f1: 96, v0: -10, v1: 110, every: 10 });
  const lamp = graph(kit, { x: 70, y: 136, w: 450, h: 80, f0: 0, f1: 96, v0: -20, v1: 20, every: 10 });
  const swing = [[1, -15], [25, 15], [49, -15]];
  return kit.svg({ width: 540, height: 240 },
    door.svg, door.draw([[1, 0], [20, 100]], { interp: 'ease-in' }), door.draw([[20, 100], [96, 100]], { interp: 'constant', cls: 'd-guide', width: 1.4 }).slice(0, 1),
    kit.text(14, 64, 'door', { size: 12 }),
    lamp.svg, lamp.draw(swing), lamp.draw(swing.map(([f, v]) => [f + 48, v]), { width: 2.2 }).slice(0, 1),
    kit.text(14, 180, 'lamp', { size: 12 }),
  );
};
