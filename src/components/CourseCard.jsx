import React from 'react';
import { FaPlay, FaCheck } from 'react-icons/fa';

const CourseCard = ({ title, module, xp, isCompleted, onClick }) => {
  return (
    <div style={{
      ...styles.card,
      borderLeft: isCompleted ? '5px solid #00b894' : '5px solid #0984e3',
      opacity: isCompleted ? 0.7 : 1
    }}>
      <div style={{ flex: 1 }}>
        <span style={styles.moduleTag}>{module}</span>
        <h4 style={{ margin: '5px 0', color: '#2d3436' }}>{title}</h4>
        <span style={styles.xpTag}>+{xp} XP</span>
      </div>
      
      <button 
        onClick={onClick}
        disabled={isCompleted}
        style={{
          ...styles.button,
          background: isCompleted ? '#b2bec3' : '#0984e3',
          cursor: isCompleted ? 'default' : 'pointer'
        }}
      >
        {isCompleted ? <FaCheck /> : <FaPlay />} 
        {isCompleted ? " Done" : " Start"}
      </button>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
    transition: 'transform 0.2s'
  },
  moduleTag: { fontSize: '12px', fontWeight: 'bold', color: '#636e72', textTransform: 'uppercase' },
  xpTag: { fontSize: '12px', color: '#0984e3', fontWeight: 'bold', background: '#e1f0ff', padding: '2px 8px', borderRadius: '4px' },
  button: {
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

export default CourseCard;