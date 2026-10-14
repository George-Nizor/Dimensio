// New points each frame: Distribute Points on Faces makes points on the spout from the Group
// Input, with Scene Time's Frame as its Seed so each frame's points land in new places, and Join
// Geometry adds them to the points the zone carried over from the last frame.
import { graph } from './graph.mjs';

export default (kit) => kit.svg({ width: 420, height: 310 },
  `<rect x="120" y="14" width="290" height="290" rx="10" class="d-sunk" stroke-width="1"/>`,
  kit.text(400, 296, 'inside the zone', { anchor: 'end', size: 11 }),
  graph(kit, { show: ['group-in', 'time', 'sim-in', 'dist', 'join'], mark: ['dist', 'join', 'time'], zone: false }),
);
