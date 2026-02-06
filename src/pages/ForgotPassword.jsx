import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; // <--- Import the Toast
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

// Make sure to accept onNavigate if you use it to go back to Login
const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Show Loading State
    const toastId = toast.loading('Sending reset link...');

    try {
      // NOTE: Ensure this URL matches your backend (Localhost or Render)
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { 
        email 
      });

      // 2. Success Notification (Replaces the ugly browser alert)
      toast.success(`Link sent! Check ${email}`, { id: toastId });
      
    } catch (err) {
      // 3. Error Notification
      const errorMessage = err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Shapes for consistency */}
      <div className="bg-shape1" style={{ opacity: 0.15 }}></div>
      <div className="bg-shape2" style={{ opacity: 0.15 }}></div>

      <div className="glass-card" style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter your email to receive recovery instructions.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="name@example.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" className="btn-primary" style={styles.button}>
            Send Reset Link
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span 
            onClick={() => onNavigate('login')} 
            style={styles.backLink}
          >
            <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

// Reusing your consistent Glass Styles
const styles = {
  container: { width: '100vw', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', padding: '20px', fontFamily: 'var(--font-body)' },
  card: { width: '100%', maxWidth: '450px', padding: '40px', position: 'relative', zIndex: 10, borderRadius: '20px', textAlign: 'center' },
  title: { color: 'var(--text-primary)', marginBottom: '10px', fontSize: '26px', fontWeight: 'bold', fontFamily: 'var(--font-head)' },
  subtitle: { color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' },
  inputGroup: { position: 'relative', marginBottom: '20px', textAlign: 'left' },
  inputIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 },
  input: { width: '100%', padding: '14px 15px 14px 45px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' },
  button: { width: '100%', padding: '14px', fontSize: '16px', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', background: 'var(--accent-color)' },
  backLink: { color: 'var(--text-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '14px', marginTop: '10px' }
};

export default ForgotPassword;