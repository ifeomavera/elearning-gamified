import React, { useState } from 'react';
import { FaArrowLeft, FaForward, FaHeart, FaSkull, FaRedo, FaGhost } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import AdaptiveQuiz from '../components/AdaptiveQuiz'; 

const LessonView = ({ lesson, onComplete, onExit }) => {
  const [step, setStep] = useState('video'); 
  const [finalXP, setFinalXP] = useState(0); 
  
  // ✅ BOSS BATTLE STATE
  const [bossHP, setBossHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(3); 
  const [isDamaged, setIsDamaged] = useState(false);

  const handleQuizComplete = (result) => {
    const earnedXP = result.score; 
    setFinalXP(earnedXP);
    setBossHP(0); 
    
    setStep('result');
    confetti({ 
      particleCount: 150, 
      spread: 100,
      colors: ['#6c5ce7', '#a29bfe', '#00b894'] 
    });
    
    setTimeout(() => onComplete(earnedXP), 2500); 
  };

  // ✅ PLAYER DAMAGE LOGIC
  const onWrongAnswer = () => {
    const newHP = playerHP - 1;
    setPlayerHP(newHP);
    setIsDamaged(true);
    setTimeout(() => setIsDamaged(false), 500);

    if (newHP <= 0) {
      setStep('gameover');
    }
  };

  // ✅ RESET BATTLE
  const handleRetry = () => {
    setPlayerHP(3);
    setBossHP(100);
    setStep('quiz');
  };

  if (!lesson) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
      <div className="loader">Consulting Syllabus...</div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-body)', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '15px',
      transition: 'transform 0.1s',
      transform: isDamaged ? 'translateX(10px)' : 'none' 
    }}>
      <style>{`
        .video-wrapper { 
          position: relative; width: 100%; padding-top: 56.25%; background: #000; 
          border-radius: 20px; overflow: hidden; margin-bottom: 30px; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.4); border: 1px solid var(--card-border); 
        }
        .hp-bar-container {
          width: 100%; height: 12px; background: rgba(255,255,255,0.1); 
          border-radius: 10px; margin: 15px 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);
        }
        .boss-hp-fill {
          height: 100%; background: linear-gradient(90deg, #ff4757, #ff6b81);
          transition: width 0.5s ease-out;
        }
        .heart-container { display: flex; gap: 8px; margin-bottom: 10px; }
        .boss-avatar { font-size: 50px; filter: drop-shadow(0 0 15px #ff4757); }
        .gameover-title { color: #ff4757; font-size: 42px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; }
        
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(255, 71, 87, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
        }
      `}</style>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <button onClick={onExit} className="glass-card" style={{ 
            alignSelf: 'flex-start', border: '1px solid var(--card-border)', background: 'transparent', 
            padding: '10px 18px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', 
            alignItems: 'center', gap: '8px', z_index: 10, fontSize: '14px', borderRadius: '12px' 
        }}>
          <FaArrowLeft /> Retreat to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="heart-container">
                {[...Array(3)].map((_, i) => (
                  <FaHeart key={i} color={i < playerHP ? "#ff4757" : "rgba(255,255,255,0.1)"} />
                ))}
            </div>
            <h2 className="lesson-header-text">{lesson.module}: {lesson.title}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="boss-avatar"><FaSkull /></div>
            <span style={{ fontSize: '10px', fontWeight: '900', color: '#ff4757', letterSpacing: '1px' }}>MODULE GUARDIAN</span>
          </div>
        </div>

        <div className="hp-bar-container">
            <div className="boss-hp-fill" style={{ width: `${bossHP}%` }}></div>
        </div>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', position: 'relative', borderRadius: '24px' }}>
        
        {/* --- STEP 1: VIDEO --- */}
        {step === 'video' && (
          <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
            <div className="video-wrapper">
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${lesson.videoId}`} 
                title="Lesson Video" frameBorder="0" allowFullScreen
              ></iframe>
            </div>
            <button onClick={() => setStep('quiz')} className="knowledge-check-btn" style={{ 
                width: '100%', padding: '18px', fontSize: '18px', borderRadius: '15px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: '#ff4757', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer'
            }}>
              Engage Guardian <FaForward />
            </button>
          </div>
        )}

        {/* --- STEP 2: QUIZ --- */}
        {step === 'quiz' && (
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <AdaptiveQuiz 
              lessonId={`lesson-00${lesson._id}`} 
              onComplete={handleQuizComplete} 
              onWrongAnswer={onWrongAnswer}
            />
          </div>
        )}

        {/* --- STEP 3: GAME OVER --- */}
        {step === 'gameover' && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
             <FaGhost size={80} color="#ff4757" style={{ marginBottom: '20px' }} />
             <h1 className="gameover-title">Mission Failed</h1>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>The Guardian was too powerful. Study the material and try again.</p>
             <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button onClick={handleRetry} className="btn-primary" style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '10px', background: '#ff4757' }}>
                   <FaRedo /> Restart Battle
                </button>
                <button onClick={onExit} style={{ padding: '15px 30px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '12px', cursor: 'pointer' }}>
                   Retreat
                </button>
             </div>
          </div>
        )}

        {/* --- STEP 4: VICTORY --- */}
        {step === 'result' && (
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚔️</div>
             <h1 className="victory-text">Guardian Defeated!</h1>
             <div className="xp-earned-badge" style={{ 
               marginTop: '30px', padding: '20px 40px', borderRadius: '20px',
               background: 'rgba(46, 204, 113, 0.1)', border: '2px solid #2ecc71',
               color: '#2ecc71', fontWeight: '900', fontSize: '32px', display: 'inline-block'
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