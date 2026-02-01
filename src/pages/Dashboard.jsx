import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import { FaGraduationCap, FaChartLine, FaTrophy, FaSignOutAlt, FaSun, FaMoon, FaUsers } from 'react-icons/fa';
import axios from 'axios'; // <--- IMPORT AXIOS

const Dashboard = ({ username, avatar, onNavigate, onLogout, toggleTheme, currentTheme, onStartLesson }) => {
  
  // 1. STATE (Initialize with 0/empty to prevent flashing fake data)
  const [xp, setXP] = useState(0); 
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  // Default courses (Static structure, but completion status will come from DB)
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

  // 2. FETCH REAL DATA FROM BACKEND
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Call the new API route we just created
        const res = await axios.get(`https://elearning-api-2tsf.onrender.com/api/users/${username}`);
        const data = res.data;

        // Set Real XP and Level
        setXP(data.xp || 0);
        setLevel(data.level || 1);

        // Update Badges based on Real XP and DB data
        setBadges(prev => prev.map(b => ({
          ...b,
          isUnlocked: data.badges.includes(b.name) || (b.name === "Early Bird" && (data.xp || 0) >= 1000)
        })));

        // Update Course Completion Status from DB
        setCourses(prev => prev.map(c => ({
          ...c,
          completed: data.completedCourses?.includes(c.id.toString()) || false
        })));

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setLoading(false); // Stop loading even if error so UI shows
      }
    };

    fetchUserData();
  }, [username]);

  // 3. RENDER
  if (loading) return <div style={{padding: '50px', color: 'white', textAlign: 'center'}}>Loading Profile...</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 10px' }}>
        
        {/* HEADER - Kept your Mobile Fixes */}
        <header style={{ 
          marginBottom: '30px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '20px' 
        }}>
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
                Welcome, 
                <span 
                  onClick={() => onNavigate('profile')} 
                  style={{ color: 'var(--accent-color)', cursor: 'pointer', marginLeft: '8px', textDecoration: 'underline', textUnderlineOffset: '4px' }}
                >
                  {username}
                </span>
              </h1>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Ready to learn?</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('forum')} className="glass-card" style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', border: '1px solid var(--card-border)', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              <FaUsers color="var(--accent-color)" /> Community
            </button>
            <button onClick={toggleTheme} className="glass-card" style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', border: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>
              {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#ffeb3b" />}
              {currentTheme === 'light' ? "Go Dark" : "Go Light"}
            </button>
            <button onClick={onLogout} className="glass-card" style={{ border: '1px solid #ff7675', color: '#ff7675', padding: '8px 15px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        {/* XP BAR */}
        <div className="glass-card" style={{ marginBottom: '30px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <XPBar currentXP={xp} level={level} />
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => onNavigate('stats')} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <FaChartLine /> View Detailed Analytics
            </button>
          </div>
        </div>

        {/* LEADERBOARD BANNER */}
        <div onClick={() => onNavigate('leaderboard')} className="glass-card" style={{ padding: '20px', marginBottom: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%'}}><FaTrophy size={24} color="var(--accent-color)" /></div>
            <div><h3 style={{margin: 0, fontSize: '18px'}}>Leaderboard</h3><p style={{margin: 0, fontSize: '14px', opacity: 0.9}}>Check your rank among peers</p></div>
          </div>
          <span style={{fontWeight: 'bold', fontSize: '14px', background: 'var(--accent-color)', color: '#1e1e2e', padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap'}}>View Leaderboard →</span>
        </div>

        {/* COURSES & ACHIEVEMENTS */}
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
    </div>
  );
};

export default Dashboard;