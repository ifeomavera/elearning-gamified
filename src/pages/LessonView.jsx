import React, { useState } from 'react';
import { FaArrowLeft, FaForward, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';

// ✅ 1. DYNAMIC QUIZ DICTIONARY
// Maps the lesson.id to the correct set of questions
const QUIZ_DATA = {
  1: [
    {
      question: "What is the primary purpose of the Software Development Life Cycle (SDLC)?",
      options: ["To write code faster", "To provide a structured approach to building software", "To eliminate the need for testing", "To design UI graphics"],
      correct: 1
    },
    {
      question: "Which phase of SDLC involves defining what the system should do?",
      options: ["Testing", "Deployment", "Requirement Analysis", "Maintenance"],
      correct: 2
    }
  ],
  2: [
    {
      question: "Who is primarily responsible for gathering requirements from the client?",
      options: ["Lead Developer", "Database Admin", "Business Analyst", "DevOps Engineer"],
      correct: 2
    },
    {
      question: "Which of these is a functional requirement?",
      options: ["The system must load in under 2 seconds", "The system must allow users to reset passwords", "The code must be written in Python", "The server must have 99% uptime"],
      correct: 1
    }
  ],
  3: [
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
  ]
};

const LessonView = ({ lesson, onComplete, onExit }) => {
  const [step, setStep] = useState('video'); 
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [finalXP, setFinalXP] = useState(0); // ✅ Tracks calculated XP

  // Pull the correct questions, fallback to Module 1 if undefined
  const quizzes = QUIZ_DATA[lesson?.id] || QUIZ_DATA[1];

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
      
      // ✅ 2. DYNAMIC XP CALCULATION
      // Calculate final score including the current question
      const finalScore = score + (selectedOption === quizzes[quizIndex].correct ? 1 : 0);
      
      // Proportion the earned XP based on the lesson's total max XP
      const earnedXP = Math.round((finalScore / quizzes.length) * (lesson.xp || 50));
      
      setFinalXP(earnedXP);
      
      // Fire the completion event back to App.jsx after a brief delay
      setTimeout(() => onComplete(earnedXP), 2500); 
    }
  };

  if (!lesson) return <div style={{ padding: '20px', color: 'white' }}>Loading mission...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', padding: '15px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <button onClick={onExit} className="glass-card" style={{ 
            alignSelf: 'flex-start', border: '1px solid var(--card-border)', background: 'transparent', 
            padding: '10px 18px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', 
            alignItems: 'center', gap: '8px', zIndex: 10, fontSize: '14px', borderRadius: '12px' 
        }}>
          <FaArrowLeft /> Abandon Mission
        </button>
        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px', fontWeight: 'bold' }}>
            {lesson.module}: {lesson.title}
        </h2>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px', position: 'relative' }}>
        
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

        {step === 'quiz' && (
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>
              <span>Question {quizIndex + 1} of {quizzes.length}</span>
              <span>XP Value: {lesson.xp}</span>
            </div>
            
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-primary)', fontSize: '18px', lineHeight: '1.4' }}>
                {quizzes[quizIndex].question}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quizzes[quizIndex].options.map((option, idx) => {
                let bg = 'var(--bg-body)';
                let border = '1px solid var(--card-border)';
                let textColor = 'var(--text-primary)';
                
                if (isAnswered) {
                  if (idx === quizzes[quizIndex].correct) { 
                    bg = 'rgba(46, 204, 113, 0.15)'; border = '1px solid #2ecc71'; 
                  } else if (idx === selectedOption) { 
                    bg = 'rgba(231, 76, 60, 0.15)'; border = '1px solid #e74c3c'; 
                  }
                }

                return (
                  <div key={idx} onClick={() => handleOptionClick(idx)} style={{ 
                      padding: '18px', borderRadius: '12px', cursor: isAnswered ? 'default' : 'pointer', 
                      background: bg, border: border, display: 'flex', alignItems: 'center', 
                      justifyContent: 'space-between', transition: 'all 0.2s',
                  }}>
                    <span style={{ color: textColor, fontWeight: '600', fontSize: '15px' }}>{option}</span>
                    {isAnswered && idx === quizzes[quizIndex].correct && <FaCheckCircle color="#2ecc71" size={20} />}
                    {isAnswered && idx === selectedOption && idx !== quizzes[quizIndex].correct && <FaTimesCircle color="#e74c3c" size={20} />}
                  </div>
                );
              })}
            </div>
            
            {isAnswered && (
              <button onClick={handleNext} style={{ 
                  marginTop: '25px', width: '100%', padding: '15px', borderRadius: '12px', 
                  fontSize: '16px', background: 'var(--accent-color)', color: 'white', 
                  border: 'none', fontWeight: 'bold', cursor: 'pointer' 
              }}>
                {quizIndex < quizzes.length - 1 ? "Next Question" : "Complete Module"}
              </button>
            )}
          </div>
        )}

        {step === 'result' && (
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
             <h1 style={{ color: 'var(--text-primary)' }}>Mission Accomplished!</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Syncing your progress to the Vici servers...</p>
             {/* ✅ 3. Displays the accurately calculated XP */}
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