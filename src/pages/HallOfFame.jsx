import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy, FaMedal, FaCrown, FaArrowLeft, FaUsers, FaGlobe, FaSpinner } from 'react-icons/fa';

const HallOfFame = ({ username, onNavigate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('global');

  // Uses your Render URL from the environment variables, or defaults to local if testing
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        // This matches the Endpoint 11 we just added to your backend
        const endpoint = viewMode === 'global' ? 'leaderboard' : `${username}/friends-leaderboard`;
        const res = await axios.get(`${apiUrl}/api/users/${endpoint}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Hall of Fame fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [viewMode, username, apiUrl]);

  const getRankStyle = (index) => {
    if (index === 0) return { border: '2px solid #f1c40f', background: 'rgba(241, 196, 15, 0.05)', icon: <FaCrown color="#f1c40f" /> };
    if (index === 1) return { border: '2px solid #bdc3c7', background: 'rgba(189, 195, 199, 0.05)', icon: <FaMedal color="#bdc3c7" /> };
    if (index === 2) return { border: '2px solid #cd7f32', background: 'rgba(205, 127, 50, 0.05)', icon: <FaMedal color="#cd7f32" /> };
    return { border: '1px solid var(--card-border)', background: 'transparent', icon: null };
  };

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', background: 'var(--bg-body)', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Navigation Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="glass-card" 
            style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaTrophy color="#f1c40f" /> Hall of Fame
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Compete with scholars across the globe.</p>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
          <button 
            onClick={() => setViewMode('global')}
            style={{
              padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', border: 'none',
              display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold',
              background: viewMode === 'global' ? 'var(--accent-color)' : 'var(--card-border)',
              color: viewMode === 'global' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <FaGlobe /> Global Rankings
          </button>
          <button 
            onClick={() => setViewMode('friends')}
            style={{
              padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', border: 'none',
              display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold',
              background: viewMode === 'friends' ? 'var(--accent-color)' : 'var(--card-border)',
              color: viewMode === 'friends' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <FaUsers /> Inner Circle
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><FaSpinner className="fa-spin" size={30} color="var(--accent-color)" /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {users.length > 0 ? users.map((u, index) => {
              const style = getRankStyle(index);
              return (
                <div key={u.username} className="glass-card" style={{ 
                  padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', border: style.border, background: style.background,
                  transform: index < 3 ? 'scale(1.02)' : 'scale(1)', transition: 'transform 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '24px', width: '40px', textAlign: 'center' }}>
                      {style.icon ? style.icon : <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>#{index + 1}</span>}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{u.username}</h3>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Level {u.level || 1} • {u.badges?.length || 0} Badges
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '22px', fontWeight: '900', color: index === 0 ? '#f1c40f' : 'var(--text-primary)' }}>{u.xp}</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', marginLeft: '5px', color: 'var(--text-secondary)' }}>XP</span>
                  </div>
                </div>
              );
            }) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No scholars found in this circle yet!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFame;