import React, { useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const Login = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ DEBUG: Check if Vercel is actually finding your variable
    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
    console.log("🔌 Attempting login to:", `${apiUrl}/api/auth/login`);

    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, {
        identifier: username,
        password
      });

      // --- SECURITY CHECK ---
      
      // ✅ DEV BYPASS: Add your usernames here to access ANY side
      const devUsers = ['KAY FLOCK', 'Paul', 'Admin'];
      const isDev = devUsers.includes(res.data.username);

      // If trying to access Admin Panel...
      if (isAdminLogin) {
        // Block if NOT admin AND NOT a dev
        if (res.data.role !== 'admin' && !isDev) {
          setError("This account is not an Admin.");
          return;
        }
      }

      // Success! Log them in
      onLogin(res.data.username, isAdminLogin);

    } catch (err) {
      console.error("Login Failed:", err);
      // Give a more specific error message if the connection failed entirely
      if (err.message === "Network Error") {
         setError("Could not connect to server. Please check your internet or try again later.");
      } else {
         setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.gradientBg}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{...styles.iconWrapper, background: isAdminLogin ? '#fff5f5' : '#f0f9ff'}}>
            {isAdminLogin ? (
              <FaChalkboardTeacher size={32} color="#ff6b6b" />
            ) : (
              <FaUserGraduate size={32} color="#4834d4" />
            )}
          </div>
          <h2 style={styles.title}>{isAdminLogin ? "Instructor Portal" : "Student Portal"}</h2>
          <p style={styles.subtitle}>{isAdminLogin ? "Manage Curriculum" : "Gamify Your Learning"}</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.inputIcon} />
            <input 
              type="text" 
              placeholder={isAdminLogin ? "Admin Email or Username" : "Email or Username"} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={styles.forgotRow}>
            <span onClick={() => onNavigate('forgot-password')} style={styles.forgotLink}>
              Forgot Password?
            </span>
          </div>

          <button type="submit" style={{
            ...styles.button,
            background: isAdminLogin ? 'linear-gradient(to right, #ff6b6b, #ee5253)' : 'linear-gradient(to right, #6c5ce7, #a29bfe)'
          }}>
            {isAdminLogin ? "Login as Admin" : "Start Learning"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isAdminLogin ? "Not an instructor?" : "Are you an instructor?"}
            <span 
              onClick={() => setIsAdminLogin(!isAdminLogin)} 
              style={{...styles.link, color: isAdminLogin ? '#4834d4' : '#ff6b6b'}}
            >
              {isAdminLogin ? " Student Login" : " Admin Login"}
            </span>
          </p>
          {!isAdminLogin && (
            <p style={{...styles.footerText, marginTop: '10px'}}>
              New here? <span onClick={() => onNavigate('register')} style={styles.link}>Create Account</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MODERN STYLES ---
const styles = {
  container: {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  gradientBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(135deg, #a29bfe 0%, #74b9ff 100%)',
    zIndex: -1
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    margin: '20px'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  iconWrapper: {
    width: '64px', height: '64px',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 15px auto',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  },
  title: { fontSize: '24px', fontWeight: '800', color: '#2d3436', margin: '0' },
  subtitle: { fontSize: '14px', color: '#636e72', marginTop: '5px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
    color: '#b2bec3', fontSize: '16px', zIndex: 1
  },
  input: {
    width: '100%',
    padding: '14px 45px',
    borderRadius: '12px',
    border: '2px solid #f1f2f6',
    background: '#f8f9fa',
    fontSize: '15px',
    color: '#2d3436',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  eyeIcon: {
    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
    cursor: 'pointer', color: '#b2bec3', zIndex: 2
  },
  forgotRow: { textAlign: 'right', marginTop: '-5px' },
  forgotLink: { fontSize: '13px', color: '#636e72', cursor: 'pointer', fontWeight: '500' },
  button: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.1s ease'
  },
  errorBox: {
    background: '#ffeaa7', color: '#d63031', padding: '12px', borderRadius: '8px',
    fontSize: '14px', textAlign: 'center', marginBottom: '20px', fontWeight: '500'
  },
  footer: { marginTop: '30px', textAlign: 'center', borderTop: '1px solid #f1f2f6', paddingTop: '20px' },
  footerText: { fontSize: '14px', color: '#636e72' },
  link: { color: '#4834d4', fontWeight: '700', cursor: 'pointer', marginLeft: '5px' }
};

export default Login;