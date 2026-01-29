import React from 'react';
import { FaTrophy, FaMedal, FaArrowLeft, FaUserGraduate } from 'react-icons/fa';

const Leaderboard = ({ username, onNavigate }) => {
  // Fake data for the competition
  const students = [
    { rank: 1, name: "Sarah J.", xp: 3200, level: 4 },
    { rank: 2, name: "David K.", xp: 2950, level: 3 },
    { rank: 3, name: username || "You", xp: 2450, level: 3 }, // Your dynamic user
    { rank: 4, name: "Jessica T.", xp: 2100, level: 3 },
    { rank: 5, name: "Michael B.", xp: 1900, level: 2 },
    { rank: 6, name: "Chris P.", xp: 1500, level: 2 },
    { rank: 7, name: "Amanda L.", xp: 1200, level: 2 },
  ];

  return (
    <div style={{ padding: '40px', fontFamily: '"Segoe UI", sans-serif', background: '#f4f7f6', minHeight: '100vh' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <FaTrophy size={60} color="#ffd700" style={{ marginBottom: '10px' }} />
          <h1 style={{ color: '#2d3436', margin: 0 }}>Class Leaderboard</h1>
          <p style={{ color: '#636e72' }}>Top performing students this semester</p>
        </div>

        {/* LIST */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {students.map((student) => (
            <div 
              key={student.rank}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px',
                borderBottom: '1px solid #f1f2f6',
                background: student.name === username ? '#e3f2fd' : 'white' // Highlight "You"
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* RANK BADGE */}
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: student.rank <= 3 ? '#ffd700' : '#dfe6e9',
                  color: student.rank <= 3 ? 'black' : '#636e72',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {student.rank}
                </div>
                
                {/* NAME & LEVEL */}
                <div>
                  <h3 style={{ margin: 0, color: '#2d3436', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {student.name}
                    {student.rank <= 3 && <FaMedal color="#fdcb6e" />}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#636e72', background: '#f1f2f6', padding: '2px 8px', borderRadius: '10px' }}>
                    Level {student.level}
                  </span>
                </div>
              </div>

              {/* XP SCORE */}
              <div style={{ fontWeight: 'bold', color: '#0984e3', fontSize: '18px' }}>
                {student.xp} XP
              </div>
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button 
            onClick={() => onNavigate('dashboard')}
            style={{
              background: 'transparent', border: 'none', color: '#636e72',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '16px', fontWeight: 'bold'
            }}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;