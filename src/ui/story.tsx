import { asOfLabel, type Story, type StoryComponent } from '../story.ts';

type StandingsContent = Extract<StoryComponent, { component: 'Standings' }>['content'];

/**
 * The story renderer — trusted code, worn by every surface that shows a story:
 * the site's slot and the studio's review pages today, an MCP App and the
 * newsletter next. It draws the frame (headline, standfirst, the as-of line)
 * and then the telling in order. It inherits its colour from whatever ground
 * the host stands it on and sets only type and spacing, because the host owns
 * position and layout (studio #275 Decided 1). Styles live in `story.css`.
 */
export function StoryView({ story }: { story: Story }) {
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
        <StoryPart key={index} part={part} />
      ))}
    </article>
  );
}

function StoryPart({ part }: { part: StoryComponent }) {
  switch (part.component) {
    case 'Paragraph':
      return <p className="rr-story__paragraph">{part.content.text}</p>;
    case 'Standings':
      return <Standings content={part.content} />;
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
