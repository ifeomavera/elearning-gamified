import React, { useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaLock } from 'react-icons/fa';

const Login = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username, isAdminLogin);
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* ICON */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isAdminLogin ? (
            <FaChalkboardTeacher size={50} color="#ff7675" />
          ) : (
            <FaUserGraduate size={50} color="#03dac6" />
          )}
        </div>

        {/* HEADER */}
        <h2 style={styles.title}>
          {isAdminLogin ? "Instructor Portal" : "Student Portal"}
        </h2>
        <p style={styles.subtitle}>
          {isAdminLogin ? "Login to manage courses" : "Login to access your dashboard"}
        </p>
        
        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder={isAdminLogin ? "Admin Username" : "Student Username"} 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <div style={{ position: 'relative' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <FaLock style={styles.iconLock} />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '25px' }}>
            <span onClick={() => onNavigate('forgot-password')} style={styles.forgotLink}>
              Forgot Password?
            </span>
          </div>

          <button type="submit" style={{
            ...styles.button, 
            background: isAdminLogin ? '#ff7675' : '#03dac6'
          }}>
            {isAdminLogin ? "Login as Admin" : "Access Dashboard"}
          </button>
        </form>
        
        {/* FOOTER */}
        <div style={styles.footer}>
          <p style={{ fontSize: '14px', color: '#a0a0a0' }}>
            {isAdminLogin ? "Are you a student?" : "Are you an instructor?"}
            <span 
              onClick={() => setIsAdminLogin(!isAdminLogin)} 
              style={{...styles.link, color: isAdminLogin ? '#03dac6' : '#ff7675'}}
            >
              {isAdminLogin ? "Student Login" : "Admin Login"}
            </span>
          </p>
        </div>

        {!isAdminLogin && (
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#a0a0a0', textAlign: 'center' }}>
            New here? <span onClick={() => onNavigate('register')} style={styles.link}>Create Account</span>
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  // FULLSCREEN CONTAINER
  container: {
    width: '100vw',
    minHeight: '100vh', // Ensures it covers height even on mobile scroll
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#121212',
    padding: '20px' // Padding prevents edges touching on small phones
  },
  
  // RESPONSIVE CARD
  card: {
    width: '100%',         // Try to take full width...
    maxWidth: '420px',     // ...but stop at 420px (Laptop size)
    background: '#1e1e1e',
    padding: '40px 30px',  // Comfortable padding
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
    border: '1px solid #333'
  },
  
  // TEXT STYLES
  title: { color: 'white', marginBottom: '8px', textAlign: 'center', fontSize: '24px' },
  subtitle: { color: '#a0a0a0', textAlign: 'center', marginBottom: '30px', fontSize: '14px' },
  
  // INPUTS
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#2d2d2d',
    color: 'white',
    fontSize: '16px', // 16px prevents zoom on iPhone
    boxSizing: 'border-box',
    outline: 'none'
  },
  
  // ICONS & BUTTONS
  iconLock: { position: 'absolute', right: '15px', top: '15px', color: '#666' },
  forgotLink: { color: '#a0a0a0', fontSize: '12px', cursor: 'pointer' },
  button: {
    width: '100%',
    padding: '14px',
    color: 'black',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
  },
  
  // LINKS
  footer: { marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #333', textAlign: 'center' },
  link: { marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#03dac6' }
};

export default Login;