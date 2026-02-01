import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import { FaGraduationCap, FaChartLine, FaTrophy, FaSignOutAlt, FaSun, FaMoon, FaUsers } from 'react-icons/fa';

const Dashboard = ({ username, avatar, onNavigate, showToast, onLogout, toggleTheme, currentTheme, onStartLesson }) => {
  
  // 1. STATE & LOGIC
  const [xp] = useState(() => {
    const saved = localStorage.getItem('studentXP');
    return saved ? parseInt(saved) : 2350;
  });

  const [courses] = useState(() => {
    const saved = localStorage.getItem('appCourses');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: "Intro to Software Engineering", module: "Module 1", xp: 50, videoId: "zOjov-2OZ0E", completed: false },
      { id: 2, title: "Requirement Gathering", module: "Module 2", xp: 100, videoId: "9K7g8k5_xIQ", completed: false },
      { id: 3, title: "Gamification Logic", module: "Module 3", xp: 150, videoId: "m2uxP-kZk24", completed: false },
    ];
  });

  const badges = [
    { id: 1, name: "Early Bird", description: "Earn 1000 XP total", isUnlocked: xp >= 1000 },
    { id: 2, name: "Quiz Master", description: "Reach 2500 XP to unlock!", isUnlocked: xp >= 2500 },
    { id: 3, name: "Scholar", description: "Complete Module 1", isUnlocked: courses[0]?.completed }
  ];

  const currentLevel = Math.floor(xp / 1000) + 1;

  // 2. RENDER
  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 10px' }}>
        
        {/* HEADER - RESPONSIVE FIX: flexWrap allows stacking on mobile */}
        <header style={{ 
          marginBottom: '30px', 
          display: 'flex', 
          flexWrap: 'wrap', // <--- FIX 1: Allow wrapping
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '20px'       // <--- FIX 2: Gap between stacked items
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            {/* CLICKABLE AVATAR */}
            <div 
              className="glass-card"
              onClick={() => onNavigate('profile')} 
              style={{ fontSize: '40px', cursor: 'pointer', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {avatar || "👨‍💻"}
            </div>
            
            <div>
              {/* CLICKABLE USERNAME */}
              <h1 style={{ fontSize: '24px', margin: 0 }}>
                Welcome, 
                <span 
                  onClick={() => onNavigate('profile')} 
                  style={{ 
                    color: 'var(--accent-color)', 
                    cursor: 'pointer', 
                    marginLeft: '8px',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px'
                  }}
                  title="Edit Profile"
                >
                  {username}
                </span>
              </h1>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Ready to learn?</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* COMMUNITY BUTTON */}
            <button 
              onClick={() => onNavigate('forum')}
              className="glass-card"
              style={{ 
                padding: '10px 15px', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', gap: '10px', 
                fontSize: '14px', border: '1px solid var(--card-border)',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap' // <--- FIX 3: Prevent text breaking
              }}
            >
              <FaUsers color="var(--accent-color)" /> Community
            </button>

            {/* THEME TOGGLE */}
            <button onClick={toggleTheme} className="glass-card" style={{ 
              padding: '10px 15px', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: '10px', 
              fontSize: '14px', border: '1px solid var(--card-border)',
              whiteSpace: 'nowrap' // <--- FIX 3
            }}>
              {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#ffeb3b" />}
              {currentTheme === 'light' ? "Go Dark" : "Go Light"}
            </button>
            
            {/* LOGOUT */}
            <button onClick={onLogout} className="glass-card" style={{ 
              border: '1px solid #ff7675', color: '#ff7675', 
              padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', gap: '8px',
              whiteSpace: 'nowrap' // <--- FIX 3
            }}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {/* XP BAR & ANALYTICS LINK */}
        <div className="glass-card" style={{ marginBottom: '30px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <XPBar currentXP={xp} level={currentLevel} />
          
          <div style={{ textAlign: 'right' }}>
            <button 
              onClick={() => onNavigate('stats')}
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--accent-color)', 
                color: 'var(--accent-color)', 
                padding: '5px 15px', 
                borderRadius: '20px', 
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FaChartLine /> View Detailed Analytics
            </button>
          </div>
        </div>

        {/* LEADERBOARD BANNER */}
        <div onClick={() => onNavigate('leaderboard')} className="glass-card" style={{ padding: '20px', marginBottom: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%'}}><FaTrophy size={24} color="var(--accent-color)" /></div>
            <div><h3 style={{margin: 0, fontSize: '18px'}}>Current Rank: #3</h3><p style={{margin: 0, fontSize: '14px', opacity: 0.9}}>Top 10% of class</p></div>
          </div>
          <span style={{fontWeight: 'bold', fontSize: '14px', background: 'var(--accent-color)', color: '#1e1e2e', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap'}}>View Leaderboard →</span>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', width: '100%' }}>
          
          {/* COURSES */}
          <div style={{ flex: '2 1 400px', width: '100%' }}> {/* Grow factor 2, Shrink 1, Base 400px */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FaGraduationCap color="var(--accent-color)" size={24} />
              <h3 style={{ margin: 0 }}>My Courses</h3>
            </div>
            {courses.map(course => (
              <CourseCard 
                key={course.id} 
                {...course} 
                isCompleted={course.completed} 
                onClick={() => onStartLesson(course)} 
              />
            ))}
          </div>

          {/* ACHIEVEMENTS */}
          <div style={{ flex: '1 1 300px', width: '100%' }}> {/* Grow 1, Shrink 1, Base 300px */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FaChartLine color="#e17055" size={24} />
              <h3 style={{ margin: 0 }}>Achievements</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {badges.map(badge => <BadgeCard key={badge.id} {...badge} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;