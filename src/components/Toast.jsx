import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaBolt } from 'react-icons/fa';

const Toast = ({ message, type = 'success', xpAmount = null, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, type === 'reward' ? 4000 : 3000); // Rewards stay slightly longer
    return () => clearTimeout(timer);
  }, [onClose, type]);

  // Determine styles based on type
  const isReward = type === 'reward';
  
  const styles = {
    position: 'fixed',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: isReward ? '18px 30px' : '15px 25px',
    borderRadius: isReward ? '50px' : '8px', // Rounder for rewards
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    color: 'white',
    // Position: Rewards are bottom-center, System is top-right
    top: isReward ? 'auto' : '20px',
    bottom: isReward ? '40px' : 'auto',
    right: isReward ? 'auto' : '20px',
    left: isReward ? '50%' : 'auto',
    transform: isReward ? 'translateX(-50%)' : 'none',
    // Theme
    background: isReward ? 'linear-gradient(135deg, #6c5ce7, #a29bfe)' : (type === 'error' ? '#ff7675' : '#2d3436'),
    borderLeft: isReward ? 'none' : `5px solid ${type === 'error' ? '#d63031' : '#00b894'}`,
    border: isReward ? '2px solid rgba(255,255,255,0.3)' : 'none',
    animation: isReward ? 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'slideIn 0.3s ease-out',
  };

  return (
    <div style={styles}>
      {isReward ? (
        <div style={{ background: '#f1c40f', borderRadius: '50%', padding: '8px', display: 'flex' }}>
          <FaBolt color="white" size={18} />
        </div>
      ) : (
        type === 'success' ? <FaCheckCircle color="#00b894" /> : <FaExclamationCircle color="white" />
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {isReward && xpAmount && (
          <span style={{ fontWeight: '900', fontSize: '18px', color: '#fff' }}>+{xpAmount} XP</span>
        )}
        <span style={{ fontWeight: isReward ? '700' : '500', fontSize: isReward ? '12px' : '14px' }}>
          {message}
        </span>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes popIn {
          from { transform: translate(-50%, 100px) scale(0.5); opacity: 0; }
          to { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;