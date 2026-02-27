import React, { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft, FaMedal, FaGraduationCap, FaUniversity, FaUser } from 'react-icons/fa';
import axios from 'axios';

const Profile = ({ onNavigate, onUpdateProfile, showToast }) => {
  const [name, setName] = useState(localStorage.getItem('currentUser') || "Student");
  const [major, setMajor] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('userAvatar') || "👨‍💻");
  const [xp, setXP] = useState(0);
  const [loading, setLoading] = useState(true);

  const avatars = ["👨‍💻", "👩‍💻", "🦸‍♂️", "🥷", "👩‍🚀", "🤖", "🦊", "🦉", "⚡", "🔥"];
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/users/${name}`);
        const data = res.data;
        setMajor(data.major || "Independent Learner");
        setAcademicLevel(data.academicLevel || "Beginner");
        setXP(data.xp || 0);
        setSelectedAvatar(data.avatar || "👨‍💻");
      } catch (err) { console.error("Profile load failed", err); }
      finally { setLoading(false); }
    };
    fetchUserData();
  }, [name, apiUrl]);

  const handleSave = async () => {
    try {
      // 1. Grab the original name you logged in with from local storage
      const originalName = localStorage.getItem('currentUser'); 
      
      // 2. Add the potentially new name to the payload
      const updateData = { 
        newName: name, // We send the new name here
        avatar: selectedAvatar, 
        major, 
        academicLevel 
      };
      
      // 3. Send the request to the ORIGINAL name's URL so the DB can find you
      await axios.put(`${apiUrl}/api/users/${originalName}/profile`, updateData);
      
      // 4. Update local storage with the new name and avatar
      localStorage.setItem('currentUser', name); 
      localStorage.setItem('userAvatar', selectedAvatar); 
      onUpdateProfile(name, selectedAvatar); 
      
      showToast("Scholar Profile Updated!", "success");
    } catch (err) { 
      console.error(err);
      showToast("Save failed", "error"); 
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-primary)' }}>Loading Scholar Data...</div>;

  return (
    <div className="profile-page-wrapper" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <style>{`
        .profile-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
        .responsive-avatar-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 25px; }
        
        @media (max-width: 600px) {
          .profile-fields-grid { grid-template-columns: 1fr; }
          .responsive-avatar-grid { grid-template-columns: repeat(4, 1fr); }
          .profile-page-wrapper { padding: 10px; }
          .profile-title { font-size: 18px !important; }
        }
        @media (max-width: 400px) {
          .responsive-avatar-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '15px' }}>
         <button onClick={() => onNavigate('dashboard')} className="glass-card" style={{ width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaArrowLeft /></button>
         <h2 className="profile-title" style={{ flex: 1, textAlign: 'center', color: 'var(--text-primary)', margin: 0 }}>Edit Profile</h2>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '80px', marginBottom: '10px' }}>{selectedAvatar}</div>
        <div style={styles.badge}><FaGraduationCap /> {academicLevel} • {major}</div>
      </div>

      <div className="glass-card" style={{ padding: '25px', borderRadius: '24px' }}>
        <label style={styles.label}>Choose Avatar</label>
        <div className="responsive-avatar-grid">
          {avatars.map(av => (
            <div key={av} onClick={() => setSelectedAvatar(av)} style={{ ...styles.avatarOption, background: selectedAvatar === av ? 'rgba(108, 92, 231, 0.2)' : 'transparent', borderColor: selectedAvatar === av ? 'var(--accent-color)' : 'transparent' }}>{av}</div>
          ))}
        </div>

        <label style={styles.label}><FaUser /> Display Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />

        <div className="profile-fields-grid">
          <div>
            <label style={styles.label}><FaUniversity /> Dept / Focus</label>
            <input value={major} onChange={(e) => setMajor(e.target.value)} style={styles.input} placeholder="e.g. Computer Science" />
          </div>
          <div>
            <label style={styles.label}><FaGraduationCap /> Learning Stage</label>
            <select value={academicLevel} onChange={(e) => setAcademicLevel(e.target.value)} style={styles.input}>
              <optgroup label="Academic">
                <option value="100L">100L</option><option value="200L">200L</option>
                <option value="300L">300L</option><option value="400L">400L</option>
                <option value="500L">500L</option><option value="Graduate">Graduate</option>
              </optgroup>
              <optgroup label="Independent">
                <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option><option value="Professional">Professional</option>
              </optgroup>
            </select>
          </div>
        </div>

        <button onClick={handleSave} style={{ ...styles.saveBtn, marginTop: '30px' }}> <FaSave /> Save Academic Record </button>
      </div>
    </div>
  );
};

const styles = {
  badge: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent-color)', color: '#fff', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
  label: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '12px' },
  input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', boxSizing: 'border-box' },
  saveBtn: { width: '100%', padding: '15px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  avatarOption: { fontSize: '30px', cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '12px', border: '2px solid transparent', transition: '0.2s' }
};

export default Profile;