// Forge3D interface icons in the Instrumenta brand v2 style (brand/ALIGNMENT.md): a flat, friendly
// drawing on a 48-unit grid with a dark ink outline and a stepped extrusion down and to the right,
// no container behind it. The renderer is the suite's own algorithm (as in Discere's
// apps/web/src/brand/discere-icons.ts); only the glyphs and their meaning-hues are Forge3D's.
//
// Output is presentation attributes and classes only: no style="", no <script>, no <foreignObject>,
// no href, so it is safe under the renderer's strict Content-Security-Policy. Motion lives in
// forge-icons.css and keys off the `m-*` classes this module leaves on the drawn parts.
//
// Standalone: nothing imports this yet. See README.md for the old-glyph mapping.

function oklchToHex(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return (
    "#" +
    lin
      .map((x) => {
        const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.max(x, 0) ** (1 / 2.4) - 0.055;
        return Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0");
      })
      .join("")
      .toUpperCase()
  );
}

// The suite formula: accent L .70 C .155; tint, deep shade and ink derived from the same hue.
function colours(hue, chroma = 0.155) {
  return {
    accent: oklchToHex(0.7, chroma, hue),
    light: oklchToHex(0.86, Math.min(chroma, 0.09), hue),
    deep: oklchToHex(0.42, Math.min(chroma, 0.11), hue),
    ink: oklchToHex(0.2, 0.035, hue),
  };
}

// Meaning hues (docs/review-2026-10/ui-ux.md 2.4). Ember is the exact forge3d entry in brand/tokens.json.
export const HUES = {
  ember: { accent: "#EE7752", light: "#FFBDA6", deep: "#7D331B", ink: "#23100A" },
  green: colours(150),
  gold: colours(85),
  rose: colours(5),
  teal: colours(195),
  stone: { accent: "#A9A29A", light: "#D9D3CC", deep: "#4A443E", ink: "#171411" },
};

// Class tokens: f accent fill, f2 light fill, s ink stroke, thin lighter stroke, solid ink fill,
// flat (not extruded), dt (detail dropped at the 16px tier), m-* motion hooks.
const G = {
  hammer: { hue: "ember", d: '<g class="m-strike"><rect class="f2" x="27" y="14" width="6.5" height="30" rx="2.5" transform="rotate(-45 30 29)"/><rect class="s" x="27" y="14" width="6.5" height="30" rx="2.5" transform="rotate(-45 30 29)"/><rect class="f" x="5" y="11" width="24" height="13" rx="2.5" transform="rotate(-45 17 17.5)"/><rect class="s" x="5" y="11" width="24" height="13" rx="2.5" transform="rotate(-45 17 17.5)"/><path class="s thin dt" d="M11.5 15.5 21 25"/></g>' },
  anvil: { hue: "ember", d: '<g class="m-bob"><path class="f2" d="M15 30H33V35H38V41H10V35H15Z"/><path class="s" d="M15 30H33V35H38V41H10V35H15Z"/><path class="f" d="M5 12H34V15C38 15 41 16 44 18V21C39 21 36 22 33 24 31 26 30 28 30 30H18C18 25 12 21 5 20Z"/><path class="s" d="M5 12H34V15C38 15 41 16 44 18V21C39 21 36 22 33 24 31 26 30 28 30 30H18C18 25 12 21 5 20Z"/><path class="s thin dt" d="M9 16H30"/></g>' },
  plan: { hue: "ember", d: '<rect class="f2" x="9" y="8" width="30" height="36" rx="3"/><rect class="s" x="9" y="8" width="30" height="36" rx="3"/><rect class="f" x="17" y="4" width="14" height="8" rx="2"/><rect class="s" x="17" y="4" width="14" height="8" rx="2"/><path class="s thin" d="M15 20H33M15 27H33M15 34H25"/>' },
  shield: { hue: "ember", d: '<path class="f" d="M24 4 41 10V23C41 33 33 40 24 44 15 40 7 33 7 23V10Z"/><path class="s" d="M24 4 41 10V23C41 33 33 40 24 44 15 40 7 33 7 23V10Z"/><path class="s m-tick" d="M16 24 22 30 32 18"/>' },
  crate: { hue: "ember", d: '<rect class="f" x="6" y="18" width="36" height="24" rx="2"/><rect class="s" x="6" y="18" width="36" height="24" rx="2"/><g class="m-lid"><rect class="f2" x="4" y="12" width="40" height="7" rx="2"/><rect class="s" x="4" y="12" width="40" height="7" rx="2"/></g><path class="s thin" d="M14 19V42M34 19V42"/><path class="f2 flat" d="M24 22 30 28H27V35H21V28H18Z"/><path class="s thin flat" d="M24 22 30 28H27V35H21V28H18Z"/>' },
  teapot: { hue: "ember", d: '<path class="f2" d="M35 27 43 17 46 19 39 34Z"/><path class="s" d="M35 27 43 17 46 19 39 34Z"/><path class="s" d="M12 21C4 21 4 33 12 33"/><path class="f" d="M11 22C11 15 17 13 24 13S37 15 37 22V31C37 38 31 41 24 41S11 38 11 31Z"/><path class="s" d="M11 22C11 15 17 13 24 13S37 15 37 22V31C37 38 31 41 24 41S11 38 11 31Z"/><g class="m-lid"><path class="f2" d="M15 13C16 8 32 8 33 13Z"/><path class="s" d="M15 13C16 8 32 8 33 13Z"/><circle class="solid" cx="24" cy="7" r="2.4"/></g><path class="s thin dt" d="M16 24C17 20 20 19 22 19"/>' },
  splat: { hue: "ember", d: '<ellipse class="f2" cx="31" cy="17" rx="10" ry="6.5" transform="rotate(25 31 17)"/><ellipse class="s" cx="31" cy="17" rx="10" ry="6.5" transform="rotate(25 31 17)"/><ellipse class="f" cx="19" cy="26" rx="14" ry="9" transform="rotate(-20 19 26)"/><ellipse class="s" cx="19" cy="26" rx="14" ry="9" transform="rotate(-20 19 26)"/><ellipse class="f2" cx="32" cy="35" rx="10" ry="6"/><ellipse class="s" cx="32" cy="35" rx="10" ry="6"/><circle class="solid flat dt" cx="8" cy="10" r="1.8"/><circle class="solid flat dt" cx="43" cy="28" r="1.5"/>' },
  render: { hue: "ember", d: '<g transform="rotate(-6 24 24)"><rect class="f2" x="5" y="8" width="38" height="32" rx="2"/><rect class="s" x="5" y="8" width="38" height="32" rx="2"/><rect class="f" x="9" y="12" width="30" height="20" rx="1"/><rect class="s thin" x="9" y="12" width="30" height="20" rx="1"/><circle class="f2" cx="31" cy="19" r="3.5"/><path class="s thin" d="M9 29 17 21 24 27 28 24 39 31"/></g>' },
  film: { hue: "ember", d: '<rect class="f" x="4" y="9" width="40" height="30" rx="3"/><rect class="s" x="4" y="9" width="40" height="30" rx="3"/><rect class="f2" x="13" y="16" width="22" height="16" rx="1.5"/><rect class="s thin" x="13" y="16" width="22" height="16" rx="1.5"/><rect class="solid dt" x="7" y="12" width="3" height="3"/><rect class="solid dt" x="7" y="21" width="3" height="3"/><rect class="solid dt" x="7" y="30" width="3" height="3"/><rect class="solid dt" x="38" y="12" width="3" height="3"/><rect class="solid dt" x="38" y="21" width="3" height="3"/><rect class="solid dt" x="38" y="30" width="3" height="3"/>' },
  page: { hue: "ember", d: '<path class="f2" d="M9 4H30L40 14V44H9Z"/><path class="s" d="M9 4H30L40 14V44H9Z"/><path class="f" d="M30 4V14H40Z"/><path class="s" d="M30 4V14H40Z"/><path class="s thin" d="M15 22H34M15 29H34M15 36H27"/>' },
  folder: { hue: "ember", d: '<path class="f" d="M4 9H18L22 14H44V41H4Z"/><path class="s" d="M4 9H18L22 14H44V41H4Z"/><path class="f2" d="M4 19H44V41H4Z"/><path class="s" d="M4 19H44V41H4Z"/>' },
  runs: { hue: "ember", d: '<rect class="f2" x="9" y="29" width="30" height="10" rx="2"/><rect class="s" x="9" y="29" width="30" height="10" rx="2"/><rect class="f" x="12" y="19" width="26" height="10" rx="2"/><rect class="s" x="12" y="19" width="26" height="10" rx="2"/><rect class="f2" x="10" y="9" width="27" height="10" rx="2"/><rect class="s" x="10" y="9" width="27" height="10" rx="2"/>' },
  inspect: { hue: "ember", d: '<rect class="f" x="30" y="27" width="7" height="17" rx="2.5" transform="rotate(-45 33.5 35.5)"/><rect class="s" x="30" y="27" width="7" height="17" rx="2.5" transform="rotate(-45 33.5 35.5)"/><circle class="f2" cx="20" cy="20" r="14"/><circle class="s" cx="20" cy="20" r="14"/><path class="s thin dt" d="M20 12 27 16 20 20 13 16ZM13 16V24L20 28 27 24V16M20 20V28"/>' },
  orbit: { hue: "ember", d: '<circle class="f" cx="24" cy="24" r="11"/><circle class="s" cx="24" cy="24" r="11"/><ellipse class="s flat" cx="24" cy="24" rx="21" ry="8" transform="rotate(-18 24 24)"/><circle class="f2" cx="42" cy="16" r="3.6"/><circle class="s thin" cx="42" cy="16" r="3.6"/>' },
  pan: { hue: "ember", d: '<path class="f" d="M24 3 31 11H27V21H37V17L45 24 37 31V27H27V37H31L24 45 17 37H21V27H11V31L3 24 11 17V21H21V11H17Z"/><path class="s" d="M24 3 31 11H27V21H37V17L45 24 37 31V27H27V37H31L24 45 17 37H21V27H11V31L3 24 11 17V21H21V11H17Z"/>' },
  frame: { hue: "ember", d: '<path class="f s flat" d="M5 15V5H15V8H8V15ZM33 5H43V15H40V8H33ZM43 33V43H33V40H40V33ZM15 43H5V33H8V40H15Z"/><path class="f2" d="M24 13 34 18.5 24 24 14 18.5Z"/><path class="f" d="M14 18.5V29.5L24 35V24Z"/><path class="s" d="M24 13 34 18.5V29.5L24 35 14 29.5V18.5ZM14 18.5 24 24 34 18.5M24 24V35"/>' },
  grid: { hue: "ember", d: '<path class="f2" d="M11 13H37L45 39H3Z"/><path class="s" d="M11 13H37L45 39H3Z"/><path class="s thin" d="M7 26H41M19.5 13 16 39M28.5 13 32 39"/>' },
  wire: { hue: "ember", d: '<path class="f" d="M24 5 41 14.5V33.5L24 43 7 33.5V14.5Z"/><path class="s" d="M24 5 41 14.5V33.5L24 43 7 33.5V14.5ZM7 14.5 24 24 41 14.5M24 24V43"/><path class="s thin dt" d="M7 14.5 24 43M41 14.5 24 5"/>' },
  capture: { hue: "ember", d: '<path class="f2" d="M16 15 19 8H29L32 15Z"/><path class="s" d="M16 15 19 8H29L32 15Z"/><rect class="f" x="4" y="14" width="40" height="27" rx="4"/><rect class="s" x="4" y="14" width="40" height="27" rx="4"/><circle class="f2" cx="24" cy="27.5" r="8"/><circle class="s" cx="24" cy="27.5" r="8"/><circle class="solid" cx="24" cy="27.5" r="3"/>' },
  gear: { hue: "ember", d: '<path class="f" d="M21 5H27L28 10.5 32.5 12.5 37 9.3 41.2 13.5 38 18 40 22.5 45.5 23.5V29.5L40 30.5 38 35 41.2 39.5 37 43.7 32.5 40.5 28 42.5 27 48H21L20 42.5 15.5 40.5 11 43.7 6.8 39.5 10 35 8 30.5 2.5 29.5V23.5L8 22.5 10 18 6.8 13.5 11 9.3 15.5 12.5 20 10.5Z" transform="translate(24 26.5) scale(.82) translate(-24 -26.5)"/><path class="s" d="M21 5H27L28 10.5 32.5 12.5 37 9.3 41.2 13.5 38 18 40 22.5 45.5 23.5V29.5L40 30.5 38 35 41.2 39.5 37 43.7 32.5 40.5 28 42.5 27 48H21L20 42.5 15.5 40.5 11 43.7 6.8 39.5 10 35 8 30.5 2.5 29.5V23.5L8 22.5 10 18 6.8 13.5 11 9.3 15.5 12.5 20 10.5Z" transform="translate(24 26.5) scale(.82) translate(-24 -26.5)"/><circle class="f2" cx="24" cy="26.5" r="6"/><circle class="s" cx="24" cy="26.5" r="6"/>' },
  attach: { hue: "ember", d: '<rect class="f2" x="5" y="12" width="32" height="30" rx="3"/><rect class="s" x="5" y="12" width="32" height="30" rx="3"/><path class="f" d="M5 36 15 26 22 33 27 29 37 37V39A3 3 0 0 1 34 42H8A3 3 0 0 1 5 39Z"/><path class="s thin" d="M5 36 15 26 22 33 27 29 37 37"/><path class="s flat" d="M38 5V25A5.5 5.5 0 0 1 27 25V11"/>' },
  done: { hue: "green", d: '<circle class="f" cx="24" cy="24" r="18"/><circle class="s" cx="24" cy="24" r="18"/><path class="s m-tick" d="M15.5 24.5 21.5 30.5 33 18"/>' },
  alert: { hue: "gold", d: '<path class="f" d="M24 6 43 39H5Z"/><path class="s" d="M24 6 43 39H5Z"/><path class="s" d="M24 17V27"/><circle class="solid" cx="24" cy="32.5" r="1.8"/>' },
  stop: { hue: "rose", d: '<rect class="f" x="9" y="9" width="30" height="30" rx="6"/><rect class="s" x="9" y="9" width="30" height="30" rx="6"/><rect class="f2" x="18" y="18" width="12" height="12" rx="2"/>' },
  failed: { hue: "rose", d: '<g class="m-shake"><circle class="f" cx="24" cy="24" r="18"/><circle class="s" cx="24" cy="24" r="18"/><path class="s" d="M17.5 17.5 30.5 30.5M30.5 17.5 17.5 30.5"/></g>' },
  trash: { hue: "rose", d: '<path class="f" d="M11 15H37L34 43H14Z"/><path class="s" d="M11 15H37L34 43H14Z"/><g class="m-lid"><rect class="f2" x="7" y="9" width="34" height="6" rx="2"/><rect class="s" x="7" y="9" width="34" height="6" rx="2"/></g><path class="s thin" d="M19 9V5H29V9M20 21V37M28 21V37"/>' },
  archive: { hue: "ember", d: '<rect class="f" x="7" y="17" width="34" height="25" rx="2"/><rect class="s" x="7" y="17" width="34" height="25" rx="2"/><rect class="f2" x="4" y="8" width="40" height="9" rx="2"/><rect class="s" x="4" y="8" width="40" height="9" rx="2"/><path class="s" d="M19 25H29"/>' },
  copy: { hue: "ember", d: '<rect class="f2" x="8" y="6" width="22" height="28" rx="3"/><rect class="s" x="8" y="6" width="22" height="28" rx="3"/><rect class="f" x="18" y="14" width="22" height="28" rx="3"/><rect class="s" x="18" y="14" width="22" height="28" rx="3"/><path class="s thin" d="M24 24H34M24 30H34"/>' },
  resume: { hue: "ember", d: '<path class="f" d="M8 18A16 16 0 0 1 36 12L38 8 42 20 30 20 33 16A11 11 0 0 0 13 19Z"/><path class="s" d="M8 18A16 16 0 0 1 36 12L38 8 42 20 30 20 33 16A11 11 0 0 0 13 19Z"/><path class="f2" d="M40 30A16 16 0 0 1 12 36L10 40 6 28 18 28 15 32A11 11 0 0 0 35 29Z"/><path class="s" d="M40 30A16 16 0 0 1 12 36L10 40 6 28 18 28 15 32A11 11 0 0 0 35 29Z"/>' },
  send: { hue: "ember", d: '<path class="f" d="M6 9 42 24 6 39 12 24Z"/><path class="s" d="M6 9 42 24 6 39 12 24Z"/><path class="s thin" d="M12 24H27"/>' },
  open: { hue: "teal", d: '<path class="f" d="M24 6 36 19H29V30H19V19H12Z"/><path class="s" d="M24 6 36 19H29V30H19V19H12Z"/><path class="s" d="M8 31V39A2 2 0 0 0 10 41H38A2 2 0 0 0 40 39V31"/>' },
  export: { hue: "teal", d: '<path class="f" d="M19 6H29V18H36L24 31 12 18H19Z"/><path class="s" d="M19 6H29V18H36L24 31 12 18H19Z"/><path class="s" d="M8 33V39A2 2 0 0 0 10 41H38A2 2 0 0 0 40 39V33"/>' },
  gamepad: { hue: "teal", d: '<path class="f" d="M12 14H36C42 14 45 22 45 31 45 37 41 39 37 35L33 31H15L11 35C7 39 3 37 3 31 3 22 6 14 12 14Z"/><path class="s" d="M12 14H36C42 14 45 22 45 31 45 37 41 39 37 35L33 31H15L11 35C7 39 3 37 3 31 3 22 6 14 12 14Z"/><path class="s" d="M14 19V27M10 23H18"/><circle class="f2" cx="33" cy="20" r="2.6"/><circle class="f2" cx="37" cy="25" r="2.6"/>' },
  blender: { hue: "teal", d: '<rect class="f" x="4" y="14" width="33" height="28" rx="3"/><rect class="s" x="4" y="14" width="33" height="28" rx="3"/><path class="f2" d="M4 17A3 3 0 0 1 7 14H34A3 3 0 0 1 37 17V21H4Z"/><path class="s thin" d="M4 21H37"/><circle class="solid dt" cx="9" cy="17.6" r="1.1"/><circle class="solid dt" cx="13" cy="17.6" r="1.1"/><path class="f2" d="M29 4H44V19L38.5 13.5 29 23 25 19 34.5 9.5Z"/><path class="s" d="M29 4H44V19L38.5 13.5 29 23 25 19 34.5 9.5Z"/>' },
  clay: { hue: "stone", d: '<circle class="f" cx="24" cy="24" r="18"/><circle class="s" cx="24" cy="24" r="18"/><ellipse class="f2 flat" cx="17.5" cy="16.5" rx="5.5" ry="3.6" transform="rotate(-35 17.5 16.5)"/>' },
  rendered: { hue: "ember", d: '<circle class="f" cx="24" cy="24" r="18"/><circle class="s" cx="24" cy="24" r="18"/><ellipse class="f2 flat" cx="17.5" cy="16.5" rx="5.5" ry="3.6" transform="rotate(-35 17.5 16.5)"/><path class="s thin dt" d="M10 30C16 36 30 38 38 30"/>' },
};

// Line glyphs: utilities that stay lines, on a 24 grid, currentColor, round caps.
const LINES = {
  add: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  more: '<circle cx="5.5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.9-4.9"/>',
  fullscreen: '<path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/>',
  select: '<path d="M5 3.5 18.5 10l-6.2 1.9L9.8 18.4Z"/>',
};

const TIERS = {
  full: { steps: 6, dx: 0.5, dy: 0.55, line: 2.3, thin: 1.7, depthLine: 3.2, details: true },
  medium: { steps: 3, dx: 0.85, dy: 0.95, line: 2.8, thin: 2.1, depthLine: 3.4, details: false },
  small: { steps: 2, dx: 1.1, dy: 1.25, line: 3.4, thin: 2.6, depthLine: 3.6, details: false },
};
const tierFor = (size) => (size && size <= 16 ? "small" : size && size <= 24 ? "medium" : "full");
const TAG = /<(\/?)(g|rect|path|circle|ellipse)\b([^>]*?)(\/?)>/g;

function paint(markup, look) {
  return markup.replace(TAG, (whole, closing, tag, attrs, selfClose) => {
    if (closing) return whole;
    const m = attrs.match(/\sclass="([^"]*)"/);
    const tokens = m && m[1] ? m[1].split(/\s+/) : [];
    const rest = attrs.replace(/\sclass="[^"]*"/, "");
    const motion = tokens.filter((t) => /^m-/.test(t));
    const extra = look(tag, tokens);
    if (extra === null) return "";
    const cls = motion.length ? ` class="${motion.join(" ")}"` : "";
    return `<${tag}${cls}${rest}${extra}${selfClose ? "/" : ""}>`;
  });
}
const dropDetails = (s) => s.replace(/<(rect|path|circle|ellipse)\b[^>]*\bclass="[^"]*\bdt\b[^"]*"[^>]*\/>/g, "");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/**
 * render(name, { size, hue, label, tier }) returns an SVG string.
 * size: pixels (default 24). hue: ember|green|gold|rose|teal|stone, overriding the glyph's meaning hue.
 * label: accessible name; without it the icon is aria-hidden. tier: force full|medium|small.
 */
export function render(name, options = {}) {
  const size = options.size || 24;
  const label = options.label ? ` role="img" aria-label="${esc(options.label)}"` : ' aria-hidden="true"';
  if (LINES[name]) {
    return `<svg class="fi fi-line fi-${name}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"${label}>${LINES[name]}</svg>`;
  }
  const glyph = G[name];
  if (!glyph) throw new Error(`Unknown Forge3D icon: ${name}`);
  const tier = TIERS[options.tier || tierFor(size)];
  const col = HUES[options.hue || glyph.hue];
  if (!col) throw new Error(`Unknown Forge3D icon hue: ${options.hue}`);
  let d = glyph.d;
  if (!tier.details) d = dropDetails(d);
  const round = ' stroke-linecap="round" stroke-linejoin="round"';
  const front = paint(d, (tag, t) => {
    if (tag === "g") return "";
    if (t.includes("f")) return ` fill="${col.accent}"`;
    if (t.includes("f2")) return ` fill="${col.light}"`;
    if (t.includes("solid")) return ` fill="${col.ink}"`;
    if (t.includes("s")) return ` fill="none" stroke="${col.ink}" stroke-width="${t.includes("thin") ? tier.thin : tier.line}"${round}`;
    return "";
  });
  const depthLayer = paint(d, (tag, t) => {
    if (tag === "g") return "";
    if (t.includes("flat")) return null;
    return ` fill="${col.deep}" stroke="${col.deep}" stroke-width="${tier.depthLine}" stroke-linejoin="round"`;
  });
  const depth = [...Array(tier.steps)]
    .map((_, i) => {
      const n = tier.steps - i;
      return `<g transform="translate(${(n * tier.dx).toFixed(2)} ${(n * tier.dy).toFixed(2)})">${depthLayer}</g>`;
    })
    .join("");
  const shift = `translate(${(-tier.steps * tier.dx * 0.5).toFixed(2)} ${(-tier.steps * tier.dy * 0.5).toFixed(2)})`;
  return `<svg class="fi fi-${name}" viewBox="-2 -2 52 52" width="${size}" height="${size}"${label}><g transform="${shift}"><g class="fi-body"><g>${depth}</g><g>${front}</g></g></g></svg>`;
}

export const names = [...Object.keys(G), ...Object.keys(LINES)];
export const glyphHue = (name) => (G[name] ? G[name].hue : "currentColor");
