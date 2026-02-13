import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy, FaMedal, FaCrown, FaArrowLeft } from 'react-icons/fa';

const HallOfFame = ({ onNavigate }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        // Use the live backend URL
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiUrl}/api/users/leaderboard`);
        setLeaders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hall of fame:", err);
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const getPodiumStyle = (rank) => {
    if (rank === 0) return { // 1st Place (Gold)
      background: 'linear-gradient(135deg, #ffd700 0%, #f1c40f 100%)',
      transform: 'scale(1.1)',
      zIndex: 10,
      border: '4px solid #fff',
      boxShadow: '0 10px 30px rgba(255, 215, 0, 0.5)'
    };
    if (rank === 1) return { // 2nd Place (Silver)
      background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
      transform: 'scale(0.95)',
      marginTop: '40px', // Push down slightly
      boxShadow: '0 10px 25px rgba(189, 195, 199, 0.5)'
    };
    if (rank === 2) return { // 3rd Place (Bronze)
      background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
      transform: 'scale(0.95)',
      marginTop: '40px', // Push down slightly
      boxShadow: '0 10px 25px rgba(211, 84, 0, 0.5)'
    };
    return {};
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', padding: '20px', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '15px', color: 'var(--text-primary)' }}>
          <FaArrowLeft />
        </button>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>🏆 Hall of Fame</h1>
      </div>

      {loading ? (
        <p>Polishing the trophies...</p>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* TOP 3 PODIUM */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}>
            
            {/* 2nd Place */}
            {leaders[1] && (
              <div style={{ ...styles.podiumCard, ...getPodiumStyle(1) }}>
                <FaMedal size={30} color="#fff" style={{ marginBottom: '10px' }} />
                <div style={styles.avatar}>{leaders[1].avatar || "🥈"}</div>
                <h3>{leaders[1].username}</h3>
                <p>{leaders[1].xp} XP</p>
              </div>
            )}

            {/* 1st Place */}
            {leaders[0] && (
              <div style={{ ...styles.podiumCard, ...getPodiumStyle(0) }}>
                <FaCrown size={40} color="#fff" style={{ marginBottom: '10px' }} />
                <div style={{ ...styles.avatar, width: '80px', height: '80px', fontSize: '40px' }}>{leaders[0].avatar || "👑"}</div>
                <h2 style={{ fontSize: '22px' }}>{leaders[0].username}</h2>
                <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{leaders[0].xp} XP</p>
              </div>
            )}

            {/* 3rd Place */}
            {leaders[2] && (
              <div style={{ ...styles.podiumCard, ...getPodiumStyle(2) }}>
                <FaMedal size={30} color="#fff" style={{ marginBottom: '10px' }} />
                <div style={styles.avatar}>{leaders[2].avatar || "🥉"}</div>
                <h3>{leaders[2].username}</h3>
                <p>{leaders[2].xp} XP</p>
              </div>
            )}
          </div>

          {/* THE REST OF THE LEGENDS (List View) */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '20px', backdropFilter: 'blur(10px)' }}>
            {leaders.slice(3).map((user, index) => (
              <div key={user.username} style={styles.listItem}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', width: '30px', color: 'var(--text-secondary)' }}>#{index + 4}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                  <div style={{ fontSize: '24px' }}>{user.avatar || "👨‍💻"}</div>
                  <span style={{ fontWeight: '600' }}>{user.username}</span>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{user.xp} XP</span>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

const styles = {
  podiumCard: {
    padding: '20px',
    borderRadius: '20px',
    textAlign: 'center',
    color: '#fff',
    width: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    transition: 'transform 0.3s ease'
  },
  avatar: {
    width: '60px',
    height: '60px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    marginBottom: '10px'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    color: 'var(--text-primary)'
  }
};

export default HallOfFame;