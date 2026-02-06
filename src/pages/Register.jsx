import React, { useState } from 'react';
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import axios from 'axios';
import toast from 'react-hot-toast'; 

const Register = ({ onSignUp, onNavigate }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const toastId = toast.loading('Creating your account...');

    try {
      // ✅ THE FIX: Use the Environment Variable
      // This reads from your .env file locally, and Vercel settings when live.
      const apiUrl = import.meta.env.VITE_API_URL; 
      
      const res = await axios.post(`${apiUrl}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      toast.success("Account created successfully!", { id: toastId });
      onSignUp(res.data.username); 

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div style={styles.container}>
      <div className="bg-shape1" style={{ opacity: 0.15 }}></div>
      <div className="bg-shape2" style={{ opacity: 0.15 }}></div>

      <div className="glass-card" style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={styles.iconWrapper}>
            <FaUserPlus size={35} color="var(--accent-color)" />
          </div>
        </div>

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join the gamified learning platform</p>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          
          <div style={styles.inputGroup}>
            <FaUser style={styles.inputIcon} />
            <input 
              type="text" placeholder="Username" required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.inputIcon} />
            <input 
              type="email" placeholder="Email Address" required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={styles.input} 
            />
            
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '15px', marginTop: '-10px' }}>
             <span 
               style={{ color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}
               onClick={() => onNavigate('forgot-password')} 
             >
               Forgot Password?
             </span>
          </div>

          <button type="submit" className="btn-primary" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account? 
          <span onClick={() => onNavigate('login')} style={styles.link}> Login</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100vw', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', padding: '20px', fontFamily: 'var(--font-body)' },
  card: { width: '100%', maxWidth: '400px', padding: '40px', position: 'relative', zIndex: 10, borderRadius: '20px' },
  iconWrapper: { width: '70px', height: '70px', margin: '0 auto', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  title: { color: 'var(--text-primary)', marginBottom: '5px', textAlign: 'center', fontSize: '26px', fontWeight: 'bold', fontFamily: 'var(--font-head)' },
  subtitle: { color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '10px', fontSize: '14px' },
  inputGroup: { position: 'relative', marginBottom: '15px' },
  inputIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 },
  
  input: { width: '100%', padding: '12px 45px 12px 40px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' },
  
  button: { width: '100%', padding: '14px', fontSize: '16px', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', background: 'var(--accent-color)', marginTop: '10px' },
  link: { marginLeft: '5px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent-color)' },

  eyeIcon: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', cursor: 'pointer', zIndex: 10 }
};

export default Register;