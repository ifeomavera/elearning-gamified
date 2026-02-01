import React from 'react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = ({ onNavigate }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'var(--font-head)'
    }}>
      <div className="glass-card animate-pop" style={{ padding: '40px', maxWidth: '400px', width: '100%' }}>
        
        {/* ICON */}
        <div style={{ 
          fontSize: '60px', 
          color: '#ff7675', 
          marginBottom: '20px',
          filter: 'drop-shadow(0 0 10px rgba(255, 118, 117, 0.5))'
        }}>
          <FaExclamationTriangle />
        </div>

        {/* TEXT */}
        <h1 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)', fontSize: '32px' }}>404</h1>
        <h2 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)', fontSize: '20px' }}>Lost in Space?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.5' }}>
          The page you are looking for doesn't exist or has been moved to another dimension.
        </p>

        {/* BUTTON */}
        <button 
          onClick={() => onNavigate('dashboard')}
          className="btn-primary"
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            fontSize: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px' 
          }}
        >
          <FaHome /> Return to Safety
        </button>

      </div>
    </div>
  );
};

export default NotFound;