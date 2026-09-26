/**
 * The checkpoints, told in five steps: the day's CP Guide, what a green, a blue and a black diamond
 * are worth and how each is marked, and the route a team chooses. Plain data and arithmetic with no
 * framework, like black-diamond.ts, so the site's interactive and the explainer clips read one source.
 *
 * The kinds are the 2026 Competition Handbook's (V.2026-0, PDF pp. 10–11 and 43). Every
 * checkpoint carries its own points, so a kind's step shows its typical value (see TYPICAL). The day
 * is invented, on the black diamond's hills, and its third checkpoint is that black diamond.
 */
import { PLACE, destination, zoomFor, type LngLat } from './black-diamond.ts';
import type { Camera } from './camera.ts';

export type Kind = 'green' | 'blue' | 'black';

/** The value each kind carried most often in 2025's CP Guides: 20 on 24 of 55 greens, 10 on 48 of 106 blues, 5 on 74 of 169 blacks. */
export const TYPICAL: Record<Kind, number> = { green: 20, blue: 10, black: 5 };

export type Checkpoint = { n: number; kind: Kind; at: LngLat };

/** The day's checkpoints in the order a team collects them. */
export const CHECKPOINTS: readonly Checkpoint[] = [
  { n: 1, kind: 'green', at: destination(PLACE, 232, 2300) },
  { n: 2, kind: 'blue', at: destination(PLACE, 262, 1150) },
  { n: 3, kind: 'black', at: PLACE },
  { n: 4, kind: 'blue', at: destination(PLACE, 48, 1100) },
  { n: 5, kind: 'green', at: destination(PLACE, 30, 2400) },
];

/** The route the last step draws: every green, which a team must collect (Handbook p. 11), and two of the three it may choose. */
export const ROUTE: readonly number[] = [1, 2, 3, 5];

const numbered = (n: number) => CHECKPOINTS.find((c) => c.n === n)!;

// ── The steps ─────────────────────────────────────────────────────────────────────────────────

export type Step = {
  key: string;
  /** The step's button. */
  name: string;
  /** Over the value when its number is typical, not fixed. */
  note?: string;
  value: string;
  line: string;
  tone: 'white' | 'cyan';
  /** The checkpoint the camera holds, by number; null for the whole day. */
  focus: number | null;
  /** How many metres from its centre the view holds. */
  reach: number;
  pitch: number;
  bearing: number;
  /** The black diamond's bands, and the route. */
  black: number;
  route: number;
};

const WHOLE_DAY = 3000;
const AROUND = 'Typically around';

export const STEPS: readonly Step[] = [
  { key: 'guide', name: 'CP Guide', value: 'CP Guide', line: 'Coordinates and points', tone: 'white', focus: null, reach: WHOLE_DAY, pitch: 38, bearing: 10, black: 0, route: 0 },
  { key: 'green', name: 'Green', note: AROUND, value: `${TYPICAL.green} points`, line: 'Green flag · required', tone: 'cyan', focus: 1, reach: 230, pitch: 52, bearing: -15, black: 0, route: 0 },
  { key: 'blue', name: 'Blue', note: AROUND, value: `${TYPICAL.blue} points`, line: 'Blue flag or pole', tone: 'cyan', focus: 2, reach: 230, pitch: 52, bearing: 15, black: 0, route: 0 },
  { key: 'black', name: 'Black diamond', note: AROUND, value: `${TYPICAL.black} points`, line: 'Black diamond · no flag', tone: 'cyan', focus: 3, reach: 190, pitch: 48, bearing: 35, black: 1, route: 0 },
  { key: 'route', name: 'Your route', value: 'Your route', line: 'Every green · any blue or black', tone: 'white', focus: null, reach: WHOLE_DAY, pitch: 38, bearing: 25, black: 0, route: 1 },
];

export type Scene = Pick<Step, 'black' | 'route'>;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** The picture `t` of the way from one scene to another. */
export const mixScene = (a: Scene, b: Scene, t: number): Scene => ({ black: mix(a.black, b.black, t), route: mix(a.route, b.route, t) });

const DAY: LngLat = [
  CHECKPOINTS.reduce((sum, c) => sum + c.at[0], 0) / CHECKPOINTS.length,
  CHECKPOINTS.reduce((sum, c) => sum + c.at[1], 0) / CHECKPOINTS.length,
];

/** The camera that holds step `i` with its reach filling `fit` pixels. */
export const stepCamera = (i: number, fit: number): Camera => {
  const s = STEPS[i];
  const at = s.focus === null ? DAY : numbered(s.focus).at;
  return { center: at, zoom: zoomFor(s.reach, fit, at[1]), pitch: s.pitch, bearing: s.bearing };
};

/** Before the first step the camera comes in over the hills from 9 km out, in 2.6 s. */
export const INTRO = { seconds: 2.6, metres: 9000, heading: 205, zoom: 10.6, pitch: 30, bearing: -35 } as const;
export const introCamera = (): Camera => ({ center: destination(DAY, INTRO.heading, INTRO.metres), zoom: INTRO.zoom, pitch: INTRO.pitch, bearing: INTRO.bearing });

// ── On a map ──────────────────────────────────────────────────────────────────────────────────

/** Mapbox paints need colour values: the route is `--navy`. */
export const ROUTE_COLOUR = '#0D213D';

/** The parts of a Mapbox map the route uses, so this module needs no mapbox-gl import. */
export type CheckpointsMap = {
  addSource(id: string, source: { type: 'geojson'; data: unknown }): unknown;
  addLayer(layer: { id: string; type: 'line'; source: string; paint: Record<string, unknown> }): unknown;
  setPaintProperty(layer: string, name: string, value: unknown): unknown;
};

/** Add the route, transparent until `setRoute` says otherwise. The black diamond's bands are black-diamond.ts's `addRings`. */
export const addRoute = (map: CheckpointsMap) => {
  const coordinates = ROUTE.map((n) => numbered(n).at);
  map.addSource('cp-route', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } } });
  map.addLayer({ id: 'cp-route', type: 'line', source: 'cp-route', paint: { 'line-color': ROUTE_COLOUR, 'line-width': 4, 'line-opacity': 0, 'line-emissive-strength': 1 } });
};

export const setRoute = (map: CheckpointsMap, shown: number) => {
  map.setPaintProperty('cp-route', 'line-opacity', 0.85 * shown);
};
