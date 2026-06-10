// screens.jsx — Home, Detail, Groups, Search, Resurface
// Depends on theme.jsx, components.jsx, cards.jsx, sheet.jsx, data.jsx.

// ── Brand wordmark (the single personality touch) ────────────
function Wordmark({ size = 19 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: 9, background: C.gold, display: 'flex',
        alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(232,212,77,0.3)' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2A2820" strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round"><path d="M9 15l6-6M10.5 6.5l1.4-1.4a4 4 0 0 1 5.66 5.66l-2.1 2.1M13.5 17.5l-1.4 1.4a4 4 0 0 1-5.66-5.66l2.1-2.1"/></svg>
      </div>
      <span style={{ fontSize: size, fontWeight: 800, color: C.cream, letterSpacing: -0.4 }}>
        Link<span style={{ color: C.gold }}>pond</span></span>
    </div>
  );
}

function HeaderIconBtn({ icon, onClick, active, badge }) {
  return (
    <button onClick={onClick} style={{ width: 40, height: 40, borderRadius: 12, border: 'none',
      cursor: 'pointer', background: active ? C.goldSoft : 'transparent', display: 'flex',
      alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Icon name={icon} size={22} color={active ? C.gold : C.grey} />
      {badge && <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 99,
        background: C.gold, border: `2px solid ${C.header}` }} />}
    </button>
  );
}

// ── HOME ─────────────────────────────────────────────────────
function HomeScreen({ density, setDensity, onOpenLink, onSearch, group, setGroup }) {
  const visible = group === 'all' ? LINKS : LINKS.filter(l => l.group === group);
  const grpObj = GROUPS.find(g => g.id === group);
  return (
    <>
      {/* Header */}
      <div style={{ background: C.header, flexShrink: 0, paddingBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px 8px 16px' }}>
          <Wordmark />
          <div style={{ flex: 1 }} />
          <HeaderIconBtn icon={density === 'large' ? 'rows' : 'grid'}
            onClick={() => setDensity(density === 'large' ? 'compact' : 'large')} />
          <HeaderIconBtn icon="sliders" />
        </div>
        {/* Group chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 16px 0' }}>
          {GROUPS.map(g => (
            <GroupChip key={g.id} name={g.name} color={g.id === 'all' ? null : g.color}
              count={g.count} active={group === g.id} onClick={() => setGroup(g.id)} />
          ))}
        </div>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <EmptyState icon="folder" title={`"${grpObj.name}" is empty`}
          body="Links you add to this group will show up here. Tap + to save one."
          action={<div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 7,
            color: C.gold, fontSize: 14, fontWeight: 700 }}><Icon name="plus" size={17} color={C.gold} />Save a link</div>} />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 96px', display: 'flex',
          flexDirection: 'column', gap: density === 'large' ? 16 : 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            padding: '0 2px 2px' }}>
            <span style={{ fontSize: 13, color: C.greyDim, fontWeight: 600, whiteSpace: 'nowrap' }}>{visible.length} links</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: C.grey,
              fontWeight: 600 }}>Recent<Icon name="chevdown" size={15} color={C.grey} /></span>
          </div>
          {visible.map(l => <LinkCard key={l.id} link={l} density={density} onClick={() => onOpenLink(l)} />)}
        </div>
      )}
    </>
  );
}

// ── DETAIL ───────────────────────────────────────────────────
function DetailScreen({ link, onBack }) {
  const grp = GROUPS.find(g => g.id === link.group);
  const fallback = link.preview === 'fallback';
  return (
    <>
      <div style={{ background: C.header, flexShrink: 0, display: 'flex', alignItems: 'center',
        padding: '8px 8px', gap: 4 }}>
        <HeaderIconBtn icon="back" onClick={onBack} />
        <div style={{ flex: 1 }} />
        <HeaderIconBtn icon="edit" />
        <HeaderIconBtn icon="more" />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 110px' }}>
        {/* Hero */}
        {fallback ? (
          <div style={{ height: 150, borderRadius: 18, background: C.card, border: `1px solid ${C.line}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <PlatformGlyph platform={link.platform} size={40} color={C.grey} />
            <span style={{ fontSize: 13, color: C.greyDim, fontWeight: 600 }}>{link.domain}</span>
          </div>
        ) : <Thumb link={link} h={200} radius={18} />}

        <div style={{ marginTop: 18, fontSize: 22, fontWeight: 800, color: C.cream, lineHeight: 1.25,
          letterSpacing: -0.4, textWrap: 'pretty' }}>{link.title}</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, color: C.grey }}>
          <PlatformGlyph platform={link.platform} size={16} color={C.grey} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{link.source}</span>
        </div>

        {/* Open original */}
        <button style={{ marginTop: 18, width: '100%', padding: '14px', borderRadius: 14, border: 'none',
          cursor: 'pointer', background: C.gold, color: '#2A2820', fontSize: 15, fontWeight: 800, fontFamily: F,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <Icon name="external" size={19} color="#2A2820" stroke={2.1} />Open original</button>

        {/* Note */}
        {link.note && (
          <div style={{ marginTop: 22 }}>
            <FieldLabel icon="note">My note</FieldLabel>
            <div style={{ background: C.card, borderRadius: 14, padding: '14px 15px', fontSize: 14.5,
              color: C.cream, lineHeight: 1.5, fontStyle: 'italic', borderLeft: `3px solid ${C.gold}` }}>
              {link.note}</div>
          </div>
        )}

        {/* Meta grid */}
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DetailRow icon="folder" label="Group"
            value={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 9, height: 9, borderRadius: 99, background: grp.color }} />{grp.name}</span>} />
          <DetailRow icon="tag" label="Tags" value={
            <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {link.tags.map(t => <TagChip key={t} label={t} />)}</span>} />
          <DetailRow icon="clock" label="Saved" value={link.savedAt} />
        </div>

        {/* Reminder */}
        <div style={{ marginTop: 22 }}>
          <FieldLabel icon="bell">Reminder</FieldLabel>
          <div style={{ background: link.reminder ? C.goldSoft : C.card, borderRadius: 14, padding: '14px 15px',
            display: 'flex', alignItems: 'center', gap: 12, border: link.reminder ? `1px solid ${C.goldSoft}` : 'none' }}>
            <Icon name="bell" size={20} color={link.reminder ? C.gold : C.grey} fill={link.reminder ? C.gold : 'none'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: C.cream }}>
                {link.reminder || 'No reminder set'}</div>
              <div style={{ fontSize: 12.5, color: link.reminder ? C.goldText : C.greyDim, marginTop: 1 }}>
                {link.reminder ? 'You’ll get a nudge' : 'Tap to resurface this later'}</div>
            </div>
            <Icon name="next" size={18} color={C.grey} />
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0',
      borderBottom: `1px solid ${C.lineSoft}` }}>
      <Icon name={icon} size={18} color={C.grey} />
      <span style={{ fontSize: 14, color: C.grey, fontWeight: 600 }}>{label}</span>
      <div style={{ flex: 1, textAlign: 'right', fontSize: 14, color: C.cream, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { HomeScreen, DetailScreen, DetailRow, Wordmark, HeaderIconBtn });
