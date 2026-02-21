import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaBookOpen, FaPlus, FaCheck, FaSpinner, FaSearch, FaRegFrown, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const CourseCatalog = ({ username, onNavigate }) => {
  const [courses, setCourses] = useState([]); // ✅ Replaces ALL_COURSES array
  const [enrolling, setEnrolling] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ 1. Fetch dynamic courses AND user enrollments from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch both the catalog and the user's current profile
        const [coursesRes, userRes] = await Promise.all([
          axios.get(`${apiUrl}/api/courses`),
          axios.get(`${apiUrl}/api/users/${username}`)
        ]);

        setCourses(coursesRes.data);
        setEnrolledIds(userRes.data.enrolledCourses || []);
      } catch (err) {
        console.error("Failed to fetch catalog data", err);
        toast.error("Cloud catalog offline.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/users/${username}/enroll`, { courseId });
      
      // Add the MongoDB _id to state so it vanishes from the catalog
      setEnrolledIds([...enrolledIds, String(courseId)]);
      toast.success("Successfully enrolled!");
      
      setTimeout(() => {
        onNavigate('dashboard');
      }, 800);

    } catch (err) {
      console.error("Enrollment failed:", err);
      toast.error(err.response?.data || "Enrollment failed.");
    } finally {
      setEnrolling(null);
    }
  };

  // ✅ 2. The Smart Filter Engine (Using MongoDB _id)
  // First, remove courses the user is already enrolled in.
  const availableCourses = courses.filter(course => !enrolledIds.includes(String(course._id)));
  
  // Then, apply the search bar filter to what's left.
  const filteredCourses = availableCourses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.module?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
        <FaSpinner className="fa-spin" style={{ color: 'var(--accent-color)', fontSize: '30px' }} />
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', minHeight: '100vh', padding: '20px', 
      background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', alignItems: 'center' 
    }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
          <button 
            onClick={() => onNavigate('dashboard')}
            style={{ 
              background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', 
              width: '40px', height: '40px', borderRadius: '50%', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >
            <FaArrowLeft />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaBookOpen color="var(--accent-color)" /> Course Catalog
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Select modules to add to your learning backpack.</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {availableCourses.length > 0 && (
          <div style={{ marginBottom: '30px', position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', 
              color: 'var(--text-secondary)', fontSize: '16px' 
            }} />
            <input
              type="text"
              placeholder="Search available modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '16px 20px 16px 45px', borderRadius: '15px',
                border: '2px solid var(--card-border)', background: 'var(--bg-body)',
                color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)', fontFamily: 'inherit',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--card-border)'}
            />
          </div>
        )}

        {/* Course List & Dynamic Empty States */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {availableCourses.length === 0 ? (
            /* Mastered Everything UI */
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-border)', borderRadius: '20px', border: '1px dashed var(--accent-color)' }}>
              <FaTrophy size={50} color="#f1c40f" style={{ marginBottom: '15px' }} />
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)', fontSize: '20px' }}>You've enrolled in everything!</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>There are no new modules available in the catalog at this time.</p>
              <button onClick={() => onNavigate('dashboard')} style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Return to Dashboard
              </button>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map(course => {
              const isEnrolling = enrolling === course._id; // ✅ Changed to MongoDB _id

              return (
                <div key={course._id} className="glass-card" style={{ 
                  padding: '25px', borderRadius: '20px', background: 'var(--bg-body)', 
                  border: '1px solid var(--card-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px'
                }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {course.module} • +{course.xp} XP
                    </span>
                    <h2 style={{ margin: '5px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{course.title}</h2>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Master the foundational concepts and practical applications of this subject.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleEnroll(course._id)} // ✅ Changed to MongoDB _id
                    disabled={isEnrolling}
                    style={{ 
                      minWidth: '110px', padding: '12px 20px', borderRadius: '12px', border: 'none',
                      fontWeight: 'bold', fontSize: '14px', cursor: isEnrolling ? 'default' : 'pointer',
                      background: 'var(--accent-color)', color: '#fff', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease'
                    }}
                  >
                    {isEnrolling ? <FaSpinner className="fa-spin" /> : <><FaPlus /> Enroll</>}
                  </button>
                </div>
              );
            })
          ) : (
            /* Search yielded no results */
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-secondary)' }}>
              <FaRegFrown size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>No modules found</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>We couldn't find anything matching "{searchTerm}".</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CourseCatalog;