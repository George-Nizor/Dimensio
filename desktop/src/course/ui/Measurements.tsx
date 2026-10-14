import type { Measure } from '../content/types';
import { evaluateAll, type MeasureReport } from '../engine/measure';
import { Icon } from './Icons';

// The practice item's measurements as plain facts, each marked as holding or not yet. Never a
// score, a grade or a percentage.
export function Measurements({ report, measures }: { report: MeasureReport | null; measures: readonly Measure[] }) {
  const results = evaluateAll(report, measures);
  if (!results.length) return null;
  return (
    <ul className="held measured">
      {results.map((result) => (
        <li key={result.label} className={result.held ? 'yes' : 'no'}>
          <span className="held-mark">{result.held ? <Icon name="check" size={16} /> : null}{result.held ? 'Holds' : 'Not yet'}</span>
          <span>{result.fact}</span>
        </li>
      ))}
    </ul>
  );
}
