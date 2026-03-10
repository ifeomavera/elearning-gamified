import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaBookOpen, FaLock, FaUnlockAlt, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const LORE_DATABASE = [
  {
    id: 'SECRET_LOGO_7',
    title: 'Fragment 01: The Void',
    content: '"Before the Archives were built, there was only noise. The Guardians were not born to restrict knowledge, but to protect it from those who would use it without wisdom. You have found the first thread. Keep pulling."',
    hint: 'Seek the symbol of your quest. Strike it seven times before the timer fades.'
  },
  {
    id: 'SECRET_KONAMI',
    title: 'Fragment 02: Legacy Override',
    content: '"The ancients spoke in directional tongues. Up, down, left, right... a dance of inputs that bypasses the modern locks. You bear the mark of the retro pioneers."',
    hint: 'An ancient code of directional commands and twin buttons (B, A).'
  },
  {
    id: 'SECRET_MIDNIGHT',
    title: 'Fragment 03: The Midnight Protocol',
    content: '"While the world sleeps, the servers dream. The Midnight Guardians maintain the grid when the sun falls. Your dedication in the witching hour has been recorded."',
    hint: 'The owl hunts when the clock strikes twelve.'
  },
  {
    id: 'SECRET_PERFECT_BOSS',
    title: 'Fragment 04: The Flawless Mind',
    content: '"To defeat a Guardian is expected. To do so without shedding a single drop of vitality proves a mastery of logic that rivals the machine itself."',
    hint: 'Engage a Module Guardian and emerge completely unscathed.'
  }
];

const LoreBook = ({ username, onNavigate }) => {
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnlockedLore = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/users/${encodeURIComponent(username)}`);
        setUnlockedIds(res.data.foundSecrets || []);
      } catch (err) {
        console.error("Failed to sync Codex:", err);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchUnlockedLore();
  }, [username]);

  const displayIds = unlockedIds; 

  const unlockedCount = LORE_DATABASE.filter(lore => displayIds.includes(lore.id)).length;
  const totalCount = LORE_DATABASE.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
        <h3 style={{ color: 'var(--accent-color)', letterSpacing: '2px', fontWeight: '400' }}>Accessing Archives...</h3>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', padding: '30px 20px', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .lore-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }
        .codex-title {
          font-size: 36px;
          font-weight: 900;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -1px;
        }
        .codex-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
          margin: 5px 0 0 0;
          font-weight: 400;
        }
        .progress-container {
          background: var(--bg-card);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 25px;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .lore-card {
          background: var(--bg-card);
          border: 1px solid var(--card-border);
          padding: 30px;
          border-radius: 20px;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .lore-unlocked {
          border-top: 4px solid var(--accent-color);
        }
        .lore-unlocked:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.08);
        }
        .lore-locked {
          opacity: 0.6;
          background: rgba(0,0,0,0.02);
        }
        .lore-locked:hover { opacity: 0.9; }
        .fragment-id {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--text-secondary);
          margin-bottom: 15px;
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div className="lore-header">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="glass-card" 
            style={{ width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="codex-title">The Master Codex</h1>
            <p className="codex-subtitle">Uncover the hidden history of the digital frontier.</p>
          </div>
        </div>

        <div className="progress-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-primary)', fontWeight: '700', fontSize: '14px' }}>
            <span>Global Decryption Progress</span>
            <span style={{ color: 'var(--accent-color)' }}>{progressPercentage}% Completed</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(128,128,128,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'var(--accent-color)', borderRadius: '10px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {LORE_DATABASE.map((lore, idx) => {
            const isUnlocked = displayIds.includes(lore.id);

            return (
              <div key={lore.id} className={`lore-card ${isUnlocked ? 'lore-unlocked' : 'lore-locked'}`}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="fragment-id">Record {String(idx + 1).padStart(3, '0')}</span>
                  {isUnlocked ? <FaUnlockAlt color="var(--accent-color)" size={14} /> : <FaLock color="var(--text-secondary)" size={14} />}
                </div>

                <h3 style={{ color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)', margin: '0 0 20px 0', fontSize: '20px', fontWeight: '800' }}>
                  {isUnlocked ? lore.title : "Classified Data"}
                </h3>

                <div style={{ flex: 1 }}>
                  {isUnlocked ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.8', fontStyle: 'italic', margin: 0, paddingLeft: '15px', borderLeft: '3px solid var(--accent-color)' }}>
                      {lore.content}
                    </p>
                  ) : (
                    <div style={{ background: 'var(--bg-body)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--card-border)' }}>
                      <div style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaSearch opacity={0.5} /> SYSTEM WHISPER:
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, fontStyle: 'italic', lineHeight: '1.6' }}>
                        {lore.hint}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default LoreBook;