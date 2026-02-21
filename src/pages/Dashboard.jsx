import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import ActivityFeed from '../components/ActivityFeed'; 
import SocialInbox from '../components/SocialInbox'; 
import { 
  FaBookOpen, FaPlus, FaChartLine, FaBars, FaCommentDots, 
  FaUser, FaUsers, FaSignOutAlt, FaTimes, FaMoon, FaSun 
} from 'react-icons/fa';
import axios from 'axios';

const Dashboard = ({ username, avatar, onNavigate, refreshTrigger, onLogout, toggleTheme, currentTheme, onStartLesson, onOpenChat }) => {
  const [xp, setXP] = useState(0); 
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]); 
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ streak: 0, accuracy: 0 });
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchUserData = async (isRefresh = false) => {
    if (!isRefresh && xp === 0) setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [userRes, statsRes, coursesRes, feedRes] = await Promise.all([
        axios.get(`${apiUrl}/api/users/${username}`),
        axios.get(`${apiUrl}/api/users/${username}/stats`),
        axios.get(`${apiUrl}/api/courses`),
        axios.get(`${apiUrl}/api/users/activities`)
      ]);

      setUserData(userRes.data);
      setXP(userRes.data.xp || 0);
      setLevel(userRes.data.level || 1);
      setStats(statsRes.data);
      setActivities((feedRes.data || []).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      
      const enrolled = coursesRes.data
        .filter(c => userRes.data.enrolledCourses?.includes(String(c._id)))
        .map(c => ({ ...c, completed: userRes.data.completedCourses?.includes(String(c._id)) }));
      setCourses(enrolled);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUserData(refreshTrigger > 0); }, [username, refreshTrigger]);

  if (loading && xp === 0) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', color: 'var(--text-primary)' }}>Synchronizing Academic Core...</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '15px', background: 'var(--bg-body)' }}>
      <style>{`
        .dashboard-grid { display: grid; grid-template-columns: 300px 1fr 340px; gap: 25px; max-width: 1600px; width: 100%; margin: 0 auto; align-items: start; }
        .enroll-card {
          margin-top: 15px; border: 2.5px dashed var(--accent-color); padding: 40px 20px; 
          border-radius: 24px; color: var(--accent-color); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 15px;
          font-weight: 900; text-transform: uppercase; transition: 0.3s;
          background: rgba(108, 92, 231, 0.04); font-size: 16px;
        }
        .enroll-card:hover { background: rgba(108, 92, 231, 0.1); transform: translateY(-4px); }
        .vici-menu-item { display: flex; align-items: center; gap: 15px; width: 100%; padding: 15px 40px; background: transparent; border: none; color: var(--text-primary); font-size: 16px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .vici-menu-item:hover { background: rgba(255,255,255,0.05); color: var(--accent-color); padding-left: 45px; }
        @media (max-width: 1300px) { .dashboard-grid { grid-template-columns: 1fr 320px; } .achievements-col { display: none; } }
        @media (max-width: 800px) { .dashboard-grid { grid-template-columns: 1fr; } .social-col { order: 3; } }
      `}</style>

      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', maxWidth: '1600px', width: '100%', margin: '0 auto 25px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="glass-card" onClick={() => onNavigate('profile')} style={{ cursor: 'pointer', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>{avatar}</div>
          <div><h1 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)', fontWeight: '900' }}>{username}</h1><p style={{ margin: 0, fontSize: '12px', color: 'var(--accent-color)', fontWeight: '800' }}>Independent Scholar</p></div>
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="glass-card" style={{ padding: '12px', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '12px' }}><FaBars size={22} /></button>
      </header>

      {/* PROGRESS BAR */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', maxWidth: '1600px', margin: '0 auto 30px auto' }}>
        <XPBar currentXP={xp} level={level} />
        <div style={{ textAlign: 'right', marginTop: '12px' }}>
          <button onClick={() => onNavigate('stats')} style={{ background: 'transparent', border: '1.5px solid var(--accent-color)', color: 'var(--accent-color)', padding: '7px 18px', borderRadius: '25px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}>OPEN PERFORMANCE ANALYTICS</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="achievements-col">
          <div className="glass-card" style={{ padding: '20px', marginBottom: '25px' }}>
             <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: 'var(--accent-color)', textTransform: 'uppercase', fontWeight: '900' }}>Academic Record</h4>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-primary)' }}><span>Streak</span><b>🔥 {stats.streak} Days</b></div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-primary)', marginTop: '12px' }}><span>Accuracy</span><b>🎯 {stats.accuracy}%</b></div>
          </div>
          <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '15px', fontWeight: '900' }}>Milestone Badges</h3>
          {userData?.badges?.map((b, i) => <BadgeCard key={i} name={b} isUnlocked={true} />)}
        </div>

        <div className="center-col">
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '900' }}>
             <FaBookOpen color="var(--accent-color)" /> Active Curriculum
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {courses.map(c => <CourseCard key={c._id} {...c} isCompleted={c.completed} onClick={() => onStartLesson(c)} />)}
            <div className="enroll-card" onClick={() => onNavigate('course-catalog')}><FaPlus /> Enroll in New Module</div>
          </div>
        </div>

        <div className="social-col">
           <div className="glass-card" style={{ padding: '20px', marginBottom: '25px', border: '1.5px solid var(--accent-color)' }}>
             <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: 'var(--text-primary)', fontWeight: '900' }}><FaCommentDots /> Messenger</h4>
             {userData?.friends?.map(f => (
               <div key={f._id} onClick={() => onOpenChat(f)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', marginBottom: '10px', cursor: 'pointer' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '20px' }}>👨‍💻</span><span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '800' }}>{f.username}</span></div>
                 <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 10px #2ecc71' }}></div>
               </div>
             ))}
           </div>
           <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* ✅ SIDEBAR (Fixed and Working) */}
      <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9998, opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? 'all' : 'none', transition: '0.4s' }} />
      <div style={{ position: 'fixed', top: 0, right: isMenuOpen ? '0' : '-100%', width: '340px', height: '100%', zIndex: 9999, transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)', background: 'var(--bg-body)', borderLeft: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '25px', display: 'flex', justifyContent: 'flex-end' }}><button onClick={() => setIsMenuOpen(false)} style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer' }}><FaTimes size={20} /></button></div>
        <div style={{ padding: '0 40px 40px 40px', textAlign: 'center', borderBottom: '1px solid var(--card-border)' }}><div style={{ fontSize: '70px', marginBottom: '20px' }}>{avatar}</div><h2 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '900' }}>{username}</h2><p style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: '900', textTransform: 'uppercase' }}>Academic Scholar</p></div>
        <div style={{ padding: '30px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* ✅ Fixed Link Strings to match App.jsx Routes */}
          <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="vici-menu-item"><FaUser opacity={0.6} /> Profile Settings</button>
          <button onClick={() => { onNavigate('course-catalog'); setIsMenuOpen(false); }} className="vici-menu-item"><FaBookOpen opacity={0.6} /> Course Catalog</button>
          <button onClick={() => { onNavigate('forum'); setIsMenuOpen(false); }} className="vici-menu-item"><FaUsers opacity={0.6} /> Community</button>
          <button onClick={toggleTheme} className="vici-menu-item">{currentTheme === 'light' ? <FaMoon opacity={0.6} /> : <FaSun opacity={0.6} />} {currentTheme === 'light' ? "Dark Mode" : "Light Mode"}</button>
          <button onClick={onLogout} className="vici-menu-item" style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', color: '#ff4757', padding: '25px 40px' }}><FaSignOutAlt /> Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;