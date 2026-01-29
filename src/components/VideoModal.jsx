import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';

const VideoModal = ({ isOpen, title, videoId, onClose, onComplete }) => {
  const [step, setStep] = useState('video'); // 'video' or 'quiz'
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(false);

  // RESET STATE WHEN OPENED
  useEffect(() => {
    if (isOpen) {
      setStep('video');
      setSelectedOption(null);
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- QUIZ DATABASE ---
  const quizData = {
    "zOjov-2OZ0E": { // Module 1
      question: "What is the primary goal of Software Engineering?",
      options: ["To write code fast", "To build reliable software", "To fix hardware", "To design graphics"],
      correct: 1
    },
    "9K7g8k5_xIQ": { // Module 2
      question: "Which is a technique for gathering requirements?",
      options: ["Guessing", "Coding immediately", "Interviews and Surveys", "Ignoring the client"],
      correct: 2
    },
    "m2uxP-kZk24": { // Module 3
      question: "What are the three core elements of Gamification (PBL)?",
      options: ["Points, Badges, Leaderboards", "Play, Buy, Lose", "Power, Bosses, Levels", "Players, Bots, Loops"],
      correct: 0
    }
  };

  const currentQuiz = quizData[videoId] || {
    question: "Did you watch the video carefully?",
    options: ["No", "Yes, I understand"],
    correct: 1
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    if (selectedOption === currentQuiz.correct) {
      onComplete();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={{ margin: 0, color: '#2d3436', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {step === 'video' ? '📺 Watching Lesson' : '📝 Quick Quiz'}
          </h3>
          <button onClick={onClose} style={styles.closeBtn}><FaTimes /></button>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          {step === 'video' && (
            <>
              <div style={styles.videoWrapper}>
                <iframe 
                  width="100%" height="315" 
                  src={`https://www.youtube.com/embed/${videoId}`} 
                  title="YouTube video player" frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div style={styles.footer}>
                <p style={{ fontSize: '14px', color: '#636e72' }}>Watch the video to unlock the quiz.</p>
                <button onClick={() => setStep('quiz')} style={styles.primaryBtn}>
                  Take Quiz <FaArrowRight />
                </button>
              </div>
            </>
          )}

          {step === 'quiz' && (
            <div style={styles.quizContainer}>
              <h3 style={{ marginBottom: '20px', color: '#2d3436' }}>
                <FaQuestionCircle color="#0984e3" /> {currentQuiz.question}
              </h3>
              <div style={styles.optionsGrid}>
                {currentQuiz.options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    style={{
                      ...styles.option,
                      background: selectedOption === index ? '#e3f2fd' : 'white',
                      borderColor: selectedOption === index ? '#0984e3' : '#dfe6e9',
                      fontWeight: selectedOption === index ? 'bold' : 'normal'
                    }}
                  >
                    <div style={{ ...styles.radioCircle, background: selectedOption === index ? '#0984e3' : 'white' }}></div>
                    {option}
                  </div>
                ))}
              </div>
              {error && <p style={{ color: '#d63031', fontWeight: 'bold', marginTop: '10px' }}>❌ Incorrect. Try again!</p>}
              <div style={styles.footer}>
                <button onClick={() => setStep('video')} style={styles.secondaryBtn}>Re-watch</button>
                <button onClick={handleSubmit} style={styles.primaryBtn}>Submit <FaCheckCircle /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  // CRITICAL FIX: Ensure 'position', 'zIndex', 'width', 'height' are ALL present
  overlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    background: 'rgba(0,0,0,0.8)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out' // <--- The animation stays!
  },
  modal: { background: 'white', width: '90%', maxWidth: '600px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
  header: { padding: '15px 20px', borderBottom: '1px solid #dfe6e9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f4f7f6' },
  closeBtn: { background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#636e72' },
  content: { padding: '20px' },
  videoWrapper: { borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
  primaryBtn: { background: '#0984e3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  secondaryBtn: { background: 'transparent', color: '#636e72', border: '1px solid #b2bec3', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  quizContainer: { textAlign: 'left' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  option: { padding: '15px', border: '2px solid #dfe6e9', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', transition: '0.2s' },
  radioCircle: { width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #0984e3' }
};

export default VideoModal;