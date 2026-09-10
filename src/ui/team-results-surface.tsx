import { selectTeamResultsDay, type TeamResultsSurfaceState, type TeamResultsAction } from '../team-results-a2ui.ts';
import { TeamResultsView } from './team-results.tsx';

/** Maps this catalog's one registered component to trusted UI code. */
export function TeamResultsSurface({ state, onAction, busy = false }: {
  state: TeamResultsSurfaceState; onAction: (action: TeamResultsAction) => void; busy?: boolean;
}) {
  if (!state.created || !state.componentReady || !state.results) return null;
  const results = state.results;
  return <TeamResultsView results={results} busy={busy} onSelectDay={day => onAction(selectTeamResultsDay(results, day))}/>;
}
