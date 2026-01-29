import React from 'react';
import { FaMedal, FaLock } from 'react-icons/fa'; // We installed react-icons earlier

const BadgeCard = ({ name, description, isUnlocked }) => {
  return (
    <div style={{
      ...styles.card,
      opacity: isUnlocked ? 1 : 0.5, // Fade out if locked
      filter: isUnlocked ? 'none' : 'grayscale(100%)', // Black & white if locked
      border: isUnlocked ? '2px solid #fdcb6e' : '2px solid #b2bec3'
    }}>
      <div style={styles.iconContainer}>
        {isUnlocked ? <FaMedal size={30} color="#fdcb6e" /> : <FaLock size={24} color="#636e72" />}
      </div>
      <div>
        <h4 style={{ margin: '0 0 5px 0', color: '#2d3436' }}>{name}</h4>
        <p style={{ margin: 0, fontSize: '12px', color: '#636e72' }}>{description}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '300px'
  },
  iconContainer: {
    background: '#f1f2f6',
    padding: '10px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default BadgeCard;