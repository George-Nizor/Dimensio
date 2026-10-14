// What crosses from Blender's Principled BSDF to Godot's StandardMaterial3D, and what doesn't:
// procedural texture nodes have to be baked to an image first.
export default (kit) => {
  const rows = [['Base Color (or its image)', 'Albedo'], ['Metallic, Roughness', 'Metallic, Roughness'], ['Normal Map node', 'Normal Map'], ['Emission', 'Emission'], ['Alpha', 'Transparency'], ['Noise, Voronoi...', 'nothing: bake first']];
  const out = [
    kit.text(30, 30, 'Blender: Principled BSDF', { size: 12, cls: 'd-key-text' }),
    kit.text(300, 30, 'Godot: StandardMaterial3D', { size: 12, cls: 'd-key-text' }),
  ];
  rows.forEach(([a, b], i) => {
    const y = 60 + i * 28;
    const bad = i === rows.length - 1;
    out.push(`<rect x="22" y="${y - 15}" width="210" height="22" rx="4" class="d-paper" stroke-width="1"/>`);
    out.push(kit.text(32, y, a, { size: 11 }));
    out.push(kit.line(238, y - 4, 284, y - 4, { cls: bad ? 'd-bad' : 'd-mark', width: 1.8, dash: bad ? '4 4' : undefined }));
    if (!bad) out.push(kit.arrowhead(284, y - 4, 0, { size: 7 }));
    out.push(bad ? kit.text(292, y, b, { size: 11, cls: 'd-tag d-tag-bad' }) : [`<rect x="292" y="${y - 15}" width="190" height="22" rx="4" class="d-paper" stroke-width="1"/>`, kit.text(302, y, b, { size: 11 })]);
  });
  return kit.svg({ width: 500, height: 230 }, out);
};
