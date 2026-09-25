/**
 * The black diamond, told in five steps: the rule, the words for each step, and the rings on a
 * Mapbox map at any point between the steps. Plain data and arithmetic with no framework, so the
 * site's interactive and the explainer clips (rebelle/clips) read one source.
 *
 * The numbers are the 2026 Competition Handbook's worked example (PDF p. 11), "50m Radius / 25m
 * Step / 300m Max"; each day's CP Guide sets a black diamond's own three. The place is invented, on
 * real Nevada hills over 100 km from any point of the 2026 course.
 */

export const RULE = { points: 5, radius: 50, step: 25, max: 300, penalty: 10 } as const;

/** Each scoring band's outer edge in metres, full points first. */
export const BANDS = Array.from({ length: RULE.points }, (_, i) => ({ edge: RULE.radius + i * RULE.step, points: RULE.points - i }));
export const ZERO_FROM = BANDS[BANDS.length - 1].edge;

export const scoreAt = (metres: number) =>
  metres > RULE.max
    ? { points: 0, wideMiss: true }
    : { points: Math.max(0, RULE.points - Math.ceil(Math.max(0, metres - RULE.radius) / RULE.step)), wideMiss: false };

export type Tone = 'white' | 'cyan' | 'loss';
export type Step = {
  key: string;
  value: string;
  line: string;
  tone: Tone;
  /** Where the team signals, in metres from the coordinates; null before anyone has. */
  signal: number | null;
  /** How many metres from the centre the view holds. */
  reach: number;
  bands: number;
  zero: number;
  wide: number;
};

export const STEPS: readonly Step[] = [
  { key: 'target', value: 'No flag', line: 'Only coordinates', tone: 'white', signal: null, reach: 160, bands: 0, zero: 0, wide: 0 },
  { key: 'full', value: `${RULE.points} points`, line: `Inside ${RULE.radius} m`, tone: 'cyan', signal: 32, reach: 160, bands: 1, zero: 0, wide: 0 },
  { key: 'step', value: '1 point less', line: `Every ${RULE.step} m`, tone: 'cyan', signal: 110, reach: 160, bands: 1, zero: 0, wide: 0 },
  { key: 'zero', value: '0 points', line: `${ZERO_FROM}–${RULE.max} m · no penalty`, tone: 'white', signal: 225, reach: 340, bands: 1, zero: 1, wide: 0 },
  { key: 'wide', value: 'Wide miss', line: `Over ${RULE.max} m · −${RULE.penalty} points`, tone: 'loss', signal: 345, reach: 380, bands: 1, zero: 1, wide: 1 },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** The picture at a position along the steps: 1.5 is halfway from the second step to the third. */
export const sceneAt = (at: number) => {
  const last = STEPS.length - 1;
  const i = Math.max(0, Math.min(last, Math.floor(at)));
  const j = Math.min(last, i + 1);
  const t = ease(Math.max(0, Math.min(1, at - i)));
  const a = STEPS[i];
  const b = STEPS[j];
  const from = a.signal ?? b.signal ?? 0;
  const signal = mix(from, b.signal ?? from, t);
  return {
    reach: mix(a.reach, b.reach, t),
    bands: mix(a.bands, b.bands, t),
    zero: mix(a.zero, b.zero, t),
    wide: mix(a.wide, b.wide, t),
    signal,
    signalShown: a.signal === null ? (b.signal === null ? 0 : t) : 1,
    score: scoreAt(signal),
  };
};

/** In a clip each step holds, then moves on: seconds in, position along the steps out. */
export const HOLD_S = 3.2;
export const MOVE_S = 0.7;
export const stepAtSeconds = (seconds: number) => {
  const per = HOLD_S + MOVE_S;
  const i = Math.floor(seconds / per);
  return Math.min(STEPS.length - 1, i + Math.max(0, (seconds - i * per - HOLD_S) / MOVE_S));
};
export const STEPS_SECONDS = STEPS.length * (HOLD_S + MOVE_S) - MOVE_S + 0.8;

// ── On a map ──────────────────────────────────────────────────────────────────────────────────

export type LngLat = [number, number];
type Polygon = { type: 'Polygon'; coordinates: LngLat[][] };

export const PLACE: LngLat = [-116.9233, 38.3067];
/** The team's signal leaves the centre on this compass bearing. */
export const SIGNAL_BEARING = 58;

const EARTH_M = 6371008.8;
/** A point `metres` from `from` on a compass `bearing`. */
export const destination = (from: LngLat, bearing: number, metres: number): LngLat => {
  const p1 = (from[1] * Math.PI) / 180;
  const l1 = (from[0] * Math.PI) / 180;
  const t = (bearing * Math.PI) / 180;
  const d = metres / EARTH_M;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(t));
  const l2 = l1 + Math.atan2(Math.sin(t) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [(l2 * 180) / Math.PI, (p2 * 180) / Math.PI];
};

/** The camera for a position along the steps: how far it holds, how steep it looks, where it faces. */
export const cameraAt = (at: number) => ({ reach: sceneAt(at).reach, pitch: 56 - Math.max(0, at - 2) * 5, bearing: 18 + at * 9 });
/** The zoom at which `reach` metres fill `pixels` on screen at this latitude (Mapbox's 512 px tiles). */
export const zoomFor = (reach: number, pixels: number, lat: number) => Math.log2((78271.517 * Math.cos((lat * Math.PI) / 180) * pixels) / reach);

/** Mapbox paints need colour values, not custom properties: these are `--cyan`, `--navy`, `--white`, `--desert-sand` and `--loss`. */
export const RING_COLOURS = { band: '#189FDA', core: '#0D213D', coreLine: '#FFFFFF', zero: '#EDE5D6', loss: '#C9262C' };

/** The parts of a Mapbox map the rings use, so this module needs no mapbox-gl import. */
export type RingsMap = {
  addSource(id: string, source: { type: 'geojson'; data: unknown }): unknown;
  addLayer(layer: { id: string; type: 'fill' | 'line'; source: string; paint: Record<string, unknown> }): unknown;
  getSource(id: string): unknown;
  setPaintProperty(layer: string, name: string, value: unknown): unknown;
};

const loop = (centre: LngLat, metres: number) => Array.from({ length: 97 }, (_, i) => destination(centre, i * 3.75, Math.max(0.01, metres)));
const disc = (centre: LngLat, metres: number): Polygon => ({ type: 'Polygon', coordinates: [loop(centre, metres)] });
const annulus = (centre: LngLat, inner: number, outer: number): Polygon => ({ type: 'Polygon', coordinates: [loop(centre, outer), loop(centre, inner).reverse()] });
const feature = (geometry: Polygon) => ({ type: 'Feature' as const, properties: {}, geometry });
const glow = { 'line-emissive-strength': 1 };
const lit = { 'fill-emissive-strength': 1 };

/** Add the rings' sources and layers, all transparent until `setRings` says otherwise. */
export const addRings = (map: RingsMap, centre: LngLat = PLACE, colours = RING_COLOURS) => {
  const empty = feature(disc(centre, 0.01));
  map.addSource('bd-zero', { type: 'geojson', data: empty });
  map.addSource('bd-max', { type: 'geojson', data: empty });
  map.addLayer({ id: 'bd-zero-fill', type: 'fill', source: 'bd-zero', paint: { 'fill-color': colours.zero, 'fill-opacity': 0, ...lit } });
  map.addLayer({ id: 'bd-max-line', type: 'line', source: 'bd-max', paint: { 'line-color': colours.coreLine, 'line-width': 3, 'line-dasharray': [3, 3], 'line-opacity': 0, ...glow } });
  map.addLayer({ id: 'bd-wide-line', type: 'line', source: 'bd-max', paint: { 'line-color': colours.loss, 'line-width': 5, 'line-opacity': 0, ...glow } });
  [...BANDS].reverse().forEach((b) => {
    const core = b.points === RULE.points;
    map.addSource(`bd-band-${b.points}`, { type: 'geojson', data: empty });
    map.addLayer({ id: `bd-band-${b.points}-fill`, type: 'fill', source: `bd-band-${b.points}`, paint: { 'fill-color': core ? colours.core : colours.band, 'fill-opacity': 0, ...lit } });
    map.addLayer({ id: `bd-band-${b.points}-line`, type: 'line', source: `bd-band-${b.points}`, paint: { 'line-color': core ? colours.coreLine : colours.band, 'line-width': core ? 4 : 3, 'line-opacity': 0, ...glow } });
  });
};

/** Set the rings for a position along the steps: the bands grow out of the mark as they arrive. */
export const setRings = (map: RingsMap, at: number, centre: LngLat = PLACE) => {
  const s = sceneAt(at);
  const set = (id: string, geometry: Polygon) => (map.getSource(id) as { setData(data: unknown): void }).setData(feature(geometry));
  BANDS.forEach((b) => {
    const core = b.points === RULE.points;
    set(`bd-band-${b.points}`, disc(centre, b.edge * s.bands));
    map.setPaintProperty(`bd-band-${b.points}-fill`, 'fill-opacity', (core ? 0.4 : 0.12) * s.bands);
    map.setPaintProperty(`bd-band-${b.points}-line`, 'line-opacity', 0.95 * s.bands);
  });
  set('bd-zero', annulus(centre, ZERO_FROM, RULE.max));
  set('bd-max', disc(centre, RULE.max));
  map.setPaintProperty('bd-zero-fill', 'fill-opacity', 0.3 * s.zero);
  map.setPaintProperty('bd-max-line', 'line-opacity', s.zero * (1 - s.wide));
  map.setPaintProperty('bd-wide-line', 'line-opacity', s.wide);
};

/** Where a label sits: the band numbers read across the screen, whatever the camera's bearing. */
export const labelPlaces = (at: number, mapBearing: number, centre: LngLat = PLACE) => {
  const s = sceneAt(at);
  const across = mapBearing + 90;
  return {
    bands: BANDS.map((b) => ({ points: b.points, at: destination(centre, across, b.points === RULE.points ? RULE.radius * 0.6 : b.edge - RULE.step / 2) })),
    zero: destination(centre, across, (ZERO_FROM + RULE.max) / 2),
    signal: destination(centre, SIGNAL_BEARING, s.signal),
  };
};
