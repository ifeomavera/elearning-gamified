import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaUsers, FaBook, FaComments, FaSignOutAlt, FaChalkboardTeacher, FaSun, FaMoon } from 'react-icons/fa';

const AdminDashboard = ({ onLogout, showToast, toggleTheme, currentTheme }) => {
  const [activeTab, setActiveTab] = useState('courses');
  
  // --- 1. COURSE STATE (Synced with LocalStorage) ---
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
    { id: 1, name: "Masade Paul", email: "paul@babcock.edu.ng", role: "Student", xp: 2350, status: "Active" },
    { id: 2, name: "Ezeka Ifeoma", email: "ifeoma@babcock.edu.ng", role: "Student", xp: 1850, status: "Active" },
    { id: 3, name: "Test User", email: "test@gmail.com", role: "Student", xp: 500, status: "Inactive" },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, author: "Test User", content: "I hate this course!", flag: "Inappropriate" },
    { id: 2, author: "Spam Bot", content: "Buy crypto now!!!", flag: "Spam" },
  ]);

  // --- 3. HANDLERS ---
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.videoId) return showToast("Please fill all fields", "error");

    const courseToAdd = {
      id: Date.now(),
      title: newCourse.title,
      module: newCourse.module || "New Module",
      xp: parseInt(newCourse.xp),
      videoId: newCourse.videoId,
      completed: false
    };

    setCourses([...courses, courseToAdd]);
    setNewCourse({ title: "", module: "", xp: 100, videoId: "" });
    showToast("Course published successfully!", "success");
  };

  const handleDeleteCourse = (id) => {
    if(window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(c => c.id !== id));
      showToast("Course deleted.", "info");
    }
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
    showToast("Post removed.", "success");
  };

  // --- 4. RENDERERS ---
  const renderCourses = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Manage Curriculum</h2>
      
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text-secondary)' }}>Add New Lesson</h3>
        <form onSubmit={handleAddCourse} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <input 
            placeholder="Lesson Title (e.g. Intro to React)" 
            value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})}
            style={styles.input}
          />
          <input 
            placeholder="Module Name (e.g. Module 4)" 
            value={newCourse.module} onChange={e => setNewCourse({...newCourse, module: e.target.value})}
            style={styles.input}
          />
          <input 
            placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" 
            value={newCourse.videoId} onChange={e => setNewCourse({...newCourse, videoId: e.target.value})}
            style={styles.input}
          />
          <input 
            type="number" placeholder="XP Reward (e.g. 150)" 
            value={newCourse.xp} onChange={e => setNewCourse({...newCourse, xp: e.target.value})}
            style={styles.input}
          />
          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '12px' }}>
            <FaPlus /> Publish Course
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {courses.map(course => (
          <div key={course.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{course.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{course.module} • <span style={{color: 'var(--accent-color)'}}>{course.xp} XP</span></div>
            </div>
            <button onClick={() => handleDeleteCourse(course.id)} style={{ background: '#ff7675', border: 'none', padding: '8px 12px', borderRadius: '5px', color: 'white', cursor: 'pointer' }}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)' }}>Registered Students</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', color: 'var(--text-secondary)' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>XP</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '15px 10px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{student.name}</td>
              <td style={{ padding: '15px 10px' }}>{student.email}</td>
              <td style={{ padding: '15px 10px', color: 'var(--accent-color)' }}>{student.xp}</td>
              <td style={{ padding: '15px 10px' }}>
                <span style={{ background: 'rgba(0,184,148,0.2)', color: '#00b894', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{student.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderForum = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)' }}>Forum Moderation</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Review reported posts.</p>
      {posts.map(post => (
        <div key={post.id} className="glass-card" style={{ padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#ff7675', fontWeight: 'bold', fontSize: '12px' }}>Flagged: {post.flag}</div>
            <div style={{ color: 'var(--text-primary)', marginTop: '5px' }}>"{post.content}"</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>By: {post.author}</div>
          </div>
          <button onClick={() => handleDeletePost(post.id)} style={{ background: '#ff7675', border: 'none', padding: '8px 12px', borderRadius: '5px', color: 'white', cursor: 'pointer' }}>
            <FaTrash /> Remove
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-head)' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '250px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid var(--card-border)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaChalkboardTeacher /> Admin
        </h2>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('courses')} style={activeTab === 'courses' ? styles.activeNav : styles.navBtn}>
            <FaBook /> Manage Courses
          </button>
          <button onClick={() => setActiveTab('students')} style={activeTab === 'students' ? styles.activeNav : styles.navBtn}>
            <FaUsers /> Students
          </button>
          <button onClick={() => setActiveTab('forum')} style={activeTab === 'forum' ? styles.activeNav : styles.navBtn}>
            <FaComments /> Forum
          </button>
        </nav>

        {/* BOTTOM ACTIONS */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* THEME TOGGLE - HIGH CONTRAST */}
          <button 
            onClick={toggleTheme} 
            style={{ 
              ...styles.navBtn, 
              // FORCE BLACK BACKGROUND IN LIGHT MODE, WHITE IN DARK MODE
              background: currentTheme === 'light' ? '#2d3436' : '#dfe6e9', 
              color: currentTheme === 'light' ? '#ffffff' : '#2d3436', 
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {currentTheme === 'light' ? <FaMoon /> : <FaSun color="#e67e22" />}
            {currentTheme === 'light' ? "Go Dark" : "Go Light"}
          </button>

          {/* LOGOUT BUTTON - RED */}
          <button 
            onClick={onLogout} 
            style={{ 
              ...styles.navBtn, 
              background: '#ff7675', 
              color: 'white', 
              justifyContent: 'center',
              fontWeight: 'bold',
              border: 'none',
              boxShadow: '0 4px 6px rgba(255, 118, 117, 0.3)'
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'forum' && renderForum()}
      </div>
    </div>
  );
};

const styles = {
  input: { padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', outline: 'none' },
  navBtn: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', fontSize: '15px', transition: '0.2s', borderRadius: '8px' },
  activeNav: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 15px', background: 'var(--accent-color)', borderRadius: '8px', border: 'none', color: '#1e1e2e', cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: 'bold' }
};

export default AdminDashboard;