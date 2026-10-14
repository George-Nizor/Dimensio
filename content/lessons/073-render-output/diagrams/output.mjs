// Output Properties > Output: the path //turntable/, Media Type Image and File Format PNG, and the
// numbered files the render writes into a turntable folder beside the .blend file.
import { propRow, fileList } from './stage.mjs';

export default (kit) => kit.svg({ width: 500, height: 170 },
  `<rect x="14" y="14" width="250" height="122" rx="6" class="d-paper" stroke-width="1.2"/>`,
  kit.text(26, 36, 'Output', { size: 12 }),
  `<rect x="24" y="46" width="230" height="20" rx="3" class="d-ui-mark" stroke-width="1.2"/>`,
  kit.text(32, 60, '//turntable/', { size: 11, cls: 'd-key-text' }),
  propRow(kit, 24, 78, 'Media Type', 'Image', { width: 230, split: 0.46 }),
  propRow(kit, 24, 104, 'File Format', 'PNG', { width: 230, split: 0.46 }),
  fileList(kit, 300, 14, 180, 'turntable', ['0001.png', '0002.png', '0003.png', '...', '0048.png']),
);
