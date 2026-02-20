import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaBrain, FaArrowRight } from 'react-icons/fa';

const AdaptiveQuiz = ({ lessonId, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [askedTexts, setAskedTexts] = useState([]); 
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentDifficulty, setCurrentDifficulty] = useState(1); 
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isWrong, setIsWrong] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/quizzes/${lessonId}`);
        
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
    let available = questions.filter(q => q.difficulty === currentDifficulty && !askedTexts.includes(q.text));
    
    if (available.length === 0) {
      available = questions.filter(q => !askedTexts.includes(q.text));
    }

    if (available.length === 0) {
      onComplete({ score, total: askedTexts.length });
      return;
    }

    const nextQ = available[Math.floor(Math.random() * available.length)];
    setCurrentQuestion(nextQ);
    setAskedTexts([...askedTexts, nextQ.text]);
    
    setSelectedAnswers([]);
    setIsWrong(false);
    setShowExplanation(false);
  };

  const getOptionText = (opt) => {
    if (typeof opt === 'string') return opt;
    if (opt.text) return opt.text;
    if (opt.value) return opt.value;
    return Object.entries(opt).filter(([key, value]) => key !== '_id' && typeof value === 'string').map(([key, value]) => value).join(' - ');
  };

  const correctOptionsCount = currentQuestion?.options?.filter(o => 
    o.isCorrect === true || String(o.isCorrect).toLowerCase() === 'true'
  ).length || 0;
  const isMultiSelect = correctOptionsCount > 1;

  const handleOptionToggle = (optValue) => {
    setIsWrong(false);
    if (isMultiSelect) {
      setSelectedAnswers(prev => 
        prev.includes(optValue) ? prev.filter(v => v !== optValue) : [...prev, optValue]
      );
    } else {
      setSelectedAnswers([optValue]); 
    }
  };

  const handleSubmit = () => {
    let correct = false;

    if (currentQuestion.type === 'fill') {
      const answerStr = selectedAnswers[0] || '';
      correct = answerStr.toLowerCase().trim() === (currentQuestion.correctAnswerText || currentQuestion.answer || '').toLowerCase().trim();
    } else {
      const correctValues = currentQuestion.options
        .filter(o => o.isCorrect === true || String(o.isCorrect).toLowerCase() === 'true' || (o.text || o.value) === currentQuestion.correctAnswer)
        .map(o => o._id || getOptionText(o));

      if (isMultiSelect) {
        correct = selectedAnswers.length === correctValues.length && selectedAnswers.every(v => correctValues.includes(v));
      } else {
        const answerStr = selectedAnswers[0] || '';
        correct = correctValues.includes(answerStr) || answerStr.toLowerCase().trim() === (currentQuestion.correctAnswer || currentQuestion.answer || '').toLowerCase().trim();
      }
    }

    if (correct) {
      // ✅ FIX: Only lock the inputs and show the "Next Question" button if they got it right!
      setShowExplanation(true); 
      const newStreak = consecutiveCorrect + 1;
      setConsecutiveCorrect(newStreak);
      setScore(score + (currentDifficulty * 10)); 
      setIsWrong(false);

      if (newStreak >= 2 && currentDifficulty < 3) {
        setCurrentDifficulty(currentDifficulty + 1);
        setConsecutiveCorrect(0); 
      }
    } else {
      // ✅ FIX: Keep inputs open! They must try again.
      setIsWrong(true);
      setConsecutiveCorrect(0); 
      if (currentDifficulty > 1) {
        setCurrentDifficulty(currentDifficulty - 1); // Adaptive engine still punishes them by lowering difficulty for the next question
      }
    }
  };

  if (loading) return <div className="glass-card p-5 text-center">🧠 AI is compiling your adaptive exam...</div>;
  if (!currentQuestion) return null;

  return (
    <div className="glass-card" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', borderRadius: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: 'var(--text-secondary)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          <FaBrain /> Level {currentDifficulty}
        </span>
        <span style={{ background: 'rgba(142, 68, 173, 0.1)', color: 'var(--accent-color)', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px' }}>
          {score} XP
        </span>
      </div>

      <h3 style={{ color: 'var(--text-primary)', marginBottom: '5px', lineHeight: '1.4' }}>{currentQuestion.text}</h3>
      {isMultiSelect && <p style={{ fontSize: '12px', color: 'var(--accent-color)', marginTop: 0, marginBottom: '20px', fontWeight: 'bold' }}>(Select all that apply)</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {currentQuestion.type !== 'fill' && currentQuestion.options && currentQuestion.options.map((opt, idx) => {
          const displayText = getOptionText(opt);
          const optValue = opt._id || displayText; 
          const isSelected = selectedAnswers.includes(optValue);

          return (
            <label key={idx} style={{ 
              padding: '15px', 
              background: isSelected ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', 
              borderRadius: '12px', cursor: showExplanation ? 'not-allowed' : 'pointer', 
              color: isSelected ? '#fff' : 'var(--text-primary)',
              display: 'flex', alignItems: 'center', border: '1px solid var(--card-border)', transition: 'all 0.2s ease',
              opacity: showExplanation && !isSelected ? 0.5 : 1 
            }}>
              <input 
                type={isMultiSelect ? "checkbox" : "radio"} 
                name="quizOption" 
                value={optValue} 
                checked={isSelected}
                onChange={() => handleOptionToggle(optValue)} 
                style={{ marginRight: '12px' }} 
                disabled={showExplanation} 
              />
              <span style={{ fontSize: '15px', fontWeight: '500' }}>{displayText}</span>
            </label>
          );
        })}

        {currentQuestion.type === 'fill' && (
          <input 
            type="text" 
            placeholder="Type your answer here..."
            value={selectedAnswers[0] || ''}
            onChange={(e) => { setSelectedAnswers([e.target.value]); setIsWrong(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && selectedAnswers.length > 0) handleSubmit(); }}
            disabled={showExplanation}
            style={{ 
              padding: '15px', borderRadius: '12px', border: '2px solid var(--card-border)', 
              background: 'var(--bg-body)', color: 'var(--text-primary)', width: '100%',
              fontSize: '16px', outline: 'none', opacity: showExplanation ? 0.7 : 1
            }}
          />
        )}
      </div>

      {isWrong && (
        <div style={{ color: '#ff7675', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', animation: 'shake 0.5s ease-in-out' }}>
          <FaTimesCircle /> Incorrect. The adaptive engine has adjusted. Try again.
        </div>
      )}

      {showExplanation && !isWrong && (
        <div style={{ background: 'rgba(0, 184, 148, 0.1)', borderLeft: '4px solid #00b894', padding: '15px', marginBottom: '20px', borderRadius: '12px', animation: 'fadeIn 0.5s ease-in-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00b894', fontWeight: 'bold', marginBottom: '10px' }}>
            <FaCheckCircle /> Correct!
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {currentQuestion.explanation || "Great job! Let's move to the next one."}
          </p>
        </div>
      )}

      {!showExplanation ? (
        <button 
          onClick={handleSubmit} 
          disabled={selectedAnswers.length === 0}
          style={{ 
            width: '100%', padding: '15px', borderRadius: '12px', border: 'none', 
            cursor: selectedAnswers.length > 0 ? 'pointer' : 'not-allowed', 
            background: 'var(--accent-color)', 
            color: '#fff', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.3s',
            opacity: selectedAnswers.length > 0 ? 1 : 0.5 
          }}
        >
          Check Answer
        </button>
      ) : (
        <button onClick={pickNextQuestion} style={{ 
            width: '100%', padding: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer', 
            background: '#00b894', color: '#fff', fontWeight: 'bold', fontSize: '16px',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
        }}>
          Next Question <FaArrowRight />
        </button>
      )}

    </div>
  );
};

export default AdaptiveQuiz;