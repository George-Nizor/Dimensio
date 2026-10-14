// The View pie that the ` key opens: the six side views, View Camera and View Selected, laid out
// around the mouse as Blender lays them out.
import { pie } from './parts.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => kit.svg({ width: 420, height: 200 },
  keycap(kit, 34, 34, '`'),
  pie(kit, 230, 100, ['Left', 'Right', 'Bottom', 'Top', 'Front', 'Back', 'View Camera', 'View Selected'], { mark: 'View Selected', radius: 128, width: 106 }),
);
