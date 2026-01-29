import React from 'react';

const XPBar = ({ currentXP, level }) => {
  // LOGIC: Every level requires 1000 XP.
  // Example: If I have 2500 XP, I am Level 3 (2000 XP base + 500 XP progress).
  const xpPerLevel = 1000;
  const xpIntoLevel = currentXP % xpPerLevel;
  
  // Calculate width percentage: (500 / 1000) * 100 = 50%
  const progressPercent = (xpIntoLevel / xpPerLevel) * 100;

  return (
    <div style={styles.container}>
      {/* The Level Circle */}
      <div style={styles.levelBadge}>
        <span style={{fontSize: '10px', textTransform: 'uppercase'}}>Level</span>
        <span style={{fontSize: '20px', fontWeight: 'bold'}}>{level}</span>
      </div>
      
      {/* The Progress Bar */}
      <div style={styles.barContainer}>
        <div style={styles.track}>
          <div 
            style={{ 
              ...styles.fill, 
              width: `${progressPercent}%` 
            }} 
          ></div>
        </div>
        <div style={styles.text}>
          {xpIntoLevel} / {xpPerLevel} XP to Level {level + 1}
        </div>
      </div>
    </div>
  );
};

// Styling (CSS-in-JS for quick setup)
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: 'white',
    padding: '15px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    maxWidth: '500px',
    margin: '0 auto'
  },
  levelBadge: {
    background: '#6c5ce7', // Gaming Purple
    color: 'white',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(108, 92, 231, 0.4)'
  },
  barContainer: {
    flexGrow: 1,
  },
  track: {
    height: '12px',
    background: '#dfe6e9',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '5px'
  },
  fill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00b894, #55efc4)', // Green Gradient
    transition: 'width 0.5s ease-out'
  },
  text: {
    fontSize: '12px',
    color: '#636e72',
    fontWeight: '600',
    textAlign: 'right'
  }
};

export default XPBar;