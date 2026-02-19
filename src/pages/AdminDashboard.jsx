import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, FaTrash, FaUsers, FaBook, FaComments, 
  FaSignOutAlt, FaChalkboardTeacher, FaSun, FaMoon, FaUserShield, FaSpinner 
} from 'react-icons/fa';

const AdminDashboard = ({ onLogout, showToast, toggleTheme, currentTheme, role, onOpenChat }) => {
  // --- ROLE LOGIC ---
  const isSuperAdmin = role === 'admin';
  const dashboardTitle = isSuperAdmin ? "System Administrator" : "Academic Instructor";

  const [activeTab, setActiveTab] = useState('courses');
  
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('appCourses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newCourse, setNewCourse] = useState({ title: "", module: "", xp: 100, videoId: "" });

  useEffect(() => {
    localStorage.setItem('appCourses', JSON.stringify(courses));
  }, [courses]);

  // --- DYNAMIC SCHOLAR DATA ---
  const [students, setStudents] = useState([]);
  const [loadingScholars, setLoadingScholars] = useState(false);

  // ✅ NEW: Fetch real scholars from the database
  useEffect(() => {
    const fetchScholars = async () => {
      if (activeTab !== 'students') return; // Only fetch when viewing the tab
      
      setLoadingScholars(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Assuming you have a route to get all users. If not, use your search route with an empty or generic query
        const res = await axios.get(`${apiUrl}/api/users`); 
        
        // Filter out the current admin so you don't message yourself
        const currentUserId = localStorage.getItem('userId');
        const activeScholars = res.data.filter(u => u._id !== currentUserId);
        
        setStudents(activeScholars);
      } catch (err) {
        console.error("Failed to load scholars:", err);
        // Fallback dummy data if the API fails during testing
        setStudents([
          { _id: "65c8a1", username: "Masade Paul", email: "paul@babcock.edu.ng", major: "Software Engineering", xp: 2350 },
          { _id: "65c8b2", username: "Ezeka Ifeoma", email: "ifeoma@babcock.edu.ng", major: "Computer Science", xp: 1850 },
        ]);
      } finally {
        setLoadingScholars(false);
      }
    };

    fetchScholars();
  }, [activeTab]);

  const [posts] = useState([
    { id: 1, author: "Spam Bot", content: "Buy crypto now!!!", flag: "Spam" },
  ]);

  // --- HANDLERS ---
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.videoId) return showToast ? showToast("Details incomplete", "error") : alert("Details incomplete");

    const courseToAdd = {
      id: Date.now(),
      title: newCourse.title,
      module: newCourse.module || "Phase 1",
      xp: parseInt(newCourse.xp),
      videoId: newCourse.videoId,
    };

    setCourses([...courses, courseToAdd]);
    setNewCourse({ title: "", module: "", xp: 100, videoId: "" });
    if(showToast) showToast("Curriculum Updated!", "success");
  };

  const handleDeleteCourse = (id) => {
    if(window.confirm("Confirm deletion?")) {
      setCourses(courses.filter(c => c.id !== id));
      if(showToast) showToast("Course removed.", "info");
    }
  };

  // --- RENDERERS ---
  const renderCourses = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Curriculum Management</h2>
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', border: '1px solid var(--accent-color)' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Initialize New Lesson</h3>
        <form onSubmit={handleAddCourse} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <input placeholder="Lesson Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={styles.input} />
          <input placeholder="Module Name" value={newCourse.module} onChange={e => setNewCourse({...newCourse, module: e.target.value})} style={styles.input} />
          <input placeholder="YouTube ID" value={newCourse.videoId} onChange={e => setNewCourse({...newCourse, videoId: e.target.value})} style={styles.input} />
          <input type="number" placeholder="XP" value={newCourse.xp} onChange={e => setNewCourse({...newCourse, xp: e.target.value})} style={styles.input} />
          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '12px' }}><FaPlus /> Deploy to Catalog</button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {courses.map(course => (
          <div key={course.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{course.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{course.module} • {course.xp} XP</div>
            </div>
            <button onClick={() => handleDeleteCourse(course.id)} style={styles.deleteBtn}><FaTrash /></button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)' }}>Scholar Directory</h2>
      <div className="glass-card" style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>
              <th style={{ padding: '15px' }}>Scholar</th>
              <th style={{ padding: '15px' }}>Dept / Focus</th>
              <th style={{ padding: '15px' }}>XP</th>
              <th style={{ padding: '15px' }}>Comms</th>
            </tr>
          </thead>
          <tbody>
            {loadingScholars ? (
               <tr>
                 <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                   <FaSpinner className="fa-spin" style={{ color: 'var(--accent-color)', fontSize: '24px' }} />
                 </td>
               </tr>
            ) : students.length > 0 ? (
              students.map(student => (
                <tr key={student._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '15px' }}>
                    {/* ✅ DYNAMIC FIELDS */}
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{student.username}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>{student.email}</div>
                  </td>
                  <td style={{ padding: '15px' }}>{student.major || 'Independent Learner'}</td>
                  <td style={{ padding: '15px', color: 'var(--accent-color)', fontWeight: 'bold' }}>{student.xp || 0}</td>
                  <td style={{ padding: '15px' }}>
                    <button 
                      onClick={() => onOpenChat({ _id: student._id, username: student.username })} 
                      style={styles.chatBtn}
                    >
                      <FaComments /> Message
                    </button>
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                 <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No scholars found in the database.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <div style={{ width: '260px', background: 'rgba(0,0,0,0.1)', borderRight: '1px solid var(--card-border)', padding: '25px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--accent-color)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isSuperAdmin ? <FaUserShield /> : <FaChalkboardTeacher />} VICI COMMAND
          </h2>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{dashboardTitle}</p>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveTab('courses')} style={activeTab === 'courses' ? styles.activeNav : styles.navBtn}><FaBook /> Curriculum</button>
          <button onClick={() => setActiveTab('students')} style={activeTab === 'students' ? styles.activeNav : styles.navBtn}><FaUsers /> Scholars</button>
          {isSuperAdmin && (
            <button onClick={() => setActiveTab('forum')} style={activeTab === 'forum' ? styles.activeNav : styles.navBtn}><FaComments /> Forum Control</button>
          )}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={toggleTheme} className="glass-card" style={styles.actionBtn}>
            {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#f1c40f" />} Theme
          </button>
          <button onClick={onLogout} style={{ ...styles.actionBtn, background: '#ff7675', color: 'white', border: 'none' }}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'forum' && isSuperAdmin && (
          <div className="animate-fade">
            <h2 style={{ color: 'var(--text-primary)' }}>Security Center</h2>
            {posts.map(p => (
              <div key={p.id} className="glass-card" style={{ padding: '20px', marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <div><span style={{ color: '#ff7675', fontWeight: 'bold', fontSize: '10px' }}>FLAGGED: {p.flag}</span><p>"{p.content}"</p></div>
                <button className="btn-primary" style={{ background: '#ff7675' }}>Neutralize</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  input: { padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', outline: 'none' },
  navBtn: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', borderRadius: '10px' },
  activeNav: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px', background: 'var(--accent-color)', borderRadius: '10px', border: 'none', color: 'white', fontWeight: 'bold' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  chatBtn: { background: 'rgba(108, 92, 231, 0.1)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  deleteBtn: { background: 'transparent', border: '1px solid #ff7675', padding: '8px', borderRadius: '5px', color: '#ff7675', cursor: 'pointer' }
};

export default AdminDashboard;