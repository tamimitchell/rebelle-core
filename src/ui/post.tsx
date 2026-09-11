import * as React from 'react';
import { PostPayloadSchema, type PostPayload } from '../schemas.ts';
import { StoryPart, type StoryMedia } from './story.tsx';

/** Article metadata around the same catalog renderer. Legacy body is literal. */
export function PostView({ post, media = {} }: { post: PostPayload; media?: StoryMedia }) {
  const parsed = PostPayloadSchema.parse(post);
  return <article className="rr-story">
    <header className="rr-story__head">
      <h1 className="rr-story__headline">{parsed.headline}</h1>
      <p className="rr-story__standfirst">{parsed.dek}</p>
      <p className="rr-story__as-of"><time dateTime={parsed.published_at ?? parsed.date}>{parsed.date}</time></p>
    </header>
    {parsed.telling ? parsed.telling.map((part, index) => <StoryPart key={index} part={part} media={media} />)
      : parsed.body && <p className="rr-story__paragraph">{parsed.body}</p>}
  </article>;
}
