import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaTrash, FaUsers, FaBook, FaComments, 
  FaSignOutAlt, FaChalkboardTeacher, FaSun, FaMoon, FaUserShield 
} from 'react-icons/fa';

const AdminDashboard = ({ onLogout, showToast, toggleTheme, currentTheme, role }) => {
  // --- ROLE CHECK ---
  const isSuperAdmin = role === 'admin';
  const dashboardTitle = isSuperAdmin ? "System Administrator" : "Academic Instructor";

  // Default tab based on role
  const [activeTab, setActiveTab] = useState('courses');
  
  // --- 1. COURSE STATE (Synced with LocalStorage for now) ---
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('appCourses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newCourse, setNewCourse] = useState({ title: "", module: "", xp: 100, videoId: "" });

  useEffect(() => {
    localStorage.setItem('appCourses', JSON.stringify(courses));
  }, [courses]);

  // --- 2. MOCK DATA ---
  const [students] = useState([
    { id: 1, name: "Masade Paul", email: "paul@babcock.edu.ng", major: "Software Engineering", xp: 2350, status: "Active" },
    { id: 2, name: "Ezeka Ifeoma", email: "ifeoma@babcock.edu.ng", major: "Software Engineering", xp: 1850, status: "Active" },
    { id: 3, name: "External User", email: "test@gmail.com", major: "Cybersecurity", xp: 500, status: "Inactive" },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, author: "Spam Bot", content: "Buy crypto now!!!", flag: "Spam" },
  ]);

  // --- 3. HANDLERS ---
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.videoId) return showToast("Mission details incomplete", "error");

    const courseToAdd = {
      id: Date.now(),
      title: newCourse.title,
      module: newCourse.module || "General",
      xp: parseInt(newCourse.xp),
      videoId: newCourse.videoId,
    };

    setCourses([...courses, courseToAdd]);
    setNewCourse({ title: "", module: "", xp: 100, videoId: "" });
    showToast("Curriculum Updated!", "success");
  };

  const handleDeleteCourse = (id) => {
    if(window.confirm("Confirm course deletion?")) {
      setCourses(courses.filter(c => c.id !== id));
      showToast("Course removed.", "info");
    }
  };

  // --- 4. RENDERERS ---
  const renderCourses = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Curriculum Management</h2>
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', border: '1px solid var(--accent-color)' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>INITIALIZE NEW LESSON</h3>
        <form onSubmit={handleAddCourse} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <input placeholder="Lesson Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={styles.input} />
          <input placeholder="Module (e.g. Phase 1)" value={newCourse.module} onChange={e => setNewCourse({...newCourse, module: e.target.value})} style={styles.input} />
          <input placeholder="YouTube ID" value={newCourse.videoId} onChange={e => setNewCourse({...newCourse, videoId: e.target.value})} style={styles.input} />
          <input type="number" placeholder="XP Reward" value={newCourse.xp} onChange={e => setNewCourse({...newCourse, xp: e.target.value})} style={styles.input} />
          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '12px' }}>
            <FaPlus /> Deploy to Catalog
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {courses.map(course => (
          <div key={course.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{course.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{course.module} • <span style={{color: 'var(--accent-color)'}}>{course.xp} XP</span></div>
            </div>
            <button onClick={() => handleDeleteCourse(course.id)} style={{ background: 'transparent', border: '1px solid #ff7675', padding: '8px', borderRadius: '5px', color: '#ff7675', cursor: 'pointer' }}>
              <FaTrash />
            </button>
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
              <th style={{ padding: '15px' }}>Name</th>
              <th style={{ padding: '15px' }}>Dept / Focus</th>
              <th style={{ padding: '15px' }}>Current XP</th>
              <th style={{ padding: '15px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '15px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{student.name}</td>
                <td style={{ padding: '15px' }}>{student.major}</td>
                <td style={{ padding: '15px', color: 'var(--accent-color)' }}>{student.xp}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ background: 'rgba(0,184,148,0.1)', color: '#00b894', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>{student.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', background: 'rgba(0,0,0,0.1)', borderRight: '1px solid var(--card-border)', padding: '25px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--accent-color)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            {isSuperAdmin ? <FaUserShield /> : <FaChalkboardTeacher />} VICI COMMAND
          </h2>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>{dashboardTitle}</p>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveTab('courses')} style={activeTab === 'courses' ? styles.activeNav : styles.navBtn}>
            <FaBook /> Curriculum
          </button>
          <button onClick={() => setActiveTab('students')} style={activeTab === 'students' ? styles.activeNav : styles.navBtn}>
            <FaUsers /> Students
          </button>
          
          {/* ✅ CONDITIONAL: Forum only for Super Admins */}
          {isSuperAdmin && (
            <button onClick={() => setActiveTab('forum')} style={activeTab === 'forum' ? styles.activeNav : styles.navBtn}>
              <FaComments /> Forum Control
            </button>
          )}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={toggleTheme} className="glass-card" style={{ ...styles.actionBtn, background: 'var(--card-border)', color: 'var(--text-primary)' }}>
            {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#f1c40f" />} {currentTheme === 'light' ? "Dark Mode" : "Light Mode"}
          </button>
          <button onClick={onLogout} style={{ ...styles.actionBtn, background: '#ff7675', color: 'white', border: 'none' }}>
            <FaSignOutAlt /> Abort Session
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'forum' && isSuperAdmin && (
          <div className="animate-fade">
            <h2 style={{ color: 'var(--text-primary)' }}>Forum Security</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Review and neutralize flagged communications.</p>
            {posts.map(post => (
              <div key={post.id} className="glass-card" style={{ padding: '20px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: '#ff7675', fontSize: '10px', fontWeight: 'bold' }}>FLAGGED: {post.flag}</span>
                  <p style={{ color: 'var(--text-primary)', margin: '5px 0' }}>"{post.content}"</p>
                  <span style={{ fontSize: '11px', opacity: 0.6 }}>Origin: {post.author}</span>
                </div>
                <button className="btn-primary" style={{ background: '#ff7675' }}><FaTrash /> Neutralize</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  input: { padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', fontSize: '14px', borderRadius: '10px', transition: '0.2s' },
  activeNav: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px', background: 'var(--accent-color)', borderRadius: '10px', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }
};

export default AdminDashboard;