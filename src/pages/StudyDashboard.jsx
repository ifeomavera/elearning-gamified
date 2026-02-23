import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js'; 
import Flashcard from '../components/Flashcard';
import { FaCloudUploadAlt, FaBrain, FaFileAlt, FaChevronLeft, FaRegFilePdf, FaDownload } from 'react-icons/fa';

const StudyDashboard = ({ userId, onNavigate, showToast }) => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const API_URL = 'https://elearning-api-dr6r.onrender.com/api/study-vault';

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/${userId}`);
      setMaterials(res.data);
    } catch (err) {
      console.error("Library fetch failed:", err);
    }
  };

  useEffect(() => { 
    if (userId) fetchMaterials(); 
  }, [userId]);

  const downloadSummaryPDF = () => {
    const element = document.getElementById('note-paper-content');
    const opt = {
      margin:       [15, 15],
      filename:     `${selectedMaterial?.title}_Summary.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
    showToast("Generating PDF...", "success");
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Client-side check for 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast("File is too large. Max limit is 10MB.", "error");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('title', file.name);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60s timeout for stability
        onUploadProgress: (p) => {
          setUploadProgress(Math.round((p.loaded * 100) / p.total));
        }
      });
      setUploadProgress(0);
      fetchMaterials();
      showToast("Material Indexed!", "reward", 50);
    } catch (err) { 
      setUploadProgress(0);
      const serverMsg = err.response?.data?.message || "Upload failed. Check your network connection.";
      showToast(serverMsg, "error");
    }
  };

  const generateAI = async (materialId, type) => {
    setLoading(true);
    setAiResult(null); 
    try {
      const res = await axios.post(`${API_URL}/generate-study-material`, { 
        materialId, userId, type 
      });
      
      let content = res.data.data;
      if (type === 'flashcards') {
        const cleanJson = content.replace(/```json|```/g, "").trim();
        content = JSON.parse(cleanJson);
      }
      setAiResult({ type, content });
      showToast("AI Distillation Complete!", "reward", 20);
    } catch (err) { 
      showToast("AI is recalibrating. Try again soon.", "error");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '25px', background: 'var(--bg-body)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* 🎨 CSS Styles Restored */}
      <style>{`
        .note-paper {
          background: #fff9db; 
          background-image: linear-gradient(#e5e5e5 1px, transparent 1px);
          background-size: 100% 30px;
          border-left: 2px solid #ffadad;
          padding: 40px 40px 40px 60px;
          line-height: 30px;
          box-shadow: 10px 10px 25px rgba(0,0,0,0.1);
          color: #2d3436; font-family: 'Inter', sans-serif;
          border-radius: 12px; position: relative;
        }
        .note-paper::before {
          content: ''; position: absolute; top: 0; left: 45px;
          width: 2px; height: 100%; background: #ffadad;
        }
        .progress-bar-container {
          width: 100%; height: 8px; background: rgba(255,255,255,0.1);
          border-radius: 10px; margin-top: 10px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .progress-bar-inner {
          height: 100%; background: #2ecc71; transition: width 0.3s ease;
        }
        .material-card {
          padding: 20px; cursor: pointer; transition: all 0.3s ease;
          border: 1px solid var(--card-border);
        }
        .material-card:hover {
          border-color: #6c5ce7; transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(108, 92, 231, 0.2);
        }
      `}</style>

      {/* Universal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ background: 'var(--glass-bg)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '10px', borderRadius: '12px' }}>
            <FaChevronLeft size={20}/>
          </button>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '28px', margin: 0 }}>
              <FaBrain color="#6c5ce7" style={{ marginRight: '10px' }} /> Study Vault
            </h1>
            <p style={{ margin: 0, opacity: 0.6, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px' }}>UNIVERSAL ACADEMIC ENGINE</p>
          </div>
        </div>
        
        <div style={{ width: '300px' }}>
          <label className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '15px 20px', cursor: 'pointer', fontSize: '12px', fontWeight: 900, border: '2px solid #2ecc71', color: '#2ecc71' }}>
            <FaCloudUploadAlt size={22}/> IMPORT COURSE NOTES
            <input type="file" hidden onChange={handleUpload} />
          </label>
          {uploadProgress > 0 && (
            <div className="progress-bar-container">
              <div className="progress-bar-inner" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', opacity: 0.5, fontWeight: 900 }}>Knowledge Base</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '70vh', overflowY: 'auto' }}>
            {materials.map(m => (
              <div 
                key={m._id} 
                className="glass-card material-card" 
                style={{ border: selectedMaterial?._id === m._id ? '2px solid #6c5ce7' : '1px solid var(--card-border)' }} 
                onClick={() => setSelectedMaterial(m)}
              >
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 800 }}>{m.title}</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={(e) => { e.stopPropagation(); generateAI(m._id, 'summary'); }} style={{ flex: 1, background: '#6c5ce7', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>SUMMARIZE</button>
                  <button onClick={(e) => { e.stopPropagation(); generateAI(m._id, 'flashcards'); }} style={{ flex: 1, background: 'transparent', border: '1.5px solid #6c5ce7', color: '#6c5ce7', padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>FLASHCARDS</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="display-area">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <FaBrain size={50} color="#6c5ce7" />
              </motion.div>
              <h2 style={{ fontWeight: 900, marginTop: '20px' }}>Distilling your concepts...</h2>
            </div>
          ) : aiResult ? (
            aiResult.type === 'summary' ? (
              <div style={{ position: 'relative' }}>
                <button onClick={downloadSummaryPDF} style={{ position: 'absolute', top: '-55px', right: '0', background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 900, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaDownload /> SAVE AS PDF
                </button>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="note-paper" id="note-paper-content">
                  <h2 style={{ color: '#d63031', fontWeight: 900, fontSize: '24px', marginBottom: '25px', textTransform: 'uppercase' }}>{selectedMaterial?.title}</h2>
                  {aiResult.content.split('\n').filter(l => l.trim()).map((line, i) => (
                    <p key={i} style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{line.startsWith('*') ? line : `• ${line}`}</p>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {aiResult.content.map((card, i) => <Flashcard key={i} {...card} />)}
              </div>
            )
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.3, marginTop: '150px' }}>
              <FaFileAlt size={80} />
              <h2 style={{ fontWeight: 900 }}>Select a file to begin</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyDashboard;