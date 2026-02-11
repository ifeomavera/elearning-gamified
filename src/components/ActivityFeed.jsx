import React from 'react';
import { FaBolt, FaUserCircle } from 'react-icons/fa';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="glass-card" style={{ padding: '20px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <FaBolt color="#f1c40f" size={20} />
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '18px' }}>Live Activity</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto' }}>
        {activities.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic' }}>
            No recent activity yet. Be the first!
          </p>
        ) : (
          activities.map((act, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              gap: '12px', 
              paddingBottom: '12px', 
              borderBottom: index !== activities.length - 1 ? '1px solid var(--card-border)' : 'none' 
            }}>
              <div style={{ fontSize: '24px' }}>{act.avatar || "👨‍💻"}</div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-primary)' }}>
                  <strong>{act.username}</strong>
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {act.detail || act.action}
                </p>
                <span style={{ fontSize: '10px', color: 'var(--accent-color)', opacity: 0.8 }}>
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;