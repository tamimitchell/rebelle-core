/* @ds-bundle: {"format":4,"namespace":"RebelleRallyDesignSystem_4a29d0","components":[{"name":"CurtainTeamList","sourcePath":"components/broadcast/CurtainTeamList.jsx"},{"name":"FullscreenHeader","sourcePath":"components/broadcast/FullscreenHeader.jsx"},{"name":"LocationBadge","sourcePath":"components/broadcast/LocationBadge.jsx"},{"name":"SponsorLogo","sourcePath":"components/broadcast/SponsorLogo.jsx"},{"name":"StageInfoBadge","sourcePath":"components/broadcast/StageInfoBadge.jsx"},{"name":"StandingsHeader","sourcePath":"components/broadcast/StandingsHeader.jsx"},{"name":"TeamRowCurtain","sourcePath":"components/broadcast/TeamRowCurtain.jsx"},{"name":"TeamRowFullscreen","sourcePath":"components/broadcast/TeamRowFullscreen.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"RaceLine","sourcePath":"components/core/RaceLine.jsx"},{"name":"Star","sourcePath":"components/core/Star.jsx"},{"name":"TopoLines","sourcePath":"components/core/TopoLines.jsx"},{"name":"InstrumentCard","sourcePath":"components/fieldglass/InstrumentCard.jsx"},{"name":"InstrumentCell","sourcePath":"components/fieldglass/InstrumentCell.jsx"},{"name":"LiveChip","sourcePath":"components/fieldglass/LiveChip.jsx"},{"name":"Countdown","sourcePath":"components/marketing/Countdown.jsx"},{"name":"FeatureCard","sourcePath":"components/marketing/FeatureCard.jsx"},{"name":"PostCard","sourcePath":"components/marketing/PostCard.jsx"},{"name":"UtilityBar","sourcePath":"components/marketing/UtilityBar.jsx"}],"sourceHashes":{"components/broadcast/CurtainTeamList.jsx":"ea617057b473","components/broadcast/FullscreenHeader.jsx":"84a83e2caf3d","components/broadcast/LocationBadge.jsx":"7433f1a956b4","components/broadcast/SponsorLogo.jsx":"e52cd8782299","components/broadcast/StageInfoBadge.jsx":"48ea436168fe","components/broadcast/StandingsHeader.jsx":"0c8898363f00","components/broadcast/TeamRowCurtain.jsx":"f4c800797dcd","components/broadcast/TeamRowFullscreen.jsx":"c47effdc1231","components/core/Button.jsx":"e6a2a2b8312f","components/core/RaceLine.jsx":"053999fad544","components/core/Star.jsx":"967be381c0f9","components/core/TopoLines.jsx":"81f4825a0f63","components/fieldglass/InstrumentCard.jsx":"08fabbc9e132","components/fieldglass/InstrumentCell.jsx":"de1d59da1181","components/fieldglass/LiveChip.jsx":"bc189c128c0e","components/marketing/Countdown.jsx":"766b97c9263d","components/marketing/FeatureCard.jsx":"d464fdd81ba0","components/marketing/PostCard.jsx":"8ce716117cca","components/marketing/UtilityBar.jsx":"5512915b319b","ui_kits/broadcast-overlay/overlay.jsx":"ce037242f657","ui_kits/ios-app/ios-frame.jsx":"be3343be4b51","ui_kits/ios-app/screens.jsx":"166d5d3f7d50","ui_kits/marketing-web/marketing.jsx":"3b69b72b9fb4"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RebelleRallyDesignSystem_4a29d0 = window.RebelleRallyDesignSystem_4a29d0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/broadcast/FullscreenHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FullscreenHeader — big title block for the full-screen results board: a
 * year/event title (white) + a class/standings subtitle (cyan). "X-CROSS"
 * automatically gets the ® superscript.
 */
function FullscreenHeader({
  title = 'REBELLE RALLY',
  subtitle = '4X4 CLASS OVERALL STANDINGS',
  style,
  ...rest
}) {
  const renderSub = () => {
    const marker = subtitle.includes('X-CROSS®') ? 'X-CROSS®' : subtitle.includes('X-CROSS') ? 'X-CROSS' : null;
    if (!marker) return subtitle;
    const [before, after = ''] = subtitle.split(marker);
    return /*#__PURE__*/React.createElement(React.Fragment, null, before, "X-CROSS", /*#__PURE__*/React.createElement("sup", {
      style: {
        fontSize: '0.5em'
      }
    }, "\xAE"), after);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--bc-space-xl,20px)',
      flexWrap: 'wrap',
      width: '100%',
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: '100px',
      fontWeight: 'var(--fw-semibold,600)',
      lineHeight: 0.8,
      color: 'var(--rr-white,#fff)',
      whiteSpace: 'nowrap',
      flexShrink: 0
    }
  }, title), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: '60px',
      fontWeight: 'var(--fw-medium,500)',
      lineHeight: 0.8,
      color: 'var(--rr-blue,#189fda)',
      flex: 1,
      minWidth: 0
    }
  }, renderSub()));
}
Object.assign(__ds_scope, { FullscreenHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/broadcast/FullscreenHeader.jsx", error: String((e && e.message) || e) }); }

// components/broadcast/LocationBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LocationBadge — top-left location badge: DAY/DATE header, then three icon
 * rows — location name + state, GPS coordinates, and a type label (START /
 * FINISH). stateIcon and typeIcon are supplied by the consumer; the coordinate
 * pin is built in.
 */
function LocationBadge({
  day = 1,
  date = '',
  name = '',
  state = '',
  latitude = '',
  longitude = '',
  label = '',
  stateIcon = null,
  typeIcon = null,
  style,
  ...rest
}) {
  const row = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '10px',
    borderBottom: '1px solid var(--bc-panel-divider,#5b6a7c)'
  };
  const iconBox = {
    flexShrink: 0,
    width: '24px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const text = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--bc-data-lg,18px)',
    fontWeight: 'var(--fw-medium,500)',
    lineHeight: 1.2
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      width: '273px',
      height: '279px',
      boxSizing: 'border-box',
      padding: '21px 28px 20px 26px',
      background: 'var(--bc-panel)',
      borderRadius: 'var(--radius-card,8px)',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--rr-white,#fff)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      height: '56px',
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      lineHeight: 1
    }
  }, day <= 8 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '38px',
      fontWeight: 'var(--fw-semibold,600)'
    }
  }, "DAY ", day), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '26px',
      fontWeight: 'var(--fw-semibold,600)',
      color: 'var(--rr-blue,#189fda)',
      paddingTop: '3px'
    }
  }, (date || '').toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: 1,
      padding: '12px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: iconBox
  }, stateIcon), /*#__PURE__*/React.createElement("div", {
    style: text
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textTransform: 'uppercase'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.75)'
    }
  }, state))), /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: iconBox
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 28",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    style: {
      width: '100%',
      height: 'auto'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z",
    fill: "var(--rr-blue, #189fda)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: text
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'rgba(255,255,255,0.9)'
    }
  }, latitude), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'rgba(255,255,255,0.9)'
    }
  }, longitude))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...row,
      borderBottom: 'none',
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: iconBox
  }, typeIcon), /*#__PURE__*/React.createElement("div", {
    style: text
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textTransform: 'uppercase',
      marginTop: '2px'
    }
  }, label)))));
}
Object.assign(__ds_scope, { LocationBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/broadcast/LocationBadge.jsx", error: String((e && e.message) || e) }); }

// components/broadcast/SponsorLogo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SponsorLogo — presentation container for a sponsor logo on the curtain
 * overlay: fixed 200px width, drop-shadow for legibility over video, fade-in.
 * Rotation/interval is a consumer concern — swap `src` (or children) to rotate.
 */
function SponsorLogo({
  src,
  alt = '',
  transitioning = false,
  children,
  style,
  ...rest
}) {
  const media = {
    maxWidth: '100%',
    maxHeight: '100px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    filter: transitioning ? 'none' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))',
    opacity: transitioning ? 0 : 1,
    transition: 'opacity var(--d-quick,300ms) ease-in-out'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      width: '200px',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: media
  }) : /*#__PURE__*/React.createElement("div", {
    style: media
  }, children));
}
Object.assign(__ds_scope, { SponsorLogo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/broadcast/SponsorLogo.jsx", error: String((e && e.message) || e) }); }

// components/broadcast/StageInfoBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StageInfoBadge — top-left info badge for a competition day: DAY/DATE header,
 * TIME LIMIT + DISTANCE stats, and a difficulty rating (number + 5-star meter,
 * supports halves). Fallback panel fill; on-air a branded SVG frame sits behind.
 */
function StageInfoBadge({
  day = 1,
  date = '',
  timeLimit = '',
  distance = '',
  difficulty = 0,
  style,
  ...rest
}) {
  const full = Math.floor(difficulty);
  const half = difficulty % 1 !== 0;
  const stars = Array.from({
    length: 5
  }, (_, idx) => {
    const i = idx + 1;
    if (i <= full) return 'filled';
    if (i === full + 1 && half) return 'half';
    return 'empty';
  });
  const label = {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 'var(--fw-medium,500)',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      width: '273px',
      height: '279px',
      boxSizing: 'border-box',
      padding: 'var(--bc-space-lg,16px)',
      background: 'var(--bc-panel)',
      borderRadius: 'var(--radius-card,8px)',
      color: 'var(--rr-white,#fff)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--bc-space-md,8px)',
      marginBottom: 'var(--bc-space-lg,16px)',
      paddingBottom: '12px',
      borderBottom: '1px solid var(--bc-divider)',
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '24px',
      fontWeight: 'var(--fw-bold,700)'
    }
  }, "DAY ", day), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '17px',
      fontWeight: 'var(--fw-semibold,600)',
      color: 'var(--rr-blue,#189fda)'
    }
  }, (date || '').toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--bc-space-lg,16px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--bc-space-lg,16px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--bc-space-sm,4px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: label
  }, "TIME LIMIT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '22px',
      fontWeight: 'var(--fw-bold,700)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, timeLimit)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--bc-space-sm,4px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: label
  }, "DISTANCE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '22px',
      fontWeight: 'var(--fw-bold,700)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, distance))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--bc-space-md,8px)',
      paddingTop: '12px',
      borderTop: '1px solid var(--bc-divider-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--bc-space-md,8px)',
      fontSize: '32px',
      fontWeight: 'var(--fw-bold,700)',
      lineHeight: 1
    }
  }, difficulty, /*#__PURE__*/React.createElement("span", {
    style: label
  }, "DIFFICULTY")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '2px',
      fontSize: '20px'
    }
  }, stars.map((kind, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'relative',
      color: kind === 'filled' ? 'var(--rr-blue,#189fda)' : 'var(--bc-divider)'
    }
  }, "\u2605", kind === 'half' && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '50%',
      overflow: 'hidden',
      color: 'var(--rr-blue,#189fda)'
    }
  }, "\u2605")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      fontWeight: 'var(--fw-medium,500)',
      color: 'rgba(255,255,255,0.5)',
      letterSpacing: '0.3em'
    }
  }, "1 2 3 4 5"))));
}
Object.assign(__ds_scope, { StageInfoBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/broadcast/StageInfoBadge.jsx", error: String((e && e.message) || e) }); }

// components/broadcast/StandingsHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StandingsHeader — header block for a standings panel: REBELLE / RALLY wordmark,
 * a DAY · DATE · DISTANCE info strip, a STANDINGS title, and the POS · # · TEAM ·
 * PTS · % column-header row.
 */
function StandingsHeader({
  day = 1,
  date = '',
  distance = '',
  title = 'STANDINGS',
  style,
  ...rest
}) {
  const label = {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--bc-data-xs,11px)',
    textTransform: 'uppercase',
    opacity: 0.7
  };
  const value = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--bc-h4,16px)',
    fontWeight: 'var(--fw-semibold,600)',
    fontVariantNumeric: 'tabular-nums'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'linear-gradient(180deg, var(--rr-navy-broadcast,#0f223e) 0%, rgba(15,34,62,0.98) 100%)',
      padding: 'var(--bc-space-xl,20px) var(--bc-space-lg,16px)',
      borderBottom: 'var(--border-rule,2px) solid var(--rr-blue,#189fda)',
      color: 'var(--rr-white,#fff)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 'var(--bc-space-lg,16px)',
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '32px',
      fontWeight: 'var(--fw-bold,700)',
      color: 'var(--rr-blue,#189fda)',
      letterSpacing: '0.04em'
    }
  }, "REBELLE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '20px',
      marginTop: '-4px',
      color: 'var(--rr-white,#fff)',
      letterSpacing: '0.24em'
    }
  }, "RALLY")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      background: 'var(--bc-header-tint)',
      padding: 'var(--bc-space-md,8px)',
      borderRadius: 'var(--radius-chip,4px)',
      marginBottom: 'var(--bc-space-lg,16px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--bc-space-sm,4px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: label
  }, "DAY"), /*#__PURE__*/React.createElement("span", {
    style: value
  }, day)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--bc-space-sm,4px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: label
  }, "DATE"), /*#__PURE__*/React.createElement("span", {
    style: value
  }, date)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--bc-space-sm,4px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: label
  }, "DISTANCE"), /*#__PURE__*/React.createElement("span", {
    style: value
  }, distance))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--bc-h1,28px)',
      margin: 'var(--bc-space-lg,16px) 0',
      textTransform: 'uppercase',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '3rem 4rem 1fr 5rem 4rem',
      padding: 'var(--bc-space-md,8px) var(--bc-space-lg,16px)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--bc-col-header,11px)',
      fontWeight: 'var(--fw-semibold,600)',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.6)',
      borderTop: '1px solid var(--bc-divider)',
      borderBottom: '1px solid var(--bc-divider)',
      background: 'var(--bc-header-tint-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "POS"), /*#__PURE__*/React.createElement("span", null, "#"), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 'var(--bc-space-md,8px)'
    }
  }, "TEAM"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "PTS"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "%")));
}
Object.assign(__ds_scope, { StandingsHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/broadcast/StandingsHeader.jsx", error: String((e && e.message) || e) }); }

// components/broadcast/TeamRowCurtain.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const code = (name = '') => name.slice(0, 3).toUpperCase();

/**
 * TeamRowCurtain — one standings row for the lower-third "curtain" overlay.
 * Columns: position · team# · crew (3-letter codes) · points.
 */
function TeamRowCurtain({
  position,
  teamNumber,
  driver = '',
  coDriver = '',
  points,
  highlighted = false,
  odd = false,
  style,
  ...rest
}) {
  const row = {
    display: 'grid',
    gridTemplateColumns: '32px 34px 1fr 40px',
    alignItems: 'center',
    gap: '6px',
    padding: '0 var(--bc-space-md, 8px)',
    minHeight: 'var(--bc-row-height, 30px)',
    borderRadius: 'var(--radius-chip, 4px)',
    background: highlighted ? 'var(--bc-row-highlight)' : odd ? 'var(--bc-row-odd)' : 'transparent',
    boxShadow: highlighted ? 'var(--bc-glow-highlight)' : 'none',
    transition: 'background var(--d-quick) var(--ease)',
    ...style
  };
  const cell = {
    fontFamily: 'var(--font-body, "Inter", sans-serif)',
    fontSize: 'var(--bc-data-lg, 18px)',
    fontWeight: 'var(--fw-medium, 500)',
    lineHeight: 1.2,
    color: 'var(--rr-white, #fff)',
    textShadow: 'var(--bc-text-shadow)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: row
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      ...cell,
      textAlign: 'center',
      fontWeight: 'var(--fw-bold,700)',
      color: 'var(--rr-blue,#189fda)'
    }
  }, position), /*#__PURE__*/React.createElement("span", {
    style: {
      ...cell,
      textAlign: 'center'
    }
  }, teamNumber), /*#__PURE__*/React.createElement("span", {
    style: {
      ...cell,
      textTransform: 'uppercase',
      fontVariantNumeric: 'tabular-nums'
    }
  }, code(driver), "/", code(coDriver)), /*#__PURE__*/React.createElement("span", {
    style: {
      ...cell,
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  }, points));
}
Object.assign(__ds_scope, { TeamRowCurtain });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/broadcast/TeamRowCurtain.jsx", error: String((e && e.message) || e) }); }

// components/broadcast/CurtainTeamList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CurtainTeamList — the composite lower-third standings panel: title + class
 * header, RANK · TEAM · PTS column labels, up to 16 zebra-striped rows, and a
 * "real-time / unofficial" footer. The list owns zebra striping.
 */
function CurtainTeamList({
  teams = [],
  title = 'OVERALL RANKING',
  vehicleClass = '4X4 CLASS',
  footerText = 'REAL TIME · UNOFFICIAL',
  logo = null,
  style,
  ...rest
}) {
  const list = {
    boxSizing: 'border-box',
    width: '272px',
    minHeight: '525px',
    padding: 'var(--bc-space-lg, 16px) var(--bc-space-xl, 20px)',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bc-panel)',
    borderRadius: 'var(--radius-card, 8px)',
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: list
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '10px',
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, logo && /*#__PURE__*/React.createElement("div", {
    style: {
      width: '43px',
      flexShrink: 0
    }
  }, logo), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: logo ? '22px' : '36px',
      fontWeight: 'var(--fw-bold,700)',
      lineHeight: 1,
      textTransform: 'uppercase',
      color: 'var(--rr-white,#fff)'
    }
  }, title), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: '26px',
      fontWeight: 'var(--fw-bold,700)',
      lineHeight: 1,
      textTransform: 'uppercase',
      color: 'var(--rr-blue,#189fda)'
    }
  }, vehicleClass))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '70px 1fr 50px',
      alignItems: 'center',
      gap: '6px',
      padding: 'var(--bc-space-md,8px) var(--bc-space-md,8px) 0',
      marginBottom: 'var(--bc-space-sm,4px)',
      borderBottom: 'var(--border-rule,2px) solid var(--rr-blue,#189fda)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--bc-data-base,14px)',
      fontWeight: 'var(--fw-bold,700)',
      textTransform: 'uppercase',
      color: 'var(--rr-white,#fff)',
      textShadow: 'var(--bc-text-shadow)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "RANK"), /*#__PURE__*/React.createElement("span", null, "TEAM"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "PTS")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'hidden'
    }
  }, teams.slice(0, 16).map((t, i) => /*#__PURE__*/React.createElement(__ds_scope.TeamRowCurtain, _extends({
    key: t.teamNumber || i
  }, t, {
    odd: i % 2 === 0,
    highlighted: !!t.isHighlighted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 'var(--bc-space-md,8px)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--bc-data-base,14px)',
      fontWeight: 'var(--fw-medium,500)',
      textTransform: 'uppercase',
      textAlign: 'center',
      color: 'var(--rr-white,#fff)'
    }
  }, footerText));
}
Object.assign(__ds_scope, { CurtainTeamList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/broadcast/CurtainTeamList.jsx", error: String((e && e.message) || e) }); }

// components/broadcast/TeamRowFullscreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TeamRowFullscreen — a standings row for the full-screen results board.
 * Columns: rank · team# · crew (full names) · vehicle · points · completion %.
 */
function TeamRowFullscreen({
  position,
  teamNumber,
  driver = '',
  coDriver = '',
  vehicle = '',
  points = 0,
  completion,
  rookie = false,
  even = false,
  highlighted = false,
  style,
  ...rest
}) {
  const row = {
    display: 'grid',
    gridTemplateColumns: '60px 100px 340px 550px 80px 80px',
    gap: 'var(--bc-space-lg, 16px)',
    alignItems: 'center',
    padding: '6px 0',
    minHeight: '44px',
    borderRadius: 'var(--radius-chip, 4px)',
    background: highlighted ? 'var(--bc-row-highlight)' : even ? 'var(--bc-row-even-dark)' : 'transparent',
    borderTop: even ? '1px solid var(--bc-border)' : '1px solid transparent',
    borderBottom: even ? '1px solid var(--bc-border)' : '1px solid transparent',
    boxShadow: highlighted ? 'var(--bc-glow-highlight)' : 'none',
    ...style
  };
  const cell = {
    fontFamily: 'var(--font-body, "Inter", sans-serif)',
    fontSize: 'var(--bc-data-xl, 26px)',
    fontWeight: 'var(--fw-medium, 500)',
    lineHeight: 1.3,
    color: 'var(--rr-white, #fff)'
  };
  const num = {
    ...cell,
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: row
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      ...cell,
      textAlign: 'center'
    }
  }, position, rookie && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'var(--bc-space-md,8px)',
      fontSize: '0.7em',
      fontWeight: 'var(--fw-bold,700)',
      color: 'var(--rr-goldenhour-amber,#ffc04a)'
    }
  }, "ROOKIE")), /*#__PURE__*/React.createElement("span", {
    style: num
  }, teamNumber), /*#__PURE__*/React.createElement("span", {
    style: {
      ...cell,
      textAlign: 'left',
      textTransform: 'capitalize'
    }
  }, driver, " / ", coDriver), /*#__PURE__*/React.createElement("span", {
    style: {
      ...cell,
      textAlign: 'left'
    }
  }, vehicle), /*#__PURE__*/React.createElement("span", {
    style: num
  }, typeof points === 'number' ? points.toLocaleString() : points), /*#__PURE__*/React.createElement("span", {
    style: num
  }, completion != null ? `${completion}%` : ''));
}
Object.assign(__ds_scope, { TeamRowFullscreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/broadcast/TeamRowFullscreen.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — action button for Rebelle surfaces.
 *
 * Three variants mirroring the real Lit component:
 *  - primary: filled cyan on navy ink, hard navy offset-shadow on hover (hero CTAs)
 *  - ghost:   cyan outline on transparent (filter pills, secondary actions)
 *  - mono:    monospace micro-button on paper (tabular / data UI, timing)
 *
 * Square corners + hard offset shadow = the editorial/broadcast signature.
 * `register="glass"` (Field Glass surfaces) RETIRES the hard offset shadow:
 * 8px radius, gradient cyan fill / cyan outline, hover brightness lift + soft
 * cyan glow — instrument, not print. Applies to primary/ghost; mono stays editorial.
 */
function Button({
  variant = 'primary',
  register = 'editorial',
  size = 'md',
  href,
  disabled = false,
  onClick,
  children,
  style,
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-body, "Inter", sans-serif)',
    fontWeight: 'var(--fw-medium, 500)',
    lineHeight: 'var(--lh-snug, 1)',
    letterSpacing: 'var(--ls-label, 0.18em)',
    textTransform: 'uppercase',
    textDecoration: 'none',
    border: 'var(--border-rule, 2px) solid var(--rr-navy-deep, #0c1420)',
    borderRadius: 'var(--radius-none, 0)',
    background: 'var(--rr-blue, #189fda)',
    color: 'var(--rr-navy-deep, #0c1420)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    transition: 'transform 100ms var(--ease-out), box-shadow 100ms var(--ease-out), background 100ms var(--ease)',
    padding: size === 'sm' ? '10px 16px' : size === 'lg' ? '18px 30px' : '14px 20px',
    fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px'
  };
  const variants = {
    primary: {},
    ghost: {
      background: 'transparent',
      color: 'var(--rr-blue, #189fda)',
      borderColor: 'var(--rr-blue, #189fda)'
    },
    mono: {
      padding: '10px 14px',
      borderWidth: 'var(--border-hairline, 1px)',
      borderColor: 'var(--rr-ink, #171720)',
      background: 'var(--rr-paper, #f4f4f4)',
      color: 'var(--rr-ink, #171720)',
      fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
      fontSize: 'var(--fs-mono-data, 12px)',
      fontWeight: 'var(--fw-semibold, 600)',
      fontFeatureSettings: '"tnum"'
    }
  };

  // Field Glass register — the hard navy offset shadow is retired on glass.
  const glass = register === 'glass' && variant !== 'mono';
  const glassVariants = {
    primary: {
      border: 'none',
      borderRadius: '8px',
      background: 'linear-gradient(180deg, rgba(24,159,218,0.78) 0%, #189FDA 60%)',
      color: 'var(--rr-navy-deep, #0c1420)',
      fontFamily: 'var(--font-display, "Oswald", sans-serif)',
      fontWeight: 'var(--fw-semibold, 600)',
      letterSpacing: '0.12em',
      transition: 'filter 150ms var(--ease, ease), transform 150ms var(--ease-out, ease-out), box-shadow 150ms var(--ease-out, ease-out)'
    },
    ghost: {
      borderWidth: '1px',
      borderColor: 'rgba(24,159,218,0.7)',
      borderRadius: '8px',
      background: 'transparent',
      color: 'var(--rr-white, #ffffff)',
      fontFamily: 'var(--font-display, "Oswald", sans-serif)',
      letterSpacing: '0.12em',
      transition: 'background 150ms var(--ease, ease)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverShadow = {
    primary: 'var(--shadow-paper-offset, 4px 4px 0 0 #0d213d)',
    ghost: 'var(--shadow-paper-offset-blue, 4px 4px 0 0 #189fda)',
    mono: '2px 2px 0 0 var(--rr-ink, #171720)'
  };
  const glassHover = {
    // brightness lift + 1px rise + soft cyan glow underneath (approved)
    primary: {
      filter: 'brightness(1.1)',
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 20px rgba(24,159,218,0.35)'
    },
    // matches the primary's hover lightening amount
    ghost: {
      background: 'rgba(24,159,218,0.18)'
    }
  };
  const finalStyle = {
    ...base,
    ...variants[variant],
    ...(glass ? glassVariants[variant] : {}),
    ...(hover && !disabled ? glass ? glassHover[variant] : {
      transform: 'translateY(-1px)',
      boxShadow: hoverShadow[variant]
    } : {}),
    ...style
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      style: finalStyle
    }, handlers, rest), children);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    style: finalStyle,
    disabled: disabled,
    onClick: onClick
  }, handlers, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/RaceLine.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RaceLine — the Rebelle angled-segment rule.
 *
 * Three parallelogram segments accelerating into a solid cyan rule — the
 * motorsport gesture under mega-panel editorial columns and card fragments.
 * The segments ALWAYS brighten toward the content they point at
 * (opacity 0.3 → 0.55 → 1.0); `pointing` adapts to layout, never fixed.
 *
 * Live/route cyan by default — this is signal-adjacent ornament; keep it on
 * surfaces where cyan's job is "route/live", don't spray it decoratively.
 */
function RaceLine({
  pointing = 'right',
  color = 'var(--rr-blue, #189FDA)',
  height = 5,
  style,
  ...rest
}) {
  const widths = [10, 16, 28];
  const ops = [0.3, 0.55, 1];
  const skew = 4;
  // parallelogram leaning in the direction of travel
  const clip = pointing === 'right' ? `polygon(${skew}px 0, 100% 0, calc(100% - ${skew}px) 100%, 0 100%)` : `polygon(0 0, calc(100% - ${skew}px) 0, 100% 100%, ${skew}px 100%)`;
  const seg = (w, o, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: w,
      height,
      background: color,
      opacity: o,
      clipPath: clip,
      display: 'block',
      flex: 'none'
    }
  });
  const rule = /*#__PURE__*/React.createElement("span", {
    key: "rule",
    style: {
      height,
      flex: 1,
      background: color,
      borderRadius: height / 2,
      display: 'block'
    }
  });
  const children = pointing === 'right' ? [...widths.map((w, i) => seg(w, ops[i], i)), rule] : [rule, ...widths.map((w, i) => seg(widths[2 - i], ops[2 - i], i))];
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { RaceLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/RaceLine.jsx", error: String((e && e.message) || e) }); }

// components/core/Star.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Star — the Rebelle four-point north-star / compass motif.
 *
 * The recurring brand device: it terminates the "star ▸ hairline ▸ date"
 * corner lockup, punctuates footers, and marks section dividers. A clean
 * navigational sparkle (four points, long vertical axis) — NOT the full logo.
 *
 * Renders white by default (over navy); pass color for cyan/amber accents.
 */
function Star({
  size = 40,
  color = 'currentColor',
  glow = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size * 1.3,
    viewBox: "0 0 40 52",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    style: {
      color,
      filter: glow ? 'drop-shadow(0 0 8px rgba(24,159,218,0.6))' : 'drop-shadow(0 1px 10px rgba(13,33,61,0.35))',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("path", {
    d: "M20 0 L23 24 L40 26 L23 28 L20 52 L17 28 L0 26 L17 24 Z",
    fill: color
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 6 L21.4 24.6 L34 26 L21.4 27.4 L20 46 L18.6 27.4 L6 26 L18.6 24.6 Z",
    fill: "var(--rr-navy, #0d213d)",
    opacity: "0.0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M31.5 14.5 L22 24 M8.5 37.5 L18 28 M31.5 37.5 L22 28 M8.5 14.5 L18 24",
    stroke: color,
    strokeWidth: "0.75",
    opacity: "0.55"
  }));
}
Object.assign(__ds_scope, { Star });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Star.jsx", error: String((e && e.message) || e) }); }

// components/core/TopoLines.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TopoLines — the Rebelle terrain-contour motif.
 *
 * The recurring brand texture seen on the trailer wrap, the Day-N route
 * graphics, and the sponsor wall: fine cyan elevation-contour lines (topo /
 * mountain isolines) drawn on navy. Structure, not signal — uses --rr-line-topo,
 * never the live-cyan. Bottom-anchored nested "mountain" contours by default;
 * `variant="waves"` gives the flatter horizontal isolines of the sponsor wall;
 * `variant="terrain"` renders REAL contours — assets/topo-terrain.svg,
 * marching-squares isolines derived from actual Rebelle aerial dune photography
 * (never hand-drawn or generated jagged paths). Terrain is the Field Glass
 * register: layer opacity ~0.16, faded in via mask so lines emerge from the glass.
 *
 * Drop it absolutely-positioned inside any navy surface as a background layer.
 */
function TopoLines({
  variant = 'mountains',
  color = 'var(--rr-line-topo, #2e8fb8)',
  opacity,
  lines = 9,
  strokeWidth = 1.4,
  src = 'assets/topo-terrain.svg',
  fade = true,
  style,
  ...rest
}) {
  if (variant === 'terrain') {
    // Real-terrain contours (Field Glass register). Stroke color/width live in the
    // SVG file (#2E8FB8 @ 1.5px). ALWAYS faded in so lines emerge from the glass.
    const mask = fade ? 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 50%, #000 85%)' : undefined;
    return /*#__PURE__*/React.createElement("img", _extends({
      src: src,
      alt: "",
      "aria-hidden": "true",
      style: {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: opacity ?? 0.16,
        pointerEvents: 'none',
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style
      }
    }, rest));
  }
  const op = opacity ?? 0.5;
  const W = 1200,
    H = 600;
  const paths = [];
  if (variant === 'waves') {
    // flatter horizontal isolines drifting across the surface (sponsor-wall register)
    for (let i = 0; i < lines; i++) {
      const y = H / (lines + 1) * (i + 1);
      const amp = 26 + i % 3 * 16;
      const d = `M0 ${y} C ${W * 0.2} ${y - amp}, ${W * 0.35} ${y + amp}, ${W * 0.5} ${y} S ${W * 0.8} ${y - amp}, ${W} ${y - amp * 0.4}`;
      paths.push(d);
    }
  } else {
    // nested bottom-anchored peak contours (trailer / Day-N register)
    for (let i = 0; i < lines; i++) {
      const k = i / lines;
      const lift = 120 + k * 300; // higher index → taller peaks
      const base = H + 40;
      const p1 = W * (0.18 + k * 0.04),
        p2 = W * (0.52 - k * 0.05),
        p3 = W * (0.82 + k * 0.02);
      const d = `M-40 ${base} L${p1} ${base - lift * 0.7} L${W * 0.34} ${base - lift * 0.35} L${p2} ${base - lift} L${W * 0.66} ${base - lift * 0.45} L${p3} ${base - lift * 0.8} L${W + 40} ${base - lift * 0.3} L${W + 40} ${base} Z`;
      paths.push(d);
    }
  }
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: "xMidYMax slice",
    "aria-hidden": "true",
    style: {
      display: 'block',
      width: '100%',
      height: '100%',
      opacity: op,
      ...style
    }
  }, rest), paths.map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: d,
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeOpacity: variant === 'mountains' ? 0.35 + i / lines * 0.5 : 0.4 + i % 3 * 0.2
  })));
}
Object.assign(__ds_scope, { TopoLines });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TopoLines.jsx", error: String((e && e.message) || e) }); }

// components/fieldglass/InstrumentCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * InstrumentCard — the hero status card of the Field Glass system.
 *
 * A glass instrument cluster: outer frame with a cyan bloom from bottom-right
 * over a 135° depth gradient (top-left is the most transparent point), an inner
 * "groove" ring — a 1.5px gradient border cut into the glass with a glimmer of
 * cyan, not a painted line — and column separators that never touch top/bottom.
 * Children are the columns (use InstrumentCell); separators are added between
 * them automatically. Entrance: settles once, needle-finding-north.
 */
function InstrumentCard({
  columns,
  settle = true,
  cellPadding = '18px 22px',
  style,
  children,
  ...rest
}) {
  const kids = React.Children.toArray(children);
  const gridColumns = columns || `repeat(${Math.max(kids.length, 1)}, 1fr)`;
  const separator = {
    borderRight: '1px solid transparent',
    borderImage: 'linear-gradient(180deg, transparent 14%, rgba(200,204,208,0.2) 34%, rgba(200,204,208,0.2) 66%, transparent 86%) 1'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'linear-gradient(to top left, rgba(24,159,218,0.18) 0%, rgba(24,159,218,0) 38%), linear-gradient(135deg, rgba(13,33,61,0.38) 0%, rgba(12,20,32,0.88) 100%)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderRadius: 14,
      padding: 6,
      boxShadow: '0 18px 44px rgba(0,0,0,0.45)',
      animation: settle ? 'rrHeroSettle 700ms cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("style", null, '@keyframes rrHeroSettle{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@media (prefers-reduced-motion: reduce){.rr-instrument-card,[data-rr-instrument]{animation:none !important}}'), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 9,
      boxShadow: 'inset 0 0 28px rgba(24,159,218,0.09), inset 0 1px 3px rgba(0,0,0,0.35)',
      display: 'grid',
      gridTemplateColumns: gridColumns
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9,
      padding: 1.5,
      background: 'linear-gradient(305deg, rgba(24,159,218,0.5) 0%, rgba(200,204,208,0.22) 42%, rgba(200,204,208,0.22) 58%, rgba(24,159,218,0.5) 100%)',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      pointerEvents: 'none'
    }
  }), kids.map((child, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: cellPadding,
      ...(i < kids.length - 1 ? separator : {})
    }
  }, child))));
}
Object.assign(__ds_scope, { InstrumentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/fieldglass/InstrumentCard.jsx", error: String((e && e.message) || e) }); }

// components/fieldglass/InstrumentCell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * InstrumentCell — one column of an InstrumentCard.
 *
 * The instrument micro-label voice: mono caps label (silver), Oswald value in
 * pure white (with optional leading icon), one Inter support line, plus any
 * extra children (progress bar, CTA row). Pure white for readable copy —
 * no gray/off-white tints on glass.
 */
function InstrumentCell({
  label,
  value,
  support,
  icon,
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, rest), label != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--rr-metal-silver, #C8CCD0)'
    }
  }, label), value != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, icon, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display, "Oswald", sans-serif)',
      fontSize: 19,
      fontWeight: 600,
      color: 'var(--rr-white, #FFFFFF)',
      lineHeight: 1
    }
  }, value)), support != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body, "Inter", sans-serif)',
      fontSize: 11.5,
      color: 'var(--rr-white, #FFFFFF)'
    }
  }, support), children);
}
Object.assign(__ds_scope, { InstrumentCell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/fieldglass/InstrumentCell.jsx", error: String((e && e.message) || e) }); }

// components/fieldglass/LiveChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LiveChip — the Field Glass live indicator.
 *
 * On Field Glass surfaces the live signal is CYAN (governance: cyan = live/you);
 * broadcast red #FF0000 stays exclusively on the OBS on-air overlay. Light glass
 * ground, 1px gradient border ring (mask-composite), solid cyan dot (the pulse
 * is the one allowed content loop), Oswald caps label in pure white.
 */
function LiveChip({
  label = 'LIVE NOW',
  pulse = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '10px 17px',
      borderRadius: 9,
      background: 'linear-gradient(135deg, rgba(13,33,61,0.22) 0%, rgba(12,20,32,0.5) 100%)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("style", null, '@keyframes rrLiveDotPulse{0%,100%{opacity:1}50%{opacity:0.35}}@media (prefers-reduced-motion: reduce){.rr-live-dot{animation:none !important}}'), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9,
      padding: 1,
      background: 'linear-gradient(305deg, rgba(24,159,218,0.9) 0%, rgba(24,159,218,0.3) 35%, rgba(200,204,208,0.25) 60%, rgba(24,159,218,0.55) 100%)',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "rr-live-dot",
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--rr-blue, #189FDA)',
      animation: pulse ? 'rrLiveDotPulse 3s ease-in-out infinite' : 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display, "Oswald", sans-serif)',
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--rr-white, #FFFFFF)',
      lineHeight: 1
    }
  }, label));
}
Object.assign(__ds_scope, { LiveChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/fieldglass/LiveChip.jsx", error: String((e && e.message) || e) }); }

// components/marketing/Countdown.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Countdown — a row of navy stat tiles (big number + small label), as on the
 * rebellerally.com event countdown. Presentation only: pass pre-formatted units.
 * Square corners, Open Sans — codify, don't redesign.
 */
function Countdown({
  units = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 'var(--space-1,20px)',
      flexWrap: 'wrap',
      ...style
    }
  }, rest), units.map((u, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: '0 0 120px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--bc-space-sm,4px)',
      padding: 'var(--space-1,20px) var(--bc-space-md,8px)',
      background: 'var(--rr-navy,#0d213d)',
      color: 'var(--rr-white,#fff)',
      borderRadius: 'var(--radius-none,0)',
      fontFamily: 'var(--font-magazine,"Open Sans",sans-serif)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '35px',
      fontWeight: 'var(--fw-regular,400)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, u.value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--bc-data-base,14px)',
      fontWeight: 'var(--fw-regular,400)',
      lineHeight: 1
    }
  }, u.label))));
}
Object.assign(__ds_scope, { Countdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/Countdown.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FeatureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FeatureCard — the image-box feature/nav tile from rebellerally.com (Explore /
 * Format / Train / FAQs): a photo on top, a condensed title, a short description.
 * The whole tile links when `href` is set.
 */
function FeatureCard({
  heading = '',
  description = '',
  href,
  image = null,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const body = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'block',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: hover ? 'scale(1.04)' : 'scale(1)',
      transition: 'transform var(--d-extended,500ms) var(--ease-out)'
    }
  }, image)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: '28px',
      fontWeight: 'var(--fw-semibold,600)',
      lineHeight: 1.1,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      color: 'var(--rr-ink,#171720)'
    }
  }, heading), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-magazine,"Open Sans",sans-serif)',
      fontSize: 'var(--bc-h4,16px)',
      fontWeight: 'var(--fw-light,300)',
      lineHeight: 1.5,
      color: 'var(--rr-text,#333)'
    }
  }, description));
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--bc-space-md,8px)',
    textDecoration: 'none',
    color: 'inherit',
    ...style
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  };
  return href ? /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    style: wrap
  }, handlers, rest), body) : /*#__PURE__*/React.createElement("div", _extends({
    style: wrap
  }, handlers, rest), body);
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PostCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PostCard — the news/blog post card from rebellerally.com: thumbnail, date,
 * title, excerpt, and a "Read More" link. Magazine flavor (Open Sans).
 */
function PostCard({
  heading = '',
  excerpt = '',
  date = '',
  href,
  image = null,
  readMoreLabel = 'Read More »',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--bc-space-md,8px)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'block',
      overflow: 'hidden'
    }
  }, image), date && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-magazine,"Open Sans",sans-serif)',
      fontSize: 'var(--bc-data-sm,12px)',
      lineHeight: 1.3,
      color: 'var(--rr-gray-400,#ababab)'
    }
  }, date), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-magazine,"Open Sans",sans-serif)',
      fontSize: '18px',
      fontWeight: 'var(--fw-regular,400)',
      lineHeight: 1.2,
      letterSpacing: '-0.2px',
      color: 'var(--rr-text,#333)'
    }
  }, href ? /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, heading) : heading), excerpt && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-magazine,"Open Sans",sans-serif)',
      fontSize: 'var(--bc-h4,16px)',
      lineHeight: 1.5,
      color: 'var(--rr-text,#333)'
    }
  }, excerpt), href && /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      alignSelf: 'flex-start',
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--bc-data-sm,12px)',
      fontWeight: 'var(--fw-bold,700)',
      letterSpacing: 'var(--ls-label,0.18em)',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: 'var(--rr-blue,#189fda)'
    }
  }, readMoreLabel));
}
Object.assign(__ds_scope, { PostCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PostCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/UtilityBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * UtilityBar — the thin navy strip at the top of rebellerally.com. A full-bleed
 * band for a short utility line (event dates, announcements). Right-aligned by
 * default (matches the live site).
 */
function UtilityBar({
  align = 'end',
  children,
  style,
  ...rest
}) {
  const justify = align === 'start' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--rr-navy,#0d213d)',
      color: 'var(--rr-white,#fff)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: justify,
      padding: 'var(--bc-space-md,8px) var(--space-1,20px)',
      fontFamily: 'var(--font-magazine,"Open Sans",sans-serif)',
      fontSize: 'var(--bc-h4,16px)',
      fontWeight: 'var(--fw-regular,400)',
      lineHeight: 1
    }
  }, children));
}
Object.assign(__ds_scope, { UtilityBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/UtilityBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/broadcast-overlay/overlay.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Rebelle Rally — Broadcast overlay kit.
   Two OBS surfaces: FULLSCREEN standings board + CURTAIN lower-third panel.
   Composes the DS broadcast components over field photography. */
const NS = window.RebelleRallyDesignSystem_4a29d0;
const {
  FullscreenHeader,
  TeamRowFullscreen,
  CurtainTeamList,
  StageInfoBadge,
  SponsorLogo,
  Button,
  Star
} = NS;
const FS_TEAMS = [{
  position: 1,
  teamNumber: '129',
  driver: 'Barlow',
  coDriver: 'Petereit',
  vehicle: '2024 Jeep Gladiator Mojave',
  points: 1380,
  completion: 91
}, {
  position: 2,
  teamNumber: '150',
  driver: 'Hall',
  coDriver: 'Lewis',
  vehicle: '2023 Ford Bronco Raptor',
  points: 1321,
  completion: 87
}, {
  position: 3,
  teamNumber: '152',
  driver: 'Barber',
  coDriver: 'Brophy',
  vehicle: '2024 Toyota Tacoma',
  points: 1299,
  completion: 86
}, {
  position: 4,
  teamNumber: '188',
  driver: 'Wanlass',
  coDriver: 'Dale',
  vehicle: '2022 Ford Bronco Raptor',
  points: 1279,
  completion: 84
}, {
  position: 5,
  teamNumber: '167',
  driver: 'Campbell',
  coDriver: 'Blinson',
  vehicle: '2024 Ford Ranger Raptor',
  points: 1260,
  completion: 83
}, {
  position: 6,
  teamNumber: '122',
  driver: 'Hlavnicka',
  coDriver: 'Carlson',
  vehicle: '2023 Ford Bronco Raptor',
  points: 1252,
  completion: 82
}, {
  position: 7,
  teamNumber: '131',
  driver: 'Haydon',
  coDriver: 'Smith',
  vehicle: '2023 Ford Bronco Wildtrak',
  points: 1239,
  completion: 82
}, {
  position: 8,
  teamNumber: '128',
  driver: 'Pieper',
  coDriver: 'Young',
  vehicle: '2024 INEOS Grenadier Trial',
  points: 1201,
  completion: 79
}];
const CURTAIN_TEAMS = FS_TEAMS.map(t => ({
  position: t.position,
  teamNumber: t.teamNumber,
  driver: t.driver,
  coDriver: t.coDriver,
  points: t.points,
  isHighlighted: t.position === 2
}));
function FullscreenBoard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/hero-dune-gold.jpg",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(12,20,32,0.92) 0%, rgba(12,20,32,0.78) 45%, rgba(12,20,32,0.35) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 80,
      top: 90,
      right: 120,
      bottom: 90,
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid rgba(24,159,218,0.35)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(13,33,61,0.55)',
      backdropFilter: 'blur(10px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '48px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/rebelle-logo-blue.svg",
    style: {
      height: 120,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(FullscreenHeader, {
    title: "2025 REBELLE RALLY",
    subtitle: "4X4 CLASS OVERALL STANDINGS"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: 'grid',
      gridTemplateColumns: '60px 100px 340px 550px 80px 80px',
      gap: 16,
      padding: '0 0 10px',
      borderBottom: '2px solid rgba(24,159,218,0.8)',
      fontFamily: 'var(--font-body)',
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '0.06em',
      color: 'rgba(255,255,255,0.6)',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, "RANK"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, "TEAM"), /*#__PURE__*/React.createElement("span", null, "DRIVER / CO-DRIVER"), /*#__PURE__*/React.createElement("span", null, "VEHICLE"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, "PTS"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, FS_TEAMS.map((t, i) => /*#__PURE__*/React.createElement(TeamRowFullscreen, _extends({
    key: t.teamNumber
  }, t, {
    even: i % 2 === 1
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 80,
      bottom: 30,
      display: 'flex',
      alignItems: 'center',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      letterSpacing: '0.16em',
      color: 'rgba(255,255,255,0.7)',
      textTransform: 'uppercase'
    }
  }, "Live Presented By"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/sponsors/toyota-logo-fullscreen.svg",
    style: {
      height: 34
    }
  })));
}
function CurtainSurface() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/hero-desert.jpg",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(12,20,32,0.95) 0%, rgba(12,20,32,0.9) 24%, rgba(12,20,32,0) 42%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 40,
      top: 48,
      transform: 'scale(1.2)',
      transformOrigin: 'top left'
    }
  }, /*#__PURE__*/React.createElement(StageInfoBadge, {
    day: 4,
    date: "Oct 15",
    timeLimit: "6H 30M",
    distance: "270 KM",
    difficulty: 3.5
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 40,
      top: 430,
      transform: 'scale(1.35)',
      transformOrigin: 'top left'
    }
  }, /*#__PURE__*/React.createElement(CurtainTeamList, {
    vehicleClass: "4X4 CLASS",
    teams: CURTAIN_TEAMS
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 40,
      bottom: 40
    }
  }, /*#__PURE__*/React.createElement(SponsorLogo, {
    src: "../../assets/sponsors/toyota-logo-fullscreen.svg",
    alt: "Toyota"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 620,
      bottom: 48
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/rebelle-logo-blue.svg",
    style: {
      height: 130
    }
  })));
}
function OverlayKit() {
  const [mode, setMode] = React.useState('fullscreen');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "canvas"
  }, mode === 'fullscreen' ? /*#__PURE__*/React.createElement(FullscreenBoard, null) : /*#__PURE__*/React.createElement(CurtainSurface, null)), /*#__PURE__*/React.createElement("div", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("span", {
    className: "switch-lbl"
  }, "OBS Surface"), /*#__PURE__*/React.createElement("button", {
    className: mode === 'fullscreen' ? 'on' : '',
    onClick: () => setMode('fullscreen')
  }, "Fullscreen"), /*#__PURE__*/React.createElement("button", {
    className: mode === 'curtain' ? 'on' : '',
    onClick: () => setMode('curtain')
  }, "Curtain")));
}
window.OverlayKit = OverlayKit;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/broadcast-overlay/overlay.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ios-app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ios-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ios-app/screens.jsx
try { (() => {
/* Rebelle Rally — iOS app screens (Field Glass direction).
   Dark navy ground, Liquid-Glass navigation layer over opaque content.
   Loads after ios-frame.jsx (IOSDevice) and the DS bundle. */

const RR = {
  navy: '#0d213d',
  navyDeep: '#0c1420',
  blue: '#189fda',
  blueDeep: '#118899',
  white: '#fff',
  sand: '#d8c3a0',
  amber: '#ffc04a',
  up: '#10b981',
  down: '#df1f26',
  display: '"Oswald", "Arial Narrow", sans-serif',
  body: '"Inter", system-ui, sans-serif',
  mono: '"IBM Plex Mono", monospace'
};

/* ---- shared bits -------------------------------------------------------- */
function Glass({
  children,
  style,
  radius = 18,
  tint = 0.42
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: radius,
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: `rgba(13,33,61,${tint})`,
      backdropFilter: 'blur(14px) saturate(140%)',
      WebkitBackdropFilter: 'blur(14px) saturate(140%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: radius,
      border: '0.5px solid rgba(255,255,255,0.14)',
      boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.08)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, children));
}
function CompassRose({
  size = 130,
  opacity = 0.9
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 200 200",
    style: {
      opacity
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "94",
    fill: "none",
    stroke: "rgba(200,204,208,0.35)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "78",
    fill: "none",
    stroke: "rgba(24,159,218,0.35)",
    strokeWidth: "0.75",
    strokeDasharray: "2 4"
  }), Array.from({
    length: 72
  }).map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: "100",
    y1: "10",
    x2: "100",
    y2: i % 9 === 0 ? 20 : 15,
    stroke: "rgba(200,204,208,0.4)",
    strokeWidth: "0.6",
    transform: `rotate(${i * 5} 100 100)`
  })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M100 22 L110 100 L100 100 Z",
    fill: "#c8ccd0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M100 22 L90 100 L100 100 Z",
    fill: "#9da3ab"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M100 178 L110 100 L100 100 Z",
    fill: "#6b7178"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M100 178 L90 100 L100 100 Z",
    fill: "#4a4e52"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M178 100 L100 90 L100 100 Z",
    fill: "#9da3ab"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M178 100 L100 110 L100 100 Z",
    fill: "#6b7178"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 100 L100 90 L100 100 Z",
    fill: "#c8ccd0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 100 L100 110 L100 100 Z",
    fill: "#9da3ab"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "6",
    fill: RR.navyDeep,
    stroke: "#c8ccd0",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: "100",
    y: "14",
    fill: RR.blue,
    fontSize: "11",
    fontFamily: RR.display,
    fontWeight: "600",
    textAnchor: "middle"
  }, "N"));
}
const progressDots = (total, done) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 5,
    alignItems: 'center'
  }
}, Array.from({
  length: total
}).map((_, i) => /*#__PURE__*/React.createElement("div", {
  key: i,
  style: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    background: i < done ? RR.blue : 'rgba(255,255,255,0.18)'
  }
})));
const cardLabel = t => /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: RR.display,
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)'
  }
}, t);

/* ---- TODAY -------------------------------------------------------------- */
function TodayScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '58px 20px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 12,
      letterSpacing: '0.28em',
      color: 'rgba(255,255,255,0.6)',
      textTransform: 'uppercase'
    }
  }, "Rebelle Rally"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 66,
      fontWeight: 600,
      lineHeight: 0.9,
      color: '#fff',
      textTransform: 'uppercase',
      marginTop: 4,
      whiteSpace: 'nowrap'
    }
  }, "Day 4"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.mono,
      fontSize: 12,
      letterSpacing: '0.1em',
      color: 'rgba(255,255,255,0.7)',
      marginTop: 12
    }
  }, "THU, OCT 17"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.mono,
      fontSize: 11,
      letterSpacing: '0.1em',
      color: RR.blue,
      marginTop: 3
    }
  }, "STAGE 4 OF 7")), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(CompassRose, {
    size: 96
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, progressDots(7, 4)), /*#__PURE__*/React.createElement(Glass, {
    style: {
      marginTop: 18,
      padding: 16
    }
  }, cardLabel('Stage Status'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 24,
      fontWeight: 600,
      color: RR.blue,
      textTransform: 'uppercase',
      marginTop: 4
    }
  }, "In Progress"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      marginTop: 8,
      fontFamily: RR.body,
      fontSize: 13,
      color: 'rgba(255,255,255,0.85)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Checkpoint ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, "5 of 9")), /*#__PURE__*/React.createElement("span", null, "Closes ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, "16:30")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Glass, {
    style: {
      padding: 14
    }
  }, cardLabel('Weather'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 20,
      fontWeight: 600,
      color: '#fff',
      marginTop: 4
    }
  }, "CLEAR \u2600"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 6,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "H 28\xB0 \xA0 L 15\xB0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 11,
      color: 'rgba(255,255,255,0.55)',
      marginTop: 2
    }
  }, "Wind NW 12 km/h")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 18,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/field-4.jpg",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(0deg,rgba(13,33,61,0.92),rgba(13,33,61,0.15))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 14,
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }
  }, cardLabel('Basecamp'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 20,
      fontWeight: 600,
      color: '#fff',
      textTransform: 'uppercase'
    }
  }, "Al Wajh"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 11,
      color: 'rgba(255,255,255,0.75)',
      marginTop: 2
    }
  }, "Rest day tomorrow")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 18,
      overflow: 'hidden',
      marginTop: 12,
      background: `radial-gradient(120% 100% at 50% 0%, ${RR.navy}, ${RR.navyDeep})`,
      border: '0.5px solid rgba(255,255,255,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 16px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "38",
    viewBox: "0 0 40 52"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 0 L23 24 L40 26 L23 28 L20 52 L17 28 L0 26 L17 24 Z",
    fill: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.06em',
      color: '#fff',
      textTransform: 'uppercase'
    }
  }, "Endurance + Accuracy"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 14,
      fontFamily: RR.mono,
      fontSize: 10.5,
      letterSpacing: '0.08em',
      color: 'rgba(255,255,255,0.5)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "UPDATED 5 MIN AGO"), /*#__PURE__*/React.createElement("span", null, "OFFLINE CACHE OK \u2713")));
}

/* ---- STANDINGS ---------------------------------------------------------- */
const STANDINGS = [{
  pos: 1,
  num: '104',
  name: 'SANDSTORM',
  crew: 'A. Kincaid / L. Perez',
  pts: '1,247',
  chk: 15,
  delta: 2,
  leader: true
}, {
  pos: 2,
  num: '118',
  name: 'NORTH STAR',
  crew: 'M. Andersen / K. Wu',
  pts: '1,182',
  chk: 15,
  delta: 0,
  you: true
}, {
  pos: 3,
  num: '111',
  name: 'DESERT ROSE',
  crew: 'J. Miller / T. Novak',
  pts: '1,068',
  chk: 14,
  delta: -1
}, {
  pos: 4,
  num: '102',
  name: 'WILD SAGE',
  crew: 'R. Solis / J. Hart',
  pts: '998',
  chk: 13,
  delta: 1
}, {
  pos: 5,
  num: '107',
  name: 'IRON BLOOM',
  crew: 'C. Briggs / S. Lee',
  pts: '965',
  chk: 13,
  delta: -1
}, {
  pos: 6,
  num: '109',
  name: 'HIGH DESERT',
  crew: 'K. Walker / D. Patel',
  pts: '872',
  chk: 12,
  delta: 0
}, {
  pos: 7,
  num: '115',
  name: 'LUNA RUNNERS',
  crew: 'E. James / P. Chen',
  pts: '799',
  chk: 11,
  delta: 1
}, {
  pos: 8,
  num: '120',
  name: 'SALT & STONE',
  crew: 'N. Darwin / L. Foster',
  pts: '743',
  chk: 11,
  delta: -1
}];
function Delta({
  d
}) {
  if (d === 0) return /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(255,255,255,0.35)',
      fontSize: 13
    }
  }, "\u2014");
  const up = d > 0;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: up ? RR.up : RR.down,
      fontSize: 12,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, up ? '▲' : '▼', Math.abs(d));
}
function StandingsScreen() {
  const [tab, setTab] = React.useState('OVERALL');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '58px 16px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 46,
      fontWeight: 600,
      color: '#fff',
      textTransform: 'uppercase',
      lineHeight: 0.9
    }
  }, "Standings"), /*#__PURE__*/React.createElement(Glass, {
    radius: 999,
    style: {
      width: 40,
      height: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6h16M7 12h10M10 18h4",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.display,
      fontSize: 13,
      letterSpacing: '0.16em',
      color: RR.blue,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: RR.blue,
      display: 'inline-block'
    },
    className: "rr-pulse"
  }), "LIVE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.mono,
      fontSize: 10,
      letterSpacing: '0.08em',
      color: 'rgba(255,255,255,0.5)'
    }
  }, "UPDATED 5 MIN AGO")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 14,
      marginBottom: 14
    }
  }, ['OVERALL', 'STAGE 4', 'ROOKIE', 'LEGACY'].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      flex: 1,
      padding: '9px 4px',
      fontFamily: RR.display,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      borderRadius: 999,
      cursor: 'pointer',
      border: '1px solid ' + (tab === t ? RR.blue : 'rgba(255,255,255,0.18)'),
      background: tab === t ? RR.blue : 'transparent',
      color: tab === t ? RR.navyDeep : 'rgba(255,255,255,0.7)'
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '28px 1fr 58px 34px 30px',
      gap: 8,
      padding: '0 12px 8px',
      fontFamily: RR.body,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.1em',
      color: 'rgba(255,255,255,0.45)',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", null, "POS"), /*#__PURE__*/React.createElement("span", null, "TEAM"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "PTS"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, "CHK"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, "\u0394")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, STANDINGS.map(t => /*#__PURE__*/React.createElement(Glass, {
    key: t.num,
    tint: t.leader ? 0.55 : 0.32,
    style: {
      padding: '11px 12px',
      boxShadow: t.leader ? '0 0 16px rgba(24,159,218,0.25)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '28px 1fr 58px 34px 30px',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.display,
      fontSize: 20,
      fontWeight: 700,
      color: t.leader ? RR.blue : '#fff'
    }
  }, t.pos), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.mono,
      fontSize: 10,
      color: 'rgba(255,255,255,0.5)'
    }
  }, "#", t.num), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.display,
      fontSize: 15,
      fontWeight: 600,
      color: '#fff',
      textTransform: 'uppercase',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, t.name), t.leader && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 40 52",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 0 L23 24 L40 26 L23 28 L20 52 L17 28 L0 26 L17 24 Z",
    fill: RR.blue
  })), t.you && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.mono,
      fontSize: 8,
      letterSpacing: '0.1em',
      color: RR.blue,
      border: '1px solid ' + RR.blue,
      borderRadius: 3,
      padding: '1px 4px'
    }
  }, "YOU")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 10.5,
      color: 'rgba(255,255,255,0.5)',
      marginTop: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, t.crew)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.body,
      fontSize: 15,
      fontWeight: 700,
      color: '#fff',
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  }, t.pts), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.mono,
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      textAlign: 'center'
    }
  }, t.chk), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Delta, {
    d: t.delta
  })))))));
}

/* ---- ROUTE STORY -------------------------------------------------------- */
function RouteScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 812
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/terrain-aerial.jpg",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg,rgba(12,20,32,0.75) 0%,rgba(12,20,32,0.25) 30%,rgba(12,20,32,0.35) 60%,rgba(12,20,32,0.92) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '58px 16px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Glass, {
    radius: 999,
    style: {
      width: 38,
      height: 38
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "18",
    viewBox: "0 0 12 20"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: "#fff",
    strokeWidth: "2.5",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 26,
      fontWeight: 600,
      color: '#fff',
      textTransform: 'uppercase',
      textShadow: '0 2px 8px rgba(0,0,0,0.5)'
    }
  }, "Route Story"), /*#__PURE__*/React.createElement(Glass, {
    radius: 999,
    style: {
      height: 38,
      padding: '0 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 38,
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: RR.display,
      fontSize: 13,
      fontWeight: 600,
      color: '#fff'
    }
  }, "DAY 4 \u25BE"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 380,
      margin: '10px 0'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 360 380",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M250 40 L245 120 L200 175 L215 250 L150 330",
    fill: "none",
    stroke: "rgba(255,255,255,0.35)",
    strokeWidth: "2",
    strokeDasharray: "3 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M245 120 L200 175 L215 250",
    fill: "none",
    stroke: RR.blue,
    strokeWidth: "3",
    filter: "url(#glow)"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "glow"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "3",
    result: "b"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    in: "b"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), [['CP6', 250, 40, 'open'], ['CP5', 245, 120, 'you'], ['CP4', 200, 175, 'done'], ['CP3', 215, 250, 'done'], ['CP2', 150, 330, 'done']].map(([id, x, y, st]) => /*#__PURE__*/React.createElement("g", {
    key: id
  }, st === 'you' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "11",
    fill: RR.blue
  }), /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "16",
    fill: "none",
    stroke: RR.blue,
    strokeWidth: "1.5",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${x} ${y - 5} l4 8 -4 -2 -4 2 z`,
    fill: "#fff"
  })) : st === 'done' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "9",
    fill: RR.navy,
    stroke: RR.blue,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${x - 3.5} ${y} l2.5 2.5 4.5 -5`,
    fill: "none",
    stroke: RR.blue,
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })) : /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "9",
    fill: RR.navy,
    stroke: RR.amber,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: x + 16,
    y: y + 4,
    fill: "#fff",
    fontFamily: RR.display,
    fontSize: "13",
    fontWeight: "600"
  }, id), /*#__PURE__*/React.createElement("text", {
    x: x + 16,
    y: y + 17,
    fill: st === 'you' ? RR.blue : 'rgba(255,255,255,0.6)',
    fontFamily: RR.mono,
    fontSize: "8",
    letterSpacing: "0.1em"
  }, st === 'you' ? 'YOU' : st.toUpperCase())))), /*#__PURE__*/React.createElement(Glass, {
    style: {
      position: 'absolute',
      left: 16,
      top: 40,
      width: 118,
      padding: 12
    },
    tint: 0.5
  }, cardLabel('Stage 4'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 13,
      fontWeight: 600,
      color: '#fff',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, "Al Wajh Loop"), [['Distance', '312 km'], ['Checkpoints', '9'], ['Terrain', 'Mtn / Wadi / Sand'], ['Max Elev', '1,246 m']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.mono,
      fontSize: 8,
      letterSpacing: '0.1em',
      color: 'rgba(255,255,255,0.5)',
      textTransform: 'uppercase'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 11,
      fontWeight: 600,
      color: '#fff'
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 96
    }
  }, /*#__PURE__*/React.createElement(Glass, {
    style: {
      padding: 14
    },
    tint: 0.6
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 16,
      fontWeight: 600,
      color: '#fff',
      textTransform: 'uppercase'
    }
  }, "#118 North Star"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR.display,
      fontSize: 10,
      letterSpacing: '0.12em',
      color: RR.blue,
      border: '1px solid ' + RR.blue,
      borderRadius: 999,
      padding: '4px 10px'
    }
  }, "FOLLOW")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 11,
      color: 'rgba(255,255,255,0.6)',
      marginTop: 2
    }
  }, "M. Andersen / K. Wu"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 10,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: RR.mono,
      fontSize: 12,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Checkpoint 5"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: RR.up,
      fontWeight: 700
    }
  }, "+1,200 pts")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 11,
      color: 'rgba(255,255,255,0.65)',
      marginTop: 4
    }
  }, "Heading NW toward CP6."))))));
}

/* ---- TEAMS (light) ------------------------------------------------------ */
function TeamsScreen() {
  const teams = STANDINGS.slice(0, 6);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '58px 16px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 46,
      fontWeight: 600,
      color: '#fff',
      textTransform: 'uppercase',
      lineHeight: 0.9,
      marginBottom: 16
    }
  }, "Teams"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, teams.map(t => /*#__PURE__*/React.createElement(Glass, {
    key: t.num,
    style: {
      padding: 12
    },
    tint: t.you ? 0.5 : 0.32
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: RR.display,
      fontSize: 18,
      fontWeight: 700,
      color: RR.blue,
      flexShrink: 0
    }
  }, t.num), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.display,
      fontSize: 17,
      fontWeight: 600,
      color: '#fff',
      textTransform: 'uppercase'
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 11,
      color: 'rgba(255,255,255,0.55)'
    }
  }, t.crew)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.body,
      fontSize: 15,
      fontWeight: 700,
      color: '#fff',
      fontVariantNumeric: 'tabular-nums'
    }
  }, t.pts), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR.mono,
      fontSize: 9,
      color: 'rgba(255,255,255,0.5)'
    }
  }, "P", t.pos)))))));
}

/* ---- TAB BAR + APP ------------------------------------------------------ */
const TABS = [{
  id: 'today',
  label: 'Today',
  icon: c => /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 40 52"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 4 L22.5 24 L38 26 L22.5 28 L20 48 L17.5 28 L2 26 L17.5 24 Z",
    fill: c
  }))
}, {
  id: 'standings',
  label: 'Standings',
  icon: c => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 7h16M4 12h10M4 17h13",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  }))
}, {
  id: 'route',
  label: 'Route',
  icon: c => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 20c0-6 12-4 12-10a4 4 0 10-8 0",
    stroke: c,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "20",
    r: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "10",
    r: "2",
    fill: c
  }))
}, {
  id: 'teams',
  label: 'Teams',
  icon: c => /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "9",
    r: "3.2",
    stroke: c,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "8",
    r: "2.6",
    stroke: c,
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 13c2.5 0 4.5 1.8 4.5 4.5",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }))
}];
function TabBar({
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 10,
      right: 10,
      bottom: 12,
      zIndex: 40
    }
  }, /*#__PURE__*/React.createElement(Glass, {
    radius: 26,
    tint: 0.5,
    style: {
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '8px 6px 10px'
    }
  }, TABS.map(t => {
    const on = active === t.id;
    const c = on ? RR.blue : 'rgba(255,255,255,0.55)';
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => onChange(t.id),
      style: {
        flex: 1,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: 0
      }
    }, t.icon(c), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: RR.body,
        fontSize: 10,
        fontWeight: on ? 600 : 500,
        color: c
      }
    }, t.label));
  }))));
}
function RebelleApp() {
  const [tab, setTab] = React.useState('today');
  const screens = {
    today: /*#__PURE__*/React.createElement(TodayScreen, null),
    standings: /*#__PURE__*/React.createElement(StandingsScreen, null),
    route: /*#__PURE__*/React.createElement(RouteScreen, null),
    teams: /*#__PURE__*/React.createElement(TeamsScreen, null)
  };
  return /*#__PURE__*/React.createElement(IOSDevice, {
    dark: true,
    width: 402,
    height: 874
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: '100%',
      background: RR.navyDeep,
      paddingBottom: 90,
      fontFamily: RR.body
    }
  }, screens[tab], /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onChange: setTab
  })));
}
window.RebelleApp = RebelleApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ios-app/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-web/marketing.jsx
try { (() => {
/* Rebelle Rally — Marketing / Live web kit.
   The public rebellerally.com face: quiet nav on photo, condensed-caps hero with
   compass, numbered editorial sections, a live "follow every day" band, footer.
   Composes DS marketing components (FeatureCard, PostCard, Countdown, UtilityBar). */
const NS = window.RebelleRallyDesignSystem_4a29d0;
const {
  FeatureCard,
  PostCard,
  Countdown,
  UtilityBar,
  Button,
  Star,
  TopoLines
} = NS;
const D = '"Oswald", sans-serif',
  B = '"Inter", sans-serif',
  M = '"Open Sans", sans-serif';
const W = '"Minion Pro", "Cormorant Garamond", Georgia, serif'; // serif wordmark face (Minion Pro)

/* Serif brand wordmark — the arch/trailer "REBELLE RALLY" lockup */
function Wordmark({
  size = 22,
  color = '#fff',
  sub = 'rgba(255,255,255,0.85)'
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      lineHeight: 1,
      textShadow: '0 1px 12px rgba(13,33,61,0.4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: W,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '0.08em',
      color
    }
  }, "REBELLE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: B,
      fontWeight: 600,
      fontSize: size * 0.42,
      letterSpacing: '0.42em',
      textIndent: '0.42em',
      color: sub,
      marginTop: size * 0.12
    }
  }, "RALLY"));
}
const img = (src, h = 220) => /*#__PURE__*/React.createElement("img", {
  src: src,
  style: {
    width: '100%',
    height: h,
    objectFit: 'cover',
    display: 'block'
  }
});
function Kicker({
  n,
  children,
  light
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: D,
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: light ? 'rgba(255,255,255,0.6)' : 'var(--rr-gray-navy)'
    }
  }, n && /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--rr-blue)'
    }
  }, n), children, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 60px',
      height: 1,
      background: 'currentColor',
      opacity: 0.5
    }
  }));
}
function Nav() {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'absolute',
      top: 26,
      left: 48,
      right: 48,
      zIndex: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 34,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 22
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      gap: 28,
      margin: '0 0 0 auto',
      padding: 0,
      listStyle: 'none'
    }
  }, ['The Rally', 'Story', 'Teams', 'Results', 'Media'].map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: B,
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.92)',
      textDecoration: 'none',
      textShadow: '0 1px 10px rgba(13,33,61,0.4)'
    }
  }, l)))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: B,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#fff',
      textDecoration: 'none',
      paddingBottom: 3,
      borderBottom: '2px solid var(--rr-blue)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--rr-blue)'
    },
    className: "rr-pulse"
  }), "Live"));
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 720,
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/hero-desert.jpg",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(120deg, rgba(13,33,61,0.55) 0%, rgba(13,33,61,0.15) 45%, rgba(13,33,61,0.05) 100%)'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: "360",
    height: "360",
    viewBox: "0 0 200 200",
    style: {
      position: 'absolute',
      right: 90,
      top: 130,
      opacity: 0.85
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "94",
    fill: "none",
    stroke: "rgba(200,204,208,0.4)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "70",
    fill: "none",
    stroke: "rgba(24,159,218,0.4)",
    strokeWidth: "0.6",
    strokeDasharray: "2 5"
  }), Array.from({
    length: 72
  }).map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: "100",
    y1: "10",
    x2: "100",
    y2: i % 9 === 0 ? 20 : 15,
    stroke: "rgba(200,204,208,0.4)",
    strokeWidth: "0.5",
    transform: `rotate(${i * 5} 100 100)`
  })), /*#__PURE__*/React.createElement("path", {
    d: "M100 24 L108 100 L100 100 Z",
    fill: "#c8ccd0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M100 24 L92 100 L100 100 Z",
    fill: "#9da3ab"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M100 176 L108 100 L100 100 Z",
    fill: "#6b7178"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M100 176 L92 100 L100 100 Z",
    fill: "#4a4e52"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M176 100 L100 92 L100 100 Z",
    fill: "#9da3ab"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 100 L100 92 L100 100 Z",
    fill: "#c8ccd0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M176 100 L100 108 L100 100 Z",
    fill: "#6b7178"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 100 L100 108 L100 100 Z",
    fill: "#9da3ab"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "5",
    fill: "#0c1420",
    stroke: "#c8ccd0",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("text", {
    x: "100",
    y: "16",
    fill: "var(--rr-blue)",
    fontSize: "10",
    fontFamily: D,
    fontWeight: "600",
    textAnchor: "middle"
  }, "N")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 3,
      width: '100%',
      maxWidth: 1240,
      margin: '0 auto',
      padding: '140px 48px 72px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      marginBottom: 10,
      color: 'rgba(255,255,255,0.9)'
    }
  }, "The First Women's Off-Road Navigation Rally"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: D,
      fontWeight: 600,
      fontSize: 120,
      lineHeight: 0.88,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      textShadow: '0 2px 24px rgba(13,33,61,0.4)'
    }
  }, "Know Your", /*#__PURE__*/React.createElement("br", null), "North Star"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '18px 0 26px',
      fontFamily: B,
      fontSize: 18,
      letterSpacing: '0.05em'
    }
  }, "Endurance. Accuracy. Direction."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Explore the Rally \u2192"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.6)'
    }
  }, "Follow the Story"))));
}
function StatStrip() {
  const cells = [['Days', '8'], ['Miles', '~1,600'], ['States', '3'], ['GPS Allowed', 'None'], ['Tools', 'Map · Compass · Roadbook']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--rr-navy)',
      color: '#fff',
      borderTop: '1px solid rgba(255,255,255,0.14)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)'
    }
  }, cells.map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: '20px 26px 18px',
      borderRight: i < 4 ? '1px solid rgba(255,255,255,0.12)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--rr-gray-navy)',
      marginBottom: 7
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: '0.03em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)))));
}
function NavigationSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--rr-paper-warm)',
      padding: '88px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '0 48px',
      display: 'grid',
      gridTemplateColumns: '340px 1fr',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Kicker, {
    n: "02"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '14px 0 0',
      fontFamily: D,
      fontWeight: 600,
      fontSize: 52,
      lineHeight: 0.96,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      color: 'var(--rr-ink)'
    }
  }, "Not Speed.", /*#__PURE__*/React.createElement("br", null), "Navigation."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: M,
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--rr-text)',
      maxWidth: 320,
      marginTop: 20
    }
  }, "The goal isn't to cross the line first. Teams are scored on accuracy \u2014 finding hidden checkpoints with only analog tools.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(FeatureCard, {
    heading: "Maps",
    description: "Topographic sheets, plotted by hand on the tailgate each morning.",
    image: img('../../assets/imagery/field-3.jpg', 260),
    href: "#"
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    heading: "Compass",
    description: "Baseplate and declination. If you know north, you know everything else.",
    image: img('../../assets/imagery/field-6.jpg', 260),
    href: "#"
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    heading: "Roadbook",
    description: "Written driving directions \u2014 distance, heading, and terrain notes.",
    image: img('../../assets/imagery/field-1.jpg', 260),
    href: "#"
  }))));
}
function CourseSection() {
  const [day, setDay] = React.useState(4);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--rr-navy-deep)',
      color: '#fff',
      padding: '88px 0',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(TopoLines, {
    variant: "mountains",
    opacity: 0.32,
    lines: 9
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1240,
      margin: '0 auto',
      padding: '0 48px'
    }
  }, /*#__PURE__*/React.createElement(Kicker, {
    n: "03",
    light: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '360px 1fr',
      gap: 48,
      alignItems: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: D,
      fontWeight: 600,
      fontSize: 52,
      lineHeight: 0.96,
      textTransform: 'uppercase'
    }
  }, "The Desert", /*#__PURE__*/React.createElement("br", null), "Is the Course."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 24,
      flexWrap: 'wrap'
    }
  }, [1, 2, 3, 4, 5, 6, 7].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setDay(d),
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      cursor: 'pointer',
      fontFamily: D,
      fontWeight: 600,
      fontSize: 15,
      border: '1px solid ' + (day === d ? 'var(--rr-blue)' : 'rgba(255,255,255,0.2)'),
      background: day === d ? 'var(--rr-blue)' : 'transparent',
      color: day === d ? 'var(--rr-navy-deep)' : 'rgba(255,255,255,0.7)'
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: M,
      fontSize: 15,
      color: 'rgba(255,255,255,0.7)',
      lineHeight: 1.6
    }
  }, "Day ", day, " \xB7 Al Wajh Loop \u2014 312 km across mountain, wadi and sand. Nine checkpoints, max elevation 1,246 m.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(24,159,218,0.3)',
      aspectRatio: '16/10'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/terrain-aerial.jpg",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(12,20,32,0.35)'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 700 420",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M120 90 L250 110 L360 200 L480 180 L600 320",
    fill: "none",
    stroke: "rgba(255,255,255,0.35)",
    strokeWidth: "2",
    strokeDasharray: "4 7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 90 L250 110 L360 200",
    fill: "none",
    stroke: "var(--rr-blue)",
    strokeWidth: "3"
  }), [['CP1', 120, 90], ['CP2', 250, 110], ['CP3', 360, 200], ['CP5', 600, 320]].map(([id, x, y]) => /*#__PURE__*/React.createElement("g", {
    key: id
  }, /*#__PURE__*/React.createElement("rect", {
    x: x - 22,
    y: y - 26,
    width: "44",
    height: "18",
    rx: "3",
    fill: "var(--rr-navy)"
  }), /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y - 13,
    fill: "#fff",
    fontFamily: D,
    fontSize: "11",
    fontWeight: "600",
    textAnchor: "middle"
  }, id), /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "6",
    fill: "var(--rr-blue)",
    stroke: "#fff",
    strokeWidth: "1.5"
  }))))))));
}
function FollowBand() {
  const rows = [['1', '118', '15', '1,247'], ['2', '104', '15', '1,182'], ['3', '111', '14', '1,068'], ['4', '102', '13', '998'], ['5', '107', '13', '965']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--rr-navy)',
      color: '#fff',
      padding: '80px 0',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(TopoLines, {
    variant: "waves",
    opacity: 0.35,
    lines: 11
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1240,
      margin: '0 auto',
      padding: '0 48px'
    }
  }, /*#__PURE__*/React.createElement(Kicker, {
    n: "04",
    light: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginTop: 14,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: D,
      fontWeight: 600,
      fontSize: 56,
      textTransform: 'uppercase'
    }
  }, "Follow Every Day"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    style: {
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.5)'
    }
  }, "All Days \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(24,159,218,0.3)',
      borderRadius: 8,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '0.16em',
      color: 'var(--rr-blue)',
      textTransform: 'uppercase',
      marginBottom: 16
    }
  }, "Day 4 Standings"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '30px 1fr 50px 70px',
      fontFamily: B,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      color: 'rgba(255,255,255,0.5)',
      textTransform: 'uppercase',
      paddingBottom: 8,
      borderBottom: '1px solid rgba(24,159,218,0.3)'
    }
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null, "TEAM"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, "CHK"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "PTS")), rows.map(([p, t, c, pts]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'grid',
      gridTemplateColumns: '30px 1fr 50px 70px',
      alignItems: 'center',
      padding: '11px 0',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      fontFamily: B,
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontWeight: 600,
      fontSize: 16
    }
  }, p), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontWeight: 600
    }
  }, "#", t), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.7)'
    }
  }, c), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right',
      fontWeight: 700
    }
  }, pts)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid rgba(24,159,218,0.3)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/finish-hug-gold.jpg",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(0deg,rgba(12,20,32,0.9),rgba(12,20,32,0.1))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 24,
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 300
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: D,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      border: '1px solid var(--rr-blue)',
      borderRadius: 999,
      padding: '6px 12px',
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--rr-blue)'
    },
    className: "rr-pulse"
  }), "Live Now"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: D,
      fontSize: 26,
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Day 4 Recap"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: M,
      fontSize: 13,
      color: 'rgba(255,255,255,0.75)',
      marginTop: 4
    }
  }, "On air with Toyota \xB7 Episode 4")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PostCard, {
    date: "Oct 15, 2026",
    heading: "Sandstorm Takes the Lead into the Dunes",
    excerpt: "Andersen and Wu clear all nine checkpoints to hold the top of the 4x4 class.",
    href: "#",
    image: img('../../assets/imagery/field-5.jpg', 190)
  })))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--rr-navy-deep)',
      color: 'rgba(255,255,255,0.6)',
      padding: '56px 0 44px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(TopoLines, {
    variant: "mountains",
    opacity: 0.28,
    lines: 8
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1240,
      margin: '0 auto',
      padding: '0 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 20,
    sub: "rgba(255,255,255,0.7)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: D,
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.85)',
      marginLeft: 8
    }
  }, "Endurance \xB7 Accuracy \xB7 Direction"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 26,
      fontFamily: D,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.4)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Toyota"), /*#__PURE__*/React.createElement("span", null, "Pirelli"), /*#__PURE__*/React.createElement("span", null, "Pennzoil"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'rgba(255,255,255,0.12)',
      margin: '30px 0 22px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      fontFamily: B,
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", null, "Women Driven. Adventure Proven."), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, "\xA9 2026 Rebelle Rally"))));
}
function MarketingSite() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--rr-paper-warm)'
    }
  }, /*#__PURE__*/React.createElement(UtilityBar, {
    align: "end"
  }, "Oct 10\u201318, 2026 \xB7 Nevada \u2192 California \xB7 #jointherebelle"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement(Hero, null)), /*#__PURE__*/React.createElement(StatStrip, null), /*#__PURE__*/React.createElement(NavigationSection, null), /*#__PURE__*/React.createElement(CourseSection, null), /*#__PURE__*/React.createElement(FollowBand, null), /*#__PURE__*/React.createElement(Footer, null));
}
window.MarketingSite = MarketingSite;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-web/marketing.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CurtainTeamList = __ds_scope.CurtainTeamList;

__ds_ns.FullscreenHeader = __ds_scope.FullscreenHeader;

__ds_ns.LocationBadge = __ds_scope.LocationBadge;

__ds_ns.SponsorLogo = __ds_scope.SponsorLogo;

__ds_ns.StageInfoBadge = __ds_scope.StageInfoBadge;

__ds_ns.StandingsHeader = __ds_scope.StandingsHeader;

__ds_ns.TeamRowCurtain = __ds_scope.TeamRowCurtain;

__ds_ns.TeamRowFullscreen = __ds_scope.TeamRowFullscreen;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.RaceLine = __ds_scope.RaceLine;

__ds_ns.Star = __ds_scope.Star;

__ds_ns.TopoLines = __ds_scope.TopoLines;

__ds_ns.InstrumentCard = __ds_scope.InstrumentCard;

__ds_ns.InstrumentCell = __ds_scope.InstrumentCell;

__ds_ns.LiveChip = __ds_scope.LiveChip;

__ds_ns.Countdown = __ds_scope.Countdown;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.PostCard = __ds_scope.PostCard;

__ds_ns.UtilityBar = __ds_scope.UtilityBar;

})();
