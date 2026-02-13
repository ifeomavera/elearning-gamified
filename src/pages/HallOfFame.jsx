import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaTrophy, FaMedal, FaCrown, FaSpinner } from 'react-icons/fa';

const HallOfFame = ({ onNavigate }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Connects to the route we built in users.js
        const res = await axios.get(`${apiUrl}/api/users/leaderboard`);
        setLeaders(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Helper to determine metallic styling for the Top 3
  const getRankStyle = (index) => {
    if (index === 0) return { color: '#FFD700', border: '1px solid rgba(255, 215, 0, 0.5)', glow: '0 0 20px rgba(255, 215, 0, 0.15)', icon: <FaCrown size={24} color="#FFD700" /> }; // Gold
    if (index === 1) return { color: '#C0C0C0', border: '1px solid rgba(192, 192, 192, 0.5)', glow: '0 0 15px rgba(192, 192, 192, 0.1)', icon: <FaMedal size={22} color="#C0C0C0" /> }; // Silver
    if (index === 2) return { color: '#CD7F32', border: '1px solid rgba(205, 127, 50, 0.5)', glow: '0 0 15px rgba(205, 127, 50, 0.1)', icon: <FaMedal size={20} color="#CD7F32" /> }; // Bronze
    return { color: 'var(--text-secondary)', border: '1px solid var(--card-border)', glow: 'none', icon: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>#{index + 1}</span> };
  };

  return (
    <div style={{ 
      width: '100%', minHeight: '100vh', padding: '20px', 
      background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: 'inherit'
    }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
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
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaTrophy color="#f1c40f" /> Hall of Fame
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>The top software engineering scholars on Vici.</p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <FaSpinner className="fa-spin" style={{ color: 'var(--accent-color)', fontSize: '30px' }} />
          </div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
            No scholars have earned XP yet. Be the first!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Top 3 Podium Cards */}
            {leaders.slice(0, 3).map((leader, index) => {
              const style = getRankStyle(index);
              return (
                <div key={index} className="glass-card" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 25px', borderRadius: '16px', background: 'var(--bg-body)',
                  border: style.border, boxShadow: style.glow, transition: 'transform 0.2s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                      {style.icon}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', fontWeight: '800' }}>
                        {leader.username}
                      </h2>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Level {Math.floor(leader.xp / 1000) + 1}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                          • {leader.badges.length} Badges
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: style.color }}>
                      {leader.xp} <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>XP</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Honorable Mentions Divider */}
            {leaders.length > 3 && (
              <div style={{ margin: '20px 0 10px 0', paddingLeft: '10px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Honorable Mentions
              </div>
            )}

            {/* Ranks 4-10 */}
            {leaders.slice(3).map((leader, index) => {
              const actualRank = index + 3; // +3 because we sliced the first 3 off
              const style = getRankStyle(actualRank);
              return (
                <div key={actualRank} className="glass-card" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '15px 20px', borderRadius: '12px', background: 'transparent',
                  border: '1px solid var(--card-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '40px', display: 'flex', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                      {style.icon}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>
                        {leader.username}
                      </h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Level {Math.floor(leader.xp / 1000) + 1}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {leader.xp} <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>XP</span>
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

export default HallOfFame;