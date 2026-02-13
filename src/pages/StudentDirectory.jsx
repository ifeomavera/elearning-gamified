import React, { useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaSearch, FaUserPlus, FaCheck, FaSpinner, FaGraduationCap } from 'react-icons/fa';

const StudentDirectory = ({ currentUsername, onNavigate }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length < 2) return setResults([]);

    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/users/search/${val}`);
      setResults(res.data.filter(u => u.username !== currentUsername)); // Don't find yourself
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (targetUsername) => {
    setRequesting(targetUsername);
    try {
      await axios.put(`${apiUrl}/api/users/${targetUsername}/request`, { 
        currentUsername 
      });
      // Update local state to show "Sent"
      setResults(results.map(u => u.username === targetUsername ? { ...u, sent: true } : u));
    } catch (err) {
      alert(err.response?.data || "Failed to send request");
    } finally {
      setRequesting(null);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <button onClick={() => onNavigate('dashboard')} className="glass-card" style={{ border: 'none', padding: '10px', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <FaArrowLeft />
          </button>
          <h1 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: 0 }}>Discover Scholars</h1>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by username (e.g. Osahon)..."
            value={query}
            onChange={handleSearch}
            style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {loading && <FaSpinner className="fa-spin" style={{ margin: '0 auto', color: 'var(--accent-color)' }} />}
          {results.map(user => (
            <div key={user.username} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px', background: 'var(--card-border)', padding: '8px', borderRadius: '10px' }}>👨‍💻</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{user.username}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Level {user.level} Software Engineer</p>
                </div>
              </div>
              <button 
                onClick={() => sendRequest(user.username)}
                disabled={user.sent || requesting === user.username}
                style={{ 
                  background: user.sent ? 'transparent' : 'var(--accent-color)', 
                  border: user.sent ? '1px solid var(--card-border)' : 'none',
                  color: user.sent ? 'var(--text-secondary)' : '#fff',
                  padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {requesting === user.username ? <FaSpinner className="fa-spin" /> : 
                 user.sent ? <><FaCheck /> Sent</> : <><FaUserPlus /> Connect</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDirectory;