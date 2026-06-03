import React, { useEffect, useState } from 'react';
import ConnectModal from './ConnectModal';

// Board page: shows all shared skills and requested needs.
// Clicking an entry opens ConnectModal so the viewer can reach out to the poster.

export default function BoardPage({ onBack }) {
  const [skills, setSkills] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null); // { entry, type: 'skill' | 'need' }

  useEffect(() => {
    Promise.all([
      fetch('/api/skills').then((r) => r.json()),
      fetch('/api/needs').then((r) => r.json()),
    ])
      .then(([s, n]) => {
        setSkills(s);
        setNeeds(n);
      })
      .catch(() => setError("COULDN'T LOAD — IS THE SERVER RUNNING?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.appWrapper}>
      <div style={styles.card}>
        <div style={styles.badge}>THE_BOARD</div>
        <h1 style={styles.title}>GIVE & TAKE BOARD</h1>
        <p style={styles.subtitle}>Everything currently on offer and requested.</p>

        {loading && <p style={styles.muted}>LOADING…</p>}
        {error && <div style={styles.errorBox}>{error}</div>}

        {!loading && !error && (
          <>
            <Column title='SKILLS ON OFFER' accent='#a3e635' entries={skills} onSelect={(e) => setSelected({ entry: e, type: 'skill' })} />
            <Column title='NEEDS REQUESTED' accent='#22d3ee' entries={needs} onSelect={(e) => setSelected({ entry: e, type: 'need' })} />
          </>
        )}

        {selected && (
          <ConnectModal
            entry={selected.entry}
            type={selected.type}
            onClose={() => setSelected(null)}
            onSent={(id) => {
              const mark = (list) =>
                list.map((e) => (e.id === id ? { ...e, pending: true } : e));
              if (selected.type === 'skill') setSkills(mark);
              else setNeeds(mark);
            }}
          />
        )}

        <div style={styles.buttonContainer}>
          <button
            type='button'
            style={{ ...styles.baseButton, backgroundColor: '#e2e8f0' }}
            onClick={onBack}
          >
            ◀ BACK
          </button>
        </div>
      </div>
    </div>
  );
}

function Column({ title, accent, entries, onSelect }) {
  return (
    <div style={styles.section}>
      <h2 style={{ ...styles.columnHeader, backgroundColor: accent }}>{title}</h2>
      {entries.length === 0 ? (
        <p style={styles.muted}>NOTHING HERE YET.</p>
      ) : (
        <div style={styles.list}>
          {entries.map((e) => (
            <div
              key={e.id}
              style={{ ...styles.entry, cursor: 'pointer' }}
              onClick={() => onSelect(e)}
              title='Click to connect'
            >
              <span style={styles.entryItem}>{(e.item || '').toUpperCase()}</span>
              <span style={styles.entryRight}>
                {e.pending && <span style={styles.pendingBadge}>PENDING</span>}
                {e.email && <span style={styles.entryMeta}>{e.email}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Brutalist Style Tokens (kept consistent with GeminiGiveTake).
const styles = {
  appWrapper: {
    backgroundColor: '#fffbeb',
    minHeight: '100vh',
    padding: '40px 20px',
    boxSizing: 'border-box',
    fontFamily: '"Courier New", Courier, monospace, sans-serif',
    fontWeight: '900',
  },
  card: {
    position: 'relative',
    maxWidth: '650px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    border: '4px solid #000000',
    borderRadius: '0px',
    boxShadow: '8px 8px 0px 0px #000000',
  },
  badge: {
    position: 'absolute',
    top: '-18px',
    left: '20px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: '3px solid #000000',
    padding: '4px 10px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  title: {
    fontSize: '2rem',
    margin: '10px 0 5px 0',
    color: '#000000',
    letterSpacing: '-1px',
    textTransform: 'uppercase',
    lineHeight: '1.2',
  },
  subtitle: {
    margin: '0 0 35px 0',
    color: '#555555',
    fontSize: '0.95rem',
  },
  section: {
    marginBottom: '40px',
  },
  columnHeader: {
    display: 'inline-block',
    fontSize: '1rem',
    padding: '6px 12px',
    border: '3px solid #000000',
    boxShadow: '3px 3px 0px 0px #000000',
    marginBottom: '15px',
    textTransform: 'uppercase',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  entry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    border: '3px solid #000000',
    boxShadow: '3px 3px 0px 0px #000000',
  },
  entryItem: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#000000',
  },
  entryRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  pendingBadge: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    padding: '2px 8px',
    border: '2px solid #000',
    backgroundColor: '#fbbf24',
    color: '#000',
    textTransform: 'uppercase',
  },
  entryMeta: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#555555',
  },
  muted: {
    color: '#777777',
    fontSize: '0.85rem',
  },
  errorBox: {
    border: '3px solid #000000',
    backgroundColor: '#f43f5e',
    color: '#ffffff',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  },
  baseButton: {
    width: '100%',
    padding: '16px',
    color: '#000000',
    border: '4px solid #000000',
    borderRadius: '0px',
    fontSize: '1rem',
    fontWeight: '900',
    cursor: 'pointer',
    boxShadow: '5px 5px 0px 0px #000000',
    textTransform: 'uppercase',
    textAlign: 'left',
  },
};
