import * as React from 'react';
import { bandRows, type BandSettings, type Partner } from '../partners.ts';

export interface PartnersBandHead {
  kicker?: string;
  lineA: string;
  /** The second line, set in cyan. */
  lineB?: string;
}

export interface PartnersBandPhoto {
  src: string;
  srcSet?: string;
  alt: string;
}

/**
 * Home's partners band, as the site and the studio's preview both draw it:
 * the photograph, the section's head and its link, and every partner on one
 * Field Glass panel, a row a level. Each mark carries `data-partner` with the
 * partner's key so an editor can find it; the band edits nothing itself.
 * Without partners the band keeps its head and link, and no panel. `band`
 * carries the feed's settings: color or white, and each level's size.
 */
export function PartnersBand({
  partners,
  head,
  link,
  photo,
  band,
  fallbackHref = '/partners',
  headingId = 'partners-title',
}: {
  partners: readonly Partner[];
  head: PartnersBandHead;
  link?: { href: string; label: string };
  photo?: PartnersBandPhoto;
  band?: BandSettings;
  fallbackHref?: string;
  headingId?: string;
}) {
  const rows = bandRows(partners, { fallbackHref, band });
  return (
    <section className="photo-ground rr-partners" aria-labelledby={headingId}>
      {photo && <img src={photo.src} srcSet={photo.srcSet} sizes="100vw" alt={photo.alt} loading="lazy" decoding="async" />}
      <span className="scrim rr-partners__scrim" aria-hidden="true" />
      <div className="rr-partners__inner">
        <div className="rr-partners__head">
          <div className="rr-sechead rr-partners__sechead">
            {head.kicker && <span className="k">{head.kicker}</span>}
            <h2 id={headingId}>
              {head.lineA}
              {head.lineB && <em>{head.lineB}</em>}
            </h2>
          </div>
          {link && (
            <a className="rr-link rr-partners__link" href={link.href}>
              <span>{link.label}</span>
              <span>→</span>
            </a>
          )}
        </div>
        {rows.length > 0 && (
          <div className="fgi rr-partners__glass">
            {rows.map((row) => (
              <ul
                key={row.tier}
                className={`rr-partners__row rr-partners__row--${row.tier}`}
                style={{ '--cols-wide': row.columns.wide, '--cols-mid': row.columns.mid, '--cols-narrow': row.columns.narrow, '--cell': `${row.cell}px` } as React.CSSProperties}
              >
                {row.logos.map((logo) => (
                  <li key={logo.key}>
                    <a className="rr-partners__mark" href={logo.href} data-partner={logo.key}>
                      <img src={logo.src} alt={logo.name} width={logo.width} height={logo.height} loading="lazy" decoding="async" />
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
