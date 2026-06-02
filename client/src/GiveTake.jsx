import React, { useState } from 'react';
import ShareSkills from './ShareSkills';
import RequestAssistance from './RequestAssistance';
import InfoDetails from './InfoDetails';
// import InfoDetails from './InfoDetails';

export default function GiveTake({ onViewBoard }) {
  const [step, setStep] = useState('choose'); // 'choose' | 'share' | 'need'
  const [sharedSkills, setSharedSkills] = useState({});
  const [requestedAssistance, setRequestedAssistance] = useState({});
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCheckboxChange = (category, type) => {
    if (type === 'share') {
      setSharedSkills((prev) => ({ ...prev, [category]: !prev[category] }));
    } else if (type === 'request') {
      setRequestedAssistance((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    }
  };

  const goToChoose = () => {
    setStep('choose');
    setError('');
  };

  const resetAll = () => {
    setStatusMessage('');
    setSharedSkills({});
    setRequestedAssistance({});
    setEmail('');
    setError('');
    setStep('choose');
  };

  // Persist the current form. mode 'share' -> /api/skills, 'need' -> /api/needs.
  // Each selected category is saved as its own entry, tagged with the email.
  const save = async (mode) => {
    const selected = mode === 'share' ? sharedSkills : requestedAssistance;
    const items = Object.keys(selected).filter((key) => selected[key]);

    if (!email.trim() || !/.+@.+\..+/.test(email.trim())) {
      setError('PLEASE ENTER A VALID EMAIL.');
      return;
    }
    if (items.length === 0) {
      setError('PLEASE SELECT AT LEAST ONE CATEGORY.');
      return;
    }

    const endpoint = mode === 'share' ? '/api/skills' : '/api/needs';
    setSubmitting(true);
    setError('');
    try {
      await Promise.all(
        items.map((item) =>
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item, email: email.trim() }),
          }).then((res) => {
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
          }),
        ),
      );
      setStatusMessage(
        mode === 'share'
          ? '🎉 SHARED! YOUR SKILLS ARE ON THE BOARD.'
          : '🎉 REQUEST SUBMITTED! NEIGHBORS NOTIFIED.',
      );
    } catch (e) {
      setError("COULDN'T SAVE — IS THE SERVER RUNNING?");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmation screen after a successful save.
  if (statusMessage) {
    return (
      <div style={styles.appWrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>{statusMessage}</h2>
          <button style={styles.baseButton} onClick={resetAll}>
            [ RETURN HOME ]
          </button>
        </div>
      </div>
    );
  }

  // Step 1: choose Share or Need.
  if (step === 'choose') {
    return (
      <div style={styles.appWrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>GIVE & TAKE</h1>
          <p style={styles.subtitle}>What would you like to do?</p>
          <div style={styles.infoWrapper}>
            <InfoDetails />
          </div>
          <div style={styles.buttonContainer}>
            <button
              type='button'
              style={{ ...styles.baseButton, backgroundColor: '#a3e635' }}
              onClick={() => {
                setError('');
                setStep('share');
              }}
            >
              SHARE — I HAVE SKILLS TO OFFER ➔
            </button>
            <button
              type='button'
              style={{ ...styles.baseButton, backgroundColor: '#22d3ee' }}
              onClick={() => {
                setError('');
                setStep('need');
              }}
            >
              NEED — I'M LOOKING FOR ASSISTANCE ➔
            </button>
            <button
              type='button'
              style={{ ...styles.baseButton, backgroundColor: '#ffffff' }}
              onClick={onViewBoard}
            >
              VIEW BOARD — SEE SKILLS & NEEDS ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sharing = step === 'share';

  // Step 2: the selected form (Share or Need) + email + save button.
  return (
    <div style={styles.appWrapper}>
      <div style={styles.card}>
        <div style={styles.badge}>{sharing ? 'SHARE_FORM' : 'NEED_FORM'}</div>
        <h1 style={styles.title}>
          {sharing ? 'SHARE' : 'NEED'}
        </h1>
        <p style={styles.subtitle}>
          Index your {sharing ? 'capabilities' : 'routing requirements'} below.
        </p>

        <form onSubmit={(e) => e.preventDefault()}>
          {sharing ? (
            <ShareSkills
              selected={sharedSkills}
              onToggle={(category) => handleCheckboxChange(category, 'share')}
            />
          ) : (
            <RequestAssistance
              selected={requestedAssistance}
              onToggle={(category) => handleCheckboxChange(category, 'request')}
            />
          )}
          <div style={styles.infoWrapper}>
            <InfoDetails />
          </div>
          {/* EMAIL — required on either form */}
          <div style={styles.section}>
            <label style={styles.questionLabel}>YOUR EMAIL</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              style={styles.emailInput}
            />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.buttonContainer}>
            <button
              type='button'
              disabled={submitting}
              style={{ ...styles.baseButton, backgroundColor: '#fbbf24' }}
              onClick={() => save(sharing ? 'share' : 'need')}
            >
              {submitting
                ? 'SAVING…'
                : sharing
                  ? "YES, I'D LIKE TO SHARE ➔"
                  : "YES, I'D LIKE TO REQUEST THESE NEEDS ➔"}
            </button>

            <button
              type='button'
              style={{ ...styles.baseButton, backgroundColor: '#e2e8f0' }}
              onClick={goToChoose}
            >
              ◀ BACK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Brutalist Style Tokens
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
  questionLabel: {
    fontSize: '1.1rem',
    display: 'block',
    marginBottom: '15px',
    color: '#000000',
    lineHeight: '1.4',
  },
  emailInput: {
    width: '100%',
    padding: '14px',
    border: '3px solid #000000',
    borderRadius: '0px',
    boxShadow: '3px 3px 0px 0px #000000',
    fontSize: '1rem',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    boxSizing: 'border-box',
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
