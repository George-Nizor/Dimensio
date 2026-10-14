// Types for the Instrumenta icon library, so the course app (TypeScript) can import the same file
// the Workshop uses.
declare const InstrumentaIcons: {
  render(id: string, options?: { size?: number; label?: string; className?: string; tier?: string }): string;
  colours(id: string): { accent: string; light: string; deep: string; ink: string; suite: string };
};
export default InstrumentaIcons;
