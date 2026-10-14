// Wrong: props.blend saved in Downloads, so the library folder D:\Props holds nothing and the
// Asset Browser shows no assets. Right: props.blend saved in D:\Props, and its props appear.
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';
import { tile } from './assets.mjs';

const folder = (kit, x, y, name, file) => [
  kit.path(`M ${x} ${y + 8} H ${x + 30} L ${x + 38} ${y} H ${x + 90} V ${y + 8} H ${x + 200} V ${y + 56} H ${x} Z`, { cls: 'd-ink', width: 1.4 }),
  kit.text(x + 10, y + 26, name, { size: 12, cls: 'd-key-text' }),
  kit.text(x + 24, y + 46, file || '(nothing)', { size: 11 }),
];

export default (kit) => kit.svg({ width: 500, height: 260 },
  folder(kit, 20, 16, 'D:\\Props', ''),
  box(20, 86, 210, 120, { cls: 'd-ui', rx: 4 }),
  kit.text(30, 104, 'Asset Browser: My Props', { size: 11 }),
  kit.text(125, 154, 'no assets', { anchor: 'middle', size: 12 }),
  kit.tag(125, 244, 'props.blend in Downloads', { tone: 'bad' }),
  folder(kit, 270, 16, 'D:\\Props', 'props.blend'),
  box(270, 86, 210, 120, { cls: 'd-ui', rx: 4 }),
  kit.text(280, 104, 'Asset Browser: My Props', { size: 11 }),
  tile(kit, 282, 114, 'Crate', { size: 56 }),
  tile(kit, 346, 114, 'Barrel', { size: 56 }),
  tile(kit, 410, 114, 'Lamp', { size: 56 }),
  kit.tag(375, 244, 'props.blend in D:\\Props'),
);
