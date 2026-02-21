import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import ActivityFeed from '../components/ActivityFeed'; 
import SocialInbox from '../components/SocialInbox'; 
import { FaBookOpen, FaPlus, FaChartLine, FaBars, FaCommentDots, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = ({ username, avatar, onNavigate, refreshTrigger, onStartLesson, onOpenChat }) => {
  const [xp, setXP] = useState(0); 
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]); 
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ streak: 0, accuracy: 0 });
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
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
      // ✅ Manual Sort for real-time activity
      setActivities((feedRes.data || []).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      
      const enrolled = coursesRes.data
        .filter(c => userRes.data.enrolledCourses?.includes(String(c._id)))
        .map(c => ({ ...c, completed: userRes.data.completedCourses?.includes(String(c._id)) }));
      setCourses(enrolled);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // ✅ Listens for Enrollment Refresh
  useEffect(() => { fetchUserData(refreshTrigger > 0); }, [username, refreshTrigger]);

  if (loading && xp === 0) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', color: 'var(--text-primary)' }}>Synchronizing Academic Core...</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '15px', background: 'var(--bg-body)' }}>
      <style>{`
        .dashboard-grid { display: grid; grid-template-columns: 280px 1fr 320px; gap: 20px; max-width: 1500px; margin: 0 auto; align-items: start; }
        .enroll-card {
          margin-top: 20px; border: 2.5px dashed var(--accent-color); padding: 30px; 
          border-radius: 20px; color: var(--accent-color); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          font-weight: 800; text-transform: uppercase; transition: 0.3s;
          background: rgba(108, 92, 231, 0.03);
        }
        .enroll-card:hover { background: rgba(108, 92, 231, 0.08); transform: translateY(-3px); }
        @media (max-width: 1200px) { .dashboard-grid { grid-template-columns: 1fr 300px; } .achievements-col { display: none; } }
        @media (max-width: 800px) { .dashboard-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', maxWidth: '1500px', margin: '0 auto 20px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="glass-card" style={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{avatar}</div>
          <div><h1 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', fontWeight: '800' }}>{username}</h1><p style={{ margin: 0, fontSize: '11px', color: 'var(--accent-color)', fontWeight: 'bold' }}>Independent Scholar</p></div>
        </div>
        <button className="glass-card" style={{ padding: '10px', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><FaBars size={20} /></button>
      </header>

      {/* PROGRESS SECTION */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '25px', maxWidth: '1500px', margin: '0 auto 25px auto' }}>
        <XPBar currentXP={xp} level={level} />
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button onClick={() => onNavigate('stats')} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '5px 15px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>OPEN PERFORMANCE ANALYTICS</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="achievements-col">
          <div className="glass-card" style={{ padding: '15px', marginBottom: '20px' }}>
             <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: 'var(--accent-color)', textTransform: 'uppercase' }}>Academic Record</h4>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-primary)' }}><span>Streak</span><b>🔥 {stats.streak} Days</b></div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-primary)', marginTop: '8px' }}><span>Accuracy</span><b>🎯 {stats.accuracy}%</b></div>
          </div>
          <h3 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '10px', fontWeight: '800' }}>Academic Badges</h3>
          {userData?.badges?.map((b, i) => <BadgeCard key={i} name={b} isUnlocked={true} />)}
        </div>

        {/* CENTER COLUMN: ACTIVE CURRICULUM */}
        <div className="center-col">
          <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <FaBookOpen color="var(--accent-color)" /> Active Curriculum
          </h3>
          {courses.map(c => <CourseCard key={c._id} {...c} isCompleted={c.completed} onClick={() => onStartLesson(c)} />)}
          <div className="enroll-card" onClick={() => onNavigate('course-catalog')}><FaPlus /> Enroll in New Module</div>
        </div>

        {/* RIGHT COLUMN: SOCIAL */}
        <div className="social-col">
           <div className="glass-card" style={{ padding: '15px', marginBottom: '20px', border: '1px solid var(--accent-color)' }}>
             <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '800' }}><FaCommentDots /> Messenger</h4>
             {userData?.friends?.map(f => (
               <div key={f._id} onClick={() => onOpenChat(f)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '18px' }}>👨‍💻</span><span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{f.username}</span></div>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 8px #2ecc71' }}></div>
               </div>
             ))}
           </div>
           <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;