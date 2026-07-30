import { z } from 'zod';

// Starter shapes — provisional until refined against the scoring API's real fields.

export const TeamSchema = z.object({
  number: z.number().int().positive(),
  name: z.string(),
  vehicleClass: z.enum(['4x4', 'x-cross']),
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.enum(['driver', 'navigator']),
      }),
    )
    .length(2),
  slug: z.string(),
});
export type Team = z.infer<typeof TeamSchema>;

export const DispatchSchema = z.object({
  id: z.string(),
  day: z.number().int().min(0),
  publishedAt: z.string().datetime(),
  author: z.string(),
  body: z.string(),
  teamNumbers: z.array(z.number().int().positive()).default([]),
  mediaRefs: z.array(z.string()).default([]),
});
export type Dispatch = z.infer<typeof DispatchSchema>;

export const DayStandingSchema = z.object({
  day: z.number().int().min(1),
  teamNumber: z.number().int().positive(),
  rank: z.number().int().positive(),
  score: z.number(),
  rankDelta: z.number().int(),
});
export type DayStanding = z.infer<typeof DayStandingSchema>;
