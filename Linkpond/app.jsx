// app.jsx — root: navigation, sheets, toast, density toggle, demo tray
// Depends on all prior files.

function Toast({ show, text }) {
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, bottom: 92, zIndex: 40,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      transform: show ? 'translateY(0)' : 'translateY(20px)', opacity: show ? 1 : 0,
      transition: 'all .3s cubic-bezier(.22,1,.36,1)' }}>
      <div style={{ background: C.greenSoft, border: `1px solid ${C.green}44`, backdropFilter: 'blur(8px)',
        borderRadius: 13, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
        <Icon name="check" size={18} color={C.green} stroke={2.4} />
        <span style={{ fontSize: 14, fontWeight: 700, color: C.cream }}>{text}</span>
      </div>
    </div>
  );
}

function App() {
  const [nav, setNav] = React.useState('home');         // home|groups|search|resurface
  const [density, setDensity] = React.useState('large'); // large|compact
  const [group, setGroup] = React.useState('all');
  const [detail, setDetail] = React.useState(null);      // active link or null
  const [saveSheet, setSaveSheet] = React.useState(null);// null | 'manual' | 'share'
  const [groupSheet, setGroupSheet] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const tRef = React.useRef(null);

  const fireToast = (text) => {
    setToast(text); clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setToast(null), 2200);
  };

  const openLink = (l) => setDetail(l);
  const onSaved = () => { setSaveSheet(null); fireToast('Saved to Linkpond'); };
  const onGroupCreated = () => { setGroupSheet(false); fireToast('Group created'); };

  let screen;
  if (detail) {
    screen = <DetailScreen link={detail} onBack={() => setDetail(null)} />;
  } else if (nav === 'home') {
    screen = <HomeScreen density={density} setDensity={setDensity} onOpenLink={openLink}
      group={group} setGroup={setGroup} />;
  } else if (nav === 'groups') {
    screen = <GroupsScreen onOpenGroup={(g) => { setGroup(g.id); setNav('home'); }}
      onCreate={() => setGroupSheet(true)} />;
  } else if (nav === 'search') {
    screen = <SearchScreen onOpenLink={openLink} />;
  } else if (nav === 'resurface') {
    screen = <ResurfaceScreen onOpenLink={openLink} />;
  }

  const showChrome = !detail; // bottom nav + FAB hidden in detail view

  // scale the whole stage to fit the viewport height
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => {
      const need = 858 + 22 + 44; // phone + gap + tray
      const avail = window.innerHeight - 36;
      setScale(Math.min(1, avail / need));
    };
    fit(); window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <Phone>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {screen}
        </div>

        {showChrome && <FAB onClick={() => setSaveSheet('manual')} />}
        {showChrome && <BottomNav active={nav} onNav={(id) => { setDetail(null); setNav(id);
          if (id !== 'home') setGroup('all'); }} />}

        <Toast show={!!toast} text={toast || ''} />

        <SaveSheet open={!!saveSheet} mode={saveSheet || 'manual'}
          onClose={() => setSaveSheet(null)} onSaved={onSaved} />
        <GroupCreateSheet open={groupSheet} onClose={() => setGroupSheet(false)} onCreate={onGroupCreated} />
      </Phone>

      {/* Demo tray (review aid — not part of the app UI) */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 420 }}>
        <span style={{ fontSize: 12, color: '#6E685E', alignSelf: 'center', fontWeight: 600,
          letterSpacing: 0.3, marginRight: 2 }}>TRY</span>
        <TrayBtn onClick={() => { setDetail(null); setSaveSheet('share'); }}
          icon="link" label="Simulate shared link" primary />
        <TrayBtn onClick={() => { setDetail(null); setNav('home'); setDensity(d => d === 'large' ? 'compact' : 'large'); }}
          icon="grid" label="Toggle card density" />
        <TrayBtn onClick={() => { setDetail(null); setNav('home'); setGroup('travel'); }}
          icon="folder" label="Empty group" />
      </div>
    </div>
    </div>
  );
}

function TrayBtn({ onClick, icon, label, primary }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 7,
      background: primary ? 'rgba(232,212,77,0.12)' : 'rgba(255,255,255,0.04)',
      border: primary ? '1px solid rgba(232,212,77,0.35)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: 99, padding: '8px 14px', cursor: 'pointer', fontFamily: F,
      color: primary ? '#E8D44D' : '#A8A294', fontSize: 13, fontWeight: 600 }}>
      <Icon name={icon} size={15} color={primary ? '#E8D44D' : '#A8A294'} />{label}</button>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
