import React from 'react';
import { FaLock, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

const Banned = ({ onLogout }) => {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f13', // Force dark background
      color: '#ffffff',
      padding: '20px',
      textAlign: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999 // Ensures nothing else overlaps it
    }}>
      <div style={{
        background: 'rgba(255, 118, 117, 0.05)',
        border: '2px solid #ff7675',
        padding: '50px 40px',
        borderRadius: '24px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(255, 118, 117, 0.1)'
      }}>
        <div style={{ 
          width: '80px', height: '80px', background: 'rgba(255, 118, 117, 0.2)', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 25px auto'
        }}>
          <FaLock style={{ fontSize: '35px', color: '#ff7675' }} />
        </div>
        
        <h1 style={{ margin: '0 0 15px 0', fontSize: '26px', letterSpacing: '2px', textTransform: 'uppercase', color: '#ff7675', fontWeight: '900' }}>
          Access Denied
        </h1>
        
        <p style={{ color: '#b2bec3', fontSize: '15px', lineHeight: '1.6', marginBottom: '35px' }}>
          Your scholar access has been permanently revoked by the System Administrator due to a violation of platform protocols. 
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button 
            onClick={() => window.location.href = "mailto:admin@vici-academy.com"}
            style={{
              padding: '16px', background: 'transparent', border: '1.5px solid #ff7675', color: '#ff7675',
              borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px', transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 118, 117, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <FaEnvelope /> Appeal to Admin
          </button>
          
          <button 
            onClick={onLogout}
            style={{
              padding: '16px', background: '#2d3436', border: 'none', color: '#fff',
              borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px'
            }}
          >
            <FaSignOutAlt /> Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banned;