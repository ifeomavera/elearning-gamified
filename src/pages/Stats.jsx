import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChartBar, FaChartPie, FaFire, FaCode, FaFolderOpen, FaExternalLinkAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const Stats = ({ username, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ streak: 0, xp: 0, accuracy: 0 });
  const [activityData, setActivityData] = useState([]);
  const [accuracyData, setAccuracyData] = useState([]);
  const [missions, setMissions] = useState([]); 

  const COLORS = ['#00b894', '#d63031'];

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const [statsRes, userRes] = await Promise.all([
          axios.get(`${apiUrl}/api/users/${username}/stats`),
          axios.get(`${apiUrl}/api/users/${username}`)
        ]);

        const statsData = statsRes.data;
        const userData = userRes.data;

        setStats({
          streak: statsData.streak,
          xp: statsData.xp,
          accuracy: statsData.accuracy
        });

        setAccuracyData([ 
          { name: 'Correct', value: statsData.accuracy }, 
          { name: 'Incorrect', value: 100 - statsData.accuracy } 
        ]);

        setActivityData(statsData.weeklyActivity);
        setMissions(userData.missions || []);

      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUserStats();
  }, [username]);

  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-body)' }}>
        <h3 style={{ color: 'var(--accent-color)' }}>Compiling Academic Data...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'var(--bg-body)' }}>
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
            <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '24px' }}>Learning Analytics</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time velocity for {username}</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '40px' }}>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FaFire size={30} color="#e17055" />
            <h2 style={{ margin: '10px 0 0 0', color: 'var(--text-primary)', fontSize: '20px' }}>{stats.streak} Days</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Current Streak</span>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FaChartBar size={30} color="#0984e3" />
            <h2 style={{ margin: '10px 0 0 0', color: 'var(--text-primary)', fontSize: '20px' }}>{stats.xp.toLocaleString()} XP</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Database Total</span>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FaChartPie size={30} color="#00b894" />
            <h2 style={{ margin: '10px 0 0 0', color: 'var(--text-primary)', fontSize: '20px' }}>{stats.accuracy}%</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Average Accuracy</span>
          </div>
        </div>

        {/* CHARTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="glass-card" style={{ padding: '20px', minHeight: '300px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '18px' }}>Weekly Activity</h3>
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="day" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                  <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e1e2e', border: 'none', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="xp" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', minHeight: '300px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '18px' }}>Quiz Performance</h3>
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={accuracyData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {accuracyData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e1e2e', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TECHNICAL PORTFOLIO */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <FaFolderOpen color="var(--accent-color)" size={24} />
            <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '20px' }}>Technical Portfolio</h3>
          </div>

          {missions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              <FaCode size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
              <p>No practical missions completed yet. Build your portfolio by defeating Guardians!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {missions.map((mission, idx) => (
                <div key={idx} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--accent-color)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>{mission.moduleName}</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>{mission.lessonTitle}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>"{mission.submission}"</div>
                  </div>
                  {mission.submission.includes('http') && (
                    <button onClick={() => window.open(mission.submission, '_blank')} style={{ marginLeft: '20px', background: 'transparent', border: '1.5px solid var(--card-border)', color: 'var(--text-primary)', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
                      <FaExternalLinkAlt size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;