import { z } from 'zod';

export const RallyDaySchema = z.number().int().min(0).max(31);
export const TeamResultsSelectionSchema = z.object({
  rally_year: z.number().int().min(2000).max(9999),
  team_number: z.string().regex(/^\d{1,4}$/),
  day: RallyDaySchema,
}).strict();
export type TeamResultsSelection = z.infer<typeof TeamResultsSelectionSchema>;
export const TeamCheckpointSchema = z.object({
  key: z.string().trim().min(1).max(80), label: z.string().trim().min(1).max(80), points: z.number().int(),
  max_points: z.number().int().nonnegative(),
  validity: z.union([z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]), suffix: z.string().max(16),
}).strict();
export const TeamDayResultSchema = z.object({
  day: RallyDaySchema, points: z.number().int(), max_points: z.number().int().nonnegative(),
  ranked: z.boolean(), checkpoints: z.array(TeamCheckpointSchema).max(200),
  record_id: z.string().min(1), revision: z.string().min(1),
}).strict();
export const TeamResultsSchema = TeamResultsSelectionSchema.extend({
  schema_version: z.literal('1'),
  driver: z.string(), navigator: z.string(),
  available_days: z.array(RallyDaySchema).max(32),
  source: z.object({ kind: z.enum(['published', 'replay', 'studio']), at: z.string().datetime({ offset: true }) }).strict(),
  results: z.array(TeamDayResultSchema).max(32),
}).superRefine((value, context) => {
  const days = value.results.map(row => row.day);
  if (new Set(days).size !== days.length || new Set(value.available_days).size !== value.available_days.length) {
    context.addIssue({ code: 'custom', message: 'Team results repeat a day.' });
  }
  for (const row of value.results) {
    if (new Set(row.checkpoints.map(cp => cp.key)).size !== row.checkpoints.length) {
      context.addIssue({ code: 'custom', message: 'Checkpoint keys must be unique within a day.' });
    }
  }
  if (days.some(day => day > value.day || !value.available_days.includes(day))) {
    context.addIssue({ code: 'custom', message: 'Team results include a day outside the selected cutoff.' });
  }
});
export type TeamResults = z.infer<typeof TeamResultsSchema>;
export const checkpointCounts = (checkpoint: z.infer<typeof TeamCheckpointSchema>) => checkpoint.validity > 0 && checkpoint.points >= 0 && checkpoint.points < 125;
export const rallyDayLabel = (day: number) => day === 0 ? 'Prologue' : `Day ${day}`;
export const scorePointsLabel = (points: number) => points === -21000 ? 'DQ' : points.toLocaleString();
