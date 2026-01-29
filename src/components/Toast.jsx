import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose }) => {
  // Automatically disappear after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'error' ? '#ff7675' : '#2d3436', // Red for error, Dark for success
      color: 'white',
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 2000,
      minWidth: '250px',
      borderLeft: `5px solid ${type === 'error' ? '#d63031' : '#00b894'}`, // Green stripe for success
      animation: 'slideIn 0.3s ease-out'
    }}>
      {type === 'success' ? <FaCheckCircle color="#00b894" /> : <FaExclamationCircle color="white" />}
      <span style={{ fontWeight: '500', fontSize: '14px' }}>{message}</span>
      
      {/* Inline Keyframes for animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;