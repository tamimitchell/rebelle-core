import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  POSITIONS_STATUSES,
  PositionFixSchema,
  PositionsLatestSchema,
  PositionsTrailsSchema,
  TrailPointSchema,
  parsePositionLines,
  positionsPath,
} from '../src/positions.ts';

// Emitted by the deployed positions Worker for 2024 day 4 (65 teams, closed),
// fetched as they stand on 2026-09-13; the site keeps byte-identical copies.
const read = (name: string) => readFileSync(new URL(`./fixtures/positions/2024-4/${name}`, import.meta.url), 'utf8');
const latest = JSON.parse(read('latest.json'));
const trails = JSON.parse(read('trails.json'));

test('the Worker\'s latest.json parses: one public fix per team, in marker order, none after as_of', () => {
  const document = PositionsLatestSchema.parse(latest);
  assert.equal(document.status, 'closed');
  assert.equal(document.delay_s, 900);
  assert.equal(document.refused, 0);
  assert.equal(document.teams.length, 65);
  const markers = document.teams.map((team) => team.marker);
  assert.deepEqual(markers, [...markers].sort((a, b) => a - b));
  assert.deepEqual(Object.keys(document.teams[0]).sort(), ['alt', 'at', 'cog', 'id', 'lat', 'lon', 'marker']);
  assert.deepEqual(POSITIONS_STATUSES, ['live', 'closed']);
});

test('the Worker\'s trails.json parses: every team a trail of five-number points at the public step', () => {
  const document = PositionsTrailsSchema.parse(trails);
  assert.equal(document.step_s, 120);
  assert.equal(document.teams.length, 65);
  const points = document.teams.reduce((sum, team) => sum + team.points.length, 0);
  assert.equal(points, 21556);
  for (const team of document.teams) {
    for (let i = 1; i < team.points.length; i++) assert.ok(team.points[i][0] - team.points[i - 1][0] >= document.step_s, `#${team.marker} keeps the step`);
  }
});

test('a team\'s day file reads a fix per line, and its last fix is the dot latest.json shows', () => {
  const lines = parsePositionLines(read('101.jsonl'));
  assert.equal(lines.length, 301);
  assert.deepEqual(Object.keys(lines[0]).sort(), ['alt', 'at', 'cog', 'id', 'lat', 'lon']);
  const dot = PositionsLatestSchema.parse(latest).teams.find((team) => team.marker === 101)!;
  const { marker: _marker, ...fix } = dot;
  assert.deepEqual(lines[lines.length - 1], fix);
  assert.equal(parsePositionLines('').length, 0);
  assert.throws(() => parsePositionLines('{"id":1,"at":"2024-10-16T02:00:05Z","lat":35.7,"lon":-116.2,"alt":221,"cog":320,"sog":41}\n'), /sog/);
});

test('the reader is no looser than the writer: a strange key, status, marker, point or a fix after as_of is refused', () => {
  assert.equal(PositionsLatestSchema.safeParse({ ...latest, extra: true }).success, false);
  assert.equal(PositionsLatestSchema.safeParse({ ...latest, status: 'open' }).success, false);
  assert.equal(PositionsLatestSchema.safeParse({ ...latest, teams: [{ ...latest.teams[0], marker: '101' }] }).success, false);
  assert.equal(PositionsLatestSchema.safeParse({ ...latest, teams: [{ ...latest.teams[0], marker: 0 }] }).success, false);
  assert.equal(PositionsLatestSchema.safeParse({ ...latest, teams: [latest.teams[0], latest.teams[0]] }).success, false, 'a marker listed twice');
  assert.equal(PositionsLatestSchema.safeParse({ ...latest, teams: [{ ...latest.teams[0], at: '2026-09-13T20:10:00Z' }] }).success, false, 'a fix after as_of');
  assert.equal(PositionsLatestSchema.safeParse({ ...latest, teams: [{ ...latest.teams[0], lat: 91 }] }).success, false);
  assert.equal(PositionFixSchema.safeParse({ ...latest.teams[0], marker: undefined, sog: 41 }).success, false, 'speed is never public');

  assert.equal(TrailPointSchema.safeParse([1728999030, 35.69, -116.23, 230]).success, false, 'four numbers');
  assert.equal(TrailPointSchema.safeParse([1728999030, 35.69, -116.23, 230, 0, 1]).success, false, 'six numbers');
  assert.equal(TrailPointSchema.safeParse(['1728999030', 35.69, -116.23, 230, 0]).success, false);
  assert.equal(PositionsTrailsSchema.safeParse({ ...trails, teams: [{ marker: 101, points: [] }] }).success, false, 'an empty trail');
  assert.equal(PositionsTrailsSchema.safeParse({ ...trails, teams: [{ marker: 101, points: [[Date.parse(trails.as_of) / 1000 + 60, 35.69, -116.23, 230, 0]] }] }).success, false, 'a point after as_of');
  assert.equal(PositionsTrailsSchema.safeParse({ ...trails, step_s: 0 }).success, false);
});

test('a document path is the canonical spelling the Worker answers', () => {
  assert.equal(positionsPath(2024, 4, 'latest.json'), '2024/4/latest.json');
  assert.equal(positionsPath(2026, 0, 'trails.json'), '2026/0/trails.json');
  assert.equal(positionsPath(2024, 4, 101), '2024/4/101.jsonl');
  assert.throws(() => positionsPath(2024, 4, 0));
  assert.throws(() => positionsPath(2024, -1, 'latest.json'));
});
