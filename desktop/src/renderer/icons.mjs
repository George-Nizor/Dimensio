// The renderer's one door to icons. Everything comes from the brand-v2 set in ./brand-icons (README there has
// the old-glyph mapping); the three theme-toggle glyphs are the only icons still drawn as plain lines, because
// the set has no sun, moon or monitor. All output is presentation attributes and classes, so it is CSP-safe.
import { render } from "./brand-icons/forge-icons.mjs";
import "./brand-icons/forge-icons.css";

/** icon("hammer", 24) or icon("wire", 24, { hue: "stone", playing: true, working: false, label }) as an SVG string. */
export function icon(name, size = 24, options = {}) {
  const { hue, label, playing, working } = options;
  const svg = render(name, { size, hue, label });
  const state = [playing && "is-playing", working && "is-working"].filter(Boolean).join(" ");
  return state ? svg.replace('class="fi ', `class="fi ${state} `) : svg;
}

const THEME_LINES = {
  monitor: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
};

export function themeIcon(name) {
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${THEME_LINES[name] || ""}</svg>`;
}
