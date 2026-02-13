import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import ActivityFeed from '../components/ActivityFeed'; 
import { 
  FaGraduationCap, FaChartLine, FaTrophy, FaSignOutAlt, 
  FaSun, FaMoon, FaUsers, FaBars, FaTimes, FaUser, 
  FaCompass, FaBookOpen, FaPlus 
} from 'react-icons/fa'; // ✅ Added FaBookOpen and FaPlus
import axios from 'axios';

const ALL_COURSES = [
  { id: 1, title: "Intro to Software Engineering", module: "Module 1", xp: 50, videoId: "zOjov-2OZ0E" },
  { id: 2, title: "Requirement Gathering", module: "Module 2", xp: 100, videoId: "9K7g8k5_xIQ" },
  { id: 3, title: "Gamification Logic", module: "Module 3", xp: 150, videoId: "m2uxP-kZk24" },
];

const Dashboard = ({ username, avatar, onNavigate, onLogout, toggleTheme, currentTheme, onStartLesson }) => {
  const [xp, setXP] = useState(0); 
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activities, setActivities] = useState([]); 
  const [courses, setCourses] = useState([]);

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
        const userCoursesCompleted = data.completedCourses || [];
        const userEnrolled = data.enrolledCourses || []; 

        try {
            const feedRes = await axios.get(`${apiUrl}/api/users/activities`);
            setActivities(feedRes.data);
        } catch (feedErr) {
            console.error("Could not load activity feed", feedErr);
        }

        setBadges(prev => prev.map(b => ({
          ...b,
          isUnlocked: userBadges.includes(b.name) || (b.name === "Early Bird" && (data.xp || 0) >= 1000)
        })));

        const activeCourses = ALL_COURSES
          .filter(course => userEnrolled.includes(String(course.id)))
          .map(course => ({
            ...course,
            completed: userCoursesCompleted.includes(String(course.id))
          }));

        setCourses(activeCourses);
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
      width: '100%', minHeight: '100vh', padding: '15px', display: 'flex', 
      flexDirection: 'column', position: 'relative', background: 'var(--bg-body)' 
    }}>
      
      <style>{`
        .sidebar-glass { background: rgba(255, 255, 255, 0.98); box-shadow: -5px 0 25px rgba(0,0,0,0.2); }
        [data-theme='dark'] .sidebar-glass { background: #1e1e2e; border-left: 1px solid rgba(255,255,255,0.1); }
        
        .vici-sidebar {
          background: var(--bg-body) !important; 
          box-shadow: -10px 0 40px rgba(0,0,0,0.3) !important;
          border-left: 1px solid var(--card-border) !important;
        }
        .vici-menu-item {
          display: flex; align-items: center; gap: 15px; width: 100%; padding: 14px 30px; 
          background: transparent; border: none; color: var(--text-primary); 
          font-family: inherit; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative;
        }
        .vici-menu-item:hover { background: var(--card-border); color: var(--accent-color); padding-left: 35px; }
        .vici-menu-item:hover::before {
          content: ''; position: absolute; left: 0; top: 20%; height: 60%; width: 4px;
          background: var(--accent-color); border-radius: 0 4px 4px 0; box-shadow: 0 0 10px var(--accent-color);
        }
        .vici-sign-out { color: #ff4757 !important; border-top: 1px solid var(--card-border) !important; margin-top: auto; padding-top: 20px !important; margin-bottom: 20px; }

        /* ✅ NEW: Button styling for adding another course */
        .add-course-btn {
          margin-top: 10px; background: transparent; border: 2px dashed var(--card-border); 
          color: var(--text-secondary); padding: 15px; border-radius: 12px; cursor: pointer; 
          font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.3s ease; width: 100%; font-size: 14px; font-family: inherit;
        }
        .add-course-btn:hover {
          border-color: var(--accent-color); color: var(--accent-color); background: rgba(108, 92, 231, 0.05);
        }

        @media (max-width: 768px) {
          .responsive-flex { flex-direction: column !important; gap: 20px !important; }
          .responsive-flex-item { flex: 1 1 100% !important; width: 100% !important; }
          .sidebar-mobile { width: 320px !important; }
          .xp-section { padding: 12px !important; }
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

        <div onClick={() => onNavigate('hall-of-fame')} className="glass-card" style={{ padding: '12px 15px', marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid var(--accent-color)' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FaTrophy size={20} color="#f1c40f" />
            <h3 style={{margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: '700'}}>Hall of Fame</h3>
          </div>
          <span style={{fontWeight: 'bold', fontSize: '11px', background: 'var(--accent-color)', color: '#fff', padding: '6px 12px', borderRadius: '15px'}}>View &rarr;</span>
        </div>

        {/* Content Area */}
        <div className="responsive-flex" style={{ display: 'flex', gap: '20px' }}>
          
          <div className="responsive-flex-item" style={{ flex: '2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FaGraduationCap color="var(--accent-color)" size={18} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800' }}>My Courses</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {courses.length > 0 ? (
                <>
                  {courses.map(course => (
                    <CourseCard key={course.id} {...course} isCompleted={course.completed} onClick={() => onStartLesson(course)} />
                  ))}
                  
                  {/* ✅ THE FIX: Persistent Button when courses exist */}
                  <button onClick={() => onNavigate('course-catalog')} className="add-course-btn">
                    <FaPlus /> Browse Catalog for More Modules
                  </button>
                </>
              ) : (
                <div style={{ 
                  padding: '30px 20px', textAlign: 'center', background: 'var(--card-border)', 
                  borderRadius: '15px', border: `1px dashed var(--text-secondary)`, opacity: 0.8
                }}>
                  <FaCompass size={30} color="var(--text-secondary)" style={{ margin: '0 auto 10px auto' }} />
                  <p style={{ color: 'var(--text-primary)', marginBottom: '15px', fontWeight: 'bold' }}>Your backpack is empty.</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '20px' }}>Enroll in a module to begin your journey.</p>
                  <button 
                    onClick={() => onNavigate('course-catalog')} 
                    style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Browse Course Catalog
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="responsive-flex-item" style={{ flex: '1' }}>
            <div style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <FaTrophy color="#e17055" size={18} />
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800' }}>Achievements</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {badges.map(badge => <BadgeCard key={badge.id} {...badge} />)}
                </div>
            </div>
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>

      {/* OVERLAY & SIDEBAR */}
      <div 
        onClick={() => setIsMenuOpen(false)} 
        style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9998, 
          opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? 'all' : 'none', 
          transition: 'opacity 0.4s ease' 
        }} 
      />

      <div className="vici-sidebar sidebar-mobile" style={{ 
        position: 'fixed', top: 0, right: isMenuOpen ? '0' : '-100%', 
        width: '320px', height: '100%', zIndex: 9999, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
        display: 'flex', flexDirection: 'column' 
      }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes size={18} /></button>
        </div>
        
        <div style={{ padding: '0 30px 30px 30px', textAlign: 'center', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ 
            fontSize: '50px', marginBottom: '15px', background: 'var(--bg-body)', 
            width: '100px', height: '100px', borderRadius: '30px', margin: '0 auto 15px auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--card-border)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
          }}>{avatar || "👨‍💻"}</div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: '800', marginBottom: '5px', letterSpacing: '-0.5px', fontFamily: 'inherit' }}>{username}</h2>
          <div style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'inherit' }}>Level {level} Software Engineer</div>
        </div>

        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="vici-menu-item"><FaUser opacity={0.6} /> Profile Settings</button>
          
          {/* ✅ THE FIX: Permanent link in the sidebar */}
          <button onClick={() => { onNavigate('course-catalog'); setIsMenuOpen(false); }} className="vici-menu-item"><FaBookOpen opacity={0.6} /> Course Catalog</button>
          
          <button onClick={() => { onNavigate('forum'); setIsMenuOpen(false); }} className="vici-menu-item"><FaUsers opacity={0.6} /> Student Community</button>
          <button onClick={toggleTheme} className="vici-menu-item">
            {currentTheme === 'light' ? <FaMoon opacity={0.6} /> : <FaSun color="var(--accent-color)" opacity={0.8} />}
            {currentTheme === 'light' ? "Dark Mode" : "Light Mode"}
          </button>
          <button onClick={onLogout} className="vici-menu-item vici-sign-out"><FaSignOutAlt /> Terminate Session</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;