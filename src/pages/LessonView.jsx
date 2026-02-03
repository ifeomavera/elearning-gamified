import React, { useState } from 'react';
import { FaArrowLeft, FaPlay, FaCheckCircle, FaTimesCircle, FaForward } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const LessonView = ({ lesson, onComplete, onExit }) => {
  const [step, setStep] = useState('video'); 
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const quizzes = [
    {
      question: "What is the main goal of Gamification?",
      options: ["To play games all day", "To increase engagement & motivation", "To make software slower", "To replace teachers"],
      correct: 1
    },
    {
      question: "Which element is NOT part of the PBL triad?",
      options: ["Points", "Badges", "Leaderboards", "Lose Conditions"],
      correct: 3
    }
  ];

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === quizzes[quizIndex].correct) {
      setScore(score + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    if (quizIndex < quizzes.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setStep('result');
      confetti({ particleCount: 150, spread: 100 });
      const finalScore = score + (selectedOption === quizzes[quizIndex].correct ? 1 : 0);
      const earnedXP = finalScore * 50;
      setTimeout(() => onComplete(earnedXP), 2000); 
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', padding: '15px' }}>
      
      {/* HEADER: Stacked vertically on mobile for space */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <button onClick={onExit} className="glass-card" style={{ 
            alignSelf: 'flex-start', border: 'none', padding: '10px 18px', 
            cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', 
            alignItems: 'center', gap: '8px', zIndex: 10, fontSize: '14px' 
        }}>
          <FaArrowLeft /> Exit Lesson
        </button>
        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px', fontWeight: 'bold' }}>
            {lesson.title}
        </h2>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', position: 'relative' }}>
        
        {step === 'video' && (
          <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
            {/* RESPONSIVE VIDEO WRAPPER (16:9 Aspect Ratio) */}
            <div style={{ 
                position: 'relative', width: '100%', paddingTop: '56.25%', // 16:9 Ratio
                background: '#000', borderRadius: '16px', overflow: 'hidden', 
                marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' 
            }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${lesson.videoId}`} 
                title="Lesson Video" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <button onClick={() => setStep('quiz')} className="btn-primary" style={{ 
                width: '100%', padding: '18px', fontSize: '18px', borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', border: 'none', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)'
            }}>
              Start Quiz <FaForward />
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-primary)', fontSize: '18px', lineHeight: '1.4' }}>
                {quizzes[quizIndex].question}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizzes[quizIndex].options.map((option, idx) => {
                let bg = 'rgba(255,255,255,0.05)';
                let border = '1px solid var(--card-border)';
                if (isAnswered) {
                  if (idx === quizzes[quizIndex].correct) { bg = 'rgba(0, 184, 148, 0.2)'; border = '1px solid #00b894'; }
                  else if (idx === selectedOption) { bg = 'rgba(214, 48, 49, 0.2)'; border = '1px solid #d63031'; }
                }
                return (
                  <div key={idx} onClick={() => handleOptionClick(idx)} style={{ 
                      padding: '18px', borderRadius: '12px', cursor: 'pointer', background: bg, border: border, 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s'
                  }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '15px' }}>{option}</span>
                    {isAnswered && idx === quizzes[quizIndex].correct && <FaCheckCircle color="#00b894" />}
                    {isAnswered && idx === selectedOption && idx !== quizzes[quizIndex].correct && <FaTimesCircle color="#d63031" />}
                  </div>
                );
              })}
            </div>
            {isAnswered && (
              <button onClick={handleNext} className="btn-primary" style={{ marginTop: '25px', width: '100%', padding: '15px', borderRadius: '12px', fontSize: '16px', background: 'var(--accent-color)', color: 'white', border: 'none', fontWeight: 'bold' }}>
                {quizIndex < quizzes.length - 1 ? "Next Question" : "Finish Lesson"}
              </button>
            )}
          </div>
        )}

        {step === 'result' && (
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
             <h1 style={{ color: 'var(--text-primary)' }}>Lesson Complete!</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Saving your progress...</p>
             <div style={{ marginTop: '30px', color: '#00b894', fontWeight: 'bold', fontSize: '24px' }}>+100 XP Earned</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;