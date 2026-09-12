import * as React from 'react';
import { DispatchPayloadSchema, type DispatchPayload, type DispatchPanel, type DispatchRecord } from '../dispatch.ts';
import { SponsorLockup, brandClass } from './sponsor-lockup.tsx';
export { SponsorLockup, brandClass } from './sponsor-lockup.tsx';

type Photo = NonNullable<DispatchPayload['photos']>[number];
export type DispatchViewProps = {
  dispatch: DispatchPayload; timeLabel?: string; panelLabels?: Partial<Record<DispatchPanel, string>>;
  onViewPanel?: (panel: DispatchPanel) => void; onFilterTeam?: (team: string) => void;
  onOpenPhoto?: (photo: Photo) => void; onOpenMoment?: (id: string) => void; onOpenStory?: (id: string) => void;
  /** A preview host can resolve authenticated bytes or return null. Never stored. */
  photoUrl?: (photo: Photo) => string | null | undefined;
};
function sourceChipClass(source: DispatchRecord['payload']['source']): string {
  // hq = live cyan, media = warm dune, fans = gain green; sponsor stays
  // neutral ON PURPOSE — the brand lockup beside it carries the color
  // (2026-08-30 round). Teams are neutral number chips.
  if (source === 'hq') return 'rr-chip rr-chip--live';
  if (source === 'media') return 'rr-chip live-chip--warm';
  if (source === 'fans') return 'rr-chip rr-chip--gain';
  return 'rr-chip rr-chip--neutral';
}

function sourceLabel(payload: DispatchRecord['payload']): string {
  if (payload.source === 'team') return `#${payload.teams?.[0] ?? '—'}`;
  return payload.source.toUpperCase();
}

function linkLabel(link: string): string {
  try {
    if (new URL(link).hostname.endsWith('instagram.com')) return 'VIEW STORY ON INSTAGRAM';
  } catch {
    /* an unparseable link still opens; it just gets the plain label */
  }
  return 'OPEN LINK';
}

export function DispatchView({ dispatch, timeLabel, panelLabels = {}, onViewPanel, onFilterTeam, onOpenPhoto, onOpenMoment, onOpenStory, photoUrl }: DispatchViewProps) {
  const payload = DispatchPayloadSchema.parse(dispatch);
  const photos = payload.photos ?? [];
  const credits = [...new Set(photos.map((p) => p.credit))].join(' / ');
  const isQuote = payload.kind === 'quote';
  const stats = payload.stats;
  const hasWidget = stats != null && stats.pairs.length > 0;
  const brand = payload.source === 'sponsor' && payload.sponsor ? brandClass(payload.sponsor) : null;

  return (
    <React.Fragment><article className={`live-entry${brand ? ` live-entry--partner ${brand}` : ''}`}>
      <header className="live-entry__meta">
        <span className={sourceChipClass(payload.source)}>{sourceLabel(payload)}</span>
        {payload.sponsor && <SponsorLockup sponsor={payload.sponsor} />}
        {brand && <span className="live-entry__partner">PARTNER</span>}
        <time className="live-entry__time" dateTime={payload.posted_at}>
          {timeLabel ?? payload.posted_at}
        </time>
        {payload.panel && (
          <button
            type="button"
            className="live-entry__panel-link"
            disabled={!onViewPanel}
            onClick={() => onViewPanel?.(payload.panel as DispatchPanel)}
          >
            VIEW · {panelLabels[payload.panel] ?? payload.panel.toUpperCase()} <span aria-hidden="true">→</span>
          </button>
        )}
      </header>

      <p className={isQuote ? 'live-entry__text live-entry__text--quote' : 'live-entry__text'}>
        {payload.text}
      </p>

      {isQuote && <p className="live-entry__attribution">— {payload.attribution}</p>}
      {payload.video && <div className="live-widget rr-card rr-card--lit live-entry__video">
        <p className="live-widget__title">{payload.video.title}</p>
        <p className="live-entry__caption">{payload.video.duration ? Math.floor(payload.video.duration / 60) + ':' + String(payload.video.duration % 60).padStart(2, '0') : 'Video'}
          {payload.video.video_id == null && ' · Coming soon'}</p>
        {payload.video.provider === 'youtube' && payload.video.video_id && <a className="live-entry__link" href={'https://www.youtube.com/watch?v=' + payload.video.video_id} target="_blank" rel="noopener noreferrer">Watch video →</a>}
        {payload.video.provider === 'hosted' && payload.video.video_id && <p className="live-entry__caption">Clip preview unavailable</p>}
      </div>}
      {payload.moments && payload.moments.length > 0 && <ol className="live-entry__moments">{payload.moments.map((moment, index) => <li key={index}>
        {onOpenMoment ? <button type="button" className="live-entry__link" onClick={() => onOpenMoment(moment.dispatch_id)}>{moment.label} →</button> : <span>{moment.label}</span>}
      </li>)}</ol>}
      {payload.story && <button type="button" className="live-entry__link" disabled={!onOpenStory} onClick={() => onOpenStory?.(payload.story!)}>OPEN · THE STORY →</button>}

      {stats && hasWidget && (
        <div className="live-widget rr-card rr-card--lit">
          <div className="live-widget__head">
            {stats.kicker && <span className="live-widget__kicker">{stats.kicker}</span>}
            <span className="live-widget__tag">WIDGET</span>
          </div>
          {stats.title && <p className="live-widget__title">{stats.title}</p>}
          <div className="live-widget__stats">
            {stats.pairs.map((stat) => (
              <div className="live-widget__stat" key={stat.label}>
                <span className="live-widget__stat-label">{stat.label}</span>
                <span className="live-widget__stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
          {photos.length > 0 && (
            <button
              type="button"
              className="live-widget__photo"
              disabled={!onOpenPhoto} onClick={() => onOpenPhoto?.(photos[0])}
              aria-label={`Open photo — ${photos[0].credit}`}
            >
              <DispatchPhoto photo={photos[0]} url={photoUrl ? photoUrl(photos[0]) : photos[0].url} />
            </button>
          )}
        </div>
      )}

      {!hasWidget && photos.length > 0 && (
        <>
          {/* Real <img loading="lazy">, not CSS backgrounds — a background
              can't defer, and the feed's photos are the heaviest thing this
              page ships (Heron, PR round). */}
          <div className="live-entry__photos">
            {photos.map((photo) => (
              <button
                key={photo.url}
                type="button"
                className="live-entry__photo"
                disabled={!onOpenPhoto} onClick={() => onOpenPhoto?.(photo)}
                aria-label={`Open photo — ${photo.credit}`}
              >
                <DispatchPhoto photo={photo} url={photoUrl ? photoUrl(photo) : photo.url} />
              </button>
            ))}
          </div>
          <p className="live-entry__caption">
            <span className="live-entry__media">{payload.source === 'fans' ? 'FAN REPOST' : 'FIELD DISPATCH'}</span>
            <span className="live-entry__credit">Photo · {credits}</span>
          </p>
        </>
      )}

      {payload.link && (
        <a className="live-entry__link" href={payload.link} target="_blank" rel="noopener noreferrer">
          {linkLabel(payload.link)} <span aria-hidden="true">→</span>
        </a>
      )}

      {(payload.teams?.length ?? 0) > 0 && (
        <div className="live-entry__teams">
          {(payload.teams ?? []).map((team) => (
            <button
              key={team}
              type="button"
              className="rr-chip rr-chip--neutral live-entry__team-chip"
              disabled={!onFilterTeam} onClick={() => onFilterTeam?.(team)}
            >
              #{team}
            </button>
          ))}
        </div>
      )}
    </article></React.Fragment>
  );
}

/** A failed fetch must retain the credit, not leave a broken image icon. */
function DispatchPhoto({ photo, url }: { photo: Photo; url: string | null | undefined }) {
  const [failed, setFailed] = React.useState<string | null>(null);
  return <React.Fragment>{url && failed !== url
    ? <img src={url} alt="" loading="lazy" decoding="async" onError={() => setFailed(url)} />
    : <span className="live-entry__missing">Photograph unavailable · {photo.credit}</span>}
  </React.Fragment>;
}
