// Output properties for the edit: End set to 480 in Frame Range, Media Type Video, and the encoding
// the Video Editing template sets (MPEG-4, H.264, AAC), with Ctrl+F12 to render.
import { keycap } from '../../../diagrams/mesh.mjs';
import { area, field } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 440, height: 290 },
  area(kit, 20, 14, 300, 70, { title: 'Frame Range' }),
  field(kit, 150, 40, 'Frame Start', '1', { width: 150 }),
  field(kit, 150, 60, 'End', '480', { width: 150, mark: true }),
  area(kit, 20, 94, 300, 186, { title: 'Output' }),
  field(kit, 150, 120, 'File Path', '//video/', { width: 150 }),
  field(kit, 150, 144, 'Media Type', 'Video', { width: 150 }),
  kit.text(36, 184, 'Encoding', { size: 11, cls: 'd-label' }),
  field(kit, 150, 196, 'Container', 'MPEG-4', { width: 150 }),
  field(kit, 150, 220, 'Video Codec', 'H.264', { width: 150 }),
  field(kit, 150, 244, 'Audio Codec', 'AAC', { width: 150 }),
  keycap(kit, 380, 150, 'Ctrl+F12', { size: 12 }),
  kit.text(380, 180, 'Render Animation', { anchor: 'middle', size: 11 }),
);
