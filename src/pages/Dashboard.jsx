import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
// Added FaBars (Menu) and FaTimes (Close X)
import { FaGraduationCap, FaChartLine, FaTrophy, FaSignOutAlt, FaSun, FaMoon, FaUsers, FaBars, FaTimes, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = ({ username, avatar, onNavigate, onLogout, toggleTheme, currentTheme, onStartLesson }) => {
  
  // --- STATE ---
  const [xp, setXP] = useState(0); 
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <--- NEW STATE FOR MENU

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
      
      {/* --- 1. CLEAN HEADER --- */}
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 10px' }}>
        <header style={{ 
          marginBottom: '30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          {/* LEFT: User Info (Essentials) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div 
              className="glass-card"
              onClick={() => onNavigate('profile')} 
              style={{ fontSize: '40px', cursor: 'pointer', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {avatar || "👨‍💻"}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', margin: 0 }}>
                Welcome, {username}
              </h1>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Ready to learn?</p>
            </div>
          </div>
          
          {/* RIGHT: Hamburger Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="glass-card" 
            style={{ padding: '12px', cursor: 'pointer', fontSize: '20px', color: 'var(--text-primary)' }}
          >
            <FaBars />
          </button>
        </header>

        {/* --- 2. MAIN DASHBOARD CONTENT --- */}
        <div className="glass-card" style={{ marginBottom: '30px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <XPBar currentXP={xp} level={level} />
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => onNavigate('stats')} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', width: '100%' }}>
          <div style={{ flex: '2 1 400px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FaGraduationCap color="var(--accent-color)" size={24} />
              <h3 style={{ margin: 0 }}>My Courses</h3>
            </div>
            {courses.map(course => (
              <CourseCard key={course.id} {...course} isCompleted={course.completed} onClick={() => onStartLesson(course)} />
            ))}
          </div>
          <div style={{ flex: '1 1 300px', width: '100%' }}>
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

      {/* --- 3. SLIDE-OUT MENU OVERLAY --- */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)} 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(0,0,0,0.5)', zIndex: 998, backdropFilter: 'blur(3px)'
          }}
        />
      )}

      {/* --- 4. THE SIDEBAR MENU --- */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isMenuOpen ? '0' : '-300px', // Slide in/out logic
        width: '280px',
        height: '100%',
        background: 'var(--card-bg)', // Matches your theme
        boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
        zIndex: 999,
        transition: 'right 0.3s ease-in-out',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
        borderLeft: '1px solid var(--card-border)'
      }}>
        
        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '24px', cursor: 'pointer' }}>
            <FaTimes />
          </button>
        </div>

        {/* Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ fontSize: '12px', textTransform: 'uppercase', color: 'gray', marginBottom: '5px' }}>Menu</p>
          
          <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="menu-btn" style={menuBtnStyle}>
             👤 My Profile
          </button>
          
          <button onClick={() => { onNavigate('forum'); setIsMenuOpen(false); }} className="menu-btn" style={menuBtnStyle}>
            <FaUsers color="var(--accent-color)" /> Community
          </button>

          <button onClick={() => { onNavigate('credits'); setIsMenuOpen(false); }} className="menu-btn" style={menuBtnStyle}>
            <FaInfoCircle color="#3498db" /> Credits & Team
          </button>

          <div style={{ height: '1px', background: 'var(--card-border)', margin: '10px 0' }}></div>

          <button onClick={toggleTheme} className="menu-btn" style={menuBtnStyle}>
            {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#ffeb3b" />}
            {currentTheme === 'light' ? "Switch to Dark" : "Switch to Light"}
          </button>
          
          <button onClick={onLogout} className="menu-btn" style={{ ...menuBtnStyle, color: '#ff7675', fontWeight: 'bold' }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

    </div>
  );
};

// Simple style object to keep the code clean
const menuBtnStyle = {
  background: 'transparent',
  border: 'none',
  padding: '12px',
  textAlign: 'left',
  fontSize: '16px',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  borderRadius: '8px',
  transition: 'background 0.2s'
};

export default Dashboard;