import * as React from 'react';
import { balancedColumns, PARTNER_TIERS, type Partner, type PartnerTier } from '../partners.ts';
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
const ROSTER_GAP = 96;

/**
 * Each level's logos at the size Rebelle's WordPress page showed them (Tami,
 * 2026-10-03), measured there at 1440px: every logo in a row covers the same
 * area, so a square badge and a long wordmark read as equals, and none runs
 * wider than `max`. A Gold logo fills its column, as there.
 */
const LOGO_SIZING: Record<Exclude<PartnerTier, 'gold'>, { area: number; max: number }> = {
  'silver-oem': { area: 14000, max: 190 },
  silver: { area: 18000, max: 240 },
  bronze: { area: 17000, max: 200 },
  supplier: { area: 1800, max: 100 },
};
const GOLD = { width: 500, height: 300 };
/** A wordmark's typical shape, for a mark sent without its pixels. */
const FALLBACK_ASPECT = 3;

const aspectOf = (mark: Mark) => (mark.width && mark.height ? mark.width / mark.height : FALLBACK_ASPECT);

// A partner's own nudge (its `band_scale`) carries here too; the band's level sizes do not.
function rosterWidth(mark: Mark, tier: Exclude<PartnerTier, 'gold'>, scale: number): number {
  const { area, max } = LOGO_SIZING[tier];
  return Math.round(Math.min(max, Math.sqrt(area * aspectOf(mark))) * scale);
}

const goldWidth = (mark: Mark) => Math.round(Math.min(GOLD.width, GOLD.height * aspectOf(mark)));

type Ground = 'paper' | 'navy';
const GROUND: Record<Ground, string> = { paper: 'terrain tp-worn rr-pp--paper', navy: 'navy-flat rr-pp--navy' };

const outside = (href: string) => (/^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener' } : {});

// Paper draws the brand's own colors; navy draws its dark-ground mark, else white.
// Either falls back to what there is, on a plate of the other ground (`plated`).
function markOn(partner: Partner, ground: Ground): Mark | null {
  const { color, dark, white } = partner.logos;
  return ground === 'paper' ? (color ?? dark ?? white) : (dark ?? white ?? color);
}

const plated = (partner: Partner, ground: Ground) => (ground === 'paper' ? !partner.logos.color : !partner.logos.dark && !partner.logos.white);
const drawn = (partner: Partner) => Boolean(partner.logos.color ?? partner.logos.dark ?? partner.logos.white);

// A partner without a site keeps its logo, unlinked: on this page there is nowhere else to send it.
function Logo({ partner, mark, width }: { partner: Partner; mark: Mark; width: number }) {
  const height = mark.width && mark.height ? Math.round((width * mark.height) / mark.width) : undefined;
  const img = <img src={mark.url} alt={partner.name} width={width} height={height} loading="lazy" decoding="async" />;
  return partner.link ? (
    <a className="rr-pp-mark" href={partner.link} data-partner={partner.key} {...outside(partner.link)}>
      {img}
    </a>
  ) : (
    <span className="rr-pp-mark" data-partner={partner.key}>
      {img}
    </span>
  );
}

export interface PartnersHeroProps {
  lineA: string;
  /** The heading's second line, in cyan. */
  lineB?: string;
  lead: string;
  photo?: { src: string; srcSet?: string; alt: string };
  /**
   * A Vimeo film to play over the photograph, from `start` to `end` seconds
   * and round again. The hero draws only its place (`data-vimeo`); the page
   * mounts the player, so a still stays for reduced motion and in an editor.
   */
  video?: { vimeo: string; start?: number; end?: number };
  mark?: { src: string; alt: string; width: number; height: number };
  headingId?: string;
  /** Drawn above the heading: the site's breadcrumb. */
  children?: React.ReactNode;
}

export function PartnersHero({ lineA, lineB, lead, photo, video, mark, headingId = 'partners-title', children }: PartnersHeroProps) {
  return (
    <header className="photo-ground rr-pp-hero" aria-labelledby={headingId}>
      {photo && <img src={photo.src} srcSet={photo.srcSet} sizes="100vw" fetchPriority="high" alt={photo.alt} />}
      {video && <div className="rr-pp-hero__video" aria-hidden="true" data-vimeo={video.vimeo} data-start={video.start} data-end={video.end} />}
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
export function PartnerProfiles({ partners, heading = 'Official partners', headingId = 'official-partners' }: {
  partners: readonly Partner[];
  heading?: string;
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
                {mark && <Logo partner={partner} mark={mark} width={goldWidth(mark)} />}
              </div>
              <div className="rr-pp-profile__words">
                <h3 id={`partner-${partner.key}`}>{partner.name}</h3>
                {partner.profile && <p>{partner.profile}</p>}
                {/* Each profile is its own band, so its door is that band's primary, drawn for the ground (Field Glass 08). */}
                {partner.link && (
                  <a className={`rr-btn rr-btn--md rr-btn--primary${ground === 'paper' ? ' rr-g-terrain' : ''}`} href={partner.link} {...outside(partner.link)}>
                    Visit {partner.name} <span aria-hidden="true">↗</span>
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
 * profiles' so the page alternates all the way down.
 */
export function PartnerRoster({ partners }: { partners: readonly Partner[] }) {
  const gold = partners.filter((partner) => partner.tier === 'gold').length;
  // Only levels with a logo to draw take a row, so the grounds keep turning about.
  const tiers = PARTNER_TIERS.filter((tier) => tier !== 'gold' && partners.some((partner) => partner.tier === tier && drawn(partner)));
  if (tiers.length === 0) return null;
  return (
    <section className="rr-pp-roster" aria-label="Partners">
      {tiers.map((tier, index) => {
        const ground: Ground = (gold + index) % 2 === 0 ? 'paper' : 'navy';
        const logos = partners.flatMap((partner) => {
          const mark = partner.tier === tier ? markOn(partner, ground) : null;
          return mark ? [{ partner, mark, width: rosterWidth(mark, tier as Exclude<PartnerTier, 'gold'>, partner.band_scale / 100) }] : [];
        });
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
                    <Logo partner={partner} mark={mark} width={width} />
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
