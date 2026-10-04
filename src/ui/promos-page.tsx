import * as React from 'react';
import type { Mark } from '../dispatch.ts';
import { parseProse } from '../prose.ts';
import { validLine, type Promo } from '../promos.ts';
import { ProseBlocks } from './story.tsx';

/**
 * The Promos page's sections, as the site and the studio's preview both draw
 * them (studio #663). The first offer stands in the hero beside the page's
 * heading, over its own photograph; each later offer is a band over its own.
 * Each offer carries `data-promo` with its place, so an editor can find it;
 * the sections edit nothing.
 */

export interface PromoPhoto {
  src: string;
  srcSet?: string;
  alt: string;
}

/** Every mark covers about the same area, so a square badge and a long wordmark read as equals. */
const MARK = { area: 14000, max: 240 };
/** A wordmark's typical shape, for a mark sent without its pixels. */
const FALLBACK_ASPECT = 3;

const ours = (href: string) => /^https:\/\/(www\.|wp\.)?rebellerally\.com(\/|$)/.test(href);
const outside = (href: string) => (/^https?:\/\//.test(href) && !ours(href) ? { target: '_blank', rel: 'noopener' } : {});

function SponsorMark({ sponsor }: { sponsor: NonNullable<Promo['sponsor']> }) {
  // The sheet is glass over a photograph: the brand's dark-ground mark, else its white one.
  const { dark, white, color } = sponsor.logos;
  const mark: Mark | null = dark ?? white ?? color;
  if (!mark) return <h2 className="rr-promo__heading">{sponsor.name}</h2>;
  const aspect = mark.width && mark.height ? mark.width / mark.height : FALLBACK_ASPECT;
  const width = Math.round(Math.min(MARK.max, Math.sqrt(MARK.area * aspect)));
  const height = mark.width && mark.height ? Math.round(width / aspect) : undefined;
  const img = <img src={mark.url} alt={sponsor.name} width={width} height={height} loading="lazy" decoding="async" />;
  const plated = !dark && !white;
  const className = `rr-promo__mark${plated ? ' rr-promo__mark--plated' : ''}`;
  return sponsor.link ? (
    <a className={className} href={sponsor.link} {...outside(sponsor.link)}>
      {img}
    </a>
  ) : (
    <span className={className}>{img}</span>
  );
}

/** One offer on Field Glass: who it is from, its words, how long it runs and its button. */
export function PromoSheet({ promo }: { promo: Promo }) {
  return (
    <div className="fgi fgi--settle rr-promo" data-promo={promo.position}>
      {promo.sponsor ? <SponsorMark sponsor={promo.sponsor} /> : <h2 className="rr-promo__heading">{promo.heading}</h2>}
      <div className="rr-promo__words">
        <ProseBlocks document={parseProse(promo.words)} linkProps={outside} />
      </div>
      <p className="rr-promo__valid">{validLine(promo.ends_on)}</p>
      {promo.button && (
        <a className="rr-btn rr-btn--primary rr-btn--lg rr-promo__go" href={promo.button.href} {...outside(promo.button.href)}>
          {promo.button.label} <span aria-hidden="true">{ours(promo.button.href) ? '→' : '↗'}</span>
        </a>
      )}
    </div>
  );
}

export interface PromosHeroProps {
  lineA: string;
  /** The heading's second line, in cyan. */
  lineB?: string;
  /** The first offer, beside the heading. */
  promo?: Promo;
  /** The first offer's photograph. */
  photo?: PromoPhoto;
  headingId?: string;
  /** Drawn above the heading: the site's breadcrumb. */
  children?: React.ReactNode;
}

export function PromosHero({ lineA, lineB, promo, photo, headingId = 'promos-title', children }: PromosHeroProps) {
  return (
    <header className="photo-ground rr-promo-hero" aria-labelledby={headingId}>
      {photo && <img src={photo.src} srcSet={photo.srcSet} sizes="100vw" fetchPriority="high" alt={photo.alt} />}
      <span className="rr-promo-hero__wash" aria-hidden="true" />
      <div className="rr-promo-hero__in">
        {children}
        <div className="rr-promo-hero__body">
          <div className="rr-sechead rr-promo-hero__head">
            <h1 id={headingId}>
              {lineA} {lineB && <em>{lineB}</em>}
            </h1>
          </div>
          {promo && <PromoSheet promo={promo} />}
        </div>
      </div>
    </header>
  );
}

/** A later offer, on the glass over its own photograph. */
export function PromoBand({ promo, photo }: { promo: Promo; photo: PromoPhoto }) {
  return (
    <section className="rr-promo-band" aria-label={promo.sponsor?.name ?? promo.heading ?? undefined}>
      <div className="photo-ground rr-promo-band__ground">
        <img src={photo.src} srcSet={photo.srcSet} sizes="100vw" loading="lazy" decoding="async" alt={photo.alt} />
        <div className="rr-promo-band__in">
          <div className="rr-promo-band__sheet">
            <PromoSheet promo={promo} />
          </div>
        </div>
      </div>
    </section>
  );
}
