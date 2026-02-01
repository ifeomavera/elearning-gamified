import React, { useState } from 'react';
import { FaSave, FaArrowLeft, FaMedal } from 'react-icons/fa';

const Profile = ({ onNavigate, onUpdateProfile, showToast }) => {
  const [name, setName] = useState(localStorage.getItem('currentUser') || "Student");
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('userAvatar') || "👨‍💻");
  const xp = parseInt(localStorage.getItem('studentXP') || "2350");
  const level = Math.floor(xp / 1000) + 1;
  const avatars = ["👨‍💻", "👩‍💻", "🦸‍♂️", "🥷", "👩‍🚀", "🤖", "🦊", "🦉", "⚡", "🔥"];

  const handleSave = () => {
    // 1. Save to Database (LocalStorage)
    localStorage.setItem('currentUser', name); 
    localStorage.setItem('userAvatar', selectedAvatar); 
    
    // 2. CRITICAL: Update App State Instantly!
    onUpdateProfile(name, selectedAvatar); 
    
    showToast("Profile Updated Successfully!", "success");
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'var(--font-head)' }}>
      {/* HEADER WITH BACK BUTTON */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
         <button 
            onClick={() => onNavigate('dashboard')}
            className="glass-card"
            style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--card-border)', marginRight: '20px', color: 'var(--text-primary)' }}
          >
            <FaArrowLeft size={18} />
          </button>
          <div style={{ flex: 1, textAlign: 'center', paddingRight: '45px' }}>
            <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Edit Profile</h2>
          </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div className="animate-pop" style={{ fontSize: '80px', marginBottom: '10px' }}>{selectedAvatar}</div>
        <span style={styles.badge}>Level {level} Scholar</span>
      </div>

      <div className="glass-card" style={{ padding: '30px' }}>
        <label style={styles.label}>Choose your Avatar</label>
        <div style={styles.avatarGrid}>
          {avatars.map((av) => (
            <div 
              key={av}
              onClick={() => setSelectedAvatar(av)}
              style={{ ...styles.avatarOption, background: selectedAvatar === av ? 'rgba(0,0,0,0.1)' : 'transparent', borderColor: selectedAvatar === av ? 'var(--accent-color)' : 'transparent', transform: selectedAvatar === av ? 'scale(1.1)' : 'scale(1)' }}
            >
              {av}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Display Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Total XP Earned</label>
          <div style={styles.readOnlyField}> <FaMedal color="#fdcb6e" /> {xp} XP </div>
        </div>

        <button onClick={handleSave} style={styles.saveBtn}> <FaSave /> Save Changes </button>
      </div>
    </div>
  );
};

const styles = {
  badge: { background: 'var(--accent-color)', color: '#1e1e2e', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' },
  label: { display: 'block', marginBottom: '10px', fontWeight: 'bold', color: 'var(--text-secondary)' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '16px', boxSizing: 'border-box', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' },
  readOnlyField: { background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 'bold' },
  saveBtn: { width: '100%', padding: '15px', background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  avatarGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' },
  avatarOption: { fontSize: '30px', cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '50%', border: '2px solid transparent', transition: '0.2s' }
};

export default Profile;