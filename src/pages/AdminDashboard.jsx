import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa';

// UPDATED: Now accepts 'onLogout'
const AdminDashboard = ({ showToast, onLogout }) => {
  
  // 1. Load existing courses
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('appCourses');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ title: '', module: '', xp: 100, videoId: '' });

  // 2. Save to "Database"
  useEffect(() => {
    localStorage.setItem('appCourses', JSON.stringify(courses));
  }, [courses]);

  // 3. Handle Adding
  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.videoId) return showToast("Please fill details", "error");

    const newCourse = {
      id: Date.now(),
      ...form,
      completed: false
    };

    setCourses([...courses, newCourse]);
    setForm({ title: '', module: '', xp: 100, videoId: '' });
    showToast("Course Uploaded Successfully!", "success");
  };

  // 4. Handle Deleting
  const handleDelete = (id) => {
    if(window.confirm("Delete this course?")) {
      setCourses(courses.filter(c => c.id !== id));
      showToast("Course deleted", "info");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: '"Segoe UI", sans-serif' }}>
      
      {/* HEADER WITH LOGOUT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2d3436', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <FaChalkboardTeacher /> Instructor Panel
        </h1>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={onLogout}
          style={{
            background: 'white', border: '1px solid #ff7675', color: '#ff7675',
            padding: '8px 15px', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* UPLOAD FORM */}
      <div style={styles.card}>
        <h3 style={{ marginTop: 0, color: '#2d3436' }}>Upload New Module</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '15px' }}>
          <input 
            placeholder="Module Name (e.g. Module 4)" 
            value={form.module} 
            onChange={e => setForm({...form, module: e.target.value})}
            style={styles.input}
          />
          <input 
            placeholder="Course Title (e.g. Advanced React)" 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})}
            style={styles.input}
          />
          <input 
            placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" 
            value={form.videoId} 
            onChange={e => setForm({...form, videoId: e.target.value})}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            <FaPlus /> Publish Course
          </button>
        </form>
      </div>

      {/* MANAGE COURSES */}
      <h3 style={{ color: '#636e72' }}>Manage Active Content</h3>
      <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        {courses.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#b2bec3' }}>No courses uploaded yet.</div>
        ) : (
          courses.map(course => (
            <div key={course.id} style={styles.item}>
              <div>
                <strong style={{ color: '#0984e3' }}>{course.module}</strong>
                <span style={{ margin: '0 10px', color: '#dfe6e9' }}>|</span>
                {course.title}
              </div>
              <button onClick={() => handleDelete(course.id)} style={styles.deleteBtn}>
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  card: { background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '40px' },
  input: { padding: '12px', borderRadius: '5px', border: '1px solid #dfe6e9', width: '100%', boxSizing: 'border-box', fontSize: '14px' },
  button: { padding: '12px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '14px' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid #f1f2f6', alignItems: 'center' },
  deleteBtn: { background: '#ff7675', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default AdminDashboard;