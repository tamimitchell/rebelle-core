import { z } from 'zod';
import { TeamResultsSchema, TeamResultsSelectionSchema, type TeamResults } from './team-results.ts';

export const TEAM_RESULTS_CATALOG = 'urn:rebelle:a2ui:team-results:1';
export const TEAM_RESULTS_SURFACE = 'team-results';
export const TEAM_RESULTS_VERSION = 'v0.9.1';
export const TeamResultsComponentSchema = z.object({
  id: z.literal('root'), component: z.literal('TeamResults'),
  results: z.object({ path: z.literal('/teamResults') }).strict(),
  onSelectDay: z.object({ event: z.object({ name: z.literal('select_day'), context: z.object({ rally_year: z.object({ path: z.literal('/teamResults/rally_year') }).strict(), team_number: z.object({ path: z.literal('/teamResults/team_number') }).strict(), day: z.object({ path: z.literal('/teamResults/day') }).strict() }).strict() }).strict() }).strict(),
}).strict();
const envelope = { version: z.literal(TEAM_RESULTS_VERSION) };
const surfaceId = z.literal(TEAM_RESULTS_SURFACE);
export const TeamResultsMessageSchema = z.union([
  z.object({ ...envelope, createSurface: z.object({ surfaceId, catalogId: z.literal(TEAM_RESULTS_CATALOG) }).strict() }).strict(),
  z.object({ ...envelope, updateComponents: z.object({ surfaceId, components: z.array(TeamResultsComponentSchema).length(1) }).strict() }).strict(),
  z.object({ ...envelope, updateDataModel: z.object({ surfaceId, path: z.literal('/teamResults'), value: TeamResultsSchema }).strict() }).strict(),
  z.object({ ...envelope, deleteSurface: z.object({ surfaceId }).strict() }).strict(),
]);
export type TeamResultsMessage = z.infer<typeof TeamResultsMessageSchema>;
export const TeamResultsActionSchema = z.object({
  version: z.literal(TEAM_RESULTS_VERSION),
  action: z.object({
    name: z.literal('select_day'), surfaceId, sourceComponentId: z.literal('root'),
    timestamp: z.string().datetime({ offset: true }), context: TeamResultsSelectionSchema,
  }).strict(),
}).strict();
export type TeamResultsAction = z.infer<typeof TeamResultsActionSchema>;
export type TeamResultsSurfaceState = { created: boolean; componentReady: boolean; results: TeamResults | null };
export const emptyTeamResultsSurface = (): TeamResultsSurfaceState => ({ created: false, componentReady: false, results: null });

/** A bounded catalog renderer, not a general evaluator. Only root data replacement
 * and the TeamResults component are supported; no functions, HTML or tool names. */
export function applyTeamResultsMessages(previous: TeamResultsSurfaceState, input: unknown): TeamResultsSurfaceState {
  const messages = z.array(TeamResultsMessageSchema).min(1).max(32).parse(input);
  let state = previous;
  for (const message of messages) {
    if ('createSurface' in message) { if (state.created) throw new Error('Delete the existing surface before recreating it.'); state = { created: true, componentReady: false, results: null }; continue; }
    if (!state.created) throw new Error('Create the team-results surface before updating it.');
    if ('deleteSurface' in message) state = emptyTeamResultsSurface();
    else if ('updateComponents' in message) state = { ...state, componentReady: true };
    else state = { ...state, results: message.updateDataModel.value };
  }
  return state;
}
export function teamResultsMessages(input: TeamResults): TeamResultsMessage[] {
  const results = TeamResultsSchema.parse(input);
  return [
    { version: TEAM_RESULTS_VERSION, createSurface: { surfaceId: TEAM_RESULTS_SURFACE, catalogId: TEAM_RESULTS_CATALOG } },
    { version: TEAM_RESULTS_VERSION, updateComponents: { surfaceId: TEAM_RESULTS_SURFACE, components: [{ id: 'root', component: 'TeamResults', results: { path: '/teamResults' }, onSelectDay: { event: { name: 'select_day', context: { rally_year: { path: '/teamResults/rally_year' }, team_number: { path: '/teamResults/team_number' }, day: { path: '/teamResults/day' } } } } }] } },
    { version: TEAM_RESULTS_VERSION, updateDataModel: { surfaceId: TEAM_RESULTS_SURFACE, path: '/teamResults', value: results } },
  ];
}
export function selectTeamResultsDay(results: TeamResults, day: number): TeamResultsAction {
  if (!results.available_days.includes(day)) throw new Error('Choose an available rally day.');
  return TeamResultsActionSchema.parse({ version: TEAM_RESULTS_VERSION, action: {
    name: 'select_day', surfaceId: TEAM_RESULTS_SURFACE, sourceComponentId: 'root', timestamp: new Date().toISOString(),
    context: { rally_year: results.rally_year, team_number: results.team_number, day },
  } });
}
