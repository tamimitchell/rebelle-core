import test from 'node:test';
import assert from 'node:assert/strict';
import { BANDS, FLY_IN, PLACE, RULE, STEPS, ZERO_FROM, addRings, cameraAt, destination, flyInAt, sceneAt, scoreAt, setRings, stepAtSeconds, trackerReadout, zoomFor } from '../src/black-diamond.ts';

// The 2026 Competition Handbook's worked example, PDF p. 11: "50m Radius / 25m Step / 300m Max".
test('a signal scores as the handbook\'s figure draws it', () => {
  const cases: [number, number, boolean][] = [
    [0, 5, false], [50, 5, false], [51, 4, false], [75, 4, false], [76, 3, false],
    [125, 2, false], [150, 1, false], [151, 0, false], [200, 0, false], [300, 0, false], [301, 0, true],
  ];
  for (const [metres, points, wideMiss] of cases) assert.deepEqual(scoreAt(metres), { points, wideMiss }, `${metres} m`);
});

test('five bands, full points inside the radius, the 0-point band from the last edge to the max', () => {
  assert.deepEqual(BANDS.map((b) => [b.edge, b.points]), [[50, 5], [75, 4], [100, 3], [125, 2], [150, 1]]);
  assert.equal(ZERO_FROM, 150);
});

test('every step\'s words carry the rule\'s numbers, and each signal scores what its step says', () => {
  const words = STEPS.map((s) => `${s.value} ${s.line}`).join(' | ');
  for (const n of [RULE.points, RULE.radius, RULE.step, ZERO_FROM, RULE.max, RULE.penalty]) assert.match(words, new RegExp(`\\b${n}\\b`));
  const scored = STEPS.map((s) => (s.signal === null ? null : scoreAt(s.signal)));
  const wide = { points: 0, wideMiss: true };
  assert.deepEqual(scored, [null, { points: 5, wideMiss: false }, { points: 3, wideMiss: false }, { points: 0, wideMiss: false }, wide, wide]);
  // the big line is the points the step's signal scores
  assert.deepEqual(STEPS.slice(1, -1).map((s) => s.value), ['5 points', '3 points', '0 points', '−10 points']);
});

// Handbook p. 12–13 and 51: every signal leaves the team's own position on the tracker's Last Position screen.
test('the last step reads the wide miss back as the tracker shows a position', () => {
  assert.deepEqual(trackerReadout(PLACE), ['38° 18.402′ N', '116° 55.398′ W']);
  assert.deepEqual(trackerReadout([0.5, -0.999999]), ['01° 00.000′ S', '000° 30.000′ E']);
  assert.deepEqual(STEPS.map((s) => s.readout), [0, 0, 0, 0, 0, 1]);
  assert.equal(sceneAt(STEPS.length - 1).readout, 1);
});

test('a position between two steps is a mix of both, and a clip reaches the last step', () => {
  assert.equal(sceneAt(0).signalShown, 0);
  assert.equal(sceneAt(1).bands, 1);
  const between = sceneAt(3.5);
  assert.ok(between.reach > STEPS[3].reach && between.reach < STEPS[4].reach);
  assert.equal(stepAtSeconds(0), 0);
  assert.equal(stepAtSeconds(1000), STEPS.length - 1);
});

test('destination walks the metres it is asked for', () => {
  const north = destination(PLACE, 0, 1000);
  assert.ok(Math.abs((north[1] - PLACE[1]) * 111_195 - 1000) < 1);
});

test('the rings go onto any map with the four calls, and a step sets every layer it added', () => {
  const sources = new Map<string, unknown>();
  const layers = new Map<string, Record<string, unknown>>();
  const map = {
    addSource: (id: string, source: { data: unknown }) => sources.set(id, source.data),
    addLayer: (layer: { id: string; paint: Record<string, unknown> }) => layers.set(layer.id, { ...layer.paint }),
    getSource: (id: string) => ({ setData: (data: unknown) => sources.set(id, data) }),
    setPaintProperty: (layer: string, name: string, value: unknown) => {
      assert.ok(layers.has(layer), `${layer} was added`);
      layers.get(layer)![name] = value;
    },
  };
  addRings(map);
  setRings(map, 4);
  assert.equal(layers.get('bd-wide-line')!['line-opacity'], 1);
  assert.equal(layers.get('bd-band-5-line')!['line-opacity'], 0.95);
});

test('the fly-in comes in over the hills to the first step, the ground crossing the screen at an even pace', () => {
  const fit = 330;
  const view = { width: 1130, height: 900 };
  const close = (a: number, b: number, what: string) => assert.ok(Math.abs(a - b) < 1e-6, `${what}: ${a} vs ${b}`);
  const start = flyInAt(0, fit, view);
  const end = flyInAt(1, fit, view);
  const far = destination(PLACE, FLY_IN.heading, FLY_IN.metres);
  close(start.center[0], far[0], 'starts out'), close(start.center[1], far[1], 'starts out'), close(start.zoom, FLY_IN.zoom, 'start zoom');
  close(end.center[0], PLACE[0], 'lands'), close(end.center[1], PLACE[1], 'lands'), close(end.zoom, zoomFor(cameraAt(0).reach, fit, PLACE[1]), 'lands at the first step');
  close(end.pitch, cameraAt(0).pitch, 'pitch'), close(end.bearing, cameraAt(0).bearing, 'bearing');
  // at 30 fps a straight line swept the ground under the view's centre 176 px in one frame, and it strobed
  const frames = FLY_IN.seconds * 30;
  const metresPerPixel = (zoom: number) => 2 ** (zoomFor(1, 1, PLACE[1]) - zoom);
  let fastest = 0;
  for (let f = 1; f <= frames; f++) {
    const a = flyInAt((f - 1) / frames, fit, view);
    const b = flyInAt(f / frames, fit, view);
    const metres = Math.hypot((b.center[0] - a.center[0]) * 111_320 * Math.cos((PLACE[1] * Math.PI) / 180), (b.center[1] - a.center[1]) * 110_574);
    fastest = Math.max(fastest, metres / metresPerPixel(b.zoom));
  }
  assert.ok(fastest < 40, `the ground moves ${fastest.toFixed(0)} px in a frame`);
});
