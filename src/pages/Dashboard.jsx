import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import { FaGraduationCap, FaChartLine, FaTrophy, FaSignOutAlt, FaSun, FaMoon, FaUsers, FaBars, FaTimes, FaInfoCircle, FaUser } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = ({ username, avatar, onNavigate, onLogout, toggleTheme, currentTheme, onStartLesson }) => {
  
  // --- STATE ---
  const [xp, setXP] = useState(0); 
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- DATA ---
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

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`https://elearning-api-2tsf.onrender.com/api/users/${username}`);
        const data = res.data;
        setXP(data.xp || 0);
        setLevel(data.level || 1);
        setBadges(prev => prev.map(b => ({
          ...b,
          isUnlocked: data.badges.includes(b.name) || (b.name === "Early Bird" && (data.xp || 0) >= 1000)
        })));
        setCourses(prev => prev.map(c => ({
          ...c,
          completed: data.completedCourses?.includes(c.id.toString()) || false
        })));
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  if (loading) return <div style={{padding: '50px', color: 'white', textAlign: 'center'}}>Loading Profile...</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      
      {/* --- INJECT CUSTOM CSS STYLES --- */}
      <style>{`
        .sidebar-glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
        }
        [data-theme='dark'] .sidebar-glass {
          background: rgba(30, 30, 46, 0.95);
          border-left: 1px solid rgba(255,255,255,0.1);
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 15px;
          width: 100%;
          padding: 15px 20px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .menu-item:hover {
          background: rgba(108, 92, 231, 0.1); /* Light purple tint */
          color: var(--accent-color);
          transform: translateX(5px);
        }
        .menu-item.logout:hover {
          background: rgba(255, 118, 117, 0.1); /* Light red tint */
          color: #ff7675;
        }
        .menu-header {
          padding: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(128,128,128,0.2);
          text-align: center;
        }
        /* MOBILE FIXES */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important; /* Force single column on mobile */
          }
          .responsive-flex-item {
            flex: 1 1 100% !important; /* Stack items fully on mobile */
          }
        }
      `}</style>

      {/* --- 1. HEADER --- */}
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 10px' }}>
        <header style={{ 
          marginBottom: '30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div 
              className="glass-card"
              onClick={() => onNavigate('profile')} 
              style={{ fontSize: '35px', cursor: 'pointer', width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {avatar || "👨‍💻"}
            </div>
            <div>
              <h1 style={{ fontSize: '22px', margin: 0 }}>Hello, {username}</h1>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>Let's learn something new!</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="glass-card" 
            style={{ padding: '12px', cursor: 'pointer', fontSize: '20px', color: 'var(--text-primary)', border: 'none' }}
          >
            <FaBars />
          </button>
        </header>

        {/* --- 2. DASHBOARD CONTENT --- */}
        <div className="glass-card" style={{ marginBottom: '30px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <XPBar currentXP={xp} level={level} />
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => onNavigate('stats')} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FaChartLine /> View Analytics
            </button>
          </div>
        </div>

        <div onClick={() => onNavigate('leaderboard')} className="glass-card" style={{ padding: '20px', marginBottom: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%'}}><FaTrophy size={24} color="var(--accent-color)" /></div>
            <div><h3 style={{margin: 0, fontSize: '18px'}}>Leaderboard</h3><p style={{margin: 0, fontSize: '14px', opacity: 0.9}}>Check your rank among peers</p></div>
          </div>
          <span style={{fontWeight: 'bold', fontSize: '14px', background: 'var(--accent-color)', color: '#1e1e2e', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap'}}>
            View &rarr;
          </span>
        </div>

        {/* Responsive Grid for Courses and Achievements */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', width: '100%' }}>
          
          {/* Courses Section - Adjusted flex-basis for mobile */}
          <div className="responsive-flex-item" style={{ flex: '2 1 300px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FaGraduationCap color="var(--accent-color)" size={24} />
              <h3 style={{ margin: 0 }}>My Courses</h3>
            </div>
            {courses.map(course => (
              <CourseCard key={course.id} {...course} isCompleted={course.completed} onClick={() => onStartLesson(course)} />
            ))}
          </div>

          {/* Achievements Section - Adjusted flex-basis for mobile */}
          <div className="responsive-flex-item" style={{ flex: '1 1 250px', width: '100%' }}>
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

      {/* --- 3. PREMIUM SIDEBAR MENU (FIXED Z-INDEX) --- */}
      {/* Overlay - Z-index increased to 9998 */}
      <div 
        onClick={() => setIsMenuOpen(false)} 
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.6)', 
          zIndex: 9998, 
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Drawer - Z-index increased to 9999 */}
      <div className="sidebar-glass" style={{
        position: 'fixed',
        top: 0,
        right: isMenuOpen ? '0' : '-320px', 
        width: '300px',
        height: '100%',
        zIndex: 9999, 
        transition: 'right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Close Button Area */}
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '24px', cursor: 'pointer', opacity: 0.7 }}>
            <FaTimes />
          </button>
        </div>

        {/* Profile Header (INSIDE Menu) */}
        <div className="menu-header">
          <div style={{ fontSize: '60px', marginBottom: '10px' }}>{avatar || "👨‍💻"}</div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{username}</h2>
          <span style={{ fontSize: '12px', background: 'var(--accent-color)', color: '#fff', padding: '3px 10px', borderRadius: '10px', fontWeight: 'bold' }}>
            Level {level} Student
          </span>
        </div>

        {/* Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '0 15px' }}>
          
          <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="menu-item">
             <FaUser /> My Profile
          </button>
          
          <button onClick={() => { onNavigate('forum'); setIsMenuOpen(false); }} className="menu-item">
            <FaUsers /> Community
          </button>

          <button onClick={() => { onNavigate('credits'); setIsMenuOpen(false); }} className="menu-item">
            <FaInfoCircle /> Credits & Team
          </button>

          <div style={{ height: '1px', background: 'rgba(128,128,128,0.2)', margin: '15px 10px' }}></div>

          <button onClick={toggleTheme} className="menu-item">
            {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#ffeb3b" />}
            {currentTheme === 'light' ? "Dark Mode" : "Light Mode"}
          </button>
          
          <button onClick={onLogout} className="menu-item logout" style={{ marginTop: '20px' }}>
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;