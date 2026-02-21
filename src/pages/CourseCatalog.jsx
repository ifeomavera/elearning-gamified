import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaBookOpen, FaPlus, FaSpinner, FaSearch, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const CourseCatalog = ({ username, onNavigate, onEnrollSuccess }) => {
  const [courses, setCourses] = useState([]); 
  const [enrolling, setEnrolling] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const [coursesRes, userRes] = await Promise.all([
          axios.get(`${apiUrl}/api/courses`),
          axios.get(`${apiUrl}/api/users/${username}`)
        ]);
        setCourses(coursesRes.data);
        setEnrolledIds(userRes.data.enrolledCourses || []);
      } catch (err) { toast.error("Cloud catalog offline."); } finally { setLoading(false); }
    };
    fetchData();
  }, [username]);

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/users/${username}/enroll`, { courseId });
      setEnrolledIds([...enrolledIds, String(courseId)]);
      toast.success("Successfully enrolled!");
      
      // ✅ Refresh the Dashboard state before navigating
      if (onEnrollSuccess) onEnrollSuccess();
      setTimeout(() => onNavigate('dashboard'), 800);
    } catch (err) { toast.error("Enrollment failed."); } finally { setEnrolling(null); }
  };

  const filteredCourses = courses
    .filter(c => !enrolledIds.includes(String(c._id)))
    .filter(c => c.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}><FaSpinner className="fa-spin" style={{ color: 'var(--accent-color)', fontSize: '30px' }} /></div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <button onClick={() => onNavigate('dashboard')} style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}><FaArrowLeft /></button>
          <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)' }}><FaBookOpen color="var(--accent-color)" /> VICI Catalog</h1>
        </div>

        <div style={{ marginBottom: '30px', position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search modules..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '16px 20px 16px 45px', borderRadius: '15px', border: '2px solid var(--card-border)', background: 'var(--bg-body)', color: 'var(--text-primary)', outline: 'none' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredCourses.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-border)', borderRadius: '20px', border: '1px dashed var(--accent-color)' }}>
                <FaTrophy size={50} color="#f1c40f" style={{ marginBottom: '15px' }} />
                <h3 style={{ color: 'var(--text-primary)' }}>You've Mastered Every Module!</h3>
                <button onClick={() => onNavigate('dashboard')} style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '15px' }}>Back to HQ</button>
             </div>
          ) : (
            filteredCourses.map(course => (
              <div key={course._id} className="glass-card" style={{ padding: '25px', borderRadius: '20px', background: 'var(--bg-body)', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{course.module} • +{course.xp} XP</span>
                  <h2 style={{ margin: '5px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{course.title}</h2>
                </div>
                <button onClick={() => handleEnroll(course._id)} disabled={enrolling === course._id} style={{ minWidth: '110px', padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--accent-color)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                   {enrolling === course._id ? <FaSpinner className="fa-spin" /> : <><FaPlus /> Enroll</>}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;