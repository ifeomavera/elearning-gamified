import React, { useState } from 'react';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Password reset link sent to ${email}`);
      onNavigate('login');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FaLock size={50} color="#03dac6" />
        </div>
        <h2 style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>Reset Password</h2>
        <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '30px', fontSize: '16px' }}>
          Enter your email to receive recovery instructions.
        </p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Send Reset Link</button>
        </form>
        
        <p 
          onClick={() => onNavigate('login')} 
          style={{ marginTop: '20px', fontSize: '14px', color: '#03dac6', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <FaArrowLeft /> Back to Login
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#121212', fontFamily: '"Segoe UI", sans-serif', position: 'fixed', top: 0, left: 0 },
  card: { background: '#1e1e1e', padding: '50px', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.5)', width: '100%', maxWidth: '450px', border: '1px solid #333' },
  input: { width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', background: '#2d2d2d', color: 'white', boxSizing: 'border-box', outline: 'none', fontSize: '16px' },
  button: { width: '100%', padding: '14px', background: '#03dac6', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', fontSize: '16px' },
};

export default ForgotPassword;