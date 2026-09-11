import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

/** The stored dialect. Editor adapters consume this tree, never their own parser. */
export const PROSE_HEADINGS = [3, 4] as const;
export const PROSE_RULES = ['paragraph', 'heading', 'list', 'reference', 'text', 'newline', 'escape', 'entity', 'emphasis', 'link'] as const;
export type Inline = { type: 'text'; text: string } | { type: 'break' } |
  { type: 'strong' | 'emphasis'; children: Inline[] } |
  { type: 'link'; href: string; title?: string; children: Inline[] };
export type ProseBlock = { type: 'paragraph'; children: Inline[] } |
  { type: 'heading'; level: 3 | 4; children: Inline[] } |
  { type: 'list'; ordered: boolean; start: number; items: ProseBlock[][] };
export type ProseDocument = ProseBlock[];

/** Absolute web and email addresses only; no credentials, controls or relative URLs. */
export function proseLinkAllowed(value: string): boolean {
  if (/[\s\u0000-\u001f\u007f\\]/u.test(value)) return false;
  if (/^mailto:[^@?]+@[^@?]+(?:\?[^#]*)?$/i.test(value)) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

/** A fresh parser prevents an editor or host from mutating another host's rules. */
export function createProseParser(onInvalidLink?: (href: string) => void): MarkdownIt {
  const options = { html: false, breaks: false, linkify: false, typographer: false, maxNesting: 100 };
  const parser = new MarkdownIt('zero', options);
  parser.enable([...PROSE_RULES]);
  parser.validateLink = (href) => {
    const allowed = proseLinkAllowed(href);
    if (!allowed) onInvalidLink?.(href);
    return allowed;
  };
  return parser;
}

function inlines(tokens: Token[]): Inline[] {
  let at = 0;
  function read(close?: string): Inline[] {
    const result: Inline[] = [];
    const append = (text: string) => {
      const previous = result[result.length - 1];
      if (previous?.type === 'text') previous.text += text;
      else if (text) result.push({ type: 'text', text });
    };
    while (at < tokens.length) {
      const token = tokens[at++];
      if (token.type === close) return result;
      switch (token.type) {
        case 'text': append(token.content); break;
        case 'softbreak': append(' '); break;
        case 'hardbreak': result.push({ type: 'break' }); break;
        case 'strong_open': result.push({ type: 'strong', children: read('strong_close') }); break;
        case 'em_open': result.push({ type: 'emphasis', children: read('em_close') }); break;
        case 'link_open': {
          const title = token.attrGet('title');
          result.push({ type: 'link', href: token.attrGet('href')!, ...(title === null ? {} : { title }), children: read('link_close') });
          break;
        }
        default: throw new Error(`Unsupported prose token: ${token.type}`);
      }
    }
    if (close) throw new Error('Unclosed prose formatting');
    return result;
  }
  return read();
}

export function parseProse(markdown: string): ProseDocument {
  const problems = new Set<string>();
  const tokens = createProseParser(() => problems.add('Links must be absolute HTTP, HTTPS or mailto addresses without credentials.')).parse(markdown, {});
  let at = 0;
  function blocks(close?: string): ProseDocument {
    const result: ProseDocument = [];
    while (at < tokens.length) {
      const token = tokens[at++];
      if (token.type === close) return result;
      if (token.type === 'paragraph_open' || token.type === 'heading_open') {
        const children = inlines(tokens[at++].children ?? []);
        at++; // The matching close token is supplied by markdown-it.
        if (token.type === 'paragraph_open') result.push({ type: 'paragraph', children });
        else {
          const level = Number(token.tag.slice(1));
          if (level !== 3 && level !== 4) problems.add('Prose headings must be H3 or H4 beneath the story headline.');
          else result.push({ type: 'heading', level, children });
        }
      } else if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
        const ordered = token.type === 'ordered_list_open';
        const end = ordered ? 'ordered_list_close' : 'bullet_list_close';
        const items: ProseBlock[][] = [];
        while (at < tokens.length && tokens[at].type !== end) {
          if (tokens[at++].type !== 'list_item_open') throw new Error('Unsupported list content');
          items.push(blocks('list_item_close'));
        }
        at++;
        result.push({ type: 'list', ordered, start: Number(token.attrGet('start') ?? 1), items });
      } else throw new Error(`Unsupported prose token: ${token.type}`);
    }
    return result;
  }
  const result = blocks();
  if (problems.size) throw new Error([...problems].join(' '));
  return result;
}

/** Escape punctuation before converting literal Paragraph text into formatted prose. */
export function escapeProseText(text: string): string {
  return text.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, '\\$&');
}

function writeInline(nodes: Inline[]): string {
  return nodes.map(node => {
    switch (node.type) {
      case 'text': return escapeProseText(node.text);
      case 'break': return '\\\n';
      case 'strong': return `**${writeInline(node.children)}**`;
      case 'emphasis': return `*${writeInline(node.children)}*`;
      case 'link': {
        if (!proseLinkAllowed(node.href)) throw new Error('Unsupported prose link');
        const href = node.href.replace(/\\/g, '\\\\').replace(/([<>])/g, '\\$1');
        const title = node.title === undefined ? '' : ` "${escapeProseText(node.title)}"`;
        return `[${writeInline(node.children)}](<${href}>${title})`;
      }
    }
  }).join('');
}

/** Canonical whitespace; semantic meaning, not the author's Markdown spelling. */
export function serializeProse(document: ProseDocument): string {
  return document.map(block => {
    switch (block.type) {
      case 'paragraph': return writeInline(block.children);
      case 'heading': {
        if (!PROSE_HEADINGS.includes(block.level)) throw new Error('Unsupported prose heading');
        return `${'#'.repeat(block.level)} ${writeInline(block.children)}`;
      }
      case 'list': return block.items.map((item, index) => {
        const marker = block.ordered ? `${block.start + index}. ` : '- ';
        const lines = serializeProse(item).split('\n');
        return marker + lines[0] + lines.slice(1).map(line => '\n' + ' '.repeat(marker.length) + line).join('');
      }).join('\n\n');
    }
  }).join('\n\n');
}
