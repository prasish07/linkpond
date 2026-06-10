// sheet.jsx — bottom sheet shell, quick-save / add-link sheet, reminder picker, group create
// Depends on theme.jsx, components.jsx, cards.jsx, data.jsx.

// ── Generic bottom sheet shell (dimmed scrim + slide-up card) ──
function Sheet({ open, onClose, children, maxH = '88%' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: open ? 'auto' : 'none' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,13,12,0.62)',
        opacity: open ? 1 : 0, transition: 'opacity .28s ease' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: C.body,
        borderRadius: '26px 26px 0 0', maxHeight: maxH, display: 'flex', flexDirection: 'column',
        transform: open ? 'translateY(0)' : 'translateY(102%)', transition: 'transform .34s cubic-bezier(.22,1,.36,1)',
        boxShadow: '0 -20px 50px rgba(0,0,0,0.45)', borderTop: `1px solid ${C.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, flexShrink: 0 }}>
          <div style={{ width: 38, height: 4.5, borderRadius: 3, background: C.greyDim, opacity: 0.7 }} />
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Field label ──────────────────────────────────────────────
function FieldLabel({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
      <Icon name={icon} size={15} color={C.grey} />
      <span style={{ fontSize: 12.5, fontWeight: 700, color: C.grey, letterSpacing: 0.3,
        textTransform: 'uppercase' }}>{children}</span>
    </div>
  );
}

// ── Preview block inside the save sheet (3 states) ───────────
function SavePreview({ state, link }) {
  if (state === 'loading') {
    return (
      <div style={{ background: C.card, borderRadius: 16, padding: 10, display: 'flex', gap: 12,
        alignItems: 'center' }}>
        <Sk w={92} h={64} r={11} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <Sk w="85%" h={13} /><Sk w="60%" h={11} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}>
            <span style={{ width: 13, height: 13, borderRadius: 99, border: `2px solid ${C.greyDim}`,
              borderTopColor: C.gold, animation: 'lp-spin .8s linear infinite' }} />
            <span style={{ fontSize: 12, color: C.greyDim, fontWeight: 600 }}>Fetching preview…</span>
          </div>
        </div>
      </div>
    );
  }
  if (state === 'fallback') {
    return (
      <div style={{ background: C.card, borderRadius: 16, padding: 10, display: 'flex', gap: 12,
        alignItems: 'center', border: `1px solid ${C.line}` }}>
        <FaviconTile link={link} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: C.cream, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {link.title}</div>
          <div style={{ fontSize: 12, color: C.greyDim, fontWeight: 600, marginTop: 4, display: 'flex',
            alignItems: 'center', gap: 5 }}>
            <Icon name="link" size={12} color={C.greyDim} />{link.domain}</div>
        </div>
      </div>
    );
  }
  // success — rich
  return (
    <div style={{ background: C.card, borderRadius: 16, padding: 10, display: 'flex', gap: 12 }}>
      <div style={{ width: 110, flexShrink: 0 }}><Thumb link={link} h={70} radius={11} /></div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: C.cream, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {link.title}</div>
        <div style={{ fontSize: 12, color: C.grey, fontWeight: 600, marginTop: 4 }}>{link.source}</div>
      </div>
    </div>
  );
}

// ── Quick-save / Add-link sheet ──────────────────────────────
function SaveSheet({ open, onClose, onSaved, mode }) {
  // mode: 'share' (incoming) or 'manual' (in-app +)
  const [state, setState] = React.useState('loading');  // loading | success | fallback
  const [link, setLink] = React.useState(LINKS[0]);
  const [note, setNote] = React.useState('');
  const [group, setGroup] = React.useState('watch');
  const [tags, setTags] = React.useState(['inspiration']);
  const [tagDraft, setTagDraft] = React.useState('');
  const [remind, setRemind] = React.useState(false);
  const [url, setUrl] = React.useState('');

  // when opened in share mode, simulate a fetch that resolves to a rich preview
  React.useEffect(() => {
    if (!open) return;
    if (mode === 'share') {
      setState('loading'); setLink(LINKS[0]); setNote(''); setGroup('watch');
      setTags(['inspiration']); setRemind(false); setUrl('https://youtu.be/dQw…');
      const t = setTimeout(() => setState('success'), 1500);
      return () => clearTimeout(t);
    } else {
      setState('idle'); setNote(''); setGroup('watch'); setTags([]); setRemind(false); setUrl('');
    }
  }, [open, mode]);

  // manual mode: pasting an example URL drives loading -> success/fallback
  const pasteExample = (which) => {
    setUrl(which === 'rich' ? 'https://youtube.com/watch?v=…' : 'https://instagram.com/p/…');
    setState('loading');
    setTimeout(() => { setLink(which === 'rich' ? LINKS[0] : LINKS[1]); setState(which); }, 1400);
  };

  const addTag = () => { const t = tagDraft.trim(); if (t) { setTags([...tags, t]); setTagDraft(''); } };
  const canSave = state === 'success' || state === 'fallback';

  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ padding: '14px 20px 4px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: C.goldSoft, display: 'flex',
          alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={mode === 'share' ? 'link' : 'plus'} size={17} color={C.gold} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.cream, letterSpacing: -0.2 }}>
            {mode === 'share' ? 'Save to Linkpond' : 'Add a link'}</div>
          {mode === 'share' && <div style={{ fontSize: 12, color: C.greyDim, marginTop: 1 }}>Shared from YouTube</div>}
        </div>
        <button onClick={onClose} style={{ border: 'none', background: C.card, width: 32, height: 32,
          borderRadius: 99, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={17} color={C.grey} /></button>
      </div>

      <div style={{ overflowY: 'auto', padding: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* URL row for manual mode */}
        {mode === 'manual' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: C.card,
              border: `1px solid ${C.line}`, borderRadius: 13, padding: '11px 13px' }}>
              <Icon name="link" size={17} color={C.grey} />
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste a link…"
                style={{ flex: 1, border: 'none', background: 'none', outline: 'none', color: C.cream,
                  fontSize: 14.5, fontFamily: F }} />
            </div>
            {state === 'idle' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: C.greyDim }}>Try:</span>
                <button onClick={() => pasteExample('rich')} style={exBtn}>YouTube link</button>
                <button onClick={() => pasteExample('fallback')} style={exBtn}>Instagram link</button>
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {state !== 'idle' && <SavePreview state={state} link={link} />}

        {state !== 'idle' && <>
          {/* Note */}
          <div>
            <FieldLabel icon="note">Note</FieldLabel>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
              placeholder="Why are you saving this?"
              style={{ width: '100%', boxSizing: 'border-box', resize: 'none', background: C.card,
                border: `1px solid ${C.line}`, borderRadius: 13, padding: '11px 13px', color: C.cream,
                fontSize: 14, fontFamily: F, outline: 'none', lineHeight: 1.45 }} />
          </div>

          {/* Group picker */}
          <div>
            <FieldLabel icon="folder">Group</FieldLabel>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {GROUPS.filter(g => g.id !== 'all').map(g => (
                <GroupChip key={g.id} name={g.name} color={g.color} active={group === g.id}
                  onClick={() => setGroup(g.id)} />
              ))}
              <button style={{ ...exBtn, borderStyle: 'dashed', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="plus" size={13} color={C.grey} />New</button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <FieldLabel icon="tag">Tags</FieldLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {tags.map((t, i) => <TagChip key={i} label={t} onRemove={() => setTags(tags.filter((_, j) => j !== i))} />)}
              <input value={tagDraft} onChange={e => setTagDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag…"
                style={{ flex: 1, minWidth: 90, border: 'none', background: 'none', outline: 'none',
                  color: C.cream, fontSize: 13.5, fontFamily: F, padding: '4px 2px' }} />
            </div>
          </div>

          {/* Reminder */}
          <button onClick={() => setRemind(!remind)} style={{ width: '100%', border: 'none', cursor: 'pointer',
            background: remind ? C.goldSoft : C.card, borderRadius: 13, padding: '13px 14px', display: 'flex',
            alignItems: 'center', gap: 12, textAlign: 'left' }}>
            <Icon name="bell" size={19} color={remind ? C.gold : C.grey} fill={remind ? C.gold : 'none'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: C.cream }}>Remind me</div>
              <div style={{ fontSize: 12.5, color: remind ? C.goldText : C.greyDim, marginTop: 1 }}>
                {remind ? 'Tomorrow, 9:00 AM' : 'Resurface this later'}</div>
            </div>
            <span style={{ width: 44, height: 26, borderRadius: 99, background: remind ? C.gold : C.card2,
              position: 'relative', transition: '.2s', flexShrink: 0 }}>
              <span style={{ position: 'absolute', top: 3, left: remind ? 21 : 3, width: 20, height: 20,
                borderRadius: 99, background: remind ? '#2A2820' : C.grey, transition: '.2s' }} /></span>
          </button>
        </>}
      </div>

      {/* Footer actions */}
      <div style={{ flexShrink: 0, padding: '14px 20px', paddingBottom: 22, display: 'flex', gap: 12,
        borderTop: `1px solid ${C.lineSoft}`, marginTop: 14 }}>
        <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: 14, border: `1px solid ${C.line}`,
          background: 'none', cursor: 'pointer', color: C.grey, fontSize: 15, fontWeight: 700, fontFamily: F }}>
          Cancel</button>
        <button onClick={() => canSave && onSaved()} disabled={!canSave} style={{ flex: 1.6, padding: '14px',
          borderRadius: 14, border: 'none', cursor: canSave ? 'pointer' : 'default',
          background: canSave ? C.gold : C.card2, color: canSave ? '#2A2820' : C.greyDim, fontSize: 15,
          fontWeight: 800, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="check" size={18} color={canSave ? '#2A2820' : C.greyDim} stroke={2.4} />Save link</button>
      </div>
    </Sheet>
  );
}

const exBtn = { border: `1px solid ${C.line}`, background: C.card, borderRadius: 99, padding: '7px 12px',
  cursor: 'pointer', color: C.grey, fontSize: 12.5, fontWeight: 600, fontFamily: F, whiteSpace: 'nowrap',
  flexShrink: 0 };

Object.assign(window, { Sheet, SaveSheet, SavePreview, FieldLabel, exBtn });
