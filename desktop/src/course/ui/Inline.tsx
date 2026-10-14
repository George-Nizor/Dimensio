import { Fragment, type ReactNode } from 'react';
import type { Inline } from '../content/types';
import { Keys } from './Keys';

// Renders lesson prose from the small tree the content build writes, so no HTML from content is
// ever inserted into the page. Code spans are keys and show as key caps. Links open in the system
// browser: the window hands every https link to it.
export function InlineText({ nodes }: { nodes: Inline }): ReactNode {
  return nodes.map((node, index) => {
    switch (node.t) {
      case 'text': return <Fragment key={index}>{node.v}</Fragment>;
      case 'code': return <Keys key={index} keys={node.v} />;
      case 'strong': return <strong key={index}><InlineText nodes={node.c} /></strong>;
      case 'em': return <em key={index}><InlineText nodes={node.c} /></em>;
      case 'link': return <a key={index} href={node.href} target="_blank" rel="noreferrer"><InlineText nodes={node.c} /></a>;
      default: return null;
    }
  });
}

export function Paragraphs({ items, className }: { items: Inline[]; className?: string }): ReactNode {
  return items.map((nodes, index) => <p key={index} className={className}><InlineText nodes={nodes} /></p>);
}
