import React from 'react';
import { FaLock, FaMedal } from 'react-icons/fa';

const BadgeCard = ({ name, description, isUnlocked }) => {
  return (
    <div 
      className="glass-card animate-pop" // Uses shared style
      style={{
        display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', 
        transition: 'all 0.3s ease',
        border: isUnlocked ? '1px solid var(--accent-color)' : '1px solid transparent',
        opacity: isUnlocked ? 1 : 0.5
        // REMOVED background: 'white'
      }}
    >
      <div style={{ 
        width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUnlocked ? 'rgba(255, 235, 59, 0.2)' : 'rgba(0,0,0,0.1)' 
      }}>
        {isUnlocked ? <FaMedal size={24} color="#fbc02d" /> : <FaLock size={20} color="var(--text-secondary)" />}
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{name}</h4>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{description}</p>
      </div>
    </div>
  );
};

export default BadgeCard;