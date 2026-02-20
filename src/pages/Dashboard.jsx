import React, { useState, useEffect } from 'react';
import XPBar from '../components/XPBar';
import BadgeCard from '../components/BadgeCard';
import CourseCard from '../components/CourseCard';
import ActivityFeed from '../components/ActivityFeed'; 
import SocialInbox from '../components/SocialInbox'; 
import { 
  FaGraduationCap, FaChartLine, FaTrophy, FaSignOutAlt, 
  FaSun, FaMoon, FaUsers, FaBars, FaTimes, FaUser, 
  FaCompass, FaBookOpen, FaPlus, FaFire, FaUniversity, FaFlagCheckered, FaCommentDots
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ALL_COURSES = [
  { id: 1, title: "Intro to Software Engineering", module: "Module 1", xp: 50, videoId: "zOjov-2OZ0E" },
  { id: 2, title: "Requirement Gathering", module: "Module 2", xp: 100, videoId: "9K7g8k5_xIQ" },
  { id: 3, title: "Gamification Logic", module: "Module 3", xp: 150, videoId: "m2uxP-kZk24" },
];

const Dashboard = ({ username, avatar, onNavigate, onLogout, toggleTheme, currentTheme, onStartLesson, onOpenChat }) => {
  const [userData, setUserData] = useState(null); 
  const [xp, setXP] = useState(0); 
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activities, setActivities] = useState([]); 
  const [courses, setCourses] = useState([]);
  
  // ✅ NEW: Added stats state to track live streak and accuracy
  const [stats, setStats] = useState({ streak: 0, accuracy: 0 });

  const [academicLevel, setAcademicLevel] = useState("Lvl 100"); 
  const [major, setMajor] = useState("Scholar");

  const [badges, setBadges] = useState([
    { id: 1, name: "Early Bird", description: "Earn 1000 XP total", isUnlocked: false },
    { id: 2, name: "Quiz Master", description: "Reach 2500 XP to unlock!", isUnlocked: false },
    { id: 3, name: "Scholar", description: "Complete Module 1", isUnlocked: false }
  ]);

  const fetchUserData = async () => {
    if (xp === 0) setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // ✅ PARALLEL FETCH: Gets profile and live analytics at once
      const [profileRes, statsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/users/${username}`),
        axios.get(`${apiUrl}/api/users/${username}/stats`)
      ]);

      const data = profileRes.data;
      const liveStats = statsRes.data;
      
      setUserData(data); 
      setXP(data.xp || 0);
      setLevel(data.level || 1);
      setStats(liveStats); // ✅ Syncs real streak and accuracy from the engine
      
      setMajor(data.major || "Independent Learner"); 
      setAcademicLevel(data.academicLevel || "Beginner");

      const userBadges = data.badges || [];
      const userCoursesCompleted = data.completedCourses || [];
      const userEnrolled = data.enrolledCourses || []; 

      // Fetch Global Activity Feed
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

  useEffect(() => {
    fetchUserData();
  }, [username]);

  if (loading && xp === 0) {
    return (
      <div style={{ height: '100dvh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        `}</style>
        <div style={{ width: '50px', height: '50px', border: '5px solid var(--card-border)', borderTop: '5px solid var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' }}></div>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', animation: 'pulse 1.5s ease-in-out infinite' }}>Syncing Academic Progress...</h3>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '15px', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-body)' }}>
      
      <style>{`
        .vici-sidebar { background: var(--bg-body) !important; box-shadow: -10px 0 40px rgba(0,0,0,0.3) !important; border-left: 1px solid var(--card-border) !important; }
        .vici-menu-item { display: flex; align-items: center; gap: 15px; width: 100%; padding: 14px 30px; background: transparent; border: none; color: var(--text-primary); font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
        .vici-menu-item:hover { background: var(--card-border); color: var(--accent-color); padding-left: 35px; }
        .vici-menu-item:hover::before { content: ''; position: absolute; left: 0; top: 20%; height: 60%; width: 4px; background: var(--accent-color); border-radius: 0 4px 4px 0; box-shadow: 0 0 10px var(--accent-color); }
        .vici-sign-out { color: #ff4757 !important; border-top: 1px solid var(--card-border) !important; margin-top: auto; padding-top: 20px !important; margin-bottom: 20px; }
        .add-course-btn { margin-top: 10px; background: transparent; border: 2px dashed var(--card-border); color: var(--text-secondary); padding: 15px; border-radius: 12px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease; width: 100%; font-size: 14px; font-family: inherit; }
        .add-course-btn:hover { border-color: var(--accent-color); color: var(--accent-color); background: rgba(108, 92, 231, 0.05); }
        .dashboard-grid { display: grid; grid-template-columns: 280px 1fr 320px; gap: 20px; align-items: start; }
        .messenger-item { display: flex; align-items: center; justify-content: space-between; padding: 10px; border-radius: 12px; cursor: pointer; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--card-border); transition: all 0.2s ease; margin-bottom: 8px; }
        .messenger-item:hover { background: rgba(108, 92, 231, 0.1); transform: translateX(5px); border-color: var(--accent-color); }
        @media (max-width: 1200px) { .dashboard-grid { grid-template-columns: 250px 1fr; } .activity-column { grid-column: span 2; } }
        @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } .achievements-column { order: 2; } .courses-column { order: 1; } .activity-column { order: 3; grid-column: span 1; } .header-text h1 { font-size: 18px !important; } }
      `}</style>

      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="glass-card" onClick={() => onNavigate('profile')} style={{ fontSize: '22px', cursor: 'pointer', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              {avatar || "👨‍💻"}
            </div>
            <div className="header-text">
              <h1 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>{username}</h1>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                {academicLevel} {major}
              </p>
            </div>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="glass-card" style={{ padding: '8px', cursor: 'pointer', border: 'none', color: 'var(--text-primary)', borderRadius: '10px' }}>
            <FaBars size={18} />
          </button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
          <div className="glass-card xp-section" style={{ padding: '15px' }}>
            <XPBar currentXP={xp} level={level} />
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <button onClick={() => onNavigate('stats')} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '5px 12px', borderRadius: '15px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                <FaChartLine /> Academic Stats
              </button>
            </div>
          </div>

          <div onClick={() => onNavigate('hall-of-fame')} className="glass-card" style={{ padding: '12px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid var(--accent-color)' }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <FaTrophy size={20} color="#f1c40f" />
              <h3 style={{margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: '700'}}>Academic Hall of Fame</h3>
            </div>
            <span style={{fontWeight: 'bold', fontSize: '11px', background: 'var(--accent-color)', color: '#fff', padding: '6px 12px', borderRadius: '15px'}}>View Rankings &rarr;</span>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="achievements-column">
            <div className="glass-card" style={{ padding: '18px', marginBottom: '20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--card-border)' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Student Record</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Attendance Streak</span>
                  {/* ✅ SYNCED: Now displays the actual calculated streak from the backend */}
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 'bold' }}>🔥 {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '10px', marginTop: '5px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Dept / Focus</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{major}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <FaTrophy color="#e17055" size={16} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800' }}>Academic Badges</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {badges.map(badge => <BadgeCard key={badge.id} {...badge} />)}
            </div>
          </div>

          <div className="courses-column">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <FaGraduationCap color="var(--accent-color)" size={18} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800' }}>My Enrolled Courses</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {courses.length > 0 ? (
                <>
                  {courses.map(course => (
                    <CourseCard key={course.id} {...course} isCompleted={course.completed} onClick={() => onStartLesson(course)} />
                  ))}
                  <button onClick={() => onNavigate('course-catalog')} className="add-course-btn">
                    <FaPlus /> Enroll in New Course
                  </button>

                  <div className="glass-card" style={{ marginTop: '20px', padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid var(--card-border)', position: 'relative', overflow: 'hidden' }}>
                    <FaFlagCheckered style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '80px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ background: 'var(--accent-color)', padding: '8px', borderRadius: '10px', color: '#fff' }}>
                        <FaTrophy size={14} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>Graduation Milestone</h4>
                    </div>
                    <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Complete your primary curriculum to advance to the next level.</p>
                  </div>
                </>
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--card-border)', borderRadius: '15px', border: `1px dashed var(--text-secondary)`, opacity: 0.8 }}>
                  <FaCompass size={30} color="var(--text-secondary)" style={{ margin: '0 auto 10px auto' }} />
                  <p style={{ color: 'var(--text-primary)', marginBottom: '15px', fontWeight: 'bold' }}>Academic Course Log is empty.</p>
                  <button onClick={() => onNavigate('course-catalog')} style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Open Course Catalog</button>
                </div>
              )}
            </div>
          </div>

          <div className="activity-column">
            <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', borderRadius: '20px', border: '1.5px solid var(--accent-color)', background: 'rgba(108, 92, 231, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <FaCommentDots color="var(--accent-color)" />
                <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: '800' }}>Messenger</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {userData?.friends?.length > 0 ? (
                  userData.friends.map(friend => (
                    <div 
                      key={friend._id || friend.username} 
                      onClick={() => {
                        if (friend && (friend._id || friend.id)) {
                            onOpenChat(friend);
                        } else {
                            toast.error("Peer identity data incomplete.");
                        }
                      }} 
                      className="messenger-item"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>👨‍💻</span>
                        <div>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{friend.username}</p>
                          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>{friend.academicLevel || 'Lvl 100'} {friend.major || 'Scholar'}</p>
                        </div>
                      </div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71' }}></div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', margin: '10px 0' }}>Connect with peers to chat.</p>
                )}
              </div>
            </div>

            <SocialInbox username={username} friendRequests={userData?.friendRequests || []} onRefresh={fetchUserData} />
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>

      <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9998, opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? 'all' : 'none', transition: 'opacity 0.4s ease' }} />
      
      <div className="vici-sidebar sidebar-mobile" style={{ position: 'fixed', top: 0, right: isMenuOpen ? '0' : '-100%', width: '320px', height: '100%', zIndex: 9999, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes size={18} /></button>
        </div>
        
        <div style={{ padding: '0 30px 30px 30px', textAlign: 'center', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>{avatar || "👨‍💻"}</div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: '800', marginBottom: '5px' }}>{username}</h2>
          <div style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '900', textTransform: 'uppercase' }}>{academicLevel} {major} Student</div>
        </div>
        
        <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="vici-menu-item"><FaUser opacity={0.6} /> Profile Settings</button>
          <button onClick={() => { onNavigate('course-catalog'); setIsMenuOpen(false); }} className="vici-menu-item"><FaBookOpen opacity={0.6} /> Course Catalog</button>
          <button onClick={() => { onNavigate('forum'); setIsMenuOpen(false); }} className="vici-menu-item"><FaUsers opacity={0.6} /> Community</button>
          <button onClick={() => { onNavigate('credits'); setIsMenuOpen(false); }} className="vici-menu-item"><FaUniversity opacity={0.6} /> Project Credits</button>
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