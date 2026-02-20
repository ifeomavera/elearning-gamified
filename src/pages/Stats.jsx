import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChartBar, FaChartPie, FaFire } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const Stats = ({ username, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ streak: 0, xp: 0, accuracy: 0 });
  const [activityData, setActivityData] = useState([]);
  const [accuracyData, setAccuracyData] = useState([]);

  const COLORS = ['#00b894', '#d63031'];

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // ✅ DYNAMIC FETCH: Pulling real calculations from the backend
        const res = await axios.get(`${apiUrl}/api/users/${username}/stats`);
        const data = res.data;

        setStats({
          streak: data.streak,
          xp: data.xp,
          accuracy: data.accuracy
        });

        // ✅ Map Pie Chart Data: Dynamically calculates remaining 'Incorrect' percentage
        setAccuracyData([ 
          { name: 'Correct', value: data.accuracy }, 
          { name: 'Incorrect', value: 100 - data.accuracy } 
        ]);

        // ✅ Map Bar Chart Data: Injects the real weeklyActivity array from the backend
        setActivityData(data.weeklyActivity);

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
            style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '20px', color: 'var(--text-primary)' }}>
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
            <h2 style={{ margin: '10px 0 0 0', color: 'var(--text-primary)', fontSize: '20px' }}>{stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}</h2>
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

        {/* CHARTS SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Bar Chart */}
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

          {/* Pie Chart */}
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
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ width: 10, height: 10, background: '#00b894', borderRadius: '50%', marginRight: 5 }}></div> Correct
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ width: 10, height: 10, background: '#d63031', borderRadius: '50%', marginRight: 5 }}></div> Incorrect
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Stats;