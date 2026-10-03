import { z } from 'zod';
import { MarkSchema, SponsorSchema, type Mark } from './dispatch.ts';

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

/**
 * Every logo in a row gets the same area, so a square badge and a long
 * wordmark read as equals; the levels step down plainly, Gold the largest
 * (site Decided #125).
 */
export const BAND_SIZING: Record<PartnerTier, { area: number; max: number }> = {
  gold: { area: 18000, max: 360 },
  'silver-oem': { area: 5800, max: 205 },
  silver: { area: 3250, max: 152 },
  bronze: { area: 1800, max: 115 },
  supplier: { area: 735, max: 73 },
};

export interface BandColumns {
  wide: number;
  mid: number;
  narrow: number;
}

/** The most marks a line holds: on a wide band, under 1100px, under 620px. */
export const BAND_LINE: Record<PartnerTier, BandColumns> = {
  gold: { wide: 4, mid: 4, narrow: 2 },
  'silver-oem': { wide: 6, mid: 5, narrow: 3 },
  silver: { wide: 6, mid: 5, narrow: 3 },
  bronze: { wide: 6, mid: 5, narrow: 3 },
  supplier: { wide: 9, mid: 5, narrow: 3 },
};

/** A wordmark's typical shape, for a mark the feed sends without its pixels. */
const FALLBACK_ASPECT = 3;

export interface BandLogo {
  key: string;
  name: string;
  href: string;
  src: string;
  width: number;
  /** Only when the mark's pixels are known; the browser keeps the natural shape otherwise. */
  height?: number;
}

export interface BandRow {
  tier: PartnerTier;
  logos: BandLogo[];
  /** Marks a line at each width, so a level that wraps splits evenly rather than leave one alone. */
  columns: BandColumns;
}

/** The fewest lines `count` marks fit on at `most` a line, shared out evenly. */
export function balancedColumns(count: number, most: number): number {
  return Math.ceil(count / Math.ceil(count / most));
}

/** Width in px for a mark at a tier's shared area, capped at its max. */
export function logoWidth(mark: Mark, tier: PartnerTier): number {
  const { area, max } = BAND_SIZING[tier];
  const aspect = mark.width && mark.height ? mark.width / mark.height : FALLBACK_ASPECT;
  return Math.round(Math.min(max, Math.sqrt(area * aspect)));
}

/**
 * The band's rows, one a level, top level first. Each draws its mark for a
 * dark ground, else its white one; a partner with neither has nothing to show
 * on glass. A partner without a link points at `fallbackHref`.
 */
export function bandRows(partners: readonly Partner[], { fallbackHref = '/partners' }: { fallbackHref?: string } = {}): BandRow[] {
  return PARTNER_TIERS.map((tier) => {
    const logos = partners.flatMap((partner) => {
      const mark = partner.logos.dark ?? partner.logos.white;
      if (partner.tier !== tier || !mark) return [];
      const width = logoWidth(mark, tier);
      return [{
        key: partner.key,
        name: partner.name,
        href: partner.link ?? fallbackHref,
        src: mark.url,
        width,
        height: mark.width && mark.height ? Math.round((width * mark.height) / mark.width) : undefined,
      }];
    });
    const { wide, mid, narrow } = BAND_LINE[tier];
    const columns = { wide: balancedColumns(logos.length, wide), mid: balancedColumns(logos.length, mid), narrow: balancedColumns(logos.length, narrow) };
    return { tier, logos, columns };
  }).filter((row) => row.logos.length > 0);
}
