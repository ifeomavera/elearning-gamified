import React, { useState } from 'react';
import { FaArrowLeft, FaForward } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import AdaptiveQuiz from '../components/AdaptiveQuiz'; // ✅ 1. IMPORT THE AI ENGINE

const LessonView = ({ lesson, onComplete, onExit }) => {
  const [step, setStep] = useState('video'); 
  const [finalXP, setFinalXP] = useState(0); 

  // ✅ 2. HANDLE AI QUIZ COMPLETION
  const handleQuizComplete = (result) => {
    // result contains { score, total } from the AdaptiveQuiz component
    const earnedXP = result.score; // XP is now dynamically based on adaptive difficulty!
    setFinalXP(earnedXP);
    
    // Trigger the victory screen
    setStep('result');
    confetti({ particleCount: 150, spread: 100 });
    
    // Fire the completion event back to App.jsx after a brief delay
    setTimeout(() => onComplete(earnedXP), 2500); 
  };

  if (!lesson) return <div style={{ padding: '20px', color: 'white' }}>Loading module...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', padding: '15px' }}>
      
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <button onClick={onExit} className="glass-card" style={{ 
            alignSelf: 'flex-start', border: '1px solid var(--card-border)', background: 'transparent', 
            padding: '10px 18px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', 
            alignItems: 'center', gap: '8px', zIndex: 10, fontSize: '14px', borderRadius: '12px' 
        }}>
          <FaArrowLeft /> Back to Modules {/* ✅ TEXT CHANGED HERE */}
        </button>
        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px', fontWeight: 'bold' }}>
            {lesson.module}: {lesson.title}
        </h2>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', position: 'relative' }}>
        
        {/* --- STEP 1: VIDEO LESSON --- */}
        {step === 'video' && (
          <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
            <div style={{ 
                position: 'relative', width: '100%', paddingTop: '56.25%', 
                background: '#000', borderRadius: '16px', overflow: 'hidden', 
                marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                border: '1px solid var(--card-border)'
            }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${lesson.videoId}`} 
                title="Lesson Video" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <button onClick={() => setStep('quiz')} style={{ 
                width: '100%', padding: '18px', fontSize: '18px', borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: 'var(--accent-color)', color: 'white', border: 'none', 
                fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s ease'
            }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              Commence Knowledge Check <FaForward />
            </button>
          </div>
        )}

        {/* --- STEP 2: THE AI ADAPTIVE QUIZ --- */}
        {step === 'quiz' && (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            {/* Formatting the ID to match how we saved it in the database */}
            <AdaptiveQuiz lessonId={`lesson-00${lesson.id}`} onComplete={handleQuizComplete} />
          </div>
        )}

        {/* --- STEP 3: VICTORY SCREEN --- */}
        {step === 'result' && (
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
             <h1 style={{ color: 'var(--text-primary)' }}>Module Complete!</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Syncing your progress to the servers...</p>
             <div style={{ marginTop: '30px', color: '#2ecc71', fontWeight: '900', fontSize: '28px' }}>
                +{finalXP} XP Earned
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;