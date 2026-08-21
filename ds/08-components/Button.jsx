import React from 'react';
/* Appearance lives in 08-components/components.css (loaded by styles.css), never here — so a plain
   HTML card wears the identical button with the same class names, and nothing waits on a bundle
   recompile. This file only maps props to those classes. */

/** Rebelle Rally Button — acts, never informs. A button always carries a verb; status/filter chips are a separate component. The `ground` prop tunes the register to the ground it sits on. */
export function Button({variant='primary',size='md',ground='navy',tone,href,disabled=false,className='',children,...rest}){
  const g=tone==='paper'?'terrain':ground;/* legacy alias */
  const cls=['rr-btn','rr-btn--'+variant,'rr-btn--'+size,g!=='navy'&&g!=='glass'?'rr-g-'+g:'',className].filter(Boolean).join(' ');
  if(href&&!disabled)return React.createElement('a',{className:cls,href,...rest},children);
  return React.createElement('button',{className:cls,disabled,type:rest.type||'button',...rest},children);
}
