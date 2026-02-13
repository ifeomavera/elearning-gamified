import React from 'react';
import { FaBolt, FaCircle } from 'react-icons/fa';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="glass-card" style={{ 
      padding: '20px', 
      borderRadius: '20px', 
      background: 'rgba(255, 255, 255, 0.03)', 
      border: '1px solid var(--card-border)',
      height: 'fit-content'
    }}>
      <style>{`
        .activity-card {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 10px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .activity-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(5px);
          border-color: var(--accent-color);
        }
        .status-pulse {
          animation: pulse-red 2s infinite;
          font-size: 8px;
        }
        @keyframes pulse-red {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaBolt color="#f1c40f" />
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800' }}>Live Activity</h3>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--accent-color)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Real-time
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activities.length > 0 ? (
          activities.map((act, index) => (
            <div key={index} className="activity-card">
              <div style={{ 
                fontSize: '22px', 
                background: 'rgba(255,255,255,0.05)', 
                width: '40px', height: '40px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                borderRadius: '10px' 
              }}>
                {act.avatar || "👨‍💻"}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px' }}>
                    {act.username}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', opacity: 0.7 }}>
                    {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </span>
                </div>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {act.detail}
                </p>
              </div>

              <FaCircle className="status-pulse" color={act.detail.includes('Badge') ? '#f1c40f' : 'var(--accent-color)'} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', padding: '20px' }}>
            Waiting for mission data...
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;