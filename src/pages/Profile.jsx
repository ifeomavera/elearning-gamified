import React, { useState } from 'react';
import { FaUserCircle, FaSave, FaArrowLeft, FaMedal } from 'react-icons/fa';

const Profile = ({ onNavigate, onUpdateName, showToast }) => {
  // 1. Get current data
  const [name, setName] = useState(localStorage.getItem('currentUser') || "Masade Paul");
  
  // Read-only stats
  const xp = parseInt(localStorage.getItem('studentXP') || "2350");
  const level = Math.floor(xp / 1000) + 1;

  // 2. Handle Save
  const handleSave = () => {
    localStorage.setItem('currentUser', name); // Save to DB
    onUpdateName(name); // Update App State
    showToast("Profile Updated Successfully!", "success");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <FaUserCircle size={80} color="#00b894" />
        <h2 style={{ color: '#2d3436', margin: '10px 0' }}>Student Profile</h2>
        <span style={styles.badge}>Level {level} Scholar</span>
      </div>

      <div style={styles.card}>
        {/* EDIT FORM */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#636e72' }}>Display Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* READ ONLY STATS */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#636e72' }}>Total XP Earned</label>
          <div style={styles.readOnlyField}>
             <FaMedal color="#fdcb6e" /> {xp} XP
          </div>
        </div>

        {/* ACTIONS */}
        <button onClick={handleSave} style={styles.saveBtn}>
          <FaSave /> Save Changes
        </button>
        
        <p 
          onClick={() => onNavigate('dashboard')} 
          style={{ textAlign: 'center', color: '#0984e3', cursor: 'pointer', marginTop: '20px' }}
        >
          <FaArrowLeft /> Back to Dashboard
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  badge: { background: '#dfe6e9', color: '#2d3436', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #b2bec3', fontSize: '16px', boxSizing: 'border-box' },
  readOnlyField: { background: '#f1f2f6', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: '#2d3436', fontWeight: 'bold' },
  saveBtn: { width: '100%', padding: '15px', background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }
};

export default Profile;