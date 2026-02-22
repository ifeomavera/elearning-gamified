import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Flashcard from '../components/Flashcard';
import { FaCloudUploadAlt, FaBrain, FaFileAlt } from 'react-icons/fa';

const StudyDashboard = ({ userId }) => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // ✅ NEW: Progress State

  const fetchMaterials = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await axios.get(`${apiUrl}/api/study-vault/user/${userId}`);
    setMaterials(res.data);
  };

  useEffect(() => { fetchMaterials(); }, [userId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('title', file.name);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/study-vault/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted); // ✅ Update Bar
        }
      });
      setUploadProgress(0);
      fetchMaterials();
    } catch (err) { console.error(err); setUploadProgress(0); }
  };

  const generateAI = async (materialId, type) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/study-vault/generate-study-material`, { materialId, userId, type });
      const content = type === 'flashcards' ? JSON.parse(res.data.data) : res.data.data;
      setAiResult({ type, content });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div style={{ padding: '25px', background: 'var(--bg-body)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <style>{`
        .note-paper {
          background: #fff9db; 
          background-image: linear-gradient(#e5e5e5 1px, transparent 1px);
          background-size: 100% 30px;
          border-left: 2px solid #ffadad;
          padding: 30px 40px 30px 60px;
          line-height: 30px;
          box-shadow: 5px 5px 15px rgba(0,0,0,0.1);
          color: #2d3436; font-family: 'Inter', sans-serif;
        }
        .progress-bar-inner {
          height: 100%; background: var(--accent-color); transition: width 0.3s ease; border-radius: 10px;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '24px' }}><FaBrain color="var(--accent-color)" /> Study Vault</h1>
        
        {/* ✅ NEW: Upload with Progress Bar */}
        <div style={{ width: '250px' }}>
          <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '12px', fontWeight: 900 }}>
            <FaCloudUploadAlt /> UPLOAD COURSEWORK
            <input type="file" hidden onChange={handleUpload} />
          </label>
          {uploadProgress > 0 && (
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
              <div className="progress-bar-inner" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        <div className="materials-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {materials.map(m => (
            <div key={m._id} className="glass-card" style={{ padding: '20px', border: selectedMaterial?._id === m._id ? '2px solid var(--accent-color)' : '1px solid var(--card-border)' }} onClick={() => setSelectedMaterial(m)}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>{m.title}</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => generateAI(m._id, 'summary')} style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', cursor: 'pointer' }}>SUMMARIZE</button>
                <button onClick={() => generateAI(m._id, 'flashcards')} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', cursor: 'pointer' }}>CARDS</button>
              </div>
            </div>
          ))}
        </div>

        <div className="display-area">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>AI is analyzing your Babcock notes... (+XP)</div>
          ) : aiResult ? (
            aiResult.type === 'summary' ? (
              <div className="note-paper">
                <h2 style={{ marginBottom: '20px', color: '#d63031', fontWeight: 900 }}>Academic Summary</h2>
                {aiResult.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {aiResult.content.map((card, i) => <Flashcard key={i} {...card} />)}
              </div>
            )
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '100px' }}>
              <FaFileAlt size={50} opacity={0.2} />
              <p>Select a document to begin your session.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyDashboard;