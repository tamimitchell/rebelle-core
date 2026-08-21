import React from 'react';
/* Appearance lives in 08-components/components.css (loaded by styles.css), never here — see Button.jsx. */

/** Rebelle Rally Chip — reports status or filters content; it never carries a verb. Anything with a verb is a Button. */
export function Chip({variant='neutral',ground='navy',icon,className='',children,...rest}){
  const paper=ground==='terrain'||ground==='roadbook';
  const cls=['rr-chip','rr-chip--'+variant,paper?'rr-cg-paper':'',className].filter(Boolean).join(' ');
  return React.createElement('span',{className:cls,...rest},
    icon?React.createElement('i',{className:'ti ti-'+icon,'aria-hidden':'true'}):null,
    children);
}
