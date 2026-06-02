import React, { useState } from 'react';
import ShareSkills from './ShareSkills';
import RequestAssistance from './RequestAssistance';

export default function GeminiGiveTake() {
  const [sharedSkills, setSharedSkills] = useState({});
  const [requestedAssistance, setRequestedAssistance] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

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

  // Handler function that processes which specific action button was clicked
  const handleAction = (actionType) => {
    const finalSkillsToShare = Object.keys(sharedSkills).filter(
      (key) => sharedSkills[key],
    );
    const finalAssistanceNeeded = Object.keys(requestedAssistance).filter(
      (key) => requestedAssistance[key],
    );

    const payload = {
      actionSelected: actionType,
      skillsToShare: finalSkillsToShare,
      assistanceNeeded: finalAssistanceNeeded,
    };

    console.log('Action triggered payload:', payload);

    if (actionType === 'YES') {
      setStatusMessage('🎉 REQUEST SUBMITTED! NEIGHBORS NOTIFIED.');
    } else if (actionType === 'MAYBE') {
      setStatusMessage('🤝 MEETING REQUESTED! WE WILL SET UP A CHAT.');
    } else if (actionType === 'VIEW') {
      setStatusMessage('👀 LOADING AVAILABLE OFFERINGS FROM THE NETWORK.');
    }
  };

  if (statusMessage) {
    return (
      <div style={styles.appWrapper}>
        <div style={styles.card}>
          <div style={styles.badge}>SYSTEM_STATUS</div>
          <h2 style={styles.title}>{statusMessage}</h2>
          <p style={styles.subtitle}>
            Click below to change your routing parameters or form
            configurations.
          </p>
          <button
            style={styles.baseButton}
            onClick={() => setStatusMessage('')}
          >
            [ RETURN TO CONFIG ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appWrapper}>
      <div style={styles.card}>
        <div style={styles.badge}>APP_V1.1.0</div>
        <h1 style={styles.title}>GEMINI: GIVE & TAKE</h1>
        <p style={styles.subtitle}>
          Index your capabilities and routing requirements below.
        </p>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* SECTION 1: OFFERING SKILLS */}
          <ShareSkills
            selected={sharedSkills}
            onToggle={(category) => handleCheckboxChange(category, 'share')}
          />

          {/* SECTION 2: ASKING FOR HELP */}
          <RequestAssistance
            selected={requestedAssistance}
            onToggle={(category) => handleCheckboxChange(category, 'request')}
          />

          {/* BRUTALIST BUTTON MATRIX */}
          <div style={styles.buttonContainer}>
            <button
              type='button'
              style={{ ...styles.baseButton, backgroundColor: '#fbbf24' }}
              onClick={() => handleAction('YES')}
            >
              YES, I'D LIKE TO REQUEST THESE NEEDS ➔
            </button>

            <button
              type='button'
              style={{ ...styles.baseButton, backgroundColor: '#e2e8f0' }}
              onClick={() => handleAction('MAYBE')}
            >
              MAYBE, I'D LIKE TO MEET UP WITH THE NEIGHBOR FIRST ➔
            </button>

            <button
              type='button'
              style={{
                ...styles.baseButton,
                backgroundColor: '#60a5fa',
                color: '#ffffff',
              }}
              onClick={() => handleAction('VIEW')}
            >
              VIEW AVAILABLE OFFERINGS ➔
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
    textAlign: 'left', // Left-aligned text matches brutalist terminal structures
  },
};
