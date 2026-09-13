import * as React from 'react';
import { SPONSOR_LOCKUPS, type Mark, type SponsorLogos } from '../dispatch.ts';
/**
 * Sponsor lockups are brand-accurate badges — contained-in-badge per the
 * brand rule, never recolored, never one templated pill. Each drawn brand is
 * its own tiny treatment, carried by a `live-brand--*` class that the badge
 * and the dispatch card it sits on both read; a sponsor nobody has drawn
 * wears a neutral chip with its name rather than the wrong colors.
 *
 * A sponsor whose row carries its marks (studio #349) wears those instead:
 * the white one-colour mark on the brand colour, or on navy for a brand
 * nobody drew; the full-colour lockup on a white plate where the page says
 * *presented by*. A mark is never recoloured either.
 *
 * Keyed by the sponsor's key — what a dispatch's `sponsor` carries and a rally
 * day's `presented_by` rows name — or by the lockup key a row says it wears.
 */
export interface SponsorChip {
  /** The studio's key for the sponsor. */
  key: string;
  /** As it is printed; the chip's words when no lockup is drawn. */
  name?: string | null;
  /** The drawn lockup it wears when that is not the key itself. */
  lockup_key?: string | null;
  /** The two marks the studio holds for it, when the host has the row. */
  logos?: SponsorLogos | null;
}

const normalize = (word: string) => word.toLowerCase().replace(/[^a-z0-9]/g, '');
const DRAWN = new Map(Object.entries(SPONSOR_LOCKUPS).map(([key, label]) => [normalize(key), { key, label }]));
const chipOf = (sponsor: SponsorChip | string): SponsorChip => (typeof sponsor === 'string' ? { key: sponsor } : sponsor);

/** The brand class a word resolves to — a key, a lockup key or a printed name — or null for one nobody drew. */
export function brandClass(word: string): string | null {
  const brand = DRAWN.get(normalize(word));
  return brand ? `live-brand--${brand.key}` : null;
}

/** The brand class a sponsor wears: its lockup key when it names one, else its own key. */
export function sponsorBrandClass(sponsor: SponsorChip | string): string | null {
  const chip = chipOf(sponsor);
  return brandClass(chip.lockup_key ?? chip.key);
}

/** What a chip says for a sponsor no host has named: the key's words, as chips wear them. */
export function sponsorWords(key: string): string {
  return key.replace(/-/g, ' ').toUpperCase();
}

export interface SponsorLockupProps {
  sponsor: SponsorChip | string;
  /** The strip above the page wears the badge a size down. */
  size?: 'entry' | 'strip';
  /**
   * Where it stands. `badge` — a dispatch's meta row, a partner card — draws
   * the white mark on a dark ground; `presented-by` — the live page's and
   * Home's *presented by* line — draws the colour mark on a white plate. A
   * sponsor with only one mark draws that one where it can; with none, the
   * drawn lockup or the plain chip.
   */
  variant?: 'badge' | 'presented-by';
}

export function SponsorLockup({ sponsor, size = 'entry', variant = 'badge' }: SponsorLockupProps) {
  const chip = chipOf(sponsor);
  const brand = DRAWN.get(normalize(chip.lockup_key ?? chip.key));
  const sized = size === 'strip' ? ' live-lockup--strip' : '';
  const color = variant === 'presented-by' ? chip.logos?.color : null;
  if (color) {
    return <React.Fragment><span className={`live-lockup live-lockup--presented-by${sized}`}><MarkImage mark={color} /></span></React.Fragment>;
  }
  const white = chip.logos?.white;
  if (white) {
    const ground = brand ? `live-brand--${brand.key}` : 'live-lockup--navy';
    return <React.Fragment><span className={`live-lockup live-lockup--mark ${ground}${sized}`}><MarkImage mark={white} /></span></React.Fragment>;
  }
  if (!brand) {
    return <React.Fragment><span className="rr-chip rr-chip--neutral">{(chip.name ?? sponsorWords(chip.key)).toUpperCase()}</span></React.Fragment>;
  }
  return (
    <React.Fragment><span className={`live-lockup live-brand--${brand.key}${sized}`}>
      {brand.label}
    </span></React.Fragment>
  );
}

/** The pixels reserve the box when the wire carries them; an SVG carries none and scales. */
function MarkImage({ mark }: { mark: Mark }) {
  return <img src={mark.url} alt={mark.alt} width={mark.width} height={mark.height} loading="lazy" decoding="async" />;
}
