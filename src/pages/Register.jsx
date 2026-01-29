import React, { useState } from 'react';
import { FaIdCard } from 'react-icons/fa';

const Register = ({ onSignUp, onNavigate }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSignUp(username);
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FaIdCard size={60} color="#bb86fc" />
        </div>
        <h2 style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>New Registration</h2>
        <p style={{ color: '#a0a0a0', textAlign: 'center', marginBottom: '30px', fontSize: '16px' }}>Create your student identity</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Choose Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Create Account</button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '15px', color: '#a0a0a0', textAlign: 'center' }}>
          Already registered? <span onClick={() => onNavigate('login')} style={styles.link}>Login</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#121212', fontFamily: '"Segoe UI", sans-serif', position: 'fixed', top: 0, left: 0 },
  card: { background: '#1e1e1e', padding: '50px', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.5)', width: '100%', maxWidth: '450px', border: '1px solid #333' },
  input: { width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', background: '#2d2d2d', color: 'white', boxSizing: 'border-box', outline: 'none', fontSize: '16px' },
  button: { width: '100%', padding: '14px', background: '#bb86fc', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', fontSize: '16px' },
  link: { color: '#bb86fc', cursor: 'pointer', fontWeight: 'bold' }
};

export default Register;