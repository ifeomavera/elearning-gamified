import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaBookOpen, FaLock, FaUnlockAlt, FaSearch } from 'react-icons/fa';
import axios from 'axios';

// --- MASTER LORE LIBRARY ---
// This acts as the source of truth for all secrets in TridentQuest
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
        
        // Grab the user's foundSecrets array (default to empty if it doesn't exist yet)
        setUnlockedIds(res.data.foundSecrets || []);
      } catch (err) {
        console.error("Failed to sync Codex:", err);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchUnlockedLore();
  }, [username]);

  // For testing purposes, uncomment this line to pretend all are unlocked:
  // const displayIds = LORE_DATABASE.map(l => l.id); 
  const displayIds = unlockedIds; 

  const unlockedCount = LORE_DATABASE.filter(lore => displayIds.includes(lore.id)).length;
  const totalCount = LORE_DATABASE.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
        <h3 style={{ color: '#2ecc71', letterSpacing: '2px', textTransform: 'uppercase' }}>Decrypting Archives...</h3>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)', padding: '20px' }}>
      <style>{`
        .lore-card {
          padding: 25px;
          border-radius: 16px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .lore-unlocked {
          background: rgba(46, 204, 113, 0.05);
          border: 1px solid #2ecc71;
          box-shadow: 0 10px 30px rgba(46, 204, 113, 0.1);
        }
        .lore-unlocked:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(46, 204, 113, 0.2);
        }
        .lore-locked {
          background: rgba(0, 0, 0, 0.2);
          border: 1px dashed var(--card-border);
          opacity: 0.6;
        }
        .lore-locked:hover {
          opacity: 1;
        }
        .scanline {
          position: absolute;
          top: 0; left: 0; right: 0; height: 100%;
          background: linear-gradient(to bottom, transparent 50%, rgba(46, 204, 113, 0.05) 51%);
          background-size: 100% 4px;
          pointer-events: none;
          opacity: 0.3;
        }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="glass-card" 
            style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '20px', color: 'var(--text-primary)', border: 'none' }}>
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ margin: 0, color: '#2ecc71', fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              <FaBookOpen /> The Codex
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Hidden truths of the Digital Frontier.</p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '40px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
            <span>Decryption Progress</span>
            <span style={{ color: '#2ecc71' }}>{unlockedCount} / {totalCount} Fragments</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, height: '100%', background: '#2ecc71', transition: 'width 1s ease-in-out', boxShadow: '0 0 10px #2ecc71' }}></div>
          </div>
        </div>

        {/* LORE GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {LORE_DATABASE.map((lore, idx) => {
            const isUnlocked = displayIds.includes(lore.id);

            return (
              <div key={lore.id} className={`lore-card ${isUnlocked ? 'lore-unlocked' : 'lore-locked'}`}>
                {isUnlocked && <div className="scanline"></div>}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ color: isUnlocked ? '#2ecc71' : 'var(--text-secondary)', fontWeight: '900', fontSize: '12px', letterSpacing: '1px' }}>
                    DATA ENTRY {String(idx + 1).padStart(3, '0')}
                  </span>
                  {isUnlocked ? <FaUnlockAlt color="#2ecc71" /> : <FaLock color="var(--text-secondary)" />}
                </div>

                <h3 style={{ color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)', margin: '0 0 15px 0', fontSize: '18px' }}>
                  {isUnlocked ? lore.title : "Encrypted Fragment"}
                </h3>

                {isUnlocked ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', fontStyle: 'italic' }}>
                    {lore.content}
                  </p>
                ) : (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--accent-color)', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaSearch /> RUMOR DETECTED:
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, fontStyle: 'italic' }}>
                      {lore.hint}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default LoreBook;