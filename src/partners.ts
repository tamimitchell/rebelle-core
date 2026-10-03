import { z } from 'zod';
import { MarkSchema, SponsorSchema } from './dispatch.ts';

/**
 * The partners feed (studio #610, #622): every sponsor the studio gives a
 * level, level by level and in the site's order within each, for the partners
 * band on Home and the Partners page.
 *
 * ⚠️ It never says which day a partner presents. Those stay held until 5 a.m.
 * on the day (studio Decided #176), and only the rally days feed holds them.
 */

export const PARTNERS_FEED_KEY = 'rebelle.partners';

/** The sponsor levels, the rows of Rebelle's logo bar from the top; the bar draws a rule above `supplier`. */
export const PARTNER_TIERS = ['gold', 'silver-oem', 'silver', 'bronze', 'supplier'] as const;
export type PartnerTier = (typeof PARTNER_TIERS)[number];

/**
 * A partner's three marks. `dark` is the brand's own colours drawn for a dark
 * ground, as the logo bar uses it; without one a dark ground takes `white`.
 * ⚠️ Its own shape, not `SponsorLogosSchema` plus a key: that one is strict and
 * rides in the rally days feed, so a `dark` there would fail every site pinned
 * before this module.
 */
export const PartnerLogosSchema = z
  .object({ white: MarkSchema.nullable(), color: MarkSchema.nullable(), dark: MarkSchema.nullable() })
  .strict();
export type PartnerLogos = z.infer<typeof PartnerLogosSchema>;

export const PartnerSchema = SponsorSchema.extend({
  tier: z.enum(PARTNER_TIERS),
  /** The partner's place on the site, 1 first. */
  position: z.number().int().positive(),
  logos: PartnerLogosSchema,
}).strict();
export type Partner = z.infer<typeof PartnerSchema>;

const PartnerRecordSchema = z
  .object({
    id: z.string().uuid(),
    /** The payload's own digest, as the rally days feed writes its records'. */
    version_id: z.string().regex(/^[0-9a-f]{64}$/, 'a version id is the payload digest'),
    schema_version: z.literal('2'),
    payload: PartnerSchema,
  })
  .strict();

/** Records arrive in the site's order, so a reader draws them as listed. */
export const PartnersFeedDocumentSchema = z
  .object({
    contract_version: z.literal('1'),
    feed_key: z.literal(PARTNERS_FEED_KEY),
    record_type_key: z.literal('rebelle.partner'),
    record_schema_version: z.literal('2'),
    sent_at: z.string().datetime({ offset: true }),
    records: z.array(PartnerRecordSchema),
  })
  .strict()
  .superRefine((document, context) => {
    const keys = new Set<string>();
    document.records.forEach(({ payload }, index) => {
      if (keys.has(payload.key)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['records', index, 'payload', 'key'], message: 'a partner is listed once' });
      }
      keys.add(payload.key);
      const previous = document.records[index - 1]?.payload.position;
      if (previous !== undefined && payload.position <= previous) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['records', index, 'payload', 'position'], message: 'partners are listed in their order, each place once' });
      }
    });
  });
export type PartnersFeedDocument = z.infer<typeof PartnersFeedDocumentSchema>;
