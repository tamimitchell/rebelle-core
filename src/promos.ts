import { z } from 'zod';
import { SponsorKeySchema } from './dispatch.ts';
import { PartnerLogosSchema } from './partners.ts';
import { parseProse } from './prose.ts';

/**
 * The promos feed (studio #663): the offers the studio has switched on, in the
 * Promos page's order. An ended offer may still ride in it; the reader drops
 * it by date, so an offer comes down on its day without a send.
 */

export const PROMOS_FEED_KEY = 'rebelle.promos';

const HttpsUrlSchema = z.string().url().refine((value) => value.startsWith('https://'), 'a link is an https address');
const DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** The partner an offer comes from: its mark stands at the top of the offer and links to its site. */
export const PromoSponsorSchema = z
  .object({ key: SponsorKeySchema, name: z.string().min(1).max(120), link: HttpsUrlSchema.nullable(), logos: PartnerLogosSchema })
  .strict();

export const PromoSchema = z
  .object({
    /** The offer's place on the page, 1 first. */
    position: z.number().int().positive(),
    sponsor: PromoSponsorSchema.nullable(),
    /** Stands where a sponsor's mark would, for an offer with no sponsor. */
    heading: z.string().min(1).max(80).nullable(),
    /** Core's prose dialect: paragraphs, bold, emphasis and links. */
    words: z.string().min(1).max(1200).refine((markdown) => {
      try {
        return parseProse(markdown).length > 0;
      } catch {
        return false;
      }
    }, "an offer's words are prose core can read"),
    /** The last day the offer shows, Pacific time. */
    ends_on: z.string().regex(DAY, 'an end date is YYYY-MM-DD').refine((day) => !Number.isNaN(Date.parse(`${day}T00:00:00Z`)) && new Date(`${day}T00:00:00Z`).toISOString().startsWith(day), 'an end date is a real day'),
    button: z.object({ label: z.string().min(1).max(60), href: HttpsUrlSchema }).strict().nullable(),
    /** A studio image, drawn behind the offer. */
    photo: z.object({ id: z.string().regex(UUID, 'a photo is a studio image id'), alt: z.string().min(1).max(300) }).strict(),
  })
  .strict()
  .refine((promo) => promo.sponsor !== null || promo.heading !== null, { message: 'an offer without a sponsor has a heading', path: ['heading'] });
export type Promo = z.infer<typeof PromoSchema>;

export const PromosFeedDocumentSchema = z
  .object({
    contract_version: z.literal('1'),
    feed_key: z.literal(PROMOS_FEED_KEY),
    record_type_key: z.literal('rebelle.promo'),
    record_schema_version: z.literal('1'),
    sent_at: z.string().datetime({ offset: true }),
    records: z.array(
      z
        .object({
          id: z.string().uuid(),
          /** The payload's own digest, as the partners feed writes its records'. */
          version_id: z.string().regex(/^[0-9a-f]{64}$/, 'a version id is the payload digest'),
          schema_version: z.literal('1'),
          payload: PromoSchema,
        })
        .strict(),
    ),
  })
  .strict()
  .superRefine((document, context) => {
    document.records.forEach(({ payload }, index) => {
      const previous = document.records[index - 1]?.payload.position;
      if (previous !== undefined && payload.position <= previous) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ['records', index, 'payload', 'position'], message: 'offers are listed in their order, each place once' });
      }
    });
  });
export type PromosFeedDocument = z.infer<typeof PromosFeedDocumentSchema>;

/** A moment's date in Pacific time, `YYYY-MM-DD`: the day an offer's end date is read against. */
export function pacificDay(at: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);
}

/** The offers showing on a Pacific day, in the page's order. */
export function currentPromos(document: PromosFeedDocument, day: string): Promo[] {
  return document.records.map((record) => record.payload).filter((promo) => promo.ends_on >= day);
}

/** WordPress's line under an offer: `Offer valid through 10/31/2026.` */
export function validLine(endsOn: string): string {
  const [year, month, day] = endsOn.split('-').map(Number);
  return `Offer valid through ${month}/${day}/${year}.`;
}
