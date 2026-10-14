// Five formats and what each carries: glTF and FBX take meshes, materials and animation; OBJ takes
// meshes and simple materials; STL takes bare meshes; USD takes whole scenes.
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

const ROWS = [
  ['.glb', 'glTF', 'game engines, Godot', [1, 1, 1]],
  ['.fbx', 'FBX', 'Unity, Unreal, other 3D apps', [1, 1, 1]],
  ['.obj', 'Wavefront', 'static models', [1, 0.5, 0]],
  ['.stl', 'STL', '3D printing', [1, 0, 0]],
  ['.usd', 'USD', 'large pipelines, whole scenes', [1, 1, 1]],
];

export default (kit) => {
  const cols = ['mesh', 'materials', 'animation'];
  const mark = (x, y, v) => (v === 1
    ? kit.path(`M ${x - 6} ${y} L ${x - 2} ${y + 5} L ${x + 7} ${y - 6}`, { cls: 'd-mark', width: 2.2 })
    : v === 0.5 ? kit.text(x, y + 5, 'simple', { anchor: 'middle', size: 10 }) : kit.line(x - 6, y, x + 6, y, { cls: 'd-guide', width: 1.6 }));
  return kit.svg({ width: 520, height: 230 },
    cols.map((c, i) => kit.text(350 + i * 68, 24, c, { anchor: 'middle', size: 12 })),
    ROWS.map(([ext, name, use, has], r) => {
      const y = 40 + r * 36;
      return [
        box(14, y, 492, 30, { cls: r % 2 ? 'd-paper' : 'd-ui', rx: 3, stroke: 0.6 }),
        kit.text(26, y + 20, ext, { size: 13, cls: 'd-key-text' }),
        kit.text(70, y + 20, name, { size: 12 }),
        kit.text(146, y + 20, use, { size: 11, cls: 'd-label' }),
        has.map((v, i) => mark(350 + i * 68, y + 15, v)),
      ];
    }),
  );
};
