import React, { useState, useEffect } from 'react';
import { FaHeart, FaExternalLinkAlt, FaGlobe, FaSearch, FaAward, FaStar } from 'react-icons/fa';
import axios from 'axios';

const CommunityShowcase = ({ onNavigate, currentUser }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGlobalMissions = async (query = "") => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/users/global-missions?search=${query}`);
      setMissions(res.data);
    } catch (err) {
      console.error("Failed to load showcase", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalMissions();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchGlobalMissions(e.target.value);
  };

  const handleLike = async (missionId, authorName) => {
     try {
       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
       await axios.put(`${apiUrl}/api/users/${authorName}/missions/${missionId}/like`, {
         LikerUsername: currentUser 
       });
       fetchGlobalMissions(searchTerm);
     } catch (err) { console.error("Like failed", err); }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <style>{`
        @keyframes heartPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .heart-active { animation: heartPulse 0.4s ease-out; }
        .featured-badge {
          background: linear-gradient(90deg, #f1c40f, #f39c12);
          color: #000;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 15px rgba(241, 196, 15, 0.3);
        }
      `}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '32px', fontWeight: '900' }}>
            <FaGlobe color="var(--accent-color)" /> GLOBAL ARCHIVE
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Exceptional solutions from scholars around the world.</p>
        </header>

        <div className="glass-card" style={{ padding: '15px', marginBottom: '30px', display: 'flex', gap: '15px' }}>
          <FaSearch style={{ marginTop: '5px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search missions by subject or topic..."
            value={searchTerm}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '16px' }}
            onChange={handleSearch}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--accent-color)' }}>Accessing Global Records...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
            {missions.map((m, idx) => {
              const isLiked = m.likes?.includes(currentUser);
              const isFeatured = m.likes?.length >= 10;

              return (
                <div key={idx} className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', border: isFeatured ? '2px solid #f1c40f' : '1px solid var(--card-border)', position: 'relative' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {m.moduleName}
                    </span>
                    {isFeatured && (
                      <div className="featured-badge">
                        <FaStar /> FEATURED
                      </div>
                    )}
                  </div>

                  <h3 style={{ color: 'var(--text-primary)', margin: '0 0 10px 0', fontSize: '18px' }}>{m.lessonTitle}</h3>
                  
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    "{m.submission}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button 
                        onClick={() => handleLike(m.missionId, m.username)}
                        style={{ background: 'transparent', border: 'none', color: isLiked ? '#ff4757' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        <FaHeart className={isLiked ? "heart-active" : ""} /> {m.likes?.length || 0}
                      </button>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>by {m.username}</span>
                    </div>
                    
                    {m.submission.includes('http') && (
                      <button 
                        onClick={() => window.open(m.submission, '_blank')}
                        style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                        Expand Solution <FaExternalLinkAlt size={10} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityShowcase;