import { Fragment } from 'react';

// A key or a combination written in a lesson as a code span, shown as key caps: `Ctrl+A` becomes
// two caps joined by a plus. Screen readers hear the words as written.
export function Keys({ keys }: { keys: string }) {
  const parts = keys.split(/\+(?=.)/);
  return (
    <kbd className="keys" aria-label={keys}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i ? <span className="keys-plus" aria-hidden="true">+</span> : null}
          <kbd className="key" aria-hidden="true">{part}</kbd>
        </Fragment>
      ))}
    </kbd>
  );
}
