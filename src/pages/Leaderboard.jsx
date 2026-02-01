import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaArrowLeft, FaUserAstronaut } from 'react-icons/fa';
import axios from 'axios'; // <--- 1. Import Axios

const Leaderboard = ({ username, onNavigate }) => {
  // 2. State to hold REAL data (instead of hardcoded list)
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Fetch from Backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/leaderboard');
        setLeaders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'var(--font-head)', minHeight: '100vh', width: '100%' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
          
          {/* Back Button */}
          <button 
            onClick={() => onNavigate('dashboard')}
            className="glass-card"
            style={{
              width: '45px', height: '45px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '1px solid var(--card-border)',
              marginRight: '20px', color: 'var(--text-primary)'
            }}
          >
            <FaArrowLeft size={18} />
          </button>

          {/* Title */}
          <div>
            <h1 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '28px' }}>Leaderboard</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>Global Rankings</p>
          </div>

          {/* Trophy Icon */}
          <FaTrophy size={40} color="#ffd700" style={{ marginLeft: 'auto' }} />
        </div>

        {/* LOADING STATE */}
        {loading ? (
           <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>Loading rankings...</p>
        ) : (
          /* REAL LIST */
          <div className="glass-card" style={{ padding: '0 20px', overflow: 'hidden' }}>
            
            {leaders.length === 0 ? (
               <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No players found yet.</div>
            ) : (
              leaders.map((student, index) => {
                const rank = index + 1;
                const level = Math.floor(student.xp / 1000) + 1; // Calculate level dynamically

                return (
                  <div 
                    key={student.username}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '20px',
                      borderBottom: '1px solid var(--card-border)',
                      // Highlight if it's YOU
                      background: student.username === username ? 'rgba(3, 218, 198, 0.15)' : 'transparent' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      
                      {/* RANK BUBBLE */}
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', 
                        background: rank <= 3 ? '#ffd700' : 'rgba(255,255,255,0.1)',
                        color: rank <= 3 ? 'black' : 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                      }}>
                        {rank}
                      </div>
                      
                      {/* NAME & LEVEL */}
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {student.username} {student.username === username && "(You)"}
                          {rank <= 3 && <FaMedal color="#fdcb6e" />}
                        </h3>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>
                          Level {level}
                        </span>
                      </div>
                    </div>

                    {/* XP */}
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '18px' }}>
                      {student.xp} XP
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Leaderboard;