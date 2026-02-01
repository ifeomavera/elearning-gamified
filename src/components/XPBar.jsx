import React from 'react';

const XPBar = ({ currentXP, level }) => {
  const xpToNextLevel = 1000;
  const progress = (currentXP % 1000) / xpToNextLevel * 100;

  return (
    <div style={styles.container}>
      {/* LEVEL BUBBLE */}
      <div className="animate-pop" style={styles.levelBubble}>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Level</span>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{level}</span>
      </div>

      {/* BAR CONTAINER */}
      <div style={styles.barContainer}>
        <div style={{ 
          ...styles.fill, 
          width: `${progress}%`,
          transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}></div>
      </div>
      
      <div style={styles.text}>
        {currentXP % 1000} / {xpToNextLevel} XP to Level {level + 1}
      </div>
    </div>
  );
};

const styles = {
  // FIX: Background is transparent (Dashboard parent handles the glass look)
  container: { 
    background: 'transparent', 
    padding: '10px 0', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px', 
    position: 'relative', 
    width: '100%'
  },
  levelBubble: { 
    background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', 
    width: '70px', height: '70px', borderRadius: '50%', 
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
    color: 'white', boxShadow: '0 4px 10px rgba(108, 92, 231, 0.4)', zIndex: 2, flexShrink: 0 
  },
  barContainer: { 
    flex: 1, height: '12px', 
    background: 'rgba(0,0,0,0.1)', // FIX: Darker track works on both themes
    borderRadius: '6px', overflow: 'hidden', position: 'relative' 
  },
  fill: { 
    height: '100%', 
    background: 'linear-gradient(90deg, #00b894, #55efc4)', 
    borderRadius: '6px' 
  },
  text: { 
    fontSize: '14px', 
    color: 'var(--text-secondary)', // FIX: Uses theme color
    fontWeight: 'bold', minWidth: '150px', textAlign: 'right' 
  }
};

export default XPBar;