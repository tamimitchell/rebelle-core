/**
 * One reading of a stylesheet, for anything that has to know what a sheet
 * defines: the classes its selectors name and the custom properties its
 * declarations set. `scripts/build-register.ts` reads `dist/system.css`
 * through it to publish `dist/register.json`, and a consumer's lint reads its
 * own sheets through the same walker so the two never disagree about what a
 * selector is.
 *
 * A brace walker, not a CSS parser, on purpose: the question is "what stands in
 * front of each `{`", and the three things that make a naive split wrong are
 * handled once — a quoted string or a `url()` may hold a brace, an at-rule's
 * prelude is not a selector, and the steps of a `@keyframes` block (`from`,
 * `to`, `50%`) look exactly like bare element selectors and are not.
 *
 * ⚠️ Strip comments before reading. A rule commented out still holds a dot and
 * a word, so `uncommented` is public and every reader strips once.
 */

export interface Rule {
  /** The text before the `{`, trimmed: a selector list or an at-rule prelude. */
  prelude: string;
  /** The preludes of the blocks still open around this one, outermost first. */
  enclosing: string[];
  /** Offsets into the text handed in, so a caller can point at the rule as written. */
  from: number;
  to: number;
}

const COMMENT = /\/\*[\s\S]*?\*\//g;
const KEYFRAMES = /^@(?:-\w+-)?keyframes\b/i;
const STRING = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
/** A class as a selector writes one; `\.` means "class" only outside a string. */
const CLASS = /\.(-?[_a-zA-Z][\w-]*)/g;
/** A class or an id — what makes a selector reach less than the whole page. */
const SCOPE = /[.#]-?[_a-zA-Z]/;
/** `:not(.x)` is an exclusion, not a scope: `p:not(.muted)` still styles every other paragraph. */
const NEGATION = /:not\((?:[^()]|\([^()]*\))*\)/gi;
/**
 * `--x: red` defines; `var(--x)` only uses, and has no colon after the name.
 * The lookbehind keeps a modifier class out — `.rr-btn--primary:hover` is a
 * selector, not a token called `--primary`.
 */
const TOKEN = /(?<![\w-])(--[\w-]+)\s*:\s*([^;{}]+)/g;

export function uncommented(css: string): string {
  return css.replace(COMMENT, '');
}

/** Every block in the sheet, innermost first as each closing brace is reached. */
export function rules(css: string): Rule[] {
  const found: Rule[] = [];
  const open: Array<[string, number]> = [];
  let start = 0;
  let index = 0;
  while (index < css.length) {
    const char = css[index];
    if (char === '"' || char === "'") {
      index = endOfString(css, index);
    } else if (char === '(' && css.slice(Math.max(index - 3, 0), index).toLowerCase() === 'url') {
      index = endOfParenthesis(css, index);
    } else if (char === '{') {
      open.push([css.slice(start, index).trim(), start]);
      start = index + 1;
    } else if (char === '}') {
      const opened = open.pop();
      if (opened) found.push({ prelude: opened[0], enclosing: open.map(([prelude]) => prelude), from: opened[1], to: index + 1 });
      start = index + 1;
    } else if (char === ';') {
      start = index + 1;
    }
    index += 1;
  }
  return found;
}

/** A selector rule, as opposed to an at-rule or a keyframe step. */
export function isSelectorRule(rule: Rule): boolean {
  return !rule.prelude.startsWith('@') && !rule.enclosing.some((outer) => KEYFRAMES.test(outer));
}

/** The comma-separated selectors of a rule, split only on commas outside parentheses and brackets. */
export function selectorsOf(rule: Rule): string[] {
  if (!isSelectorRule(rule)) return [];
  return splitTopLevel(rule.prelude).map((selector) => selector.trim()).filter(Boolean);
}

/** Every selector in the sheet, at-rule preludes and keyframe steps left out, in document order. */
export function selectors(css: string): string[] {
  return rules(css).flatMap(selectorsOf);
}

/** The classes a selector names, `:not()` arguments included. */
export function classesIn(selector: string): string[] {
  return [...selector.replace(STRING, '').matchAll(CLASS)].map((match) => match[1]);
}

/** Every class the sheet's selectors name, each once. */
export function classes(css: string): string[] {
  return [...new Set(selectors(css).flatMap(classesIn))];
}

/**
 * A selector that carries neither a class nor an id outside a `:not()`, and so
 * matches by element, attribute or pseudo-class alone. In a scoped block that
 * reaches one component; in a global sheet it reaches everything.
 */
export function isUnscoped(selector: string): boolean {
  return !SCOPE.test(selector.replace(STRING, '').replace(NEGATION, ''));
}

/**
 * The custom properties the sheet defines, with every value each is given —
 * a token set on `:root` and again on a ground is two entries. Deliberately
 * blind to where: the question a caller asks is "does anything give this a
 * value", and "which colour is this name" needs every answer.
 */
export function tokens(css: string): Array<{ name: string; value: string }> {
  const seen = new Set<string>();
  const found: Array<{ name: string; value: string }> = [];
  for (const match of css.replace(STRING, '').matchAll(TOKEN)) {
    const entry = { name: match[1], value: match[2].trim() };
    const key = `${entry.name}=${entry.value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    found.push(entry);
  }
  return found;
}

function splitTopLevel(text: string): string[] {
  const pieces: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(' || char === '[') depth += 1;
    else if (char === ')' || char === ']') depth -= 1;
    else if (char === ',' && depth === 0) {
      pieces.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  pieces.push(current);
  return pieces;
}

function endOfString(css: string, index: number): number {
  const quote = css[index];
  index += 1;
  while (index < css.length && css[index] !== quote) {
    if (css[index] === '\\') index += 1;
    index += 1;
  }
  return index;
}

function endOfParenthesis(css: string, index: number): number {
  let depth = 0;
  while (index < css.length) {
    const char = css[index];
    if (char === '(') depth += 1;
    else if (char === ')') {
      depth -= 1;
      if (depth === 0) return index;
    } else if (char === '"' || char === "'") index = endOfString(css, index);
    index += 1;
  }
  return index;
}
