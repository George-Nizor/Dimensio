// The Pivot Point pie that . opens: Bounding Box Center, 3D Cursor, Individual Origins, Median Point
// and Active Element, with Median Point, where it starts, picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { pie } from './parts.mjs';

export default (kit) => kit.svg({ width: 460, height: 210 },
  keycap(kit, 34, 30, '.'),
  pie(kit, 240, 104, ['Bounding Box Center', '3D Cursor', 'Individual Origins', 'Median Point', 'Active Element', 'Only Locations'], { mark: 'Median Point', radius: 140, width: 140 }),
);
