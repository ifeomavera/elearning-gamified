import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaKey, FaCheckCircle, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const ResetPassword = () => {
  // ✅ This will now capture the token from the URL correctly
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Use Robust URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

      // ✅ Sends the captured token to the backend
      await axios.put(`${apiUrl}/api/auth/reset-password/${resetToken}`, {
        password
      });

      setMessage("Password updated successfully! Redirecting...");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Link might be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.gradientBg}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <FaKey size={28} color="#6c5ce7" />
          </div>
          <h2 style={styles.title}>Set New Password</h2>
          <p style={styles.subtitle}>Your new password must be different from previously used passwords.</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {message && <div style={styles.successBox}><FaCheckCircle /> {message}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* New Password */}
          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="New Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            <span onClick={() => navigate('/login')} style={styles.link}>
              <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Login
            </span>
          </p>
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
    maxWidth: '400px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    margin: '20px'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  iconWrapper: {
    width: '60px', height: '60px',
    borderRadius: '50%',
    background: '#f0f9ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 15px auto',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  },
  title: { fontSize: '24px', fontWeight: '800', color: '#2d3436', margin: '0' },
  subtitle: { fontSize: '14px', color: '#636e72', marginTop: '10px', lineHeight: '1.5' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
    color: '#b2bec3', fontSize: '16px', zIndex: 1
  },
  eyeIcon: {
    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
    cursor: 'pointer', color: '#b2bec3', zIndex: 2
  },
  input: {
    width: '100%',
    padding: '14px 45px 14px 45px',
    borderRadius: '12px',
    border: '2px solid #f1f2f6',
    background: '#f8f9fa',
    fontSize: '15px',
    color: '#2d3436',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  button: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(to right, #6c5ce7, #a29bfe)',
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
  successBox: {
    background: '#badc58', color: '#6ab04c', padding: '12px', borderRadius: '8px',
    fontSize: '14px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
  },
  footer: { marginTop: '30px', textAlign: 'center', borderTop: '1px solid #f1f2f6', paddingTop: '20px' },
  footerText: { fontSize: '14px', color: '#636e72' },
  link: { 
    color: '#6c5ce7', 
    fontWeight: '700', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    transition: 'color 0.2s'
  }
};

export default ResetPassword;