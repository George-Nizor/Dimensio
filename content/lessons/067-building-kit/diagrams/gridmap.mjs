// A GridMap node's Inspector: Mesh Library set to kit.tres, Cell Size 2, 2.5, 2 and Center Y
// unticked; below it, the GridMap panel's list of pieces by name.
import { dock, option, heading } from './godot.mjs';

export default (kit) => kit.svg({ width: 520, height: 250 },
  dock(kit, { x: 14, y: 14, w: 250, h: 220, tabs: ['Inspector'] }),
  option(kit, 14, 58, 250, 'GridMap', ''),
  option(kit, 14, 82, 250, 'Mesh Library', 'kit.tres', { mark: true }),
  heading(kit, 14, 110, 'Cell'),
  option(kit, 14, 134, 250, 'Size', '2  2.5  2', { mark: true, indent: 8 }),
  option(kit, 14, 158, 250, 'Center X', true, { indent: 8 }),
  option(kit, 14, 182, 250, 'Center Y', false, { mark: true, indent: 8 }),
  option(kit, 14, 206, 250, 'Center Z', true, { indent: 8 }),
  dock(kit, { x: 280, y: 14, w: 226, h: 220, tabs: ['GridMap'] }),
  ['floor_2m', 'roof_2m', 'wall_2m', 'wall_corner', 'wall_door', 'wall_window'].map((name, i) => [
    i === 2 ? `<rect x="288" y="${44 + i * 28}" width="210" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
    `<rect x="296" y="${49 + i * 28}" width="14" height="14" rx="2" class="d-key" stroke-width="1"/>`,
    kit.text(318, 61 + i * 28, name, { size: 11, cls: 'd-key-text' }),
  ]),
);
