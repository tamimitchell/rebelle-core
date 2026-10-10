import * as React from 'react';
import { parseProse, type Inline, type ProseDocument } from '../prose.ts';
import { asOfLabel, durationLabel, mapFigures, placeLabel, routeFigures, videoUrls, type MapContent, type MapRoute, type Story, type StoryComponent } from '../story.ts';
import { HostedVideoPlayer, type HostedVideoMedia } from './hosted-video.tsx';
import { LAND } from './land.ts';

type StandingsContent = Extract<StoryComponent, { component: 'Standings' }>['content'];

/**
 * What the host supplies: where a photograph or a hosted video is served —
 * `undefined` from either draws the placeholder rather than a broken address —
 * and whether a YouTube player may be framed, which an MCP host cannot.
 */
export type StoryMedia = {
  imageUrl?: (id: string, width: number) => string | undefined;
  videoUrl?: (id: string) => HostedVideoMedia | undefined;
  embedVideos?: boolean;
};

/**
 * The story renderer — trusted code, worn by every surface that shows a story:
 * the site's slot and the studio's review pages today, an MCP App and the
 * newsletter next. It draws the frame (headline, standfirst, the as-of line)
 * and then the telling in order. It inherits its colour from whatever ground
 * the host stands it on and sets only type and spacing, because the host owns
 * position and layout (studio #275 Decided 1). Styles live in `story.css`.
 */
export function StoryView({ story, media = {} }: { story: Story; media?: StoryMedia }) {
  return (
    <article className="rr-story">
      <header className="rr-story__head">
        <h2 className="rr-story__headline">{story.headline}</h2>
        <p className="rr-story__standfirst">{story.summary}</p>
        <p className="rr-story__as-of">
          As of <time dateTime={story.as_of}>{asOfLabel(story.as_of)}</time>
        </p>
      </header>
      {story.telling.map((part, index) => (
        <StoryPart key={index} part={part} media={media} />
      ))}
    </article>
  );
}

export function StoryPart({ part, media = {} }: { part: StoryComponent; media?: StoryMedia }) {
  switch (part.component) {
    case 'Paragraph':
      return <p className="rr-story__paragraph">{part.content.text}</p>;
    case 'Standings':
      return <Standings content={part.content} />;
    case 'Prose':
      return <div className="rr-story__prose"><ProseBlocks document={parseProse(part.content.markdown)} /></div>;
    case 'Quote':
      return <figure className="rr-story__quote"><blockquote><p>{part.content.text}</p></blockquote><figcaption>{part.content.attribution}</figcaption></figure>;
    case 'Figure': {
      const { image_id, alt, caption, link } = part.content;
      const imageUrl = media.imageUrl ?? ((id: string, width: number) => `/images/${id}/${width}`);
      const src = imageUrl(image_id.toLowerCase(), 960);
      const image = src ? <img src={src} alt={alt} loading="lazy" /> : <p role="status">Image unavailable: {alt}</p>;
      return <figure className="rr-story__figure">{src && link ? <a href={link} target="_blank" rel="noopener noreferrer">{image}</a> : image}{caption && <figcaption>{caption}</figcaption>}</figure>;
    }
    case 'Photos': {
      // Every photograph is in the markup with its alt; the sixth onward are folded by CSS, and a host's viewer opens them.
      const { photos, caption } = part.content;
      const imageUrl = media.imageUrl ?? ((id: string, width: number) => `/images/${id}/${width}`);
      const more = photos.length - 5;
      return <figure className="rr-story__photos">
        <ul data-shown={Math.min(photos.length, 5)}>{photos.map((photo, index) => {
          const src = imageUrl(photo.image_id.toLowerCase(), index === 0 ? 960 : 480);
          return <li key={photo.image_id}>
            {src ? <img src={src} alt={photo.alt} loading="lazy" /> : <p role="status">Image unavailable: {photo.alt}</p>}
            {index === 4 && more > 0 && <span className="rr-story__more" aria-hidden="true">+{more}</span>}
          </li>;
        })}</ul>
        {caption && <figcaption>{caption}</figcaption>}
      </figure>;
    }
    case 'Video': {
      const { title, duration } = part.content;
      const urls = videoUrls(part.content);
      const length = duration === undefined ? null : <span className="rr-story__duration"> · {durationLabel(duration)}</span>;
      if (urls.provider === 'youtube') {
        return <figure className="rr-story__video">
          {media.embedVideos && <iframe src={urls.embed} title={title} loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
          <figcaption><a href={urls.watch}>{title} — watch on YouTube</a>{length}</figcaption>
        </figure>;
      }
      const hosted = media.videoUrl ? media.videoUrl(part.content.video_id.toLowerCase()) : urls;
      return <figure className="rr-story__video">
        {hosted ? <HostedVideoPlayer media={hosted} title={title} /> : <p role="status">Video unavailable</p>}
        <figcaption>{title}{length}</figcaption>
      </figure>;
    }
    case 'Map':
      return <PlacesMap content={part.content} />;
  }
}

// The world as longitude and latitude, 75°N to 60°S, where every town sits.
const LATITUDE_TOP = 75;
const LATITUDE_BOTTOM = -60;

/**
 * A still of the towns, their count in words, every town listed with its years,
 * and every route listed a day at a time. A host that can draw a live map reads
 * the lists' `data-` fields and draws over the still; one that cannot shows the
 * still and the lists (studio Decided #126: no author's code runs, and none of
 * this is code).
 */
function PlacesMap({ content }: { content: MapContent }) {
  const figures = mapFigures(content);
  const span = figures.years.length > 1 ? `${figures.years[0]}–${figures.years[figures.years.length - 1]}` : figures.years[0];
  const count = [plural(figures.towns, 'town', 'towns'), plural(figures.countries, 'country', 'countries'), span].filter(Boolean).join(' · ');
  const height = LATITUDE_TOP - LATITUDE_BOTTOM;
  return (
    <figure className="rr-story__map" data-rr-map="">
      <svg className="rr-story__map-still" viewBox={`0 ${90 - LATITUDE_TOP} 360 ${height}`} aria-hidden="true">
        <path className="rr-story__map-land" d={LAND} />
        {content.places.map((place, index) => <circle key={index} className="rr-story__map-dot" cx={round(place.longitude + 180)} cy={round(90 - place.latitude)} r={1.1} />)}
      </svg>
      <figcaption>{content.caption && <span className="rr-story__map-caption">{content.caption}</span>}<span className="rr-story__map-count">{count}</span></figcaption>
      <details className="rr-story__map-towns">
        <summary>Every town</summary>
        <ul>
          {content.places.map((place, index) => (
            <li key={index} data-latitude={place.latitude} data-longitude={place.longitude} data-years={place.years.join(' ')} data-name={place.name} data-region={place.region ?? undefined} data-country={place.country}>
              <span className="rr-story__map-town">{placeLabel(place)}</span>
              {place.years.length > 0 && <span className="rr-story__map-years"> · {place.years.join(', ')}</span>}
            </li>
          ))}
        </ul>
      </details>
      {content.routes && content.routes.length > 0 && (
        <details className="rr-story__map-routes">
          <summary>Every route</summary>
          {content.routes.map((route) => <RouteList key={route.year} route={route} />)}
        </details>
      )}
    </figure>
  );
}

/** A route, a day at a time: each day's camp by name, where it has one, with its position and the day's greens (`longitude,latitude` pairs) on the item. */
function RouteList({ route }: { route: MapRoute }) {
  const figures = routeFigures(route);
  return (
    <>
      <p className="rr-story__map-route">{`${route.year} · ${plural(figures.days, 'day', 'days')} · ${plural(figures.greens, 'green', 'greens')}`}</p>
      <ol data-route-year={route.year}>
        {route.days.map((day) => (
          <li key={day.day} data-day={day.day} data-latitude={day.camp.latitude} data-longitude={day.camp.longitude} data-greens={day.greens.map((green) => `${green.longitude},${green.latitude}`).join(' ')}>
            {day.camp.name === null ? `Day ${day.day}` : `Day ${day.day} · ${day.camp.name}`}
          </li>
        ))}
      </ol>
    </>
  );
}

const plural = (count: number, one: string, many: string) => `${count.toLocaleString('en-US')} ${count === 1 ? one : many}`;
const round = (value: number) => Math.round(value * 100) / 100;

function Standings({ content }: { content: StandingsContent }) {
  const crew = content.rows.some((row) => row.crew);
  const vehicle = content.rows.some((row) => row.vehicle);
  const share = content.rows.some((row) => row.completion !== undefined);
  return (
    <table className="rr-story__standings">
      {content.caption && <caption>{content.caption}</caption>}
      <thead>
        <tr>
          <th scope="col">Pos</th>
          <th scope="col">Team</th>
          {crew && <th scope="col">Driver / Navigator</th>}
          {vehicle && <th scope="col">Vehicle</th>}
          <th scope="col">Points</th>
          {share && <th scope="col">% Pts</th>}
        </tr>
      </thead>
      <tbody>
        {content.rows.map((row, index) => (
          <tr key={index}>
            <td>{row.position}</td>
            <td>
              <span className="rr-story__team-number">#{row.team_number}</span> {row.name}
            </td>
            {crew && <td>{row.crew}</td>}
            {vehicle && <td>{row.vehicle}</td>}
            <td>{row.points.toLocaleString('en-US')}</td>
            {share && <td>{row.completion === undefined ? '' : `${row.completion}%`}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Extra attributes for a link, by its address: a host's rule for which links open a new tab. */
type LinkProps = (href: string) => Record<string, string>;

function ProseInline({ nodes, linkProps }: { nodes: Inline[]; linkProps?: LinkProps }) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text': return node.text;
      case 'break': return <br key={index} />;
      case 'strong': return <strong key={index}><ProseInline nodes={node.children} linkProps={linkProps} /></strong>;
      case 'emphasis': return <em key={index}><ProseInline nodes={node.children} linkProps={linkProps} /></em>;
      case 'link': return <a key={index} href={node.href} title={node.title} {...linkProps?.(node.href)}><ProseInline nodes={node.children} linkProps={linkProps} /></a>;
    }
  });
}

export function ProseBlocks({ document, linkProps }: { document: ProseDocument; linkProps?: LinkProps }) {
  return document.map((block, index) => {
    switch (block.type) {
      case 'paragraph': return <p key={index}><ProseInline nodes={block.children} linkProps={linkProps} /></p>;
      case 'heading': return React.createElement(`h${block.level}`, { key: index }, <ProseInline nodes={block.children} linkProps={linkProps} />);
      case 'list': {
        const items = block.items.map((item, itemIndex) => <li key={itemIndex}><ProseBlocks document={item} linkProps={linkProps} /></li>);
        return block.ordered ? <ol key={index} start={block.start}>{items}</ol> : <ul key={index}>{items}</ul>;
      }
    }
  });
}
