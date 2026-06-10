// screens2.jsx — Groups, Search, Resurface, GroupCreate sheet
// Depends on theme.jsx, components.jsx, cards.jsx, sheet.jsx, data.jsx.

// ── GROUPS ───────────────────────────────────────────────────
function GroupsScreen({ onOpenGroup, onCreate }) {
  return (
    <>
      <div style={{ background: C.header, flexShrink: 0, padding: '14px 18px 16px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.cream, letterSpacing: -0.6 }}>Groups</div>
        <div style={{ fontSize: 13.5, color: C.grey, marginTop: 2 }}>Organize saves into your own buckets</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 96px', display: 'flex',
        flexDirection: 'column', gap: 10 }}>
        {GROUPS.filter(g => g.id !== 'all').map(g => (
          <button key={g.id} onClick={() => onOpenGroup(g)} style={{ width: '100%', textAlign: 'left',
            border: 'none', cursor: 'pointer', background: C.card, borderRadius: 16, padding: 14,
            display: 'flex', alignItems: 'center', gap: 14, fontFamily: F }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: g.color + '22',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={g.icon} size={22} color={g.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.cream }}>{g.name}</div>
              <div style={{ fontSize: 13, color: C.greyDim, marginTop: 2 }}>
                {g.count === 0 ? 'No links yet' : `${g.count} link${g.count > 1 ? 's' : ''}`}</div>
            </div>
            <Icon name="next" size={19} color={C.grey} />
          </button>
        ))}
        <button onClick={onCreate} style={{ width: '100%', border: `1.5px dashed ${C.line}`, cursor: 'pointer',
          background: 'none', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 9, color: C.grey, fontSize: 15, fontWeight: 700, fontFamily: F,
          marginTop: 4 }}>
          <Icon name="plus" size={19} color={C.grey} />New group</button>
      </div>
    </>
  );
}

// ── SEARCH ───────────────────────────────────────────────────
function SearchScreen({ onOpenLink }) {
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState('Recent');
  const inputRef = React.useRef(null);
  React.useEffect(() => { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 350);
    return () => clearTimeout(t); }, []);

  const ql = q.trim().toLowerCase();
  const results = ql === '' ? [] : LINKS.filter(l =>
    l.title.toLowerCase().includes(ql) || l.tags.some(t => t.includes(ql)) ||
    l.source.toLowerCase().includes(ql) || (l.note || '').toLowerCase().includes(ql));
  const noResults = ql !== '' && results.length === 0;

  return (
    <>
      <div style={{ background: C.header, flexShrink: 0, padding: '12px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.card,
          border: `1px solid ${C.line}`, borderRadius: 14, padding: '12px 14px' }}>
          <Icon name="search" size={20} color={C.grey} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search titles, tags, notes…" style={{ flex: 1, border: 'none', background: 'none',
              outline: 'none', color: C.cream, fontSize: 15, fontFamily: F }} />
          {q && <button onClick={() => setQ('')} style={{ border: 'none', background: 'none', cursor: 'pointer',
            display: 'flex', padding: 0 }}><Icon name="close" size={18} color={C.grey} /></button>}
        </div>
        {/* sort/filter chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto' }}>
          {['Recent', 'Oldest', 'Has reminder', 'YouTube', 'Untagged'].map((s, i) => (
            <button key={s} onClick={() => setSort(s)} style={{ flexShrink: 0, border: sort === s ?
              `1px solid ${C.gold}` : `1px solid ${C.line}`, background: sort === s ? C.goldSoft : C.card,
              borderRadius: 99, padding: '6px 13px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              color: sort === s ? C.cream : C.grey, display: 'flex', alignItems: 'center', gap: 5, fontFamily: F }}>
              {i === 0 && <Icon name="sliders" size={14} color={sort === s ? C.gold : C.grey} />}{s}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {ql === '' && (
          <div style={{ padding: '20px 18px' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.greyDim, letterSpacing: 0.4,
              textTransform: 'uppercase', marginBottom: 12 }}>Recent searches</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['productivity', 'kyoto', 'recipes', 'ux', 'local-first'].map(t =>
                <button key={t} onClick={() => setQ(t)} style={{ ...exBtn, padding: '8px 13px', fontSize: 13.5 }}>
                  <span style={{ color: C.greyDim, marginRight: 4 }}>#</span>{t}</button>)}
            </div>
          </div>
        )}
        {noResults && (
          <EmptyState icon="search" title={`No matches for "${q}"`}
            body="Try a different word, or search by tag, source, or note." />
        )}
        {results.length > 0 && (
          <div style={{ padding: '14px 16px 96px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, color: C.greyDim, fontWeight: 600, padding: '0 2px' }}>
              {results.length} result{results.length > 1 ? 's' : ''}</span>
            {results.map(l => <CompactCard key={l.id} link={l} onClick={() => onOpenLink(l)} />)}
          </div>
        )}
      </div>
    </>
  );
}

// ── RESURFACE (v2 concept) ───────────────────────────────────
function ResurfaceScreen({ onOpenLink }) {
  const link = RESURFACE;
  return (
    <>
      <div style={{ background: C.header, flexShrink: 0, padding: '14px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.cream, letterSpacing: -0.6 }}>Resurface</div>
          <span style={{ fontSize: 11, fontWeight: 800, color: C.gold, background: C.goldSoft,
            padding: '3px 8px', borderRadius: 99, letterSpacing: 0.3 }}>SOON</span>
        </div>
        <div style={{ fontSize: 13.5, color: C.grey, marginTop: 2 }}>Old saves, brought back before they rot</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 96px' }}>
        {/* Spotlight card */}
        <div style={{ background: C.card, borderRadius: 20, padding: 16, position: 'relative',
          overflow: 'hidden', border: `1px solid ${C.line}` }}>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 150, height: 150, borderRadius: 99,
            background: 'radial-gradient(circle, rgba(232,212,77,0.14), transparent 70%)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Icon name="sparkle" size={18} color={C.gold} fill={C.gold} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.goldText }}>Saved 1 week ago — still unopened</span>
          </div>
          <button onClick={() => onOpenLink(link)} style={{ width: '100%', border: 'none', background: 'none',
            cursor: 'pointer', padding: 0, textAlign: 'left' }}>
            <Thumb link={link} h={170} radius={14} />
            <div style={{ marginTop: 13, fontSize: 18, fontWeight: 800, color: C.cream, lineHeight: 1.3,
              letterSpacing: -0.3 }}>{link.title}</div>
            <div style={{ fontSize: 13.5, color: C.grey, marginTop: 5, fontWeight: 500 }}>{link.source}</div>
          </button>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${C.line}`,
              background: 'none', cursor: 'pointer', color: C.grey, fontSize: 14, fontWeight: 700, fontFamily: F }}>
              Later</button>
            <button onClick={() => onOpenLink(link)} style={{ flex: 1.5, padding: '12px', borderRadius: 12,
              border: 'none', background: C.gold, cursor: 'pointer', color: '#2A2820', fontSize: 14, fontWeight: 800,
              fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              <Icon name="external" size={17} color="#2A2820" stroke={2.2} />Open now</button>
          </div>
        </div>

        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.greyDim, letterSpacing: 0.4,
          textTransform: 'uppercase', margin: '26px 2px 12px' }}>Coming up next</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[LINKS[8], LINKS[5]].map(l => <CompactCard key={l.id} link={l} onClick={() => onOpenLink(l)} />)}
        </div>
      </div>
    </>
  );
}

// ── GROUP CREATE sheet ───────────────────────────────────────
const GCOLORS = ['#E8D44D', '#E0907A', '#86B9C4', '#9DBE8E', '#C8A2D4', '#D4B483', '#B5657A', '#6E9B5C'];
const GICONS = ['folder', 'bookmark', 'tag', 'note', 'inbox', 'clock'];

function GroupCreateSheet({ open, onClose, onCreate }) {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState(GCOLORS[2]);
  const [icon, setIcon] = React.useState('folder');
  React.useEffect(() => { if (open) { setName(''); setColor(GCOLORS[2]); setIcon('folder'); } }, [open]);

  return (
    <Sheet open={open} onClose={onClose} maxH="80%">
      <div style={{ padding: '16px 20px 6px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: C.cream, flex: 1 }}>New group</span>
        <button onClick={onClose} style={{ border: 'none', background: C.card, width: 32, height: 32,
          borderRadius: 99, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={17} color={C.grey} /></button>
      </div>
      <div style={{ padding: '12px 20px 0', overflowY: 'auto' }}>
        {/* Live preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card, borderRadius: 16,
          padding: 14, marginBottom: 20 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: color + '22', display: 'flex',
            alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={22} color={color} /></div>
          <div style={{ fontSize: 16, fontWeight: 700, color: name ? C.cream : C.greyDim }}>
            {name || 'Group name'}</div>
        </div>

        <FieldLabel icon="edit">Name</FieldLabel>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Weekend reads" autoFocus
          style={{ width: '100%', boxSizing: 'border-box', background: C.card, border: `1px solid ${C.line}`,
            borderRadius: 13, padding: '13px 14px', color: C.cream, fontSize: 15, fontFamily: F, outline: 'none',
            marginBottom: 22 }} />

        <FieldLabel icon="tag">Color</FieldLabel>
        <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
          {GCOLORS.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{ width: 38, height: 38, borderRadius: 99,
              background: c, border: color === c ? `2.5px solid ${C.cream}` : '2.5px solid transparent',
              cursor: 'pointer', boxShadow: color === c ? `0 0 0 2px ${C.body}` : 'none' }} />
          ))}
        </div>

        <FieldLabel icon="folder">Icon</FieldLabel>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {GICONS.map(ic => (
            <button key={ic} onClick={() => setIcon(ic)} style={{ width: 50, height: 50, borderRadius: 14,
              background: icon === ic ? C.goldSoft : C.card, border: icon === ic ? `1px solid ${C.gold}` :
              `1px solid ${C.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={ic} size={22} color={icon === ic ? C.gold : C.grey} /></button>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '16px 20px 24px' }}>
        <button onClick={() => name.trim() && onCreate()} disabled={!name.trim()} style={{ width: '100%',
          padding: '15px', borderRadius: 14, border: 'none', cursor: name.trim() ? 'pointer' : 'default',
          background: name.trim() ? C.gold : C.card2, color: name.trim() ? '#2A2820' : C.greyDim, fontSize: 15.5,
          fontWeight: 800, fontFamily: F }}>Create group</button>
      </div>
    </Sheet>
  );
}

Object.assign(window, { GroupsScreen, SearchScreen, ResurfaceScreen, GroupCreateSheet });
