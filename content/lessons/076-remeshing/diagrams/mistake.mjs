// Cut through a detailed surface. Remeshed with a large voxel size, the small bumps are lost; with a
// voxel size smaller than the bumps, they stay.
import { unionOutline, withVerts } from './section.mjs';

export default (kit) => {
  const detailed = (x, step) => unionOutline(x, 96, 84, 56, 18, 196, step, step < 8 ? 2.2 : 0);
  return kit.svg({ width: 480, height: 250 },
    kit.polyline(unionOutline(118, 96, 84, 56, 18, 196, 3, 2.2), { cls: 'd-guide', width: 1.2 }),
    withVerts(kit, detailed(118, 26), { r: 2.6 }),
    kit.tag(118, 236, 'voxel too big: detail gone', { tone: 'bad' }),
    withVerts(kit, detailed(362, 5), { r: 1.4, width: 1.6 }),
    kit.tag(362, 236, 'small voxel: detail kept'),
  );
};
