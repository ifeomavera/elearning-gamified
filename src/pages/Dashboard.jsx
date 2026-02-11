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
        height: '100dvh', width: '100vw', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', 
        position: 'fixed', top: 0, left: 0, zIndex: 9999 
      }}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        `}</style>
        <div style={{
          width: '50px', height: '50px', border: '5px solid var(--card-border)', 
          borderTop: '5px solid var(--accent-color)', borderRadius: '50%',
          animation: 'spin 1s linear infinite', marginBottom: '15px'
        }}></div>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', animation: 'pulse 1.5s ease-in-out infinite' }}>Syncing Mission Data...</h3>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100dvh', // ✅ FIX: Prevents empty screen on mobile browsers
      padding: '15px', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative', 
      background: 'var(--bg-body)',
      overflowY: 'auto', // ✅ Allows natural scrolling on mobile
      WebkitOverflowScrolling: 'touch' 
    }}>
      
      <style>{`
        .sidebar-glass { background: rgba(255, 255, 255, 0.98); box-shadow: -5px 0 25px rgba(0,0,0,0.2); }
        [data-theme='dark'] .sidebar-glass { background: #1e1e2e; border-left: 1px solid rgba(255,255,255,0.1); }
        .menu-item {
          display: flex; align-items: center; gap: 15px; width: 100%; padding: 12px 18px; border-radius: 12px;
          border: none; background: transparent; color: var(--text-primary); font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .menu-item:hover { background: rgba(108, 92, 231, 0.1); transform: translateX(5px); }
        
        @media (max-width: 768px) {
          .responsive-flex { flex-direction: column !important; gap: 20px !important; }
          .responsive-flex-item { flex: 1 1 100% !important; width: 100% !important; }
          .sidebar-mobile { width: 85% !important; }
          .xp-section { padding: 12px !important; } /* ✅ More compact XP Bar on mobile */
          .header-text h1 { font-size: 18px !important; }
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="glass-card" onClick={() => onNavigate('profile')} style={{ fontSize: '22px', cursor: 'pointer', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              {avatar || "👨‍💻"}
            </div>
            <div className="header-text">
              <h1 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>{username}</h1>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.8, color: 'var(--text-secondary)' }}>Ready to level up?</p>
            </div>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="glass-card" style={{ padding: '8px', cursor: 'pointer', border: 'none', color: 'var(--text-primary)', borderRadius: '10px' }}>
            <FaBars size={18} />
          </button>
        </header>

        {/* Compact XP Progress */}
        <div className="glass-card xp-section" style={{ marginBottom: '15px', padding: '15px' }}>
          <XPBar currentXP={xp} level={level} />
          <div style={{ textAlign: 'right', marginTop: '8px' }}>
            <button onClick={() => onNavigate('stats')} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '5px 12px', borderRadius: '15px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
              <FaChartLine /> Stats
            </button>
          </div>
        </div>

        {/* Leaderboard CTA (High Contrast Fix) */}
        <div 
          onClick={() => onNavigate('leaderboard')} 
          className="glass-card" 
          style={{ 
            padding: '12px 15px', marginBottom: '20px', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            border: '1.5px solid var(--accent-color)' 
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaTrophy size={20} color="#f1c40f" />
            <h3 style={{margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: '700'}}>Leaderboard</h3>
          </div>
          <span style={{fontWeight: 'bold', fontSize: '11px', background: 'var(--accent-color)', color: '#fff', padding: '6px 12px', borderRadius: '15px'}}>View &rarr;</span>
        </div>

        {/* Content Area (Vertical Stack on Mobile) */}
        <div className="responsive-flex" style={{ display: 'flex', gap: '20px' }}>
          {/* Courses Section */}
          <div className="responsive-flex-item" style={{ flex: '2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FaGraduationCap color="var(--accent-color)" size={18} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800' }}>My Courses</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {courses.map(course => (
                <CourseCard key={course.id} {...course} isCompleted={course.completed} onClick={() => onStartLesson(course)} />
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="responsive-flex-item" style={{ flex: '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FaTrophy color="#e17055" size={18} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800' }}>Achievements</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {badges.map(badge => <BadgeCard key={badge.id} {...badge} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Overlay & Sidebar */}
      <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9998, opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? 'all' : 'none', transition: 'opacity 0.3s ease' }} />
      <div className="sidebar-glass sidebar-mobile" style={{ position: 'fixed', top: 0, right: isMenuOpen ? '0' : '-100%', width: '280px', height: '100%', zIndex: 9999, transition: 'right 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '15px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '22px' }}><FaTimes /></button>
        </div>
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '45px', marginBottom: '10px' }}>{avatar || "👨‍💻"}</div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '20px', marginBottom: '5px' }}>{username}</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Level {level} Software Engineer</p>
        </div>
        <div style={{ padding: '10px' }}>
          <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="menu-item"><FaUser /> Profile</button>
          <button onClick={() => { onNavigate('forum'); setIsMenuOpen(false); }} className="menu-item"><FaUsers /> Forum</button>
          <button onClick={toggleTheme} className="menu-item">
            {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#f1c40f" />}
            {currentTheme === 'light' ? "Dark Mode" : "Light Mode"}
          </button>
          <button onClick={onLogout} className="menu-item" style={{ color: '#d63031', marginTop: '10px' }}><FaSignOutAlt /> Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;