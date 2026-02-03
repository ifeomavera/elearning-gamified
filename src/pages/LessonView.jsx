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
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      
      {/* HEADER: Added Padding and proper alignment */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', paddingTop: '10px' }}>
        <button onClick={onExit} className="glass-card" style={{ border: 'none', padding: '12px 20px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
          <FaArrowLeft /> Exit
        </button>
        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '18px', textAlign: 'right', flex: 1, paddingLeft: '10px' }}>{lesson.title}</h2>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' }}>
        
        {step === 'video' && (
          <div style={{ width: '100%', maxWidth: '900px', textAlign: 'center' }}>
            {/* RESPONSIVE VIDEO WRAPPER */}
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube.com/embed/${lesson.videoId}`} 
                title="Lesson Video" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <button onClick={() => setStep('quiz')} className="btn-primary" style={{ padding: '15px 40px', fontSize: '18px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
              Start Quiz <FaForward />
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-primary)' }}>{quizzes[quizIndex].question}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {quizzes[quizIndex].options.map((option, idx) => {
                let bg = 'rgba(255,255,255,0.05)';
                let border = '1px solid var(--card-border)';
                if (isAnswered) {
                  if (idx === quizzes[quizIndex].correct) { bg = 'rgba(0, 184, 148, 0.2)'; border = '1px solid #00b894'; }
                  else if (idx === selectedOption) { bg = 'rgba(214, 48, 49, 0.2)'; border = '1px solid #d63031'; }
                }
                return (
                  <div key={idx} onClick={() => handleOptionClick(idx)} style={{ padding: '20px', borderRadius: '12px', cursor: 'pointer', background: bg, border: border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{option}</span>
                    {isAnswered && idx === quizzes[quizIndex].correct && <FaCheckCircle color="#00b894" />}
                    {isAnswered && idx === selectedOption && idx !== quizzes[quizIndex].correct && <FaTimesCircle color="#d63031" />}
                  </div>
                );
              })}
            </div>
            {isAnswered && (
              <button onClick={handleNext} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '15px', borderRadius: '12px' }}>
                {quizIndex < quizzes.length - 1 ? "Next Question" : "Finish Lesson"}
              </button>
            )}
          </div>
        )}

        {step === 'result' && (
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
             <h1 style={{ color: 'var(--text-primary)' }}>Lesson Complete!</h1>
             <div style={{ marginTop: '30px', color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '24px' }}>+100 XP Earned</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;