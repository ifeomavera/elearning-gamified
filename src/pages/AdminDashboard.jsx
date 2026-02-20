import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, FaTrash, FaUsers, FaBook, FaComments, 
  FaSignOutAlt, FaChalkboardTeacher, FaSun, FaMoon, FaUserShield, FaSpinner,
  FaMagic, FaBrain, FaEdit, FaSave, FaTimes, FaBan, FaCheck
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminDashboard = ({ onLogout, toggleTheme, currentTheme, role, onOpenChat }) => {
  const isSuperAdmin = role === 'admin';
  const dashboardTitle = isSuperAdmin ? "System Administrator" : "Academic Instructor";

  const [activeTab, setActiveTab] = useState('courses');
  const [generatingId, setGeneratingId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Curriculum State
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('appCourses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newCourse, setNewCourse] = useState({ title: "", module: "", xp: 100, videoId: "" });

  useEffect(() => {
    localStorage.setItem('appCourses', JSON.stringify(courses));
  }, [courses]);

  // Scholar State
  const [students, setStudents] = useState([]);
  const [loadingScholars, setLoadingScholars] = useState(false);

  const fetchScholars = async () => {
    setLoadingScholars(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/users`); 
      const currentUserId = localStorage.getItem('userId');
      // Filter out the logged-in admin from the student list
      const activeScholars = res.data.filter(u => u._id !== currentUserId);
      setStudents(activeScholars);
    } catch (err) {
      console.error("Failed to load scholars:", err);
      toast.error("Cloud sync failed. Displaying cached records.");
    } finally {
      setLoadingScholars(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'students') fetchScholars();
  }, [activeTab]);

  // Forum Mock State (Preserved from your original)
  const [posts] = useState([
    { id: 1, author: "Spam Bot", content: "Buy crypto now!!!", flag: "Spam" },
    { id: 2, author: "TrollMaster", content: "This course is too easy lol", flag: "Behavior" }
  ]);

  // --- ADMIN MODERATION HANDLERS ---
  
  const handleToggleBan = async (username) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.put(`${apiUrl}/api/users/${username}/toggle-ban`);
      toast.success(res.data.message);
      fetchScholars();
    } catch (err) {
      toast.error("Moderation command failed.");
    }
  };

  const handleUpdateStudent = async (username, updatedData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/users/${username}/admin-edit`, updatedData);
      toast.success(`${username}'s record updated.`);
      setEditingStudent(null);
      fetchScholars();
    } catch (err) {
      toast.error("Failed to push update to server.");
    }
  };

  const handleGenerateAIQuiz = async (course) => {
    setGeneratingId(course.id);
    const toastId = toast.loading(`Generating AI Logic for ${course.title}...`);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const lessonContent = `${course.title} within ${course.module}. Focus on core principles and adaptive assessment.`;

      await axios.post(`${apiUrl}/api/quizzes/generate`, {
        lessonId: `lesson-00${course.id}`,
        lessonContent: lessonContent
      });

      toast.success("AI Brain specialized for this module!", { id: toastId });
    } catch (err) {
      toast.error("AI engine temporarily offline.", { id: toastId });
    } finally {
      setGeneratingId(null);
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.videoId) return toast.error("Details incomplete");

    const courseToAdd = {
      id: Date.now(),
      title: newCourse.title,
      module: newCourse.module || "Phase 1",
      xp: parseInt(newCourse.xp),
      videoId: newCourse.videoId,
    };

    setCourses([...courses, courseToAdd]);
    setNewCourse({ title: "", module: "", xp: 100, videoId: "" });
    toast.success("Curriculum Matrix Updated!");
  };

  const handleDeleteCourse = (id) => {
    if(window.confirm("Confirm deletion of this module?")) {
      setCourses(courses.filter(c => c.id !== id));
      toast.success("Module removed from catalog.");
    }
  };

  // --- RENDERING FUNCTIONS ---

  const renderCourses = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Curriculum Management</h2>
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', border: '1.5px solid var(--accent-color)' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Initialize New Lesson</h3>
        <form onSubmit={handleAddCourse} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <input placeholder="Lesson Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={styles.input} />
          <input placeholder="Module Name" value={newCourse.module} onChange={e => setNewCourse({...newCourse, module: e.target.value})} style={styles.input} />
          <input placeholder="YouTube ID" value={newCourse.videoId} onChange={e => setNewCourse({...newCourse, videoId: e.target.value})} style={styles.input} />
          <input type="number" placeholder="XP" value={newCourse.xp} onChange={e => setNewCourse({...newCourse, xp: e.target.value})} style={styles.input} />
          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '12px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <FaPlus /> Deploy to Catalog
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {courses.map(course => (
          <div key={course.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{course.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{course.module} • {course.xp} XP</div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleGenerateAIQuiz(course)} 
                disabled={generatingId === course.id} 
                style={styles.aiBtn}
              >
                {generatingId === course.id ? <FaBrain className="fa-spin" /> : <FaMagic />}
                {generatingId === course.id ? "Analyzing..." : "AI Quiz"}
              </button>
              <button onClick={() => handleDeleteCourse(course.id)} style={styles.deleteBtn}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)' }}>Scholar Ledger</h2>
      <div className="glass-card" style={{ marginTop: '20px', overflowX: 'auto', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>
              <th style={{ padding: '15px' }}>Scholar Identity</th>
              <th style={{ padding: '15px' }}>Dept / Level</th>
              <th style={{ padding: '15px' }}>Academic XP</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingScholars ? (
               <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}><FaSpinner className="fa-spin" style={{ color: 'var(--accent-color)', fontSize: '24px' }} /></td></tr>
            ) : students.map(s => (
              <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', opacity: s.isBanned ? 0.5 : 1 }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: s.isBanned ? '#ff7675' : 'var(--text-primary)' }}>
                    {s.username} {s.isBanned && "(Restricted)"}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.6 }}>{s.email}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  {editingStudent === s._id ? (
                    <input style={styles.editInput} defaultValue={s.major} id={`major-${s._id}`} />
                  ) : (
                    <span>{s.academicLevel} {s.major}</span>
                  )}
                </td>
                <td style={{ padding: '15px', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                  {editingStudent === s._id ? (
                    <input style={styles.editInput} type="number" defaultValue={s.xp} id={`xp-${s._id}`} />
                  ) : (
                    <span>{s.xp?.toLocaleString()} XP</span>
                  )}
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {editingStudent === s._id ? (
                      <>
                        <button onClick={() => handleUpdateStudent(s.username, { 
                          major: document.getElementById(`major-${s._id}`).value,
                          xp: parseInt(document.getElementById(`xp-${s._id}`).value)
                        })} style={{ ...styles.actionBtnIcon, color: '#00b894' }}><FaSave /></button>
                        <button onClick={() => setEditingStudent(null)} style={{ ...styles.actionBtnIcon, color: '#ff7675' }}><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditingStudent(s._id)} style={styles.actionBtnIcon} title="Edit Record"><FaEdit /></button>
                        <button onClick={() => onOpenChat(s)} style={styles.actionBtnIcon} title="Chat"><FaComments /></button>
                        <button 
                          onClick={() => handleToggleBan(s.username)} 
                          style={{ ...styles.actionBtnIcon, color: s.isBanned ? '#00b894' : '#ff7675' }}
                          title={s.isBanned ? "Reactivate" : "Restrict"}
                        >
                          {s.isBanned ? <FaCheck /> : <FaBan />}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderForum = () => (
    <div className="animate-fade">
      <h2 style={{ color: 'var(--text-primary)' }}>Security Center (Forum Control)</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>Review and neutralize flagged community content.</p>
      {posts.map(p => (
        <div key={p.id} className="glass-card" style={{ padding: '20px', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #ff7675' }}>
          <div>
            <span style={{ color: '#ff7675', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}>FLAGGED: {p.flag}</span>
            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '5px' }}>{p.author}</div>
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)' }}>"{p.content}"</p>
          </div>
          <button className="btn-primary" style={{ background: '#ff7675', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Neutralize Post
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-body)' }}>
      {/* SIDEBAR */}
      <div style={{ width: '260px', background: 'rgba(0,0,0,0.15)', borderRight: '1px solid var(--card-border)', padding: '25px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--accent-color)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900' }}>
            {isSuperAdmin ? <FaUserShield /> : <FaChalkboardTeacher />} VICI COMMAND
          </h2>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>{dashboardTitle}</p>
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

      {/* CONTENT AREA */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'forum' && isSuperAdmin && renderForum()}
      </div>
    </div>
  );
};

const styles = {
  input: { padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', outline: 'none' },
  editInput: { padding: '5px 10px', borderRadius: '5px', border: '1px solid var(--accent-color)', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', width: '120px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', borderRadius: '10px', fontWeight: 'bold' },
  activeNav: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px', background: 'var(--accent-color)', borderRadius: '10px', border: 'none', color: 'white', fontWeight: 'bold' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  actionBtnIcon: { background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' },
  deleteBtn: { background: 'transparent', border: '1px solid #ff7675', padding: '8px', borderRadius: '8px', color: '#ff7675', cursor: 'pointer' },
  aiBtn: { background: 'var(--accent-color)', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }
};

export default AdminDashboard;