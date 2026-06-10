// components.jsx — reusable UI: phone chrome, cards, chips, nav, FAB, states
// Depends on theme.jsx (C, F, Icon, PlatformGlyph) and data.jsx.

// ── Phone chrome (custom warm-dark, full control of status tint) ──
function StatusBar() {
  return (
    <div style={{ height: 34, flexShrink: 0, background: C.header, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', padding: '0 18px 0 22px',
      position: 'relative', fontFamily: F }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.cream, letterSpacing: 0.2 }}>9:41</span>
      <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
        width: 9, height: 9, borderRadius: 99, background: '#000' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.cream }}>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor"><path d="M8 11.5L.7 4.2a10.4 10.4 0 0114.6 0L8 11.5z"/></svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor"><path d="M14.7 11.7V.3L1.3 11.7h13.4z" opacity="0.9"/></svg>
        <svg width="20" height="11" viewBox="0 0 22 12" fill="none"><rect x="1" y="1.5" width="18" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/><rect x="2.6" y="3" width="12" height="6" rx="1" fill="currentColor"/><rect x="20" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.6"/></svg>
      </div>
    </div>
  );
}

function GestureBar({ light }) {
  return (
    <div style={{ height: 22, flexShrink: 0, background: 'transparent', display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 120, height: 4.5, borderRadius: 3, background: C.cream, opacity: 0.32 }} />
    </div>
  );
}

function Phone({ children }) {
  return (
    <div style={{ width: 400, height: 858, borderRadius: 46, background: '#100F0E',
      padding: 7, boxShadow: '0 40px 90px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
      flexShrink: 0 }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 40, overflow: 'hidden',
        background: C.body, display: 'flex', flexDirection: 'column', position: 'relative',
        fontFamily: F }}>
        <StatusBar />
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Bottom navigation ────────────────────────────────────────
const NAV = [
  { id: 'home',     label: 'Links',     icon: 'bookmark' },
  { id: 'groups',   label: 'Groups',    icon: 'folder' },
  { id: 'search',   label: 'Search',    icon: 'search' },
  { id: 'resurface',label: 'Resurface', icon: 'sparkle' },
];

function BottomNav({ active, onNav }) {
  return (
    <div style={{ flexShrink: 0, background: C.header, borderTop: `1px solid ${C.lineSoft}`,
      display: 'flex', padding: '8px 6px 4px' }}>
      {NAV.map(n => {
        const on = active === n.id;
        return (
          <button key={n.id} onClick={() => onNav(n.id)} style={{ flex: 1, border: 'none',
            background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, padding: '6px 0' }}>
            <Icon name={n.icon} size={23} color={on ? C.gold : C.grey}
              fill={on && (n.icon === 'bookmark' || n.icon === 'sparkle') ? C.gold : 'none'}
              stroke={on ? 1.9 : 1.7} />
            <span style={{ fontSize: 11, fontWeight: on ? 700 : 500,
              color: on ? C.gold : C.grey, letterSpacing: 0.1 }}>{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function FAB({ onClick, icon = 'plus' }) {
  return (
    <button onClick={onClick} style={{ position: 'absolute', right: 18, bottom: 18, width: 60,
      height: 60, borderRadius: 20, border: 'none', cursor: 'pointer', background: C.gold,
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20,
      boxShadow: '0 10px 26px rgba(232,212,77,0.32), 0 4px 10px rgba(0,0,0,0.3)' }}>
      <Icon name={icon} size={28} color="#2A2820" stroke={2.3} />
    </button>
  );
}

// ── Chips ────────────────────────────────────────────────────
function GroupChip({ name, color, active, onClick, count }) {
  return (
    <button onClick={onClick} style={{ border: active ? `1px solid ${C.gold}` : `1px solid ${C.line}`,
      background: active ? C.goldSoft : C.card, borderRadius: 99, padding: '7px 14px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {color && <span style={{ width: 8, height: 8, borderRadius: 99, background: color }} />}
      <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500,
        color: active ? C.cream : C.grey }}>{name}</span>
      {count != null && <span style={{ fontSize: 12, fontWeight: 600,
        color: active ? C.goldText : C.greyDim }}>{count}</span>}
    </button>
  );
}

function TagChip({ label, onRemove }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: C.card2,
      border: `1px solid ${C.line}`, borderRadius: 8, padding: '5px 9px', fontSize: 12.5,
      fontWeight: 500, color: C.grey }}>
      <span style={{ color: C.greyDim, fontWeight: 700 }}>#</span>{label}
      {onRemove && <button onClick={onRemove} style={{ border: 'none', background: 'none',
        cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="close" size={13} color={C.greyDim} /></button>}
    </span>
  );
}

// ── Thumbnail ────────────────────────────────────────────────
function Thumb({ link, h = 168, radius = 14 }) {
  if (link.preview === 'rich' && link.thumb) {
    return (
      <div style={{ height: h, borderRadius: radius, background: link.thumb, position: 'relative',
        overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background:
          'radial-gradient(120% 80% at 80% 0%, rgba(255,255,255,0.18), transparent 50%)' }} />
        <div style={{ position: 'absolute', left: 10, top: 10, width: 30, height: 30, borderRadius: 9,
          background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(2px)', display: 'flex',
          alignItems: 'center', justifyContent: 'center' }}>
          <PlatformGlyph platform={link.platform} size={17} />
        </div>
        {link.duration && (
          <span style={{ position: 'absolute', right: 9, bottom: 9, background: 'rgba(0,0,0,0.6)',
            color: '#fff', fontSize: 11.5, fontWeight: 600, padding: '2px 6px', borderRadius: 6 }}>
            {link.duration}</span>
        )}
      </div>
    );
  }
  // fallback thumbnail block
  return (
    <div style={{ height: h, borderRadius: radius, background: C.card2, position: 'relative',
      overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1px solid ${C.line}` }}>
      <PlatformGlyph platform={link.platform} size={34} color={C.greyDim} />
    </div>
  );
}

function FaviconTile({ link, size = 52 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 13, background: C.card2,
      border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0 }}>
      <PlatformGlyph platform={link.platform} size={size * 0.46} color={C.grey} />
    </div>
  );
}

// ── Meta row (group dot, date, reminder) ─────────────────────
function MetaRow({ link, small }) {
  const grp = GROUPS.find(g => g.id === link.group);
  const fs = small ? 11.5 : 12.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
      {grp && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: grp.color }} />
          <span style={{ fontSize: fs, fontWeight: 600, color: C.grey }}>{grp.name}</span>
        </span>
      )}
      <span style={{ width: 3, height: 3, borderRadius: 99, background: C.greyDim }} />
      <span style={{ fontSize: fs, color: C.greyDim }}>{link.savedAt}</span>
      {link.reminder && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 'auto',
          color: C.goldText }}>
          <Icon name="bell" size={13} color={C.goldText} />
          <span style={{ fontSize: fs, fontWeight: 600 }}>{small ? '' : link.reminder}</span>
        </span>
      )}
    </div>
  );
}

Object.assign(window, { Phone, StatusBar, GestureBar, BottomNav, FAB, NAV,
  GroupChip, TagChip, Thumb, FaviconTile, MetaRow });
