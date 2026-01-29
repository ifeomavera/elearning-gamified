import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';

// 1. Accept 'showToast' as a prop
const AdminDashboard = ({ showToast }) => {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('appCourses');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ title: '', module: '', xp: 100, videoId: '' });

  useEffect(() => {
    localStorage.setItem('appCourses', JSON.stringify(courses));
  }, [courses]);

  const handleAdd = (e) => {
    e.preventDefault();
    // REPLACE ALERT WITH TOAST (Error)
    if (!form.title || !form.videoId) return showToast("Please fill in all details", "error");

    const newCourse = {
      id: Date.now(),
      ...form,
      completed: false
    };

    setCourses([...courses, newCourse]);
    setForm({ title: '', module: '', xp: 100, videoId: '' });
    
    // REPLACE ALERT WITH TOAST (Success)
    showToast("Course Uploaded Successfully!", "success");
  };

  // ... (rest of the file stays the same)

  // 4. Handle Deleting a Course
  const handleDelete = (id) => {
    if(window.confirm("Delete this course?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2d3436', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaChalkboardTeacher /> Instructor Panel
      </h1>

      {/* UPLOAD FORM */}
      <div style={styles.card}>
        <h3>Upload New Module</h3>
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
      <h3>Manage Content</h3>
      {courses.map(course => (
        <div key={course.id} style={styles.item}>
          <div>
            <strong>{course.module}</strong>: {course.title}
          </div>
          <button onClick={() => handleDelete(course.id)} style={styles.deleteBtn}>
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #dfe6e9', width: '96%' },
  button: { padding: '12px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'white', borderBottom: '1px solid #dfe6e9', alignItems: 'center' },
  deleteBtn: { background: '#ff7675', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminDashboard;