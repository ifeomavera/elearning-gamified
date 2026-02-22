import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // ✅ Added for animations
import Flashcard from '../components/Flashcard';
import Toast from '../components/Toast'; // ✅ Added for Gamified rewards
import { FaCloudUploadAlt, FaBrain, FaFileAlt, FaChevronLeft } from 'react-icons/fa';

const StudyDashboard = ({ userId, onNavigate }) => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // ✅ Toast State for Rewards
  const [toast, setToast] = useState(null);

  const API_URL = 'https://elearning-api-dr6r.onrender.com/api/study-vault';

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/${userId}`);
      setMaterials(res.data);
    } catch (err) {
      console.error("Failed to fetch library:", err);
    }
  };

  useEffect(() => { 
    if (userId) fetchMaterials(); 
  }, [userId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('title', file.name);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setUploadProgress(0);
      fetchMaterials();
      
      // ✅ Trigger Reward Toast
      setToast({ message: "Coursework Indexed!", type: "reward", xpAmount: 50 });
    } catch (err) { 
      console.error("Upload Error:", err.response?.data || err.message);
      setUploadProgress(0);
      setToast({ message: "Upload failed. Try a smaller file.", type: "error" });
    }
  };

  const generateAI = async (materialId, type) => {
    setLoading(true);
    setAiResult(null); 
    try {
      const res = await axios.post(`${API_URL}/generate-study-material`, { 
        materialId, 
        userId, 
        type 
      });
      
      let content = res.data.data;
      if (type === 'flashcards') {
        try {
          content = typeof content === 'string' ? JSON.parse(content) : content;
        } catch (e) {
          console.error("JSON Parse Error:", e);
        }
      }
      
      setAiResult({ type, content });
      // ✅ Trigger AI Engagement Reward
      setToast({ message: "Knowledge Strategy Generated!", type: "reward", xpAmount: 20 });
    } catch (err) { 
      console.error("AI Error:", err);
      setToast({ message: "The AI tutor is busy. Try again soon.", type: "error" });
    }
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
          border-radius: 8px;
        }
        .progress-bar-inner {
          height: 100%; background: #2ecc71; transition: width 0.3s ease; border-radius: 10px;
        }
        .material-item:hover { border-color: var(--accent-color); transform: translateX(5px); }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><FaChevronLeft size={20}/></button>
          <h1 style={{ fontWeight: 900, fontSize: '24px', margin: 0 }}><FaBrain color="#2ecc71" /> Study Vault</h1>
        </div>
        
        <div style={{ width: '250px' }}>
          <label className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '12px', fontWeight: 900, border: '1.5px solid #2ecc71' }}>
            <FaCloudUploadAlt size={18}/> UPLOAD BABCOCK NOTES
            <input type="file" hidden onChange={handleUpload} />
          </label>
          {uploadProgress > 0 && (
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div className="progress-bar-inner" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>
        {/* Sidebar: Materials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', opacity: 0.6, fontWeight: 900, letterSpacing: '1px' }}>Your Library</h3>
          {materials.length === 0 ? <p style={{ fontSize: '13px', opacity: 0.5 }}>No notes uploaded yet.</p> : materials.map(m => (
            <div key={m._id} className="glass-card material-item" style={{ padding: '18px', cursor: 'pointer', transition: '0.2s', border: selectedMaterial?._id === m._id ? '2px solid #2ecc71' : '1px solid var(--card-border)' }} onClick={() => setSelectedMaterial(m)}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={(e) => { e.stopPropagation(); generateAI(m._id, 'summary'); }} style={{ flex: 1, background: '#6c5ce7', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>SUMMARIZE</button>
                <button onClick={(e) => { e.stopPropagation(); generateAI(m._id, 'flashcards'); }} style={{ flex: 1, background: 'transparent', border: '1.5px solid #6c5ce7', color: '#6c5ce7', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>FLASHCARDS</button>
              </div>
            </div>
          ))}
        </div>

        {/* Main: Display Area */}
        <div className="display-area">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '2px dashed var(--card-border)' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ display: 'inline-block', marginBottom: '15px' }}>
                <FaBrain size={40} color="#6c5ce7" />
              </motion.div>
              <h2 style={{ fontWeight: 900 }}>AI is reading your notes...</h2>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Analyzing content for academic precision. +20 XP incoming!</p>
            </div>
          ) : aiResult ? (
            aiResult.type === 'summary' ? (
              <div className="note-paper">
                <h2 style={{ marginBottom: '25px', color: '#d63031', fontWeight: 900, fontSize: '22px', borderBottom: '2px solid #ffadad', paddingBottom: '10px' }}>
                  Academic Summary: {selectedMaterial?.title}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {aiResult.content.split('\n').filter(line => line.trim()).map((line, i) => (
                    <p key={i} style={{ margin: 0 }}>{line.startsWith('*') || line.startsWith('-') ? line : `• ${line}`}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {Array.isArray(aiResult.content) && aiResult.content.map((card, i) => (
                  <Flashcard key={i} question={card.question} answer={card.answer} />
                ))}
              </div>
            )
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '100px', opacity: 0.4 }}>
              <FaFileAlt size={60} style={{ marginBottom: '20px' }} />
              <h2 style={{ fontWeight: 800 }}>Select a file to start studying</h2>
              <p>Your Babcock materials will appear here once processed.</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ NEW: Gamified Toast System */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          xpAmount={toast.xpAmount} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default StudyDashboard;