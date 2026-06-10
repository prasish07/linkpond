// cards.jsx — LinkCard (rich + fallback × large + compact), skeleton, empty state
// Depends on theme.jsx, components.jsx, data.jsx.

// ── LARGE density: image-forward card ────────────────────────
function LargeCard({ link, onClick }) {
  const fallback = link.preview === 'fallback';
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
      background: C.card, borderRadius: 18, padding: 10, display: 'flex', flexDirection: 'column',
      gap: 11, boxShadow: '0 1px 0 ' + C.lineSoft, fontFamily: F }}>
      <Thumb link={link} h={168} />
      <div style={{ padding: '0 4px 4px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {fallback && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.greyDim }}>
            <Icon name="link" size={13} color={C.greyDim} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.2 }}>{link.domain}</span>
          </span>
        )}
        <div style={{ fontSize: 16.5, fontWeight: 700, color: C.cream, lineHeight: 1.3,
          letterSpacing: -0.2, textWrap: 'pretty' }}>{link.title}</div>
        {!fallback && <div style={{ fontSize: 13, color: C.grey, fontWeight: 500 }}>{link.source}</div>}
        {link.note && (
          <div style={{ fontSize: 13.5, color: C.grey, lineHeight: 1.4, display: 'flex', gap: 7 }}>
            <span style={{ width: 2.5, alignSelf: 'stretch', borderRadius: 2, background: C.greyDim,
              flexShrink: 0, opacity: 0.6 }} />
            <span style={{ fontStyle: 'italic' }}>{link.note}</span>
          </div>
        )}
        <div style={{ marginTop: 2 }}><MetaRow link={link} /></div>
      </div>
    </button>
  );
}

// ── COMPACT density: row card ────────────────────────────────
function CompactCard({ link, onClick }) {
  const fallback = link.preview === 'fallback';
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
      background: C.card, borderRadius: 14, padding: 10, display: 'flex', gap: 12, alignItems: 'stretch',
      fontFamily: F }}>
      {fallback
        ? <FaviconTile link={link} size={72} />
        : <div style={{ width: 104, flexShrink: 0 }}><Thumb link={link} h={72} radius={11} /></div>}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5,
        paddingRight: 2 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: C.cream, lineHeight: 1.28,
          letterSpacing: -0.1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', textWrap: 'pretty' }}>{link.title}</div>
        <div style={{ fontSize: 12, color: fallback ? C.greyDim : C.grey, fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fallback ? link.domain : link.source}</div>
        <div style={{ marginTop: 'auto' }}><MetaRow link={link} small /></div>
      </div>
    </button>
  );
}

function LinkCard({ link, density, onClick }) {
  return density === 'compact'
    ? <CompactCard link={link} onClick={onClick} />
    : <LargeCard link={link} onClick={onClick} />;
}

// ── Skeleton (preview loading) ───────────────────────────────
function shimmerKeyframes() {
  return `@keyframes lp-shimmer { 0%{background-position:-200px 0} 100%{background-position:340px 0} }`;
}
function Sk({ w, h, r = 6, style }) {
  return <div style={{ width: w, height: h, borderRadius: r, background:
    `linear-gradient(90deg, ${C.card2} 0%, ${C.cardHi} 50%, ${C.card2} 100%)`,
    backgroundSize: '400px 100%', animation: 'lp-shimmer 1.3s infinite linear', ...style }} />;
}
function SkeletonCard({ density }) {
  if (density === 'compact') {
    return (
      <div style={{ background: C.card, borderRadius: 14, padding: 10, display: 'flex', gap: 12 }}>
        <Sk w={104} h={72} r={11} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 3 }}>
          <Sk w="92%" h={13} /><Sk w="70%" h={13} /><Sk w="45%" h={11} style={{ marginTop: 'auto' }} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: C.card, borderRadius: 18, padding: 10 }}>
      <Sk w="100%" h={168} r={14} />
      <div style={{ padding: '12px 4px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Sk w="88%" h={15} /><Sk w="55%" h={12} /><Sk w="40%" h={11} />
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
function EmptyState({ icon = 'bookmark', title, body, action }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '0 48px', gap: 4 }}>
      <div style={{ width: 84, height: 84, borderRadius: 26, background: C.card,
        border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18 }}>
        <Icon name={icon} size={36} color={C.greyDim} stroke={1.6} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.cream }}>{title}</div>
      <div style={{ fontSize: 14, color: C.greyDim, lineHeight: 1.5, maxWidth: 240 }}>{body}</div>
      {action}
    </div>
  );
}

Object.assign(window, { LinkCard, LargeCard, CompactCard, SkeletonCard, Sk, EmptyState, shimmerKeyframes });
