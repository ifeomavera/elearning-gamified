import React from 'react';
import { FaPlay, FaCheck } from 'react-icons/fa';

const CourseCard = ({ title, module, xp, isCompleted, onClick }) => {
  return (
    <div 
      className="animate-slide-1" // Added Animation Class!
      style={styles.card}
    >
      <div style={styles.header}>
        <span style={styles.moduleTag}>{module}</span>
        {isCompleted && <span style={styles.completedTag}><FaCheck /> Done</span>}
      </div>
      
      <h3 style={styles.title}>{title}</h3>
      
      <div style={styles.footer}>
        <span style={styles.xpTag}>+{xp} XP</span>
        
        {/* IMPORTANT: This button must use the onClick prop */}
        <button 
          onClick={onClick} 
          style={{
            ...styles.button,
            background: isCompleted ? '#b2bec3' : '#0984e3',
            cursor: isCompleted ? 'default' : 'pointer'
          }}
          disabled={isCompleted}
        >
          {isCompleted ? "Completed" : <><FaPlay size={12} /> Start</>}
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px', borderLeft: '5px solid #0984e3', transition: 'transform 0.2s' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  moduleTag: { fontSize: '12px', fontWeight: 'bold', color: '#636e72', textTransform: 'uppercase' },
  completedTag: { fontSize: '12px', background: '#00b894', color: 'white', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '5px' },
  title: { margin: '0 0 15px 0', color: '#2d3436', fontSize: '18px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  xpTag: { fontWeight: 'bold', color: '#0984e3', background: '#e3f2fd', padding: '5px 10px', borderRadius: '8px', fontSize: '14px' },
  button: { border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }
};

export default CourseCard;