import * as React from 'react';
/**
 * Sponsor lockups are brand-accurate badges — contained-in-badge per the
 * brand rule, never recolored, never one templated pill. Each known brand is
 * its own tiny treatment, carried by a `live-brand--*` class that the badge
 * and the dispatch card it sits on both read; an unknown sponsor word
 * degrades to a neutral chip rather than wearing the wrong colors.
 *
 * Keyed by the word the feed carries: a dispatch's `sponsor`, or a rally
 * day's `presented_by` in the strip above the page.
 */
const BRANDS: Record<string, { label: string; key: string }> = {
  pirelli: { label: 'PIRELLI', key: 'pirelli' },
  bilstein: { label: 'BILSTEIN', key: 'bilstein' },
  iridium: { label: 'iridium', key: 'iridium' },
  jiffylube: { label: 'JIFFY LUBE', key: 'jiffy-lube' },
  stryten: { label: 'STRYTEN', key: 'stryten' },
  synchrony: { label: 'SYNCHRONY', key: 'synchrony' },
  bajadesigns: { label: 'BAJA DESIGNS', key: 'baja-designs' },
  yeti: { label: 'YETI', key: 'yeti' },
  pennzoil: { label: 'PENNZOIL', key: 'pennzoil' },
};

/** The brand class a sponsor word resolves to, or null for one nobody drew. */
export function brandClass(sponsor: string): string | null {
  const brand = BRANDS[sponsor.toLowerCase().replace(/[^a-z]/g, '')];
  return brand ? `live-brand--${brand.key}` : null;
}

export interface SponsorLockupProps {
  sponsor: string;
  /** The strip above the page wears the badge a size down. */
  size?: 'entry' | 'strip';
}

export function SponsorLockup({ sponsor, size = 'entry' }: SponsorLockupProps) {
  const brand = BRANDS[sponsor.toLowerCase().replace(/[^a-z]/g, '')];
  if (!brand) return <React.Fragment><span className="rr-chip rr-chip--neutral">{sponsor.toUpperCase()}</span></React.Fragment>;
  return (
    <React.Fragment><span className={`live-lockup live-brand--${brand.key}${size === 'strip' ? ' live-lockup--strip' : ''}`}>
      {brand.label}
    </span></React.Fragment>
  );
}
