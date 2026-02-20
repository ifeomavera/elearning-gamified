import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaBrain, FaArrowRight } from 'react-icons/fa';

const AdaptiveQuiz = ({ lessonId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [askedIds, setAskedIds] = useState([]); 
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentDifficulty, setCurrentDifficulty] = useState(1); 
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/quizzes/${lessonId}`);
        
        // ✅ THE SMART FILTER: Only keep 'fill' questions, or 'single' choice questions 
        // that actually have a designated correct answer to avoid broken matching formats.
        const validQuestions = res.data.questions.filter(q => {
          if (q.type === 'fill') return true;
          if (q.options) {
             return q.options.some(o => o.isCorrect === true || String(o.isCorrect).toLowerCase() === 'true');
          }
          return false;
        });

        setQuestions(validQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load adaptive quiz", err);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      pickNextQuestion();
    }
  }, [questions, currentQuestion]);

  const pickNextQuestion = () => {
    let available = questions.filter(q => q.difficulty === currentDifficulty && !askedIds.includes(q._id));
    
    if (available.length === 0) {
      available = questions.filter(q => !askedIds.includes(q._id));
    }

    if (available.length === 0) {
      onComplete({ score, total: askedIds.length });
      return;
    }

    const nextQ = available[Math.floor(Math.random() * available.length)];
    setCurrentQuestion(nextQ);
    setAskedIds([...askedIds, nextQ._id]);
    
    setSelectedAnswer('');
    setIsWrong(false);
    setShowExplanation(false);
  };

  const getOptionText = (opt) => {
    if (typeof opt === 'string') return opt;
    if (opt.text) return opt.text;
    if (opt.value) return opt.value;
    
    return Object.entries(opt)
      .filter(([key, value]) => key !== '_id' && typeof value === 'string')
      .map(([key, value]) => value)
      .join(' - ');
  };

  const handleSubmit = () => {
    let correct = false;

    if (currentQuestion.type !== 'fill' && currentQuestion.options) {
      const selectedOpt = currentQuestion.options.find(o => 
        (o._id || getOptionText(o)) === selectedAnswer
      );
      
      if (selectedOpt) {
        // ✅ Ironclad evaluation check
        correct = selectedOpt.isCorrect === true || 
                  String(selectedOpt.isCorrect).toLowerCase() === 'true' ||
                  selectedAnswer === currentQuestion.correctAnswer || 
                  selectedAnswer === currentQuestion.answer;
      }
    } 
    else if (currentQuestion.type === 'fill') {
      correct = selectedAnswer.toLowerCase().trim() === (currentQuestion.correctAnswerText || currentQuestion.answer || '').toLowerCase().trim();
    }

    if (correct) {
      const newStreak = consecutiveCorrect + 1;
      setConsecutiveCorrect(newStreak);
      setScore(score + (currentDifficulty * 10)); 
      setShowExplanation(true);
      setIsWrong(false);

      if (newStreak >= 2 && currentDifficulty < 3) {
        setCurrentDifficulty(currentDifficulty + 1);
        setConsecutiveCorrect(0); 
      }
    } else {
      setIsWrong(true);
      setConsecutiveCorrect(0); 
      
      if (currentDifficulty > 1) {
        setCurrentDifficulty(currentDifficulty - 1);
      }
    }
  };

  if (loading) return <div className="glass-card p-5 text-center">🧠 AI is compiling your adaptive exam...</div>;
  if (!currentQuestion) return null;

  return (
    <div className="glass-card" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: 'var(--text-secondary)' }}>
        {/* ✅ CLEAN HEADER: No emojis, no fire. Just the professional Brain icon and text. */}
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          <FaBrain /> Level {currentDifficulty}
        </span>
        <span style={{ 
          background: 'rgba(142, 68, 173, 0.1)',
          color: 'var(--accent-color)', 
          padding: '4px 12px', 
          borderRadius: '12px', 
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {score} XP
        </span>
      </div>

      <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>{currentQuestion.text}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        
        {currentQuestion.type !== 'fill' && currentQuestion.options && currentQuestion.options.map((opt, idx) => {
          const displayText = getOptionText(opt);
          const optValue = opt._id || displayText; 

          return (
            <label key={idx} style={{ 
              padding: '15px', 
              background: selectedAnswer === optValue ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', 
              borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center'
            }}>
              <input 
                type="radio" 
                name="quizOption" 
                value={optValue} 
                onChange={(e) => { setSelectedAnswer(e.target.value); setIsWrong(false); }} 
                style={{ marginRight: '10px' }} 
                disabled={showExplanation} 
              />
              <span style={{ lineHeight: '1.4' }}>{displayText}</span>
            </label>
          );
        })}

        {currentQuestion.type === 'fill' && (
          <input 
            type="text" 
            placeholder="Type your answer here..."
            value={selectedAnswer}
            onChange={(e) => { setSelectedAnswer(e.target.value); setIsWrong(false); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && selectedAnswer.trim() !== '') {
                handleSubmit();
              }
            }}
            disabled={showExplanation}
            style={{ 
              padding: '15px', 
              borderRadius: '8px', 
              border: '2px solid var(--card-border, #ccc)', 
              background: 'var(--bg-body, #fff)', 
              color: 'var(--text-primary, #333)', 
              width: '100%',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        )}
      </div>

      {isWrong && (
        <div style={{ color: '#ff7675', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
          <FaTimesCircle /> Incorrect. The adaptive engine has adjusted. Try again.
        </div>
      )}

      {showExplanation ? (
        <div style={{ background: 'rgba(0, 184, 148, 0.1)', borderLeft: '4px solid #00b894', padding: '15px', marginBottom: '20px', color: 'var(--text-primary)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00b894', fontWeight: 'bold', marginBottom: '10px' }}>
            <FaCheckCircle /> Correct!
          </div>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{currentQuestion.explanation}</p>
        </div>
      ) : null}

      {!showExplanation ? (
        <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'var(--accent-color)', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
          Check Answer
        </button>
      ) : (
        <button onClick={pickNextQuestion} className="btn-secondary" style={{ 
            width: '100%', padding: '15px', borderRadius: '8px', border: 'none', cursor: 'pointer', 
            background: 'var(--accent-color)', color: '#fff', fontWeight: 'bold', fontSize: '16px',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
        }}>
          Next Question <FaArrowRight />
        </button>
      )}

    </div>
  );
};

export default AdaptiveQuiz;