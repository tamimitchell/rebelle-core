import * as React from 'react';
import { parseProse, type Inline, type ProseDocument } from '../prose.ts';
import { asOfLabel, filmUrls, type Story, type StoryComponent } from '../story.ts';

type StandingsContent = Extract<StoryComponent, { component: 'Standings' }>['content'];

/**
 * The story renderer — trusted code, worn by every surface that shows a story:
 * the site's slot and the studio's review pages today, an MCP App and the
 * newsletter next. It draws the frame (headline, standfirst, the as-of line)
 * and then the telling in order. It inherits its colour from whatever ground
 * the host stands it on and sets only type and spacing, because the host owns
 * position and layout (studio #275 Decided 1). Styles live in `story.css`.
 */
export type StoryMedia = { imageUrl?: (id: string, width: number) => string | undefined; embedFilms?: boolean };

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
      const { image_id, alt, caption } = part.content;
      const imageUrl = media.imageUrl ?? ((id: string, width: number) => `/images/${id}/${width}`);
      const src = imageUrl(image_id.toLowerCase(), 960);
      return <figure className="rr-story__figure">{src ? <img src={src} alt={alt} loading="lazy" /> : <p role="status">Image unavailable: {alt}</p>}{caption && <figcaption>{caption}</figcaption>}</figure>;
    }
    case 'Film': {
      const urls = filmUrls(part.content);
      return <figure className="rr-story__film">
        {media.embedFilms && <iframe src={urls.embed} title={part.content.title} loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
        <figcaption><a href={urls.watch}>{part.content.title} — watch on YouTube</a></figcaption>
      </figure>;
    }
  }
}

function Standings({ content }: { content: StandingsContent }) {
  return (
    <table className="rr-story__standings">
      {content.caption && <caption>{content.caption}</caption>}
      <thead>
        <tr>
          <th scope="col">Pos</th>
          <th scope="col">Team</th>
          <th scope="col">Points</th>
        </tr>
      </thead>
      <tbody>
        {content.rows.map((row, index) => (
          <tr key={index}>
            <td>{row.position}</td>
            <td>
              <span className="rr-story__team-number">#{row.team_number}</span> {row.name}
            </td>
            <td>{row.points.toLocaleString('en-US')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProseInline({ nodes }: { nodes: Inline[] }) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text': return node.text;
      case 'break': return <br key={index} />;
      case 'strong': return <strong key={index}><ProseInline nodes={node.children} /></strong>;
      case 'emphasis': return <em key={index}><ProseInline nodes={node.children} /></em>;
      case 'link': return <a key={index} href={node.href} title={node.title}><ProseInline nodes={node.children} /></a>;
    }
  });
}

export function ProseBlocks({ document }: { document: ProseDocument }) {
  return document.map((block, index) => {
    switch (block.type) {
      case 'paragraph': return <p key={index}><ProseInline nodes={block.children} /></p>;
      case 'heading': return React.createElement(`h${block.level}`, { key: index }, <ProseInline nodes={block.children} />);
      case 'list': {
        const items = block.items.map((item, itemIndex) => <li key={itemIndex}><ProseBlocks document={item} /></li>);
        return block.ordered ? <ol key={index} start={block.start}>{items}</ol> : <ul key={index}>{items}</ul>;
      }
    }
  });
}
