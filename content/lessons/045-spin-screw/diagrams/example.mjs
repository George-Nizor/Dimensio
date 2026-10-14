// The exercise: a goblet turned from half its outline by the Screw modifier, and a spring made by
// giving the Screw a height per turn.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { gobletMesh, spring } from './shapes.mjs';

export default (kit) => kit.svg({ width: 480, height: 250 },
  drawMesh(kit, gobletMesh(), view({ at: [140, 210], scale: 170, elevation: 22, target: [0, 0, 0] }), { width: 0.9 }),
  drawMesh(kit, spring(), view({ at: [350, 210], scale: 150, elevation: 16, target: [0, 0, 0] }), { width: 0.6 }),
  kit.text(140, 244, 'goblet', { anchor: 'middle', size: 12 }),
  kit.text(350, 244, 'spring', { anchor: 'middle', size: 12 }),
);
