import test from 'node:test';
import assert from 'node:assert/strict';
import { PLACE, zoomFor } from '../src/black-diamond.ts';
import { flight, flightSeconds, type Camera } from '../src/camera.ts';
import { CHECKPOINTS, INTRO, ROUTE, STEPS, TYPICAL, addRoute, introCamera, setRoute, stepCamera } from '../src/checkpoints.ts';

const metres = (a: [number, number], b: [number, number]) =>
  Math.hypot((b[0] - a[0]) * 111_320 * Math.cos((PLACE[1] * Math.PI) / 180), (b[1] - a[1]) * 110_574);
const kindOf = (n: number) => CHECKPOINTS.find((c) => c.n === n)!.kind;

// Handbook pp. 10 and 43: a green is flagged, crewed and required; a blue has a small flag or pole; a black diamond has no marker.
test('a step for each kind, its card leading with the kind\'s typical points', () => {
  const close = STEPS.filter((s) => s.focus !== null);
  assert.deepEqual(close.map((s) => kindOf(s.focus!)), ['green', 'blue', 'black']);
  for (const s of close) {
    const kind = kindOf(s.focus!);
    assert.equal(s.value, `${TYPICAL[kind]} points`);
    assert.equal(s.note, 'Typically around', 'every checkpoint carries its own points, so a kind\'s number is an example');
  }
  assert.ok(TYPICAL.green > TYPICAL.blue && TYPICAL.blue > TYPICAL.black, 'the easiest to find is worth the most');
});

test('opens on the CP Guide and closes on the team\'s route, over the whole day', () => {
  assert.deepEqual(STEPS.map((s) => s.key), ['guide', 'green', 'blue', 'black', 'route']);
  assert.equal(STEPS[0].focus, null);
  assert.equal(STEPS.at(-1)!.focus, null);
});

// Emily and Tami, 2026-09-25: green and blue carry no ring, and nothing gives a geofence's size.
test('the map draws no ring but the black diamond\'s, and no card gives a distance', () => {
  const layers: string[] = [];
  addRoute({ addSource: () => undefined, addLayer: (l: { id: string }) => layers.push(l.id), setPaintProperty: () => undefined });
  assert.deepEqual(layers, ['cp-route']);
  for (const s of STEPS) assert.doesNotMatch(`${s.note ?? ''} ${s.value} ${s.line}`, /\d\s*m\b/, s.key);
});

test('the day is the black diamond\'s: CP3 is that checkpoint, and every checkpoint is within 3 km of it', () => {
  assert.deepEqual(CHECKPOINTS.find((c) => c.kind === 'black')!.at, PLACE);
  for (const c of CHECKPOINTS) assert.ok(metres(PLACE, c.at) < 3000, `CP${c.n}`);
});

// Handbook p. 11: every green is required; the blues and blacks are the team's to choose.
test('the route collects every green, in the day\'s order, and skips at least one checkpoint', () => {
  for (const c of CHECKPOINTS.filter((c) => c.kind === 'green')) assert.ok(ROUTE.includes(c.n), `CP${c.n}`);
  assert.deepEqual([...ROUTE].sort((x, y) => x - y), ROUTE);
  assert.ok(ROUTE.length < CHECKPOINTS.length);
});

test('a flight starts on one camera and lands on the other, a pure zoom included', () => {
  const view = { width: 1130, height: 900 };
  const close = (a: Camera, b: Camera) => {
    assert.ok(metres(a.center, b.center) < 0.01);
    for (const k of ['zoom', 'pitch', 'bearing'] as const) assert.ok(Math.abs(a[k] - b[k]) < 1e-6, k);
  };
  const a = stepCamera(0, 330);
  const b = stepCamera(1, 330);
  close(flight(a, b, 0, view), a);
  close(flight(a, b, 1, view), b);
  const zoomOnly = { ...a, zoom: a.zoom + 2 };
  close(flight(a, zoomOnly, 1, view), zoomOnly);
  assert.equal(b.zoom, zoomFor(STEPS[1].reach, 330, CHECKPOINTS[0].at[1]));
});

// At 30 fps a move that sweeps the ground more than about 40 px a frame strobes (black-diamond.test.ts).
test('every move between steps, and the fly-in, keeps the ground under 40 px a frame', () => {
  const fit = 330;
  const view = { width: 1130, height: 900 };
  const legs: [Camera, Camera, number][] = [[introCamera(), stepCamera(0, fit), INTRO.seconds]];
  for (let i = 1; i < STEPS.length; i++) {
    const a = stepCamera(i - 1, fit);
    const b = stepCamera(i, fit);
    legs.push([a, b, flightSeconds(a, b, view)]);
  }
  legs.forEach(([a, b, seconds], leg) => {
    const frames = Math.round(seconds * 30);
    let fastest = 0;
    for (let f = 1; f <= frames; f++) {
      const p = flight(a, b, (f - 1) / frames, view);
      const q = flight(a, b, f / frames, view);
      fastest = Math.max(fastest, metres(p.center, q.center) / 2 ** (zoomFor(1, 1, PLACE[1]) - q.zoom));
    }
    assert.ok(fastest < 40, `leg ${leg}: the ground moves ${fastest.toFixed(0)} px in a frame`);
  });
});

test('the route fades in with its step on any map', () => {
  const paint: Record<string, unknown> = {};
  setRoute({ addSource: () => undefined, addLayer: () => undefined, setPaintProperty: (_: string, name: string, value: unknown) => (paint[name] = value) }, 1);
  assert.equal(paint['line-opacity'], 0.85);
});
