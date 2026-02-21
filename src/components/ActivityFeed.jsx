import React from 'react';
import { FaBolt, FaCircle, FaGraduationCap, FaTrophy } from 'react-icons/fa';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="glass-card" style={{ 
      padding: '18px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column',
      maxHeight: '400px' // ✅ FIX: Hard cap on height to prevent the "long feed"
    }}>
      <style>{`
        .feed-container { overflow-y: auto; padding-right: 8px; flex: 1; }
        .feed-container::-webkit-scrollbar { width: 4px; }
        .feed-container::-webkit-scrollbar-thumb { background: var(--accent-color); borderRadius: 10px; }
        .activity-card {
          padding: 10px; border-radius: 12px; background: rgba(255, 255, 255, 0.02);
          margin-bottom: 8px; display: flex; align-items: center; gap: 10px; transition: 0.2s;
        }
        .activity-card:hover { background: rgba(108, 92, 231, 0.08); transform: translateX(3px); }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800' }}>LIVE FEED</h3>
        <div style={{ fontSize: '9px', color: 'var(--accent-color)', fontWeight: '900', textTransform: 'uppercase' }}>Real-time</div>
      </div>

      <div className="feed-container">
        {activities.length > 0 ? (
          activities.map((act, index) => (
            <div key={index} className="activity-card">
              <div style={{ fontSize: '18px', background: 'var(--bg-body)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                {act.detail.includes('XP') ? <FaGraduationCap size={14} color="var(--accent-color)" /> : (act.detail.includes('Badge') ? <FaTrophy size={14} color="#f1c40f" /> : "👨‍💻")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '12px' }}>{act.username}</span>
                   <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                </div>
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.detail}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>Awaiting data...</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;