import React, { useState } from 'react';
import { FaUserCircle, FaSave, FaArrowLeft, FaMedal } from 'react-icons/fa';

const Profile = ({ onNavigate, onUpdateProfile, showToast }) => {
  // 1. Get current data
  const [name, setName] = useState(localStorage.getItem('currentUser') || "Masade Paul");
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('userAvatar') || "👨‍💻");
  
  // Read-only stats
  const xp = parseInt(localStorage.getItem('studentXP') || "2350");
  const level = Math.floor(xp / 1000) + 1;

  // AVATAR OPTIONS
  const avatars = ["👨‍💻", "👩‍💻", "🦸‍♂️", "🥷", "👩‍🚀", "🤖", "🦊", "🦉", "⚡", "🔥"];

  // 2. Handle Save
  const handleSave = () => {
    localStorage.setItem('currentUser', name); 
    localStorage.setItem('userAvatar', selectedAvatar); // Save Avatar
    
    // Update App State (Pass both name and avatar)
    onUpdateProfile(name, selectedAvatar); 
    
    showToast("Profile Updated Successfully!", "success");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: '"Segoe UI", sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {/* SHOW SELECTED AVATAR LARGE */}
        <div style={{ fontSize: '80px', marginBottom: '10px' }}>{selectedAvatar}</div>
        <h2 style={{ color: '#2d3436', margin: '10px 0' }}>Edit Profile</h2>
        <span style={styles.badge}>Level {level} Scholar</span>
      </div>

      <div style={styles.card}>
        
        {/* AVATAR SELECTOR */}
        <label style={styles.label}>Choose your Avatar</label>
        <div style={styles.avatarGrid}>
          {avatars.map((av) => (
            <div 
              key={av}
              onClick={() => setSelectedAvatar(av)}
              style={{
                ...styles.avatarOption,
                background: selectedAvatar === av ? '#e3f2fd' : 'transparent',
                borderColor: selectedAvatar === av ? '#0984e3' : 'transparent',
                transform: selectedAvatar === av ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {av}
            </div>
          ))}
        </div>

        {/* NAME EDIT */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Display Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* READ ONLY STATS */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Total XP Earned</label>
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
          style={{ textAlign: 'center', color: '#0984e3', cursor: 'pointer', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
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
  label: { display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#636e72' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #b2bec3', fontSize: '16px', boxSizing: 'border-box' },
  readOnlyField: { background: '#f1f2f6', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: '#2d3436', fontWeight: 'bold' },
  saveBtn: { width: '100%', padding: '15px', background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  
  // NEW STYLES FOR GRID
  avatarGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' },
  avatarOption: { fontSize: '30px', cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '50%', border: '2px solid transparent', transition: '0.2s' }
};

export default Profile;