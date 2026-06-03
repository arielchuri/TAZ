import React from 'react';

// "Skills you'd like to share" section, broken out so it can stand alone
// on its own screen. Controlled: the parent owns `selected` (a map of
// category -> bool) and handles `onToggle`.

export const SHARE_CATEGORIES = [
  'Programming & Tech',
  'Graphic Design',
  'Writing & Translation',
  'Video & Animation',
  'Music & Audio',
  'Marketing & Business',
];

export default function ShareSkills({
  categories = SHARE_CATEGORIES,
  selected = {},
  onToggle,
  label = "DO YOU HAVE ANY SKILLS YOU'D LIKE TO SHARE?",
  accentColor = '#a3e635',
}) {
  return (
    <div style={styles.section}>
      <label style={styles.questionLabel}>{label}</label>
      <div style={styles.verticalStack}>
        {categories.map((category) => {
          const isChecked = !!selected[category];
          return (
            <label
              key={`share-${category}`}
              style={{
                ...styles.checkboxTile,
                backgroundColor: isChecked ? accentColor : '#ffffff',
              }}
            >
              <input
                type='checkbox'
                checked={isChecked}
                onChange={() => onToggle?.(category)}
                style={styles.nativeCheckbox}
              />
              <span style={styles.customText}>{category.toUpperCase()}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
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
  verticalStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  checkboxTile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    border: '3px solid #000000',
    boxShadow: '3px 3px 0px 0px #000000',
    cursor: 'pointer',
    userSelect: 'none',
  },
  nativeCheckbox: {
    width: '20px',
    height: '20px',
    accentColor: '#000000',
    cursor: 'pointer',
    border: '3px solid #000000',
  },
  customText: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#000000',
  },
};
