import React from 'react';
import { FaPlay, FaCheck } from 'react-icons/fa';

const CourseCard = ({ title, module, xp, isCompleted, onClick }) => {
  return (
    <div 
      className="glass-card animate-slide-1" // ADDED glass-card class
      style={{
        padding: '20px', 
        marginBottom: '20px', 
        borderLeft: '5px solid var(--accent-color)', // Dynamic Color
        transition: 'transform 0.2s',
        // REMOVED background: 'white'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{module}</span>
        {isCompleted && <span style={{ fontSize: '12px', background: '#00b894', color: 'white', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><FaCheck /> Done</span>}
      </div>
      
      <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{title}</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: 'var(--accent-color)', background: 'rgba(0,0,0,0.05)', padding: '5px 10px', borderRadius: '8px', fontSize: '14px' }}>+{xp} XP</span>
        
        <button 
          onClick={onClick} 
          style={{
            background: isCompleted ? '#b2bec3' : 'var(--accent-color)',
            color: isCompleted ? 'white' : '#1e1e2e', // Dark text on bright button
            border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: isCompleted ? 'default' : 'pointer'
          }}
          disabled={isCompleted}
        >
          {isCompleted ? "Completed" : <><FaPlay size={12} /> Start</>}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;