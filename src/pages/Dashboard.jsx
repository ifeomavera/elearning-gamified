import React, { useState } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import VideoModal from '../components/VideoModal';
import { FaGraduationCap, FaChartLine, FaTrophy, FaSignOutAlt } from 'react-icons/fa';

// UPDATED: Now accepts 'avatar'
const Dashboard = ({ username, avatar, onNavigate, showToast, onLogout }) => {
  
  const [xp, setXP] = useState(() => {
    const saved = localStorage.getItem('studentXP');
    return saved ? parseInt(saved) : 2350;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('appCourses');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: "Intro to Software Engineering", module: "Module 1", xp: 50, videoId: "zOjov-2OZ0E", completed: false },
      { id: 2, title: "Requirement Gathering", module: "Module 2", xp: 100, videoId: "9K7g8k5_xIQ", completed: false },
      { id: 3, title: "Gamification Logic", module: "Module 3", xp: 150, videoId: "m2uxP-kZk24", completed: false },
    ];
  });

  const [activeCourse, setActiveCourse] = useState(null);

  const badges = [
    { id: 1, name: "Early Bird", description: "Earn 1000 XP total", isUnlocked: xp >= 1000 },
    { id: 2, name: "Quiz Master", description: "Reach 2500 XP to unlock!", isUnlocked: xp >= 2500 },
    { id: 3, name: "Scholar", description: "Complete Module 1", isUnlocked: courses[0]?.completed }
  ];

  const currentLevel = Math.floor(xp / 1000) + 1;

  const handleLessonComplete = () => {
    if (!activeCourse) return;
    const newXP = xp + activeCourse.xp;
    setXP(newXP);
    localStorage.setItem('studentXP', newXP); 
    
    const updatedCourses = courses.map(c => 
      c.id === activeCourse.id ? { ...c, completed: true } : c
    );
    setCourses(updatedCourses);
    localStorage.setItem('appCourses', JSON.stringify(updatedCourses));

    setActiveCourse(null);
    if(showToast) showToast(`+${activeCourse.xp} XP Earned!`, "success");
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f4f7f6', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        
        {/* HEADER SECTION WITH AVATAR */}
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* AVATAR DISPLAY */}
            <div 
              onClick={() => onNavigate('profile')} 
              style={{ fontSize: '50px', cursor: 'pointer', background: 'white', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            >
              {avatar || "👨‍💻"}
            </div>
            
            <div>
              <h1 style={{ color: '#2d3436', fontSize: '28px', margin: 0 }}>
                Welcome, <span onClick={() => onNavigate('profile')} style={{ color: '#0984e3', cursor: 'pointer' }}>{username}</span>
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#636e72' }}>Ready to learn?</p>
            </div>
          </div>
          
          <button onClick={onLogout} style={{ background: 'white', border: '1px solid #ff7675', color: '#ff7675', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaSignOutAlt /> Logout
          </button>
        </header>

        <div style={{ marginBottom: '30px' }}><XPBar currentXP={xp} level={currentLevel} /></div>

        <div onClick={() => onNavigate('leaderboard')} style={{ background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)', borderRadius: '12px', padding: '20px', marginBottom: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)' }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%'}}><FaTrophy color="white" size={24} /></div>
            <div><h3 style={{margin: 0, fontSize: '18px'}}>Current Rank: #3</h3><p style={{margin: 0, fontSize: '14px', opacity: 0.9}}>Top 10% of class</p></div>
          </div>
          <span style={{fontWeight: 'bold', fontSize: '14px', background: 'white', color: '#6c5ce7', padding: '8px 16px', borderRadius: '20px'}}>View Leaderboard →</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', width: '100%' }}>
          <div style={{ flex: 2, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><FaGraduationCap color="#0984e3" size={24} /><h3 style={{ margin: 0, color: '#2d3436' }}>My Courses</h3></div>
            {courses.map(course => <CourseCard key={course.id} {...course} isCompleted={course.completed} onClick={() => setActiveCourse(course)} />)}
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><FaChartLine color="#e17055" size={24} /><h3 style={{ margin: 0, color: '#2d3436' }}>Achievements</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>{badges.map(badge => <BadgeCard key={badge.id} {...badge} />)}</div>
          </div>
        </div>
        <VideoModal isOpen={!!activeCourse} title={activeCourse?.title} videoId={activeCourse?.videoId} onClose={() => setActiveCourse(null)} onComplete={handleLessonComplete} />
      </div>
    </div>
  );
};

export default Dashboard;