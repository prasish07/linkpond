// theme.jsx — warm-dark design tokens + line-icon set
// Loaded first. Exposes C (colors), F (font), and <Icon/> to window.

const C = {
  page:    '#211F1D',   // behind the device
  body:    '#2E2C28',   // app body
  header:  '#3A372F',   // header bar (slightly lighter)
  card:    '#37342E',   // card surface
  card2:   '#413D36',   // raised surface / inputs
  cardHi:  '#4A453C',   // hover / pressed
  line:    'rgba(243,238,228,0.09)',
  lineSoft:'rgba(243,238,228,0.05)',
  gold:    '#E8D44D',
  goldSoft:'rgba(232,212,77,0.15)',
  goldText:'#EFE08A',
  cream:   '#F3EEE4',   // primary text
  grey:    '#A8A294',   // secondary text / meta
  greyDim: '#746F65',   // tertiary / empty copy
  red:     '#D6897A',   // destructive (muted)
  redSoft: 'rgba(214,137,122,0.15)',
  green:   '#9DBE8E',   // confirm (muted)
  greenSoft:'rgba(157,190,142,0.15)',
};

const F = "'Hanken Grotesk', system-ui, -apple-system, sans-serif";

// ── Line icon set (consistent 24px grid, 1.7 stroke) ───────────
const PATHS = {
  search:   'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  sliders:  'M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M18 18h2 M14 6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0 M6 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0 M14 18a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0',
  plus:     'M12 5v14M5 12h14',
  close:    'M6 6l12 12M18 6L6 18',
  back:     'M15 19l-7-7 7-7',
  next:     'M9 5l7 7-7 7',
  more:     'M12 6h.01M12 12h.01M12 18h.01',
  link:     'M9 15l6-6M10.5 6.5l1.4-1.4a4 4 0 0 1 5.66 5.66l-2.1 2.1M13.5 17.5l-1.4 1.4a4 4 0 0 1-5.66-5.66l2.1-2.1',
  bookmark: 'M6 4h12v16l-6-4-6 4V4Z',
  folder:   'M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z',
  clock:    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  bell:     'M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0',
  tag:      'M12 3H5a2 2 0 0 0-2 2v7l9 9 9-9-9-9ZM8 8h.01',
  calendar: 'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4',
  grid:     'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  rows:     'M4 6h16M4 12h16M4 18h16',
  sparkle:  'M12 3l1.8 4.9L19 9.7l-5.2 1.8L12 16l-1.8-4.5L5 9.7l5.2-1.8L12 3ZM19 15l.9 2.3L22 18l-2.1.7L19 21l-.9-2.3L16 18l2.1-.7L19 15Z',
  check:    'M5 12.5l4.5 4.5L19 7',
  trash:    'M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13',
  edit:     'M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4',
  globe:    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18',
  chevdown: 'M6 9l6 6 6-6',
  note:     'M5 4h14v16l-3-2-3 2-3-2-3 2V4Z',
  dot:      'M12 12h.01',
  inbox:    'M4 13l2.5-7h11L20 13M4 13v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M4 13h5l1.5 2.5h3L14 13h6',
};

// Filled platform glyphs (small, on thumbnails) drawn separately.
function Icon({ name, size = 22, color = 'currentColor', stroke = 1.7, fill = 'none', style }) {
  const d = PATHS[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill === 'none' ? 'none' : color}
      stroke={fill === 'none' ? color : 'none'} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
    </svg>
  );
}

// Platform badge — filled mini glyph for thumbnails / fallback cards
function PlatformGlyph({ platform, size = 18, color = '#fff' }) {
  const s = size;
  if (platform === 'youtube') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={color}><path d="M23 12a13 13 0 0 0-.4-3.3 2.7 2.7 0 0 0-1.9-1.9C19 6.4 12 6.4 12 6.4s-7 0-8.7.4A2.7 2.7 0 0 0 1.4 8.7 13 13 0 0 0 1 12a13 13 0 0 0 .4 3.3 2.7 2.7 0 0 0 1.9 1.9c1.7.4 8.7.4 8.7.4s7 0 8.7-.4a2.7 2.7 0 0 0 1.9-1.9A13 13 0 0 0 23 12ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z"/></svg>
  );
  if (platform === 'instagram') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill={color} stroke="none"/></svg>
  );
  if (platform === 'x') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={color}><path d="M17.5 3h3l-6.6 7.5L21.7 21h-5.9l-4.6-6-5.3 6H3l7-8L2.6 3h6l4.2 5.5L17.5 3Zm-1 16h1.6L7.6 4.7H5.9L16.5 19Z"/></svg>
  );
  if (platform === 'facebook') return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={color}><path d="M14 9V7.5c0-.8.4-1.2 1.4-1.2H17V3.2C16.3 3.1 15.3 3 14.2 3 11.7 3 10 4.5 10 7.2V9H7.5v3.2H10V21h3.4v-8.8h2.6l.5-3.2H14Z"/></svg>
  );
  return ( // web / globe
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>
  );
}

Object.assign(window, { C, F, Icon, PlatformGlyph });
