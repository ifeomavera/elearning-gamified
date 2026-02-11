import React, { useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa'; // ✅ Added Eye Icons
import axios from 'axios';

const Login = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ Added Toggle State
  const [error, setError] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // ✅ FIX: Use the Environment Variable (or fallback to localhost)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const res = await axios.post(`${apiUrl}/api/auth/login`, {
        username,
        password
      });

      // Role Security Check
      if (isAdminLogin && res.data.role !== 'admin') {
        setError("This account is not an Admin.");
        return;
      }

      // Success! Log them in
      onLogin(res.data.username, res.data.role === 'admin');

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div className="bg-shape1" style={{ opacity: 0.15 }}></div>
      <div className="bg-shape2" style={{ opacity: 0.15 }}></div>

      <div className="glass-card" style={styles.card}>
        
        {/* ICON HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={styles.iconWrapper}>
            {isAdminLogin ? (
              <FaChalkboardTeacher size={40} color="#ff7675" />
            ) : (
              <FaUserGraduate size={40} color="var(--accent-color)" />
            )}
          </div>
        </div>

        {/* TITLE TEXT */}
        <h2 style={styles.title}>
          {isAdminLogin ? "Instructor Portal" : "Student Portal"}
        </h2>
        <p style={styles.subtitle}>
          {isAdminLogin ? "Manage your curriculum" : "Gamify your learning journey"}
        </p>
        
        {/* ERROR MESSAGE */}
        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          
          {/* USERNAME */}
          <div style={styles.inputGroup}>
            <FaUser style={styles.inputIcon} />
            <input 
              type="text" 
              placeholder={isAdminLogin ? "Admin Username" : "Student Username"} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* PASSWORD (Now with Eye Icon) */}
          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input 
              type={showPassword ? "text" : "password"} // ✅ Toggles type
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            {/* ✅ The Eye Button */}
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '25px' }}>
            <span onClick={() => onNavigate('forgot-password')} style={styles.forgotLink}>
              Forgot Password?
            </span>
          </div>

          {/* BUTTON */}
          <button type="submit" className="btn-primary" style={{ 
            ...styles.button,
            background: isAdminLogin ? 'linear-gradient(135deg, #d63031 0%, #ff7675 100%)' : 'var(--accent-color)'
          }}>
            {isAdminLogin ? "Login to Admin Panel" : "Start Learning"}
          </button>
        </form>
        
        {/* FOOTER SWITCH */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isAdminLogin ? "Not an instructor?" : "Are you an instructor?"}
            <span 
              onClick={() => setIsAdminLogin(!isAdminLogin)} 
              style={{...styles.link, color: isAdminLogin ? 'var(--accent-color)' : '#ff7675'}}
            >
              {isAdminLogin ? " Student Login" : " Admin Login"}
            </span>
          </p>
        </div>

        {!isAdminLogin && (
          <p style={{ marginTop: '15px', ...styles.footerText, textAlign: 'center' }}>
            New here? <span onClick={() => onNavigate('register')} style={styles.link}>Create Account</span>
          </p>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
    fontFamily: 'var(--font-body, sans-serif)',
    transition: 'background 0.3s ease'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    position: 'relative',
    zIndex: 10,
    borderRadius: '20px'
  },
  iconWrapper: {
    width: '80px', height: '80px', margin: '0 auto', 
    borderRadius: '50%', 
    background: 'var(--bg-secondary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: { 
    color: 'var(--text-primary)', 
    marginBottom: '5px', 
    textAlign: 'center', 
    fontSize: '28px', 
    fontWeight: 'bold',
    fontFamily: 'var(--font-head, sans-serif)'
  },
  subtitle: { 
    color: 'var(--text-secondary)', 
    textAlign: 'center', 
    marginBottom: '10px', 
    fontSize: '15px' 
  },
  errorBox: {
    color: '#ff7675', 
    textAlign: 'center', 
    fontSize: '14px', 
    background: 'rgba(255, 118, 117, 0.1)', 
    padding: '10px', 
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid rgba(255, 118, 117, 0.2)'
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '20px'
  },
  inputIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)',
    zIndex: 1
  },
  eyeIcon: { // ✅ New Style for Eye Icon
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    zIndex: 2
  },
  input: {
    width: '100%',
    padding: '15px 45px 15px 45px', // Added padding on right for eye icon
    borderRadius: '10px',
    border: '1px solid var(--card-border)',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    outline: 'none',
    transition: '0.3s',
    fontFamily: 'var(--font-body, sans-serif)'
  },
  forgotLink: { color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' },
  button: {
    width: '100%', 
    padding: '15px', 
    fontSize: '16px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'var(--font-body, sans-serif)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  footer: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--card-border)', textAlign: 'center' },
  footerText: { fontSize: '14px', color: 'var(--text-secondary)' },
  link: { marginLeft: '5px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent-color)' }
};

export default Login;