import type { TeamResults } from '../team-results.ts';
import { checkpointCounts, rallyDayLabel, scorePointsLabel } from '../team-results.ts';

export function TeamResultsView({ results, onSelectDay, busy = false }: {
  results: TeamResults; onSelectDay?: (day: number) => void; busy?: boolean;
}) {
  const selected = results.results.find(row => row.day === results.day);
  const history = [...results.results].sort((a, b) => a.day - b.day);
  const sourceLabel = results.source.kind === 'studio' ? 'Saved in Studio · may differ from published results'
    : results.source.kind === 'replay' ? `${results.rally_year} historical replay` : 'Published results';
  return <section className="rr-team-results" aria-label={`Team ${results.team_number} results`} aria-busy={busy}>
    <header className="rr-team-results__header">
      <div><h3>#{results.team_number}</h3><p>{[results.driver, results.navigator].filter(Boolean).join(' / ') || 'Crew names unavailable'}</p></div>
      {onSelectDay ? <label className="rr-team-results__day">Rally day<select aria-label="Team results day" value={results.day} disabled={busy} onChange={event => onSelectDay(Number(event.currentTarget.value))}>
        {Array.from(new Set([...results.available_days, results.day])).sort((a, b) => a - b).map(day => <option key={day} value={day}>{rallyDayLabel(day)}</option>)}
      </select></label> : <span>{rallyDayLabel(results.day)}</span>}
    </header>
    <p className="rr-team-results__source">{sourceLabel}<br/><time dateTime={results.source.at}>Source captured {results.source.at.replace('T', ' ').replace(/\.\d+Z$/, 'Z')}</time></p>
    {selected ? <>
      <p className="rr-team-results__total">{rallyDayLabel(selected.day)} <strong>{scorePointsLabel(selected.points)}</strong> / {selected.max_points} points{!selected.ranked && <span> · Not ranked</span>}</p>
      <details className="rr-team-results__checkpoints" key={`${results.team_number}/${results.day}`}>
        <summary>{selected.checkpoints.filter(checkpointCounts).length} checkpoints scored · view results</summary>
        <ul>{selected.checkpoints.map(checkpoint => <li key={checkpoint.key}>
          <span>{checkpoint.label}</span><strong>{checkpoint.points >= 125 || checkpoint.points < 0 ? 'Unscored' : `${checkpoint.points} / ${checkpoint.max_points}`}</strong>
          <span className={checkpointCounts(checkpoint) ? 'rr-team-results__counted' : 'rr-team-results__excluded'}>{checkpoint.validity === 2 && checkpointCounts(checkpoint) ? 'Late · counts' : !checkpointCounts(checkpoint) ? 'Not counted' : checkpoint.suffix || 'Counted'}</span>
        </li>)}</ul>
      </details>
      {history.length > 1 && <p className="rr-team-results__history">{history.map(score => <span key={score.day}>{rallyDayLabel(score.day)} <strong>{scorePointsLabel(score.points)}</strong></span>)}</p>}
      {results.source.kind === 'studio' && <details className="rr-team-results__evidence"><summary>Source record</summary><dl><dt>Record</dt><dd>{selected.record_id}</dd><dt>Revision</dt><dd>{selected.revision}</dd></dl></details>}
    </> : <p role="status">No score for this team on {rallyDayLabel(results.day).toLowerCase()}.</p>}
  </section>;
}
