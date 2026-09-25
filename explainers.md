# Rebelle Rally — explainers

How the rally explains its competition (the scoring, the checkpoints, the formats) on the
website and in video. The black diamond ([`src/black-diamond.ts`](src/black-diamond.ts)) is the
first one, built with Tami and Emily in September 2026, and the pattern for the rest.
[`voice.md`](voice.md) is how the words sound; [`principles.md`](principles.md) settles the
calls this leaves open. The design system carries it as the **19 · Explainers** card
(snapshot in [`design-sync/19-explainers/`](design-sync/19-explainers/)).

## One telling, every surface

A topic is written once, here in core, as a module with no framework in it: the rule's numbers,
the steps, each step's words, the geometry, and anything it draws on a map (through a narrow
interface such as `RingsMap`, so core needs no mapbox-gl). Every surface imports it and none
retypes a number or a word. Change a step's words here and the page and the clips follow.

| Surface | Where | What it adds |
|---|---|---|
| The page's interactive | rebelle-site `src/components/explainers/`, a Preact island | Step buttons, Play, autoplay in view, reduced motion |
| The explainer clips | `rebelle/clips`, Remotion (`BlackDiamondFlyover`) | A fixed camera path, frame by frame, for Rich's edit |
| The broadcast | `rebelle/clips` on Noelle's navy panel (`BlackDiamond`) | The overlay's frame, Tungsten type |

Build the web page first and take the clips from it: the interactive is where a step gets
tested by clicking through it, and a clip is that interactive with the camera held for you.

## The numbers come from the book

Every number cites its document, edition and PDF page, and a test pins the book's worked
example so an old number cannot come back. The black diamond reads the **2026 Competition
Handbook** (V.2026-0), not the Rulebook, which does not give the spacing:

- p. 11 — "50m Radius / 25m Step / 300m Max": 5 points inside 50 m, a point less every 25 m,
  0 from 150 m to 300 m.
- p. 12–13 — beyond 300 m is a wide miss (−10). Several signals at one black keep the lowest
  score; after a wide miss a team may use its position to move in and signal again.
- p. 51 — after every signal the tracker's Last Position screen shows the team's own position,
  in degrees and decimal minutes. It never shows the checkpoint or a distance.

Each day's CP Guide sets a black diamond's own three numbers; an explainer uses the Handbook's
example and says so.

## A step is a card and a picture

**The card leads with the answer.** For a scoring step that is the points, and one line under it
holds the rest:

| # | Card | Line | Colour |
|---|---|---|---|
| 1 | No flag | Only coordinates | white |
| 2 | 5 points | Inside 50 m | cyan |
| 3 | 3 points | 1 point less every 25 m | cyan |
| 4 | 0 points | 150–300 m · no penalty | white |
| 5 | −10 points | Wide miss · over 300 m | red |
| 6 | Coordinates | Shown after every signal | white |

- Cyan for points scored, white for zero and for anything that is not a score, red
  (`--loss-lift`) only for a penalty. The map carries the rest of the red.
- Names and numbers only. No sentences: the voiceover or the page's own prose explains. No
  interface words ("fly to the terrain", "tap to continue"), no beat numbers.
- Open on what the team is given (step 1) and close on what the team can do next (step 6).
- In video nothing is under 28 px at 1080p (a phone held sideways shows the frame at under half
  size). A card's value is set at 120 px on a 760 px glass, which holds about eleven capitals:
  "Your position" did not fit, "Coordinates" does.

**The picture is the ground.** The map is the Atlas sheet (light) on the page and in the clips,
Terrain Paper for plates, with real terrain under an invented place: the black diamond sits at
the foot of Nevada hills more than 100 km from any point of the 2026 course. Real course data
never goes in an explainer before its day is history.

- Rings are map layers, drawn on the ground, not an overlay over it.
- The checkpoint is Noelle's black diamond: black, a clean white edge, no label.
- A signal is a white dot ringed cyan when it scores and red when it is a wide miss, with its
  points beside it. The tracker's readout is a navy box of white mono type beside the signal
  (`trackerReadout` formats any place the way the screen does).
- Words over the map sit on Field Glass (`.fgi`). No navy scrim over the map.

## Motion

- The camera flies in over the hills (2.6 s from 6.5 km), then holds each step for 3.2 s and
  moves to the next in 0.7 s, eased. Each step's reach sets the zoom so its rings fill the frame;
  the pitch and bearing drift a little each step.
- On the page it plays when it comes into view; a step button stops it there. With reduced
  motion there is no fly-in and no ping, and the steps jump.

## How the work goes

1. Read the rule in the book and write the steps in core, with the test.
2. Build the page's interactive; look at it at 390, 834 and 1440 wide.
3. Render stills of the clip at the telling frames, options side by side; Tami picks.
4. Standardise the cards across the steps before building more.
5. Full renders once the list of changes for the round is done.

## The next topic

Copy the black diamond's shape: `src/<topic>.ts` with `RULE`, `STEPS` and whatever it draws,
a test that pins the book, an island in the site, a clip in `rebelle/clips`. Reuse the card
format and the colours above rather than inventing a new one. The checkpoints (green, blue,
black) are the proposed next topic.
