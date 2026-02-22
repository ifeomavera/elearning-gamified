import React, { useState } from 'react';
import { FaArrowLeft, FaForward } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import AdaptiveQuiz from '../components/AdaptiveQuiz'; 

const LessonView = ({ lesson, onComplete, onExit }) => {
  const [step, setStep] = useState('video'); 
  const [finalXP, setFinalXP] = useState(0); 

  const handleQuizComplete = (result) => {
    const earnedXP = result.score; 
    setFinalXP(earnedXP);
    
    setStep('result');
    confetti({ 
      particleCount: 150, 
      spread: 100,
      colors: ['#6c5ce7', '#a29bfe', '#00b894'] 
    });
    
    setTimeout(() => onComplete(earnedXP), 2500); 
  };

  if (!lesson) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
      <div className="loader">Consulting Syllabus...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', padding: '15px' }}>
      <style>{`
        /* ✅ FIX: Using standard CSS kebab-case (padding-top, border-radius, etc.) */
        .video-wrapper { 
          position: relative; 
          width: 100%; 
          padding-top: 56.25%; 
          background: #000; 
          border-radius: 20px; 
          overflow: hidden; 
          margin-bottom: 30px; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.4); 
          border: 1px solid var(--card-border); 
        }
        .lesson-header-text { margin: 0; color: var(--text-primary); font-size: 20px; font-weight: bold; }
        .victory-text { color: var(--text-primary); font-size: 32px; margin-bottom: 10px; }
        
        @media (max-width: 600px) {
          .lesson-header-text { font-size: 16px; }
          .victory-text { font-size: 24px; }
          .xp-earned-badge { font-size: 24px !important; padding: 15px 30px !important; }
          .video-wrapper { margin-bottom: 20px; }
          .knowledge-check-btn { padding: 15px !important; font-size: 16px !important; }
        }
      `}</style>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <button onClick={onExit} className="glass-card" style={{ 
            alignSelf: 'flex-start', border: '1px solid var(--card-border)', background: 'transparent', 
            padding: '10px 18px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', 
            alignItems: 'center', gap: '8px', zIndex: 10, fontSize: '14px', borderRadius: '12px' 
        }}>
          <FaArrowLeft /> Back to Modules
        </button>
        <h2 className="lesson-header-text">
            {lesson.module}: {lesson.title}
        </h2>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', position: 'relative', borderRadius: '24px' }}>
        
        {/* --- STEP 1: VIDEO LESSON --- */}
        {step === 'video' && (
          <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
            <div className="video-wrapper">
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${lesson.videoId}`} 
                title="Lesson Video" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <button onClick={() => setStep('quiz')} className="knowledge-check-btn" style={{ 
                width: '100%', padding: '18px', fontSize: '18px', borderRadius: '15px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: '#6c5ce7', color: 'white', border: 'none', 
                fontWeight: '900', cursor: 'pointer', transition: 'all 0.3s ease',
                boxShadow: '0 10px 20px rgba(108, 92, 231, 0.3)'
            }}>
              Commence Knowledge Check <FaForward />
            </button>
          </div>
        )}

        {/* --- STEP 2: THE AI ADAPTIVE QUIZ --- */}
        {step === 'quiz' && (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <AdaptiveQuiz lessonId={`lesson-00${lesson._id}`} onComplete={handleQuizComplete} />
          </div>
        )}

        {/* --- STEP 3: VICTORY SCREEN --- */}
        {step === 'result' && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 1s ease-out' }}>
             <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
             <h1 className="victory-text">Module Complete!</h1>
             <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Syncing academic record...</p>
             <div className="xp-earned-badge" style={{ 
               marginTop: '30px', 
               padding: '20px 40px', 
               borderRadius: '20px',
               background: 'rgba(46, 204, 113, 0.1)',
               border: '2px solid #2ecc71',
               color: '#2ecc71', 
               fontWeight: '900', 
               fontSize: '32px',
               display: 'inline-block'
             }}>
                +{finalXP} XP Earned
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;