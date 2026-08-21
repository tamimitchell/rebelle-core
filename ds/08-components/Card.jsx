import React from 'react';
/* Appearance lives in 08-components/components.css (loaded by styles.css), never here — so a plain
   HTML card wears the identical box with the same class names, and nothing waits on a bundle
   recompile. This file only maps props to those classes. */

/** Rebelle Rally Card — the only box on a dark ground. Sinks to --navy-night with one bright rim; no shadow, ever. Navy and Photo grounds only: on paper a block is rules and margin, not a box. */
export function Card({variant='default',lit=false,interactive=false,padded=true,className='',children,...rest}){
  const cls=['rr-card',variant!=='default'?'rr-card--'+variant:'',lit&&variant!=='note'?'rr-card--lit':'',interactive?'rr-card--link':'',className].filter(Boolean).join(' ');
  return React.createElement('article',{className:cls,...rest},padded?React.createElement('div',{className:'rr-card__body'},children):children);
}
