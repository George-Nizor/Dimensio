// The stand-in for window.dimensio.course in a browser. Its renders and report come from
// desktop/scripts/sample-models.py: a first attempt at the example stool, measured as
// blender/dimensio_check.py would. Paths look like the ones Dimensio uses on Windows.
import type { CourseBridge, MeasureOutput } from '../bridge';
import { VIEWS, type View } from '../content/types';
import type { MeasureReport } from '../engine/measure';
import front from './front.png';
import frontOverlay from './front-overlay.png';
import persp from './persp.png';
import report from './report.json';
import right from './right.png';
import rightOverlay from './right-overlay.png';
import top from './top.png';

const FOLDER = 'C:\\Users\\you\\Documents\\Dimensio\\Course';
const BLENDER = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Blender\\blender.exe';
const RENDERS: Record<View, string> = { persp, front, right, top };
const OVERLAYS: Partial<Record<View, string>> = { front: frontOverlay, right: rightOverlay };

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const bytes = async (url: string) => new Uint8Array(await (await fetch(url)).arrayBuffer());

async function pictures(urls: Partial<Record<View, string>>, views: readonly View[]): Promise<Partial<Record<View, Uint8Array>>> {
  const out: Partial<Record<View, Uint8Array>> = {};
  for (const view of views) {
    const url = urls[view];
    if (url) out[view] = await bytes(url);
  }
  return out;
}

const status = { ok: true, path: BLENDER, version: '5.2.2', supported: true, reason: '', fix: '' };

export const fakeBridge: CourseBridge = {
  async blenderStatus() { return status; },
  async chooseBlender() { return status; },
  async pickBlend() { await wait(150); return `${FOLDER}\\stool.blend`; },
  async measure(path, options = {}): Promise<MeasureOutput> {
    await wait(900);
    const views = options.views ?? VIEWS;
    const canned = report as MeasureReport;
    return {
      report: { ...canned, file: path, silhouette: options.reference ? canned.silhouette : undefined },
      renders: await pictures(RENDERS, views),
      overlays: options.reference ? await pictures(OVERLAYS, views) : {},
    };
  },
  async makeStarter(id, extra = {}) { await wait(300); return `${FOLDER}\\${extra.name ?? id}.blend`; },
  async openInBlender() { await wait(150); },
  async reveal() { /* nothing to show in a browser */ },
  async courseFolder() { return FOLDER; },
};
