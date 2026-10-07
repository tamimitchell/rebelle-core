import * as React from 'react';
import { DispatchPayloadSchema, type DispatchPayload, type DispatchPanel, type DispatchRecord } from '../dispatch.ts';
import { SponsorLockup, sponsorWords, type SponsorChip } from './sponsor-lockup.tsx';
export { SponsorLockup, brandClass, sponsorBrandClass, sponsorWords, type SponsorChip } from './sponsor-lockup.tsx';

type Photo = NonNullable<DispatchPayload['photos']>[number];
/** A photograph's copies at other widths, as the `<img>` attributes a browser picks one by. */
export type PhotoSources = { srcSet: string; sizes: string };
export type DispatchViewProps = {
  dispatch: DispatchPayload; timeLabel?: string; panelLabels?: Partial<Record<DispatchPanel, string>>;
  onViewPanel?: (panel: DispatchPanel) => void; onFilterTeam?: (team: string) => void;
  onOpenPhoto?: (photo: Photo) => void; onOpenMoment?: (id: string) => void; onOpenStory?: (id: string) => void;
  /** A reader can open its media pane and keep the trigger for return focus. */
  onOpenVideo?: (video: NonNullable<DispatchPayload['video']>, trigger: HTMLButtonElement) => void;
  /** A preview host can resolve authenticated bytes or return null. Never stored. */
  photoUrl?: (photo: Photo) => string | null | undefined;
  /** A host that serves a photograph at several widths lists them; the photo's own address stays the fallback `src`. */
  photoSources?: (photo: Photo) => PhotoSources | null | undefined;
  /**
   * A host holding the sponsor roster names the chip and says which lockup it
   * wears; without one, the key draws the lockup it names or its own words.
   */
  sponsorFor?: (key: string) => SponsorChip | null | undefined;
  /** Where the host serves a hosted clip's still; without one the row shows no picture. */
  videoPoster?: (video: NonNullable<DispatchPayload['video']>) => string | null | undefined;
  /** A host with team pages names where a team's chip leads, and its crew; without one, the chip filters. */
  teamFor?: (team: string) => TeamLink | null | undefined;
};
/** A team's page and the surnames its chip carries. */
export type TeamLink = { href: string; crew?: string | null };
function sourceChipClass(source: DispatchRecord['payload']['source']): string {
  // hq = live cyan, media = warm dune, fans = gain green; sponsor stays
  // neutral ON PURPOSE — the brand lockup beside it carries the color
  // (2026-08-30 round). Teams are neutral number chips.
  if (source === 'hq') return 'rr-chip rr-chip--live';
  if (source === 'media') return 'rr-chip live-chip--warm';
  if (source === 'fans') return 'rr-chip rr-chip--gain';
  return 'rr-chip rr-chip--neutral';
}


/** Transcribed excerpts arrive bare and typed ones often carry their own marks; draw one pair either way. */
function quoted(text: string): string {
  return /^["“‘']/.test(text) ? text : `“${text}”`;
}

/** Where a post's link goes, said plainly: the place, the show, the sponsor, the day's update. */
export function linkLabel(link: string, payload: DispatchPayload, sponsor: SponsorChip | null): string {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return 'OPEN THE LINK';
  }
  const host = url.hostname.replace(/^www\./, '');
  if (payload.source === 'sponsor' && sponsor) return `VISIT ${(sponsor.name ?? sponsor.key).toUpperCase()}`;
  if (/(^|\.)(youtube\.com|youtu\.be)$/.test(host)) return url.searchParams.has('t') ? 'WATCH THIS MOMENT ON THE BROADCAST' : 'WATCH THE SHOW';
  if (host.endsWith('instagram.com')) return 'SEE IT ON INSTAGRAM';
  const fieldUpdate = `READ THE ${payload.day === 0 ? 'PROLOGUE' : `DAY ${payload.day}`} FIELD UPDATE`;
  if (host === 'mailchi.mp') return fieldUpdate;
  // The site answers at its own name and at its stand-in.
  if (host.endsWith('rebellerally.com') || host === 'rebelle.elementalsugar.com') {
    return url.pathname.includes('field-update') ? fieldUpdate : 'READ THE FULL STORY';
  }
  return `READ MORE ON ${host.toUpperCase()}`;
}

/** A clip's length as a clock: 0:16, 12:05, 1:11:55. */
export function clipLength(seconds: number): string {
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = String(seconds % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

type Video = NonNullable<DispatchPayload['video']>;
/** What kind of clip it is, from what its title says: YouTube's own, or the studio's for a hosted one. */
export function clipKind(video: Video): 'SHORT' | 'LIVE SHOW' | 'STORY' | 'VIDEO' {
  if (video.provider === 'hosted') return /^instagram story\b/i.test(video.title) ? 'STORY' : 'VIDEO';
  if (/#shorts\b/i.test(video.title) || (video.duration != null && video.duration <= 60)) return 'SHORT';
  return /\bLIVE\b/.test(video.title) ? 'LIVE SHOW' : 'VIDEO';
}

/** A YouTube title without the hashtags the channel trails it with. */
function clipTitle(title: string): string {
  return title.replace(/(\s*#[\w-]+)+\s*$/, '').trim() || title;
}

/** The same clip on the platform it was posted to: a clip post plays it here instead. */
const isClipCopy = (link: string) => {
  try { return /(^|\.)(youtube\.com|youtu\.be|instagram\.com)$/.test(new URL(link).hostname); } catch { return false; }
};

/** ↗ leaves the page; a panel arrow points where the panel opens, which the host may turn; → goes elsewhere on it.
 * Drawn, not typed: a font's arrow glyph sits on the baseline, below the middle of a capital. */
const arrow = (d: string, panel = false) => (
  <svg className={panel ? 'live-entry__arrow live-entry__arrow--panel' : 'live-entry__arrow'} viewBox="0 0 16 16" aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const LEAVES = arrow('M4.5 11.5l7-7M6 4.5h5.5V10');
const OPENS = arrow('M3 8h10M9 4l4 4-4 4', true);
const GOES = arrow('M3 8h10M9 4l4 4-4 4');

export function DispatchView({ dispatch, timeLabel, panelLabels = {}, onViewPanel, onFilterTeam, onOpenPhoto, onOpenMoment, onOpenStory, onOpenVideo, photoUrl, photoSources, sponsorFor, videoPoster, teamFor }: DispatchViewProps) {
  const payload = DispatchPayloadSchema.parse(dispatch);
  const photos = payload.photos ?? [];
  const credits = [...new Set(photos.map((p) => p.credit))].join(' / ');
  const isQuote = payload.kind === 'quote';
  const stats = payload.stats;
  const hasWidget = stats != null && stats.pairs.length > 0;
  const sponsor: SponsorChip | null = payload.sponsor ? (sponsorFor?.(payload.sponsor) ?? { key: payload.sponsor }) : null;
  // Every sponsor's dispatch is a partner highlight: its photograph on top, then the partner named
  // as the field updates name them, on a plain card (site Decided #231).
  const partner = payload.source === 'sponsor' && sponsor !== null;
  // A quote is its own band on a fresh navy ground, unless a partner card already frames it.
  const band = isQuote && !partner;
  // A clip is one row that plays in the host's media pane: it carries its own way in, so the
  // header's panel link and a link to the same clip on YouTube or Instagram go (site Decided #226, #227).
  // A hosted clip's title is the studio's shelf name, so its row reads the post's words instead.
  const clip = payload.video;
  const clipWords = clip?.provider === 'hosted' ? payload.text : clip ? clipTitle(clip.title) : null;
  const sameAsClip = clip != null && (clip.provider === 'hosted' || payload.text.trim() === clip.title.trim());
  // A quote names its speaker's team on the speaker line, so a team with a page leaves the tag row (site Decided #230).
  const teams = (payload.teams ?? []).map((team) => ({ team, link: teamFor?.(team) ?? null }));
  const spoken = isQuote ? teams.filter((t) => t.link) : [];
  const tagged = isQuote ? teams.filter((t) => !t.link) : teams;
  const speaker = spoken.length > 0 ? payload.attribution?.replace(/,?\s*#\d+$/, '') : payload.attribution;

  const photoRow = (
    <div className="live-entry__photos">
      {photos.map((photo) => (
        <button
          key={photo.url}
          type="button"
          className="live-entry__photo"
          disabled={!onOpenPhoto} onClick={() => onOpenPhoto?.(photo)}
          aria-label={`Open photo — ${photo.credit}`}
        >
          <DispatchPhoto photo={photo} url={photoUrl ? photoUrl(photo) : photo.url} sources={photoSources?.(photo)} />
        </button>
      ))}
    </div>
  );

  return (
    <React.Fragment><article className={`live-entry${band ? ' live-entry--quote navy-flat' : ''}${partner ? ' live-entry--partner' : ''}`}>
      {partner && !hasWidget && photos.length > 0 && photoRow}
      <header className="live-entry__meta">
        {!partner && <span className={sourceChipClass(payload.source)}>{payload.source.toUpperCase()}</span>}
        {sponsor && !partner && <SponsorLockup sponsor={sponsor} />}
        <time className="live-entry__time" dateTime={payload.posted_at}>
          {timeLabel ?? payload.posted_at}
        </time>
        {payload.panel && !clip && (
          <button
            type="button"
            className="live-entry__panel-link"
            disabled={!onViewPanel}
            onClick={() => onViewPanel?.(payload.panel as DispatchPanel)}
          >
            SEE {panelLabels[payload.panel] ?? payload.panel.toUpperCase()} {OPENS}
          </button>
        )}
      </header>
      {partner && <h3 className="live-entry__highlight">Partner highlight<span>{sponsor.name ?? sponsorWords(sponsor.key)}</span></h3>}

      {isQuote
        ? <figure className="rr-quote on-dark live-entry__quote">
            <span className="rr-star live-entry__star" aria-hidden="true"></span>
            <blockquote>{quoted(payload.text)}</blockquote>
            {(speaker || spoken.length > 0) && <cite>
              {speaker && <span className="live-entry__speaker">{speaker}</span>}
              {spoken.map(({ team, link }) => (
                <a key={team} className="live-entry__speaker-team" href={link!.href} target="_blank" rel="noopener noreferrer"
                  aria-label={`Team ${team}${link!.crew ? `, ${link!.crew}` : ''}: team page, opens in a new tab`}>
                  Team #{team} {LEAVES}
                </a>
              ))}
            </cite>}
          </figure>
        : !sameAsClip && <p className="live-entry__text">{payload.text}</p>}
      {clip && <ClipRow video={clip} title={clipWords ?? ''} poster={clip.provider === 'hosted' ? videoPoster?.(clip) : null} onOpenVideo={onOpenVideo} />}
      {payload.moments && payload.moments.length > 0 && <ol className="live-entry__moments">{payload.moments.map((moment, index) => <li key={index}>
        {onOpenMoment ? <button type="button" className="live-entry__link" onClick={() => onOpenMoment(moment.dispatch_id)}>{moment.label} {GOES}</button> : <span>{moment.label}</span>}
      </li>)}</ol>}
      {payload.story && <button type="button" className="live-entry__link" disabled={!onOpenStory} onClick={() => onOpenStory?.(payload.story!)}>OPEN · THE STORY {GOES}</button>}

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
              <DispatchPhoto photo={photos[0]} url={photoUrl ? photoUrl(photos[0]) : photos[0].url} sources={photoSources?.(photos[0])} />
            </button>
          )}
        </div>
      )}

      {!hasWidget && photos.length > 0 && (
        <>
          {/* Real <img loading="lazy">, not CSS backgrounds — a background
              can't defer, and the feed's photos are the heaviest thing this
              page ships (Heron, PR round). */}
          {!partner && photoRow}
          <p className="live-entry__caption">
            {payload.source === 'fans' && <span className="live-entry__media">FAN REPOST</span>}
            <span className="live-entry__credit">Photo · {credits}</span>
          </p>
        </>
      )}

      {payload.link && !(clip && isClipCopy(payload.link)) && (
        <a className="live-entry__link" href={payload.link} target="_blank" rel="noopener noreferrer">
          {linkLabel(payload.link, payload, sponsor)} {LEAVES}
        </a>
      )}

      {tagged.length > 0 && (
        <div className="live-entry__teams">
          {tagged.map(({ team, link }) => {
            // A team with a page is a link to it, in a new tab so the feed keeps its place (site Decided #229).
            return link
              ? <a key={team} className="live-entry__team" href={link.href} target="_blank" rel="noopener noreferrer"
                  aria-label={`Team ${team}${link.crew ? `, ${link.crew}` : ''}: team page, opens in a new tab`}>
                  <span className="live-entry__team-number">Team #{team}</span>
                  {link.crew && <span className="live-entry__team-crew">{link.crew}</span>}
                  {LEAVES}
                </a>
              : <button key={team} type="button" className="rr-chip rr-chip--neutral live-entry__team-chip"
                  disabled={!onFilterTeam} onClick={() => onFilterTeam?.(team)}>
                  #{team}
                </button>;
          })}
        </div>
      )}
    </article></React.Fragment>
  );
}

/**
 * The still, the kind and length, the title and WATCH, as one control: a reader plays it in its
 * media pane; a host without one links a YouTube clip out and leaves a hosted one still. The
 * still keeps the clip's shape: a Short is tall, and a hosted still is tall when its picture is.
 */
function ClipRow({ video, title, poster, onOpenVideo }: { video: Video; title: string; poster?: string | null; onOpenVideo?: DispatchViewProps['onOpenVideo'] }) {
  const kind = clipKind(video);
  const [tall, setTall] = React.useState(false);
  const [missing, setMissing] = React.useState(false);
  const image = React.useRef<HTMLImageElement>(null);
  const measure = (img: HTMLImageElement) => setTall(img.naturalHeight > img.naturalWidth);
  // A still that finished loading before the page hydrated fired its load unheard.
  React.useEffect(() => { if (image.current?.complete && image.current.naturalWidth) measure(image.current); }, []);
  const portrait = kind === 'SHORT' || tall;
  const still = video.provider === 'youtube' && video.video_id ? `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg` : poster;
  const meta = [kind, video.duration ? clipLength(video.duration) : null, video.video_id ? null : 'Coming soon'].filter(Boolean).join(' · ');
  const youtube = video.provider === 'youtube' && video.video_id && !onOpenVideo;
  const body = <React.Fragment>
    <span className="live-clip__still">
      {video.video_id && still && !missing && <img ref={image} src={still} alt="" loading="lazy" decoding="async" onLoad={(event) => measure(event.currentTarget)} onError={() => setMissing(true)} />}
      {video.video_id && <span className="live-clip__play" aria-hidden="true" />}
    </span>
    <span className="live-clip__words">
      <span className="live-clip__meta">{meta}</span>
      <span className="live-clip__title">{title}</span>
      {video.video_id && onOpenVideo && <span className="live-entry__link live-clip__watch">Watch {OPENS}</span>}
      {youtube && <span className="live-entry__link live-clip__watch">Watch on YouTube {LEAVES}</span>}
    </span>
  </React.Fragment>;
  const className = `live-clip${portrait ? ' live-clip--portrait' : ''}`;
  if (video.video_id && onOpenVideo) return <button type="button" className={className} onClick={(event) => onOpenVideo(video, event.currentTarget)}>{body}</button>;
  if (youtube) return <a className={className} href={`https://www.youtube.com/watch?v=${video.video_id}`} target="_blank" rel="noopener noreferrer">{body}</a>;
  return <div className={className}>{body}</div>;
}

/** A failed fetch must retain the credit, not leave a broken image icon. */
function DispatchPhoto({ photo, url, sources }: { photo: Photo; url: string | null | undefined; sources?: PhotoSources | null }) {
  const [failed, setFailed] = React.useState<string | null>(null);
  const [tall, setTall] = React.useState(false);
  const image = React.useRef<HTMLImageElement>(null);
  const measure = (img: HTMLImageElement) => setTall(img.naturalHeight > img.naturalWidth);
  // A photograph that finished loading before the page hydrated fired its load unheard.
  React.useEffect(() => { if (image.current?.complete && image.current.naturalWidth) measure(image.current); }, []);
  return <React.Fragment>{url && failed !== url
    ? <img ref={image} className={tall ? 'live-entry__photo-tall' : undefined} srcSet={sources?.srcSet} sizes={sources?.sizes} src={url} alt="" loading="lazy" decoding="async"
        onLoad={(event) => measure(event.currentTarget)} onError={() => setFailed(url)} />
    : <span className="live-entry__missing">Photograph unavailable · {photo.credit}</span>}
  </React.Fragment>;
}
