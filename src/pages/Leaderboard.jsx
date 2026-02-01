import React from 'react';
import { FaTrophy, FaMedal, FaArrowLeft } from 'react-icons/fa';

const Leaderboard = ({ username, onNavigate }) => {
  // ... (keep your existing 'students' data array here) ...
  const students = [
    { rank: 1, name: "Sarah J.", xp: 3200, level: 4 },
    { rank: 2, name: "David K.", xp: 2950, level: 3 },
    { rank: 3, name: username || "You", xp: 2450, level: 3 },
    { rank: 4, name: "Jessica T.", xp: 2100, level: 3 },
    { rank: 5, name: "Michael B.", xp: 1900, level: 2 },
  ];

  return (
    <div style={{ padding: '40px', fontFamily: 'var(--font-head)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* NEW HEADER LAYOUT */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
          
          {/* 1. BACK BUTTON (Top Left) */}
          <button 
            onClick={() => onNavigate('dashboard')}
            className="glass-card" // Make it a cool glass button
            style={{
              width: '45px', height: '45px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '1px solid var(--card-border)',
              marginRight: '20px', color: 'var(--text-primary)'
            }}
          >
            <FaArrowLeft size={18} />
          </button>

          {/* 2. TITLE (Centered-ish) */}
          <div>
            <h1 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '28px' }}>Leaderboard</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>Top performers</p>
          </div>

          {/* 3. ICON (Right) */}
          <FaTrophy size={40} color="#ffd700" style={{ marginLeft: 'auto' }} />
        </div>

        {/* LIST */}
        <div className="glass-card" style={{ padding: '0 20px', overflow: 'hidden' }}>
          {students.map((student) => (
             /* ... (Keep your existing map code exactly the same) ... */
             <div 
              key={student.rank}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px',
                borderBottom: '1px solid var(--card-border)',
                background: student.name === username ? 'rgba(108, 92, 231, 0.15)' : 'transparent' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: student.rank <= 3 ? '#ffd700' : 'rgba(0,0,0,0.1)',
                  color: student.rank <= 3 ? 'black' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {student.rank}
                </div>
                
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {student.name}
                    {student.rank <= 3 && <FaMedal color="#fdcb6e" />}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '10px' }}>
                    Level {student.level}
                  </span>
                </div>
              </div>

              <div style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '18px' }}>
                {student.xp} XP
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;