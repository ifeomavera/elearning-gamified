import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ResetPassword = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Grab the token from the URL (e.g., /reset-password/YOUR_TOKEN_HERE)
  const token = window.location.pathname.split('/').pop();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    const toastId = toast.loading("Updating password...");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      await axios.put(`${apiUrl}/api/auth/resetpassword/${token}`, { password });
      
      toast.success("Password updated! Please login.", { id: toastId });
      
      // Clear any old session data so they can login fresh
      localStorage.clear();
      
      // Force a short delay so the user sees the success message
      setTimeout(() => {
        // Reset URL to clean root and go to login
        window.history.pushState({}, "", "/");
        onNavigate('login');
      }, 2000);

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password", { id: toastId });
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', padding: '20px' }}>
      <div className="glass-card" style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>New Password</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="password" 
            placeholder="New Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
            required
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
            required
          />
          <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '10px' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;