// data.jsx — sample groups + saved links for the prototype
// Thumbnails are CSS gradients (real images slot in at build time).

const GROUPS = [
  { id: 'all',     name: 'All',        color: '#E8D44D', icon: 'inbox',    count: 14 },
  { id: 'watch',   name: 'Watch later', color: '#E0907A', icon: 'bookmark', count: 5 },
  { id: 'design',  name: 'Design',     color: '#86B9C4', icon: 'tag',      count: 4 },
  { id: 'recipes', name: 'Recipes',    color: '#9DBE8E', icon: 'folder',   count: 3 },
  { id: 'reading', name: 'Reading',    color: '#C8A2D4', icon: 'note',     count: 2 },
  { id: 'travel',  name: 'Trip 2025',  color: '#D4B483', icon: 'folder',   count: 0 },
];

// gradient presets that read as media thumbnails
const G = {
  warm:  'linear-gradient(135deg,#C77B52 0%,#7A3B2E 60%,#3A2622 100%)',
  cool:  'linear-gradient(135deg,#4E7C8C 0%,#2E4A57 60%,#1E2E37 100%)',
  green: 'linear-gradient(135deg,#6E9B5C 0%,#3C5C36 60%,#243522 100%)',
  plum:  'linear-gradient(135deg,#8C6FA0 0%,#4F3A63 60%,#2B2238 100%)',
  gold:  'linear-gradient(135deg,#D9B65A 0%,#8A6E2E 60%,#43381C 100%)',
  dusk:  'linear-gradient(135deg,#B5657A 0%,#5E3247 60%,#2E1E29 100%)',
  slate: 'linear-gradient(135deg,#6B7280 0%,#3B4048 60%,#23262B 100%)',
};

const LINKS = [
  {
    id: 'l1', platform: 'youtube', preview: 'rich', thumb: G.warm,
    title: 'How I organize my entire life in one app',
    source: 'YouTube · Matt D’Avella', domain: 'youtube.com',
    note: 'The 2-minute capture rule starts at 4:10.',
    group: 'watch', tags: ['productivity', 'systems'],
    savedAt: '2h ago', duration: '12:04', reminder: 'Tomorrow, 9:00',
  },
  {
    id: 'l2', platform: 'instagram', preview: 'fallback',
    title: 'Walnut + brass shelving detail',
    source: 'instagram.com', domain: 'instagram.com',
    note: 'Joinery reference for the studio wall.',
    group: 'design', tags: ['woodwork', 'interior'],
    savedAt: '5h ago', reminder: null,
  },
  {
    id: 'l3', platform: 'web', preview: 'rich', thumb: G.cool,
    title: 'The quiet power of local-first software',
    source: 'inkandswitch.com', domain: 'inkandswitch.com',
    note: '', group: 'reading', tags: ['software', 'longread'],
    savedAt: 'Yesterday', reminder: null,
  },
  {
    id: 'l4', platform: 'x', preview: 'fallback',
    title: 'Thread: 11 tiny UX details that feel expensive',
    source: 'x.com · @joulee', domain: 'x.com',
    note: '', group: 'design', tags: ['ux', 'thread'],
    savedAt: 'Yesterday', reminder: 'Sat, 10:00',
  },
  {
    id: 'l5', platform: 'youtube', preview: 'rich', thumb: G.green,
    title: 'One-pan miso butter salmon (weeknight)',
    source: 'YouTube · Adam Ragusea', domain: 'youtube.com',
    note: 'Half the butter next time.',
    group: 'recipes', tags: ['dinner', 'fish'],
    savedAt: '2 days ago', duration: '8:51', reminder: null,
  },
  {
    id: 'l6', platform: 'web', preview: 'rich', thumb: G.plum,
    title: 'A field guide to warm dark interfaces',
    source: 'maggieappleton.com', domain: 'maggieappleton.com',
    note: '', group: 'design', tags: ['color', 'theme'],
    savedAt: '3 days ago', reminder: null,
  },
  {
    id: 'l7', platform: 'facebook', preview: 'fallback',
    title: 'Marketplace — mid-century lounge chair',
    source: 'facebook.com', domain: 'facebook.com',
    note: 'Message seller before Friday.',
    group: 'watch', tags: ['furniture'],
    savedAt: '4 days ago', reminder: 'Fri, 18:00',
  },
  {
    id: 'l8', platform: 'youtube', preview: 'rich', thumb: G.gold,
    title: 'Kyoto in autumn — a slow travel film',
    source: 'YouTube · bald and bankrupt', domain: 'youtube.com',
    note: '', group: 'watch', tags: ['travel', 'japan'],
    savedAt: '5 days ago', duration: '24:18', reminder: null,
  },
  {
    id: 'l9', platform: 'web', preview: 'rich', thumb: G.dusk,
    title: 'Why your second brain keeps failing you',
    source: 'every.to', domain: 'every.to',
    note: '', group: 'reading', tags: ['notes', 'longread'],
    savedAt: '1 week ago', reminder: null,
  },
  {
    id: 'l10', platform: 'x', preview: 'fallback',
    title: 'Tiny espresso setup for a small kitchen',
    source: 'x.com · @coffeeguy', domain: 'x.com',
    note: '', group: 'recipes', tags: ['coffee'],
    savedAt: '1 week ago', reminder: null,
  },
  {
    id: 'l11', platform: 'youtube', preview: 'rich', thumb: G.slate,
    title: 'Building an app solo: what I’d do differently',
    source: 'YouTube · Theo', domain: 'youtube.com',
    note: '', group: 'watch', tags: ['indie', 'dev'],
    savedAt: '2 weeks ago', duration: '17:32', reminder: null,
  },
  {
    id: 'l12', platform: 'instagram', preview: 'fallback',
    title: 'Plated dessert — burnt honey + fig',
    source: 'instagram.com', domain: 'instagram.com',
    note: '', group: 'recipes', tags: ['dessert'],
    savedAt: '2 weeks ago', reminder: null,
  },
];

// The link used by the resurface concept screen
const RESURFACE = LINKS[8];

Object.assign(window, { GROUPS, LINKS, G, RESURFACE });
