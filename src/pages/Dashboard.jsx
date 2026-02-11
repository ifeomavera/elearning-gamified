import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import { FaGraduationCap, FaChartLine, FaTrophy, FaSignOutAlt, FaSun, FaMoon, FaUsers, FaBars, FaTimes, FaInfoCircle, FaUser } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = ({ username, avatar, onNavigate, onLogout, toggleTheme, currentTheme, onStartLesson }) => {
  const [xp, setXP] = useState(0); 
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [courses, setCourses] = useState([
      { id: 1, title: "Intro to Software Engineering", module: "Module 1", xp: 50, videoId: "zOjov-2OZ0E", completed: false },
      { id: 2, title: "Requirement Gathering", module: "Module 2", xp: 100, videoId: "9K7g8k5_xIQ", completed: false },
      { id: 3, title: "Gamification Logic", module: "Module 3", xp: 150, videoId: "m2uxP-kZk24", completed: false },
  ]);

  const [badges, setBadges] = useState([
    { id: 1, name: "Early Bird", description: "Earn 1000 XP total", isUnlocked: false },
    { id: 2, name: "Quiz Master", description: "Reach 2500 XP to unlock!", isUnlocked: false },
    { id: 3, name: "Scholar", description: "Complete Module 1", isUnlocked: false }
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (xp === 0) setLoading(true);
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/users/${username}`);
        const data = res.data;

        setXP(data.xp || 0);
        setLevel(data.level || 1);

        const userBadges = data.badges || [];
        const userCourses = data.completedCourses || [];

        setBadges(prev => prev.map(b => ({
          ...b,
          isUnlocked: userBadges.includes(b.name) || (b.name === "Early Bird" && (data.xp || 0) >= 1000)
        })));

        setCourses(prev => prev.map(c => ({
          ...c,
          completed: userCourses.includes(c.id.toString()) || false
        })));

        setLoading(false);
      } catch (err) {
        console.error("Failed to load user data", err);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  if (loading && xp === 0) {
    return (
      <div style={{
        height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', 
        position: 'fixed', top: 0, left: 0, zIndex: 9999 
      }}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        `}</style>
        <div style={{
          width: '60px', height: '60px', border: '6px solid var(--card-border)', 
          borderTop: '6px solid var(--accent-color)', borderRadius: '50%',
          animation: 'spin 1s linear infinite', marginBottom: '20px'
        }}></div>
        <h3 style={{ 
          color: 'var(--text-primary)', fontFamily: 'var(--font-head)',
          fontSize: '18px', letterSpacing: '1px', animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          Syncing Mission Data...
        </h3>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden', background: 'var(--bg-body)' }}>
      
      <style>{`
        .sidebar-glass { background: rgba(255, 255, 255, 0.98); box-shadow: -5px 0 25px rgba(0,0,0,0.2); }
        [data-theme='dark'] .sidebar-glass { background: #1e1e2e; border-left: 1px solid rgba(255,255,255,0.1); }
        .menu-item {
          display: flex; align-items: center; gap: 15px; width: 100%; padding: 15px 20px; border-radius: 12px;
          border: none; background: transparent; color: var(--text-primary); font-size: 16px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .menu-item:hover { background: rgba(108, 92, 231, 0.1); transform: translateX(5px); }
        @media (max-width: 768px) {
          .responsive-flex-item { flex: 1 1 100% !important; }
          .sidebar-mobile { width: 85% !important; max-width: 300px; }
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 5px' }}>
        <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="glass-card" onClick={() => onNavigate('profile')} style={{ fontSize: '30px', cursor: 'pointer', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              {avatar || "👨‍💻"}
            </div>
            <div>
              <h1 style={{ fontSize: '20px', margin: 0, color: 'var(--text-primary)' }}>Hello, {username}</h1>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.7, color: 'var(--text-secondary)' }}>Let's learn something new!</p>
            </div>
          </div>
          
          <button onClick={() => setIsMenuOpen(true)} className="glass-card" style={{ padding: '12px', cursor: 'pointer', fontSize: '20px', border: 'none', color: 'var(--text-primary)', borderRadius: '12px' }}>
            <FaBars />
          </button>
        </header>

        <div className="glass-card" style={{ marginBottom: '25px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <XPBar currentXP={xp} level={level} />
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => onNavigate('stats')} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <FaChartLine /> View Analytics
            </button>
          </div>
        </div>

        {/* --- RE-STYLED LEADERBOARD SECTION FOR MAXIMUM VISIBILITY --- */}
        <div 
          onClick={() => onNavigate('leaderboard')} 
          className="glass-card" 
          style={{ 
            padding: '20px', 
            marginBottom: '30px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            transition: 'transform 0.2s ease, border 0.2s ease',
            border: '2px solid var(--accent-color)' // Bold border to catch the eye
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{ 
              background: 'rgba(241, 196, 15, 0.15)', 
              padding: '12px', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <FaTrophy size={26} color="#f1c40f" />
            </div>
            <div>
                <h3 style={{margin: 0, fontSize: '18px', color: 'var(--text-primary)', fontWeight: '800'}}>Leaderboard</h3>
                <p style={{margin: 0, fontSize: '13px', color: 'var(--text-secondary)', opacity: 1}}>Compare your progress with peers</p>
            </div>
          </div>
          
          <span style={{
            fontWeight: 'bold', 
            fontSize: '13px', 
            background: 'var(--accent-color)', 
            color: '#fff', 
            padding: '10px 22px', 
            borderRadius: '25px',
            boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)'
          }}>
            View Rankings &rarr;
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', width: '100%' }}>
          <div className="responsive-flex-item" style={{ flex: '2 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <FaGraduationCap color="var(--accent-color)" size={22} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>My Courses</h3>
            </div>
            {courses.map(course => (
              <CourseCard key={course.id} {...course} isCompleted={course.completed} onClick={() => onStartLesson(course)} />
            ))}
          </div>

          <div className="responsive-flex-item" style={{ flex: '1 1 250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <FaTrophy color="#e17055" size={22} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Achievements</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {badges.map(badge => <BadgeCard key={badge.id} {...badge} />)}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div 
        onClick={() => setIsMenuOpen(false)} 
        style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(0,0,0,0.6)', zIndex: 9998, 
            opacity: isMenuOpen ? 1 : 0, 
            pointerEvents: isMenuOpen ? 'all' : 'none', 
            transition: 'opacity 0.3s ease',
            backdropFilter: 'blur(2px)'
        }} 
      />

      {/* MOBILE SIDEBAR */}
      <div 
        className="sidebar-glass sidebar-mobile" 
        style={{ 
            position: 'fixed', top: 0, 
            right: isMenuOpen ? '0' : '-100%', 
            width: '300px', 
            height: '100%', zIndex: 9999, 
            transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            display: 'flex', flexDirection: 'column' 
        }}
      >
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}><FaTimes /></button>
        </div>
        
        <div style={{ padding: '0 25px 30px 25px', textAlign: 'center', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: '60px', marginBottom: '10px' }}>{avatar || "👨‍💻"}</div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: 'var(--text-primary)' }}>{username}</h2>
          <span style={{ fontSize: '12px', background: 'var(--accent-color)', color: '#fff', padding: '4px 12px', borderRadius: '15px', fontWeight: 'bold' }}>Level {level} Student</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '20px' }}>
          <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="menu-item"><FaUser /> My Profile</button>
          <button onClick={() => { onNavigate('forum'); setIsMenuOpen(false); }} className="menu-item"><FaUsers /> Community</button>
          <button onClick={() => { onNavigate('credits'); setIsMenuOpen(false); }} className="menu-item"><FaInfoCircle /> Credits & Team</button>
          <div style={{ height: '1px', background: 'var(--card-border)', margin: '15px 10px' }}></div>
          <button onClick={toggleTheme} className="menu-item">
            {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#ffeb3b" />}
            {currentTheme === 'light' ? "Dark Mode" : "Light Mode"}
          </button>
          <button onClick={onLogout} className="menu-item" style={{ marginTop: '20px', color: '#d63031' }}>
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;s