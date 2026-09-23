import * as React from 'react';

export type HostedVideoMedia = {
  source: string;
  poster?: string;
  captions?: { source: string; language: string; label: string };
  aspectRatio?: string;
};

/** The browser supplies playback; Media Chrome supplies the shared controls. */
export function HostedVideoPlayer({ media, title, autoPlay = false }: {
  media: HostedVideoMedia; title: string; autoPlay?: boolean;
}) {
  const [unavailable, setUnavailable] = React.useState(false);
  React.useEffect(() => setUnavailable(false), [media.source]);
  const video = React.createElement('video', {
    slot: 'media', src: media.source, poster: media.poster,
    preload: 'metadata', playsInline: true, autoPlay, 'aria-label': title,
    onError: () => setUnavailable(true),
  }, media.captions && React.createElement('track', {
    kind: 'captions', src: media.captions.source, srcLang: media.captions.language,
    label: media.captions.label, default: true,
  }));
  const controls = React.createElement('media-control-bar', null,
    React.createElement('media-play-button', { 'aria-label': 'Play or pause' }),
    React.createElement('media-mute-button', { 'aria-label': 'Mute or unmute' }),
    React.createElement('media-time-range', { 'aria-label': 'Seek' }),
    React.createElement('media-time-display', { showDuration: true }),
    media.captions && React.createElement('media-captions-button', { 'aria-label': 'Captions' }),
    React.createElement('media-fullscreen-button', { 'aria-label': 'Full screen' }),
  );
  if (unavailable) return <p className="rr-hosted-player__unavailable" role="status">Video unavailable. Please try again later.</p>;
  return <div className="rr-hosted-player">
    {React.createElement('media-controller', {
      className: 'rr-hosted-player__controller', style: { aspectRatio: media.aspectRatio ?? '16 / 9' },
      'aria-label': title,
    }, video, controls)}
    <a className="rr-hosted-player__file" href={media.source}>Open video file</a>
  </div>;
}
