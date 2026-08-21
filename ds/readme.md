# Rebelle Rally — Field Glass Design System

The design system for **Rebelle Rally** — the longest competitive off-road rally in the United States, and the first for women. Eight days across the American West, no GPS, no phones: maps, compass, and roadbook. **Field Glass** is the confirmed elevated design direction: instrument-grade translucent chrome over a dark-premium navy world.

## Sections

| # | Section | Folder | What's in it |
|---|---|---|---|
| 01 | Grounds | `01-grounds/` | The six contracts side by side, and the laws across them |
| 02 | Navy Ground | `02-navy-ground/` | The default — the desert at dusk, and the card cut out of it |
| 03 | Photo Ground | `03-photo-ground/` | Full-bleed photography under a directional scrim |
| 04 | Field Glass | `04-field-glass/` | The instrument layer that floats over Navy and Photo |
| 05 | Terrain Paper | `05-terrain-paper/` | The field notebook — warm stock, tooth, contours, linework, and the frost plate it uses for a card |
| 06 | Roadbook Paper | `06-roadbook-paper/` | The working page; ships today in live scoring |
| 07 | Broadcast On-Air | `07-broadcast-on-air/` | The origin every other shape evolved from |
| 08 | Components | `08-components/` | Button, Chip and Card, the nav bar, fields and the enlist band, and the marks, icons and radii they share |
| 09 | Marks & Assets | `09-marks-and-assets/` | Shield, compass star, wordmark, official textures |
| 10 | Color | `10-color/` | Two official hues, the derived families, and which does which job on which ground |
| 11 | Type & measure | `11-type/` | Four faces, and every dimensional scale: type, space, size |
| 12 | Voice | `12-voice/` | Two registers, and how the rally talks |
| 13 | Principles | `13-principles/` | The nine, and how to decide when they collide |
| 14 | Imagery | `14-imagery/` | What to shoot, and how to choose between frames |
| 15 | Channels | `15-channels/` | Where the system ships, and which voice leads |
| 16 | Canon | `16-canon/` | Sources, build order, foundations, and the file index |
| 17 | Documents | `17-documents/` | Page-scale laws — section heads, the accent channel, the figure row, the texture fade (the Navy print with its mask inverted), the footer |
| — | Templates | `templates/` | Whole starting documents a consuming project copies — the cost sheet, on one ground and two |

**Folders match section numbers.** A ground owns its whole language in its own folder — tokens, element classes, and cards together. `styles.css` imports each ground's CSS directly; `tokens/` holds only what is brand-wide (fonts, brand colour, type, motion). **A card lives with the ground it is made of** — the box darker than the ground is Navy's, the frost plate is Terrain's; there is no ground-agnostic card, so section 08 documents the register they share and nothing that only makes sense on one ground.

**Build posture:** from scratch, piece by piece, each foundation locked before the next leans on it. Canon lives in prose docs (`uploads/`); section 16 renders it. Every claim carries its honesty mark — **◆ official** · **✅ observed** · **🟡 derived** · **❓ open**.
