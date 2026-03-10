import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, FaForward, FaHeart, FaSkull, FaRedo, FaGhost, 
  FaCode, FaUpload, FaMicrochip, FaDatabase, FaShieldAlt, FaListUl, FaCheck
} from 'react-icons/fa';
import confetti from 'canvas-confetti';
import AdaptiveQuiz from '../components/AdaptiveQuiz'; 
import Flashcard from '../components/Flashcard'; // ✅ New Import
import axios from 'axios';

const LessonView = ({ lesson, username, onComplete, onExit }) => { 
  const [step, setStep] = useState('reading'); // ✅ Starts in 'reading' mode now
  const [finalXP, setFinalXP] = useState(0); 
  const [submission, setSubmission] = useState(""); 
  
  // --- BOSS BATTLE STATE ---
  const [bossHP, setBossHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(3); 
  const [isDamaged, setIsDamaged] = useState(false);
  const [damagePerHit, setDamagePerHit] = useState(20); 

  // --- NETACAD CURRICULUM STATE ---
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 1. Flatten the nested curriculum into a sequential array of pages
  useEffect(() => {
    if (!lesson) return;
    
    let flatPages = [];
    if (lesson.modules && lesson.modules.length > 0) {
      lesson.modules.forEach(mod => {
        mod.chapters.forEach(chap => {
          chap.pages.forEach(page => {
            flatPages.push({
              ...page,
              moduleTitle: mod.title,
              chapterTitle: chap.title,
            });
          });
        });
      });
    } else {
      // Fallback for legacy courses that haven't been updated to the new schema yet
      flatPages = [{
        pageNumber: "1.1.1",
        title: lesson.title,
        contentBlocks: [{ type: 'video', data: { videoId: lesson.videoId } }]
      }];
    }
    setPages(flatPages);

    // 2. Fetch User's Bookmark to resume where they left off
    const fetchBookmark = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/users/${encodeURIComponent(username)}`);
        const savedPage = res.data.courseProgress?.[lesson._id];
        
        if (savedPage) {
          const index = flatPages.findIndex(p => p.pageNumber === savedPage);
          if (index !== -1) setCurrentPageIndex(index);
        }
      } catch (err) { console.error("Could not retrieve bookmark"); }
    };
    fetchBookmark();

  }, [lesson, username]);

  // 3. Auto-Save Bookmark when navigating pages
  const navigateToPage = async (index) => {
    setCurrentPageIndex(index);
    if (pages[index]) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.put(`${apiUrl}/api/users/${encodeURIComponent(username)}/bookmark`, {
          courseId: lesson._id,
          pageNumber: pages[index].pageNumber
        });
      } catch (err) { console.error("Failed to sync bookmark"); }
    }
  };

  const getGuardianDetails = () => {
    const module = lesson.module?.toLowerCase() || "";
    if (module.includes('software')) return { icon: <FaCode />, color: '#6c5ce7', name: 'The Architect' };
    if (module.includes('data')) return { icon: <FaDatabase />, color: '#0984e3', name: 'The Data Overlord' };
    if (module.includes('security')) return { icon: <FaShieldAlt />, color: '#d63031', name: 'The Gatekeeper' };
    if (module.includes('hardware')) return { icon: <FaMicrochip />, color: '#e17055', name: 'The Silicon Wraith' };
    return { icon: <FaSkull />, color: '#ff4757', name: 'The Module Guardian' };
  };

  const guardian = getGuardianDetails();

  const handleQuizReady = (totalQuestions) => {
    if (totalQuestions > 0) setDamagePerHit(100 / totalQuestions); 
  };

  const onBossDamage = () => setBossHP(prev => Math.max(0, prev - damagePerHit)); 

  const handleQuizComplete = async (result) => {
    const earnedXP = result.score + 100; 
    setFinalXP(earnedXP);
    setBossHP(0); 
    setStep('result');
    confetti({ particleCount: 150, spread: 100, colors: [guardian.color, '#a29bfe', '#00b894'] });
    
    if (playerHP === 3) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.put(`${apiUrl}/api/users/${encodeURIComponent(username)}/secret`, { secretId: 'SECRET_PERFECT_BOSS' });
      } catch (err) {}
    }

    setTimeout(() => onComplete(earnedXP, { ...result, submission, moduleName: lesson.module || lesson.title }), 2500); 
  };

  const onWrongAnswer = () => {
    const newHP = playerHP - 1;
    setPlayerHP(newHP);
    setIsDamaged(true);
    setTimeout(() => setIsDamaged(false), 500);
    if (newHP <= 0) setStep('gameover');
  };

  const handleRetry = () => {
    setPlayerHP(3);
    setBossHP(100);
    setStep('quiz');
  };

  if (!lesson || pages.length === 0) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
      <div className="loader">Compiling Curriculum...</div>
    </div>
  );

  const currentPage = pages[currentPageIndex];

  // --- RENDER NETACAD READING VIEW ---
  if (step === 'reading') {
    return (
      <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-body)', overflow: 'hidden' }}>
        <style>{`
          .sidebar-item { padding: 12px 20px; color: var(--text-secondary); cursor: pointer; border-left: 3px solid transparent; transition: 0.2s; font-size: 14px; }
          .sidebar-item:hover { background: rgba(255,255,255,0.02); }
          .sidebar-item.active { border-left-color: var(--accent-color); background: rgba(108, 92, 231, 0.05); color: var(--accent-color); font-weight: bold; }
          .content-block { margin-bottom: 30px; color: var(--text-primary); line-height: 1.8; font-size: 16px; }
          .video-wrapper { position: relative; width: 100%; padding-top: 56.25%; background: #000; border-radius: 16px; overflow: hidden; }
        `}</style>

        {/* SIDEBAR INDEX */}
        {sidebarOpen && (
          <div style={{ width: '300px', background: 'var(--bg-card)', borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={onExit} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><FaArrowLeft /></button>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '15px' }}>Course Index</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
              {pages.map((p, idx) => (
                <div key={idx} className={`sidebar-item ${currentPageIndex === idx ? 'active' : ''}`} onClick={() => navigateToPage(idx)}>
                  {p.pageNumber} {p.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN READING PANE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '15px 30px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '18px' }}><FaListUl /></button>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{currentPage.chapterTitle || lesson.title}</div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '22px' }}>{currentPage.pageNumber} {currentPage.title}</h2>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '40px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            {currentPage.contentBlocks?.map((block, idx) => (
              <div key={idx} className="content-block">
                {block.type === 'text' && <div dangerouslySetInnerHTML={{ __html: block.data.content }} />}
                
                {block.type === 'video' && (
                  <div className="video-wrapper">
                    <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} src={`https://www.youtube.com/embed/${block.data.videoId}`} frameBorder="0" allowFullScreen></iframe>
                  </div>
                )}

                {block.type === 'flashcard' && (
                  <Flashcard front={block.data.front} back={block.data.back} />
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: '20px 40px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
            <button 
              disabled={currentPageIndex === 0} 
              onClick={() => navigateToPage(currentPageIndex - 1)}
              style={{ padding: '12px 25px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentPageIndex === 0 ? 0.5 : 1 }}
            >
              Previous Page
            </button>
            
            {currentPageIndex < pages.length - 1 ? (
              <button 
                onClick={() => navigateToPage(currentPageIndex + 1)}
                style={{ padding: '12px 25px', borderRadius: '8px', background: 'var(--accent-color)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Next Page <FaForward />
              </button>
            ) : (
              <button 
                onClick={() => setStep('mission')}
                style={{ padding: '12px 25px', borderRadius: '8px', background: guardian.color, border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 4px 15px ${guardian.color}66` }}
              >
                Proceed to Final Assessment <FaCheck />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER BOSS BATTLE VIEW (Missions & Quizzes) ---
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', padding: '15px', transition: 'transform 0.1s', transform: isDamaged ? 'translateX(10px)' : 'none' }}>
      <style>{`
        .hp-bar-container { width: 100%; height: 12px; background: rgba(255,255,255,0.1); border-radius: 10px; margin: 15px 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        .boss-hp-fill { height: 100%; background: linear-gradient(90deg, ${guardian.color}, #fff); transition: width 0.5s ease-out; }
        .heart-container { display: flex; gap: 8px; margin-bottom: 10px; }
        .boss-avatar-frame { font-size: 50px; filter: drop-shadow(0 0 15px ${guardian.color}); animation: hover 3s ease-in-out infinite; }
        @keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .gameover-title { color: #ff4757; font-size: 42px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; }
        .mission-input { width: 100%; padding: 15px; border-radius: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); color: var(--text-primary); font-family: 'Courier New', monospace; margin-bottom: 20px; resize: none; }
      `}</style>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => setStep('reading')} className="glass-card" style={{ alignSelf: 'flex-start', border: '1px solid var(--card-border)', background: 'transparent', padding: '10px 18px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, fontSize: '14px', borderRadius: '12px' }}>
          <FaArrowLeft /> Back to Course Material
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="heart-container">
                {[...Array(3)].map((_, i) => (
                  <FaHeart key={i} color={i < playerHP ? "#ff4757" : "rgba(255,255,255,0.1)"} />
                ))}
            </div>
            <h2 className="lesson-header-text">Module Assessment</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="boss-avatar-frame" style={{ color: guardian.color }}>{guardian.icon}</div>
            <span style={{ fontSize: '10px', fontWeight: '900', color: guardian.color, letterSpacing: '1px' }}>{guardian.name}</span>
          </div>
        </div>

        <div className="hp-bar-container">
            <div className="boss-hp-fill" style={{ width: `${bossHP}%` }}></div>
        </div>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', position: 'relative', borderRadius: '24px' }}>
        
        {step === 'mission' && (
          <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Mission Objective</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '25px' }}>
              Provide a solution link or a brief technical summary of your approach to unlock the final battle.
            </p>
            <textarea className="mission-input" placeholder="Paste link or technical notes here..." rows="5" value={submission} onChange={(e) => setSubmission(e.target.value)} />
            <button disabled={!submission.trim()} onClick={() => setStep('quiz')} className="knowledge-check-btn" style={{ width: '100%', padding: '18px', borderRadius: '15px', background: submission.trim() ? '#2ecc71' : 'var(--card-border)', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer' }}>
              Submit & Engage {guardian.name} <FaUpload />
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <AdaptiveQuiz 
              lessonId={`lesson-00${lesson._id}`} 
              onComplete={handleQuizComplete} 
              onWrongAnswer={onWrongAnswer}
              onCorrectAnswer={onBossDamage}
              onReady={handleQuizReady} 
            />
          </div>
        )}

        {step === 'gameover' && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
             <FaGhost size={80} color="#ff4757" style={{ marginBottom: '20px' }} />
             <h1 className="gameover-title">Assessment Failed</h1>
             <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button onClick={handleRetry} className="btn-primary" style={{ padding: '15px 30px', background: '#ff4757' }}><FaRedo /> Retake Assessment</button>
                <button onClick={() => setStep('reading')} style={{ padding: '15px 30px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '12px' }}>Review Course Material</button>
             </div>
          </div>
        )}

        {step === 'result' && (
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚔️</div>
             <h1 className="victory-text">{guardian.name} Defeated!</h1>
             <div className="xp-earned-badge" style={{ marginTop: '30px', padding: '20px 40px', borderRadius: '20px', background: 'rgba(46, 204, 113, 0.1)', border: '2px solid #2ecc71', color: '#2ecc71', fontWeight: '900', fontSize: '32px', display: 'inline-block' }}>
                +{finalXP} XP Earned
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;