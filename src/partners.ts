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

/** A band setting's share of its default, in percent. */
const BandPercentSchema = z.number().int().min(50).max(200);

const PartnerV2Schema = SponsorSchema.extend({
  tier: z.enum(PARTNER_TIERS),
  /** The partner's place on the site, 1 first. */
  position: z.number().int().positive(),
  logos: PartnerLogosSchema,
}).strict();

/**
 * A partner as schema 3 carries it (studio #638): schema 2's fields and
 * `band_scale`, its logo's size on the band as a share of its level's.
 */
const PartnerV3Schema = PartnerV2Schema.extend({ band_scale: BandPercentSchema }).strict();

/**
 * A partner as schema 4 carries it (studio #641): schema 3's fields and
 * `profile`, its paragraph on the Partners page. ⚠️ Not `blurb`: that one is
 * the line a rally day's "presented by" post says.
 */
export const PartnerSchema = PartnerV3Schema.extend({ profile: z.string().min(1).max(1200).nullable() }).strict();
export type Partner = z.infer<typeof PartnerSchema>;

/** The band's own settings (studio #638): every logo in color or in white, and each level's size. */
export const BandSettingsSchema = z
  .object({
    logo_style: z.enum(['color', 'white']),
    sizes: z.object({ gold: BandPercentSchema, 'silver-oem': BandPercentSchema, silver: BandPercentSchema, bronze: BandPercentSchema, supplier: BandPercentSchema }).strict(),
  })
  .strict();
export type BandSettings = z.infer<typeof BandSettingsSchema>;

export const DEFAULT_BAND: BandSettings = { logo_style: 'color', sizes: { gold: 100, 'silver-oem': 100, silver: 100, bronze: 100, supplier: 100 } };

/** The Partners page's own words (studio #641): the sentence under its heading. */
export const PartnersPageWordsSchema = z.object({ lead: z.string().min(1).max(600) }).strict();
export type PartnersPageWords = z.infer<typeof PartnersPageWordsSchema>;

/** WordPress's words, until the studio sends its own. */
export const DEFAULT_PARTNERS_PAGE: PartnersPageWords = {
  lead: 'All Rebelle Rally partners are deeply vetted for authenticity and quality. Our partners walk the walk and build the most superior, reliable products – our performance and safety depend on it. When making a purchasing decision, we ask that you support those that support the Rebelle.',
};

const recordOf = <V extends string, P extends z.ZodTypeAny>(version: V, payload: P) =>
  z
    .object({
      id: z.string().uuid(),
      /** The payload's own digest, as the rally days feed writes its records'. */
      version_id: z.string().regex(/^[0-9a-f]{64}$/, 'a version id is the payload digest'),
      schema_version: z.literal(version),
      payload,
    })
    .strict();

const envelope = {
  contract_version: z.literal('1'),
  feed_key: z.literal(PARTNERS_FEED_KEY),
  record_type_key: z.literal('rebelle.partner'),
  sent_at: z.string().datetime({ offset: true }),
};

/**
 * Records arrive in the site's order, so a reader draws them as listed.
 * Schema 3 adds the band's settings and each partner's `band_scale`; schema 4
 * the Partners page's words and each partner's `profile`. A reader takes the
 * older schemas as well, so the site reads a new one before the studio sends it.
 */
export const PartnersFeedDocumentSchema = z
  .discriminatedUnion('record_schema_version', [
    z.object({ ...envelope, record_schema_version: z.literal('2'), records: z.array(recordOf('2', PartnerV2Schema)) }).strict(),
    z.object({ ...envelope, record_schema_version: z.literal('3'), band: BandSettingsSchema, records: z.array(recordOf('3', PartnerV3Schema)) }).strict(),
    z.object({ ...envelope, record_schema_version: z.literal('4'), band: BandSettingsSchema, page: PartnersPageWordsSchema, records: z.array(recordOf('4', PartnerSchema)) }).strict(),
  ])
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

/** The partners, the band's settings and the page's words from any schema; what an older one lacks reads as the defaults. */
export function partnersOf(document: PartnersFeedDocument): { partners: Partner[]; band: BandSettings; page: PartnersPageWords } {
  switch (document.record_schema_version) {
    case '4':
      return { partners: document.records.map((record) => record.payload), band: document.band, page: document.page };
    case '3':
      return { partners: document.records.map((record) => ({ ...record.payload, profile: null })), band: document.band, page: DEFAULT_PARTNERS_PAGE };
    case '2':
      return { partners: document.records.map((record) => ({ ...record.payload, band_scale: 100, profile: null })), band: DEFAULT_BAND, page: DEFAULT_PARTNERS_PAGE };
  }
}

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
  /** The level's size times the partner's `band_scale`, 1 at the defaults; a narrow band's caps scale by it. */
  scale: number;
}

export interface BandRow {
  tier: PartnerTier;
  logos: BandLogo[];
  /** Marks a line at each width, so a level that wraps splits evenly rather than leave one alone. */
  columns: BandColumns;
  /** The row's widest possible mark with its gap, in px: how wide a line's place is on a wide band. */
  cell: number;
}

/** The fewest lines `count` marks fit on at `most` a line, shared out evenly. */
export function balancedColumns(count: number, most: number): number {
  return Math.ceil(count / Math.ceil(count / most));
}

/** Width in px for a mark at a tier's shared area, capped at its max, times `scale`. */
export function logoWidth(mark: Mark, tier: PartnerTier, scale = 1): number {
  const { area, max } = BAND_SIZING[tier];
  const aspect = mark.width && mark.height ? mark.width / mark.height : FALLBACK_ASPECT;
  return Math.round(Math.min(max, Math.sqrt(area * aspect)) * scale);
}

/**
 * The band's rows, one a level, top level first. In color each draws its mark
 * for a dark ground, else its white one; all white draws the white one where
 * it has one. A partner with neither has nothing to show on glass; one without
 * a link points at `fallbackHref`. Each level's size and each partner's
 * `band_scale` scale its mark.
 */
export function bandRows(
  partners: readonly Partner[],
  { fallbackHref = '/partners', band = DEFAULT_BAND }: { fallbackHref?: string; band?: BandSettings } = {},
): BandRow[] {
  return PARTNER_TIERS.map((tier) => {
    const level = band.sizes[tier] / 100;
    const logos = partners.flatMap((partner) => {
      const mark = band.logo_style === 'white' ? (partner.logos.white ?? partner.logos.dark) : (partner.logos.dark ?? partner.logos.white);
      if (partner.tier !== tier || !mark) return [];
      const scale = level * (partner.band_scale / 100);
      const width = logoWidth(mark, tier, scale);
      return [{
        key: partner.key,
        name: partner.name,
        href: partner.link ?? fallbackHref,
        src: mark.url,
        width,
        height: mark.width && mark.height ? Math.round((width * mark.height) / mark.width) : undefined,
        scale,
      }];
    });
    const { wide, mid, narrow } = BAND_LINE[tier];
    const columns = { wide: balancedColumns(logos.length, wide), mid: balancedColumns(logos.length, mid), narrow: balancedColumns(logos.length, narrow) };
    const widest = Math.max(level, ...logos.map((logo) => logo.scale));
    const cell = Math.round(BAND_SIZING[tier].max * widest) + (tier === 'supplier' ? 44 : 52);
    return { tier, logos, columns, cell };
  }).filter((row) => row.logos.length > 0);
}
