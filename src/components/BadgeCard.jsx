import React from 'react';
import { FaLock, FaMedal } from 'react-icons/fa';

const BadgeCard = ({ name, description, isUnlocked }) => {
  return (
    <div 
      // ADD ANIMATION CLASS HERE
      className="animate-pop"
      style={{
        ...styles.card,
        border: isUnlocked ? '2px solid #fdcb6e' : '1px solid #dfe6e9',
        opacity: isUnlocked ? 1 : 0.6,
        transform: isUnlocked ? 'scale(1)' : 'scale(0.98)'
      }}
    >
      <div style={{ 
        ...styles.iconBox, 
        background: isUnlocked ? '#fff59d' : '#f1f2f6' 
      }}>
        {isUnlocked ? <FaMedal size={24} color="#fbc02d" /> : <FaLock size={20} color="#b2bec3" />}
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 5px 0', color: isUnlocked ? '#2d3436' : '#636e72' }}>{name}</h4>
        <p style={{ margin: 0, fontSize: '12px', color: '#b2bec3' }}>{description}</p>
      </div>
    </div>
  );
};

const styles = {
  card: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px', background: 'white', transition: 'all 0.3s ease' },
  iconBox: { width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default BadgeCard;