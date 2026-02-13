import React, { useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const SocialInbox = ({ username, friendRequests, onRefresh }) => {
  const [processing, setProcessing] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleAction = async (requesterUsername, action) => {
    setProcessing(requesterUsername);
    try {
      const endpoint = action === 'accept' ? 'accept' : 'decline';
      await axios.put(`${apiUrl}/api/users/${username}/${endpoint}`, { 
        requesterUsername 
      });
      onRefresh(); // Triggers a reload of the dashboard data
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="glass-card" style={{ 
      padding: '20px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.02)', 
      border: '1.5px solid var(--accent-color)', marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <FaUserPlus color="var(--accent-color)" />
        <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: '800' }}>Requests</h3>
        <span style={{ background: 'var(--accent-color)', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px' }}>
          {friendRequests?.length || 0}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {friendRequests && friendRequests.length > 0 ? (
          friendRequests.map((req, index) => (
            <div key={index} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)'
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {req.from?.username || "Scholar"}
                </p>
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>Level {req.from?.level || 1}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleAction(req.from.username, 'accept')} style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                  {processing === req.from.username ? <FaSpinner className="fa-spin" /> : <FaCheck />}
                </button>
                <button onClick={() => handleAction(req.from.username, 'decline')} style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: 'none', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>No pending requests.</p>
        )}
      </div>
    </div>
  );
};

export default SocialInbox;