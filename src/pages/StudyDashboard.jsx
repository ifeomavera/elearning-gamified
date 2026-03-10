import React, { useEffect, useState } from 'react';
import api from '../utils/api';                    
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js'; 
import Flashcard from '../components/Flashcard';
import AdaptiveQuiz from '../components/AdaptiveQuiz'; 
import { FaCloudUploadAlt, FaBrain, FaFileAlt, FaChevronLeft, FaDownload, FaTrash, FaCogs } from 'react-icons/fa';

const StudyDashboard = ({ userId, onNavigate, showToast }) => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState(null); 
  const [materialToDelete, setMaterialToDelete] = useState(null);

  // ✅ NEW: Student Quiz Configuration State
  const [quizConfig, setQuizConfig] = useState({
    show: false,
    materialId: null,
    numQuestions: 10,
    timeLimitMinutes: 10 // defaults to 10 mins
  });

  const fetchMaterials = async () => {
    try {
      const res = await api.get(`/study-vault/user/${userId}`);
      setMaterials(res.data);
    } catch (err) {
      showToast("Could not load your vault", "error");
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

    // ✅ UPDATED TO 50MB
    if (file.size > 50 * 1024 * 1024) {
      showToast("File is too large. Max limit is 50MB.", "error");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('title', file.name);

    try {
      await api.post('/study-vault/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => {
          setUploadProgress(Math.round((p.loaded * 100) / p.total));
        }
      });
      setUploadProgress(0);
      fetchMaterials();
      showToast("Material Indexed!", "reward", 50);
    } catch (err) { 
      setUploadProgress(0);
      const serverMsg = err.response?.data?.message || "Upload failed";
      showToast(serverMsg, "error");
    }
  };

  // ✅ UPDATED: Accepts custom configuration parameters
  const generateAI = async (materialId, type, customConfig = {}) => {
    setLoading(true);
    setAiResult(null); 
    
    // Convert minutes to seconds for the backend timer
    const timeLimitSeconds = customConfig.timeLimitMinutes ? customConfig.timeLimitMinutes * 60 : 0;

    try {
      const res = await api.post('/study-vault/generate-study-material', { 
        materialId, 
        userId, 
        type,
        numQuestions: customConfig.numQuestions,
        timeLimit: timeLimitSeconds
      });
      
      let content = res.data.data;
      if (type === 'flashcards') {
        const cleanJson = content.replace(/```json|```/g, "").trim();
        content = JSON.parse(cleanJson);
      }
      
      setAiResult({ type, content });
      
      const successMsg = type === 'quiz' ? "Practice Assessment Ready!" : "AI Distillation Complete!";
      showToast(successMsg, "reward", 20);
    } catch (err) { 
      const serverMsg = err.response?.data?.message || "AI is recalibrating. Try again soon.";
      showToast(serverMsg, "error");
    }
    setLoading(false);
  };

  const handleDelete = async (materialId) => {
    setDeletingId(materialId);
    setMaterialToDelete(null); 

    try {
      await api.delete(`/study-vault/${materialId}`);
      showToast("Material deleted successfully", "success");
      fetchMaterials();
      
      if (selectedMaterial?._id === materialId) {
        setSelectedMaterial(null);
        setAiResult(null);
      }
    } catch (err) {
      showToast("Failed to delete material", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Triggered when user confirms their quiz settings
  const handleLaunchQuiz = () => {
    generateAI(quizConfig.materialId, 'quiz', {
      numQuestions: parseInt(quizConfig.numQuestions),
      timeLimitMinutes: parseInt(quizConfig.timeLimitMinutes)
    });
    setQuizConfig({ ...quizConfig, show: false }); // Close modal
  };

  return (
    <div style={{ padding: '25px', background: 'var(--bg-body)', minHeight: '100vh', color: 'var(--text-primary)', position: 'relative' }}>
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
          position: relative;
        }
        .material-card:hover {
          border-color: #6c5ce7; transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(108, 92, 231, 0.2);
        }
        .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .delete-btn { background: #d63031 !important; color: white !important; border: none !important; }
        .delete-btn:hover { background: #b71c1c !important; }
        .config-input { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); color: var(--text-primary); border-radius: 8px; outline: none; margin-bottom: 15px; }
      `}</style>

      {/* Header */}
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
            <FaCloudUploadAlt size={22}/> IMPORT COURSE NOTES (Max 50MB)
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
        {/* Knowledge Base / History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', opacity: 0.5, fontWeight: 900 }}>Knowledge Base</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '70vh', overflowY: 'auto' }}>
            {materials.map(m => (
              <div 
                key={m._id} 
                className="glass-card material-card" 
                style={{ 
                  border: selectedMaterial?._id === m._id ? '2px solid #6c5ce7' : '1px solid var(--card-border)',
                  opacity: deletingId === m._id ? 0.6 : 1,
                  pointerEvents: deletingId === m._id ? 'none' : 'auto'
                }} 
                onClick={() => setSelectedMaterial(m)}
              >
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 800 }}>{m.title}</h4>
                
                <div className="action-grid">
                  <button onClick={(e) => { e.stopPropagation(); generateAI(m._id, 'summary'); }} style={{ background: '#6c5ce7', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>SUMMARIZE</button>
                  <button onClick={(e) => { e.stopPropagation(); generateAI(m._id, 'flashcards'); }} style={{ background: 'transparent', border: '1.5px solid #6c5ce7', color: '#6c5ce7', padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>FLASHCARDS</button>
                  
                  {/* ✅ UPDATED: Opens the Quiz Config Modal instead of auto-generating */}
                  <button onClick={(e) => { e.stopPropagation(); setQuizConfig({ show: true, materialId: m._id, numQuestions: 10, timeLimitMinutes: 10 }); }} style={{ background: 'transparent', border: '1.5px solid #2ecc71', color: '#2ecc71', padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>PRACTICE QUIZ</button>
                  
                  <button onClick={(e) => { e.stopPropagation(); setMaterialToDelete(m); }} className="delete-btn" disabled={deletingId === m._id} style={{ padding: '8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>
                    {deletingId === m._id ? 'DELETING...' : 'DELETE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display Area */}
        <div className="display-area">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <FaBrain size={50} color="#6c5ce7" />
              </motion.div>
              <h2 style={{ fontWeight: 900, marginTop: '20px' }}>Distilling your concepts...</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Analyzing large files may take a moment.</p>
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
            ) : aiResult.type === 'flashcards' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {aiResult.content.map((card, i) => <Flashcard key={i} {...card} />)}
              </div>
            ) : aiResult.type === 'quiz' ? (
              <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px', textAlign: 'center', fontWeight: '900' }}>
                  Vault Assessment: {selectedMaterial?.title}
                </h2>
                <AdaptiveQuiz 
                  lessonId={aiResult.content}
                  onComplete={(res) => {
                    showToast(`Practice complete! Earned ${res.score} XP.`, "reward", res.score);
                    setAiResult(null); 
                  }}
                  onWrongAnswer={() => {}}
                  onCorrectAnswer={() => {}}
                  onTimeUp={() => {
                    showToast("Time expired! Practice terminated.", "error");
                    setAiResult(null);
                  }}
                />
              </div>
            ) : null
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.3, marginTop: '150px' }}>
              <FaFileAlt size={80} />
              <h2 style={{ fontWeight: 900 }}>Select a file to begin</h2>
            </div>
          )}
        </div>
      </div>

      {/* ✅ NEW: QUIZ CONFIGURATION MODAL */}
      {quizConfig.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card" style={{ padding: '30px', width: '400px', background: 'var(--bg-body)' }}
          >
            <h3 style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
              <FaCogs /> Configure Practice Quiz
            </h3>
            
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '5px', fontSize: '14px' }}>Number of Questions (Max 50)</label>
            <input 
              type="number" 
              className="config-input" 
              min="1" max="50"
              value={quizConfig.numQuestions} 
              onChange={e => setQuizConfig({...quizConfig, numQuestions: e.target.value})} 
            />

            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '5px', fontSize: '14px' }}>Time Limit (Minutes)</label>
            <input 
              type="number" 
              className="config-input" 
              min="1"
              value={quizConfig.timeLimitMinutes} 
              onChange={e => setQuizConfig({...quizConfig, timeLimitMinutes: e.target.value})} 
            />

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button 
                onClick={() => setQuizConfig({ ...quizConfig, show: false })}
                style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                CANCEL
              </button>
              <button 
                onClick={handleLaunchQuiz}
                style={{ flex: 1, padding: '12px', background: '#2ecc71', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                GENERATE
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {materialToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} 
            className="glass-card" style={{ padding: '30px', textAlign: 'center', maxWidth: '400px', background: 'var(--bg-body)' }}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#d63031', fontSize: '20px', fontWeight: 900 }}>Delete Material?</h3>
            <p style={{ opacity: 0.8, marginBottom: '25px', fontSize: '14px', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <strong>{materialToDelete.title}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={() => setMaterialToDelete(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 900 }}>CANCEL</button>
              <button onClick={() => handleDelete(materialToDelete._id)} className="delete-btn" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#d63031', color: 'white', cursor: 'pointer', fontWeight: 900 }}>YES, DELETE</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudyDashboard;