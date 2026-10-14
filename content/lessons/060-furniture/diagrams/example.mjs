// The finished pair: a table and a chair built at real size, the chair's open front facing -Y.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { table, chair } from './parts.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 22, scale: 140, at: [215, 150], target: [0.35, 0, 0.45] });
  return kit.svg({ width: 460, height: 260 },
    drawMesh(kit, table(), v, { width: 1.4 }),
    drawMesh(kit, translate(chair(), [1.45, -0.35, 0]), v, { width: 1.4 }),
  );
};
