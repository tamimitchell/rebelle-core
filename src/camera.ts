/**
 * A camera move between any two views of a map, on van Wijk and Nuij's path, the one Mapbox's flyTo
 * takes: it pulls out as far as the move needs and back in, so the ground crosses the screen at an
 * even pace. A straight line in both zoom and position rushes it and strobes at 30 fps.
 */

export type Camera = { center: [number, number]; zoom: number; pitch: number; bearing: number };
export type View = { width: number; height: number };

const RHO = 1.42;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const metresPerPixel = (zoom: number, lat: number) => (78271.517 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;
const groundMetres = (a: [number, number], b: [number, number]) =>
  Math.hypot((b[0] - a[0]) * 111_320 * Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180), (b[1] - a[1]) * 110_574);

/** The move from `a` to `b`: its length in van Wijk's units, and where it is `s` of the way along that length. */
const path = (a: Camera, b: Camera, view: View) => {
  const w0 = Math.max(view.width, view.height);
  const w1 = w0 / 2 ** (b.zoom - a.zoom);
  const u1 = groundMetres(a.center, b.center) / metresPerPixel(a.zoom, (a.center[1] + b.center[1]) / 2);
  if (u1 < 1e-6) {
    const length = Math.abs(Math.log(w1 / w0)) / RHO;
    return { length, at: (s: number) => ({ along: 0, zoom: mix(a.zoom, b.zoom, length ? s / length : 1) }) };
  }
  const r = (i: 0 | 1) => {
    const q = (w1 * w1 - w0 * w0 + (i ? -1 : 1) * RHO ** 4 * u1 * u1) / (2 * (i ? w1 : w0) * RHO ** 2 * u1);
    return Math.log(Math.sqrt(q * q + 1) - q);
  };
  const r0 = r(0);
  const length = (r(1) - r0) / RHO;
  return {
    length,
    at: (s: number) => {
      const x = r0 + RHO * s;
      return { along: (w0 * (Math.cosh(r0) * Math.tanh(x) - Math.sinh(r0))) / (RHO ** 2 * u1), zoom: a.zoom + Math.log2(Math.cosh(x) / Math.cosh(r0)) };
    },
  };
};

/** The camera `t` of the way from `a` to `b` (0 to 1, eased in and out), for a view `width` × `height` pixels. */
export const flight = (a: Camera, b: Camera, t: number, view: View): Camera => {
  const k = 0.5 - Math.cos(Math.PI * Math.max(0, Math.min(1, t))) / 2;
  const p = path(a, b, view);
  const { along, zoom } = p.at(k * p.length);
  return {
    center: [mix(a.center[0], b.center[0], along), mix(a.center[1], b.center[1], along)],
    zoom,
    pitch: mix(a.pitch, b.pitch, k),
    bearing: mix(a.bearing, b.bearing, k),
  };
};

/** How long the move takes: slower than flyTo's pace (1.2), so the ground crosses a 30 fps frame under 40 px. */
export const flightSeconds = (a: Camera, b: Camera, view: View) => Math.max(0.8, path(a, b, view).length / 0.9);
