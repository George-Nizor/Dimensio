// File > Import with the formats Blender 5.2 reads, glTF 2.0 and Wavefront picked out. Collada is
// no longer in the list.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const file = menu(kit, 16, 16, ['Save', 'Save As...', '-', { label: 'Import', mark: true, arrow: true }, { label: 'Export', arrow: true }], { width: 130, title: 'File' });
  const row = file.row('Import');
  const sub = menu(kit, 152, row.y - 40, ['Alembic (.abc)', 'Universal Scene Description (.usd*)', 'SVG as Grease Pencil', { label: 'Wavefront (.obj)', mark: true }, 'Stanford PLY (.ply)', 'STL (.stl)', 'FBX (.fbx)', 'SVG as Curves (.svg)', 'Motion Capture (.bvh)', 'FBX (.fbx) (Legacy)', { label: 'glTF 2.0 (.glb/.gltf)', mark: true }], { width: 260 });
  return kit.svg({ width: 430, height: 300 }, file.svg, sub.svg);
};
