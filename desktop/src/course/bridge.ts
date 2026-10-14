// The course app's door to Blender: window.dimensio.course, which the preload exposes and
// src/lib/course-ipc.cjs answers (docs/course/PLAN.md, "The bridge between the app and Blender").
// In a browser, under `vite dev` or `vite preview`, there is no preload, so a fake bridge answers
// with a canned report and renders from ./dev, and the whole flow can be driven and photographed
// without Electron. Inside the app the fake is never used.
import type { View } from './content/types';
import type { MeasureReport } from './engine/measure';

export interface BlenderStatus {
  ok: boolean;
  path: string | null;
  version: string | null;
  // True when the version is 5.2 or later, the version the course is written for.
  supported?: boolean;
  reason?: string;
  fix?: string;
}

export interface MeasureOutput {
  report: MeasureReport;
  renders: Partial<Record<View, Uint8Array>>;
  overlays: Partial<Record<View, Uint8Array>>;
}

export interface CourseBridge {
  blenderStatus(): Promise<BlenderStatus>;
  // A file picker for blender.exe; the choice is remembered. Returns the new status, or null when
  // the picker was closed.
  chooseBlender(): Promise<BlenderStatus | null>;
  pickBlend(): Promise<string | null>;
  measure(path: string, options?: { reference?: string; views?: View[] }): Promise<MeasureOutput>;
  // Builds the starter scene as <course folder>\<name>.blend and returns its path. When that file
  // is already there it is returned untouched, unless `overwrite` asks to build it again.
  makeStarter(id: string, extra?: { name?: string; overwrite?: boolean; options?: Record<string, string | number | boolean> }): Promise<string>;
  // With no path, Blender opens with a new scene.
  openInBlender(path?: string): Promise<void>;
  reveal(path: string): Promise<void>;
  courseFolder(): Promise<string>;
}

declare global {
  interface Window {
    // The preload's one object: the course bridge, and setTheme so the window's caption follows
    // the theme. The Workshop's calls are on it too; the course app does not use them.
    dimensio?: { course?: CourseBridge; setTheme?: (theme: string) => Promise<unknown> };
  }
}

let pending: Promise<CourseBridge> | null = null;

export function courseBridge(): Promise<CourseBridge> {
  pending ??= (async () => {
    if (window.dimensio?.course) return window.dimensio.course;
    if (!/^https?:$/.test(window.location.protocol)) throw new Error("Dimensio can't reach Blender from this window. Restart Dimensio.");
    const { fakeBridge } = await import('./dev/fake-bridge');
    return fakeBridge;
  })();
  return pending;
}

// Runs one bridge call and turns a failure into a sentence for the screen.
export async function withBridge<T>(call: (bridge: CourseBridge) => Promise<T>): Promise<T> {
  const bridge = await courseBridge();
  return call(bridge);
}

export function problemText(error: unknown, fallback: string): string {
  const text = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return text.trim() || fallback;
}
