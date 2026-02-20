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
  
  // Flexible state: String (fill), Array (single/multiple), Object (match)
  const [answerState, setAnswerState] = useState(null); 
  const [shuffledMatchOptions, setShuffledMatchOptions] = useState([]);
  
  const [isWrong, setIsWrong] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/quizzes/${lessonId}`);
        // We now trust the AI to send valid questions based on our JSON enforcer
        setQuestions(res.data.questions || []);
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
    
    // ✅ UI MORPHING: Initialize the correct answer state based on the AI's question type
    if (nextQ.type === 'match') {
      setAnswerState({}); // Use object for key-value matching
      setShuffledMatchOptions(nextQ.options.map(o => o.matchRight).sort(() => Math.random() - 0.5));
    } else if (nextQ.type === 'fill') {
      setAnswerState(''); // Use string for text input
    } else {
      setAnswerState([]); // Use array for checkboxes/radios
    }

    setIsWrong(false);
    setShowExplanation(false);
  };

  const isMultiSelect = currentQuestion?.type === 'multiple';

  const handleOptionToggle = (optText) => {
    setIsWrong(false);
    if (isMultiSelect) {
      setAnswerState(prev => prev.includes(optText) ? prev.filter(v => v !== optText) : [...prev, optText]);
    } else {
      setAnswerState([optText]); 
    }
  };

  const handleSubmit = () => {
    let correct = false;

    // ✅ DYNAMIC GRADING ALGORITHM
    if (currentQuestion.type === 'fill') {
      const ans = (answerState || '').toLowerCase().trim();
      const cor = (currentQuestion.correctAnswerText || currentQuestion.answer || '').toLowerCase().trim();
      correct = ans === cor;
    } else if (currentQuestion.type === 'match') {
      // Must match every left-side term to its exact right-side definition
      correct = currentQuestion.options.every(o => answerState[o.matchLeft] === o.matchRight);
    } else {
      const correctValues = currentQuestion.options
        .filter(o => o.isCorrect === true || String(o.isCorrect).toLowerCase() === 'true')
        .map(o => o.text);

      if (isMultiSelect) {
        correct = answerState.length === correctValues.length && answerState.every(v => correctValues.includes(v));
      } else {
        correct = correctValues.includes(answerState[0]);
      }
    }

    if (correct) {
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
      setIsWrong(true);
      setConsecutiveCorrect(0); 
      if (currentDifficulty > 1) {
        setCurrentDifficulty(currentDifficulty - 1); 
      }
    }
  };

  if (loading) return <div className="glass-card p-5 text-center">🧠 AI is compiling your adaptive exam...</div>;
  if (!currentQuestion) return null;

  // Evaluate if they have filled out enough info to click "Check Answer"
  let canSubmit = false;
  if (currentQuestion.type === 'fill') canSubmit = typeof answerState === 'string' && answerState.trim().length > 0;
  else if (currentQuestion.type === 'match') canSubmit = answerState && Object.keys(answerState).length === currentQuestion.options.length;
  else canSubmit = answerState && answerState.length > 0;

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
      {currentQuestion.type === 'match' && <p style={{ fontSize: '12px', color: 'var(--accent-color)', marginTop: 0, marginBottom: '20px', fontWeight: 'bold' }}>(Match the terms below)</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        
        {/* MULTIPLE CHOICE & SINGLE CHOICE */}
        {(currentQuestion.type === 'single' || currentQuestion.type === 'multiple') && currentQuestion.options?.map((opt, idx) => {
          const isSelected = answerState?.includes(opt.text);
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
                value={opt.text} 
                checked={isSelected || false}
                onChange={() => handleOptionToggle(opt.text)} 
                style={{ marginRight: '12px' }} 
                disabled={showExplanation} 
              />
              <span style={{ fontSize: '15px', fontWeight: '500' }}>{opt.text}</span>
            </label>
          );
        })}

        {/* FILL IN THE BLANK */}
        {currentQuestion.type === 'fill' && (
          <input 
            type="text" 
            placeholder="Type your answer here..."
            value={answerState || ''}
            onChange={(e) => { setAnswerState(e.target.value); setIsWrong(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) handleSubmit(); }}
            disabled={showExplanation}
            style={{ 
              padding: '15px', borderRadius: '12px', border: '2px solid var(--card-border)', 
              background: 'var(--bg-body)', color: 'var(--text-primary)', width: '100%',
              fontSize: '16px', outline: 'none', opacity: showExplanation ? 0.7 : 1
            }}
          />
        )}

        {/* ✅ THE NEW MATCHING UI */}
        {currentQuestion.type === 'match' && currentQuestion.options?.map((opt, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', border: '1px solid var(--card-border)', opacity: showExplanation ? 0.7 : 1 }}>
            <div style={{ flex: 1, fontWeight: 'bold', color: 'var(--text-primary)' }}>{opt.matchLeft}</div>
            <select 
              disabled={showExplanation}
              value={(answerState && answerState[opt.matchLeft]) || ""} 
              onChange={e => {
                setAnswerState({ ...answerState, [opt.matchLeft]: e.target.value });
                setIsWrong(false);
              }}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--bg-body)', color: 'var(--text-primary)', outline: 'none', cursor: showExplanation ? 'not-allowed' : 'pointer' }}
            >
              <option value="" disabled>Select match...</option>
              {shuffledMatchOptions.map((rightOpt, i) => (
                <option key={i} value={rightOpt}>{rightOpt}</option>
              ))}
            </select>
          </div>
        ))}
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
          disabled={!canSubmit}
          style={{ 
            width: '100%', padding: '15px', borderRadius: '12px', border: 'none', 
            cursor: canSubmit ? 'pointer' : 'not-allowed', 
            background: 'var(--accent-color)', 
            color: '#fff', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.3s',
            opacity: canSubmit ? 1 : 0.5 
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