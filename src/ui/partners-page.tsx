import * as React from 'react';
import { balancedColumns, logoWidth, PARTNER_TIERS, type BandSettings, type Partner } from '../partners.ts';
import type { Mark } from '../dispatch.ts';

/**
 * The Partners page's sections, as the site and the studio's preview both
 * draw them (studio #180, #641). Gold partners each get a profile; every
 * other level is a row of logos. Grounds alternate paper and navy down the
 * page, as Rebelle's WordPress page did. Each mark and profile carries
 * `data-partner` with the partner's key, and each editable sentence
 * `data-field`, so an editor can find them; the sections edit nothing.
 */

/** The most logos a level's line holds on a wide page, under 1100px and under 620px. */
const ROSTER_LINE = { wide: 5, mid: 4, narrow: 3 };
const ROSTER_GAP = 56;
/** The roster's logos read larger than the band's, which shares a panel with every level. */
const ROSTER_SCALE = 1.25;

type Ground = 'paper' | 'navy';
const GROUND: Record<Ground, string> = { paper: 'terrain tp-worn rr-pp--paper', navy: 'navy-flat rr-pp--navy' };

const outside = (href: string) => (/^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener' } : {});

// Paper draws the brand's own colors; navy draws its dark-ground mark, else white.
function markOn(partner: Partner, ground: Ground): Mark | null {
  const { color, dark, white } = partner.logos;
  return ground === 'paper' ? (color ?? dark ?? white) : (dark ?? white);
}

// A mark with no color version sits on a navy plate when the ground is paper.
const plated = (partner: Partner, ground: Ground) => ground === 'paper' && !partner.logos.color;

function Logo({ partner, mark, width, fallbackHref }: { partner: Partner; mark: Mark; width: number; fallbackHref: string }) {
  const height = mark.width && mark.height ? Math.round((width * mark.height) / mark.width) : undefined;
  const href = partner.link ?? fallbackHref;
  return (
    <a className="rr-pp-mark" href={href} data-partner={partner.key} {...outside(href)}>
      <img src={mark.url} alt={partner.name} width={width} height={height} loading="lazy" decoding="async" />
    </a>
  );
}

export interface PartnersHeroProps {
  lineA: string;
  /** The heading's second line, in cyan. */
  lineB?: string;
  lead: string;
  photo?: { src: string; srcSet?: string; alt: string };
  mark?: { src: string; alt: string; width: number; height: number };
  headingId?: string;
  /** Drawn above the heading: the site's breadcrumb. */
  children?: React.ReactNode;
}

export function PartnersHero({ lineA, lineB, lead, photo, mark, headingId = 'partners-title', children }: PartnersHeroProps) {
  return (
    <header className="photo-ground rr-pp-hero" aria-labelledby={headingId}>
      {photo && <img src={photo.src} srcSet={photo.srcSet} sizes="100vw" fetchPriority="high" alt={photo.alt} />}
      <span className="rr-pp-hero__wash" aria-hidden="true" />
      <div className="rr-pp-hero__in">
        {children}
        <div className="rr-pp-hero__body">
          <div>
            <div className="rr-sechead rr-pp-hero__head">
              <h1 id={headingId}>
                {lineA}
                {lineB && <em>{lineB}</em>}
              </h1>
            </div>
            <p className="rr-pp-hero__lead" data-field="lead">{lead}</p>
          </div>
          {mark && <img className="rr-pp-hero__mark" src={mark.src} alt={mark.alt} width={mark.width} height={mark.height} />}
        </div>
      </div>
    </header>
  );
}

/** Gold partners, each a band of its own: the logo, the name, the profile and a door to its site. */
export function PartnerProfiles({ partners, heading = 'Official partners', fallbackHref = '/partners', headingId = 'official-partners' }: {
  partners: readonly Partner[];
  heading?: string;
  fallbackHref?: string;
  headingId?: string;
}) {
  const gold = partners.filter((partner) => partner.tier === 'gold');
  if (gold.length === 0) return null;
  return (
    <section className="rr-pp-profiles" aria-labelledby={headingId}>
      <div className="navy-flat rr-pp-profiles__head">
        <h2 id={headingId}>{heading}</h2>
      </div>
      {gold.map((partner, index) => {
        const ground: Ground = index % 2 === 0 ? 'paper' : 'navy';
        const mark = markOn(partner, ground);
        return (
          <article key={partner.key} className={`rr-pp-profile ${GROUND[ground]}`} aria-labelledby={`partner-${partner.key}`} data-partner={partner.key}>
            <div className="rr-pp-profile__in">
              <div className={`rr-pp-profile__logo${plated(partner, ground) ? ' rr-pp-plate' : ''}`}>
                {mark && <Logo partner={partner} mark={mark} width={logoWidth(mark, 'gold') * 2} fallbackHref={fallbackHref} />}
              </div>
              <div className="rr-pp-profile__words">
                <h3 id={`partner-${partner.key}`}>{partner.name}</h3>
                {partner.profile && <p>{partner.profile}</p>}
                {partner.link && (
                  <a className={`rr-btn rr-btn--md ${ground === 'paper' ? 'rr-btn--primary' : 'rr-btn--secondary'}`} href={partner.link} {...outside(partner.link)}>
                    Visit {partner.name} ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

/**
 * Every level after Gold, a row each, its grounds carrying on from the
 * profiles' so the page alternates all the way down. Sizes follow the band's
 * settings, so the levels keep the proportions the studio gave them.
 */
export function PartnerRoster({ partners, band, fallbackHref = '/partners' }: {
  partners: readonly Partner[];
  band?: BandSettings;
  fallbackHref?: string;
}) {
  const gold = partners.filter((partner) => partner.tier === 'gold').length;
  const tiers = PARTNER_TIERS.filter((tier) => tier !== 'gold' && partners.some((partner) => partner.tier === tier));
  if (tiers.length === 0) return null;
  return (
    <section className="rr-pp-roster" aria-label="Partners">
      {tiers.map((tier, index) => {
        const ground: Ground = (gold + index) % 2 === 0 ? 'paper' : 'navy';
        const level = (band?.sizes[tier] ?? 100) / 100;
        const logos = partners.flatMap((partner) => {
          const mark = partner.tier === tier ? markOn(partner, ground) : null;
          return mark ? [{ partner, mark, width: logoWidth(mark, tier, level * (partner.band_scale / 100) * ROSTER_SCALE) }] : [];
        });
        if (logos.length === 0) return null;
        // Each logo takes a line's share, so a level that wraps splits evenly.
        const line = {
          '--cols-wide': balancedColumns(logos.length, ROSTER_LINE.wide),
          '--cols-mid': balancedColumns(logos.length, ROSTER_LINE.mid),
          '--cols-narrow': balancedColumns(logos.length, ROSTER_LINE.narrow),
          '--cell': `${Math.max(...logos.map((logo) => logo.width)) + ROSTER_GAP}px`,
        } as React.CSSProperties;
        return (
          <div key={tier} className={`rr-pp-level rr-pp-level--${tier} ${GROUND[ground]}`}>
            <div className="rr-pp-level__in">
              <ul className="rr-pp-level__logos" style={line}>
                {logos.map(({ partner, mark, width }) => (
                  <li key={partner.key} className={plated(partner, ground) ? 'rr-pp-plate' : undefined}>
                    <Logo partner={partner} mark={mark} width={width} fallbackHref={fallbackHref} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
}
