import React from 'react';
import { FaArrowLeft, FaChartBar, FaChartPie, FaFire } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Stats = ({ onNavigate }) => {
  const activityData = [
    { day: 'Mon', xp: 150 }, { day: 'Tue', xp: 50 }, { day: 'Wed', xp: 300 },
    { day: 'Thu', xp: 100 }, { day: 'Fri', xp: 250 }, { day: 'Sat', xp: 0 }, { day: 'Sun', xp: 400 }
  ];

  const accuracyData = [ { name: 'Correct', value: 85 }, { name: 'Incorrect', value: 15 } ];
  const COLORS = ['#00b894', '#d63031'];

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button onClick={() => onNavigate('dashboard')} className="glass-card" style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '20px', color: 'var(--text-primary)' }}>
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '24px' }}>Learning Analytics</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Track your gamification velocity</p>
          </div>
        </div>

        {/* SUMMARY CARDS: Fixed Grid for Mobile stacking */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="glass-card" style={{ padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FaFire size={35} color="#e17055" />
            <h2 style={{ margin: '10px 0 0 0', color: 'var(--text-primary)' }}>7 Day</h2>
            <span style={{ color: 'var(--text-secondary)' }}>Current Streak</span>
          </div>
          <div className="glass-card" style={{ padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FaChartBar size={35} color="#0984e3" />
            <h2 style={{ margin: '10px 0 0 0', color: 'var(--text-primary)' }}>1,250 XP</h2>
            <span style={{ color: 'var(--text-secondary)' }}>Earned this week</span>
          </div>
          <div className="glass-card" style={{ padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FaChartPie size={35} color="#00b894" />
            <h2 style={{ margin: '10px 0 0 0', color: 'var(--text-primary)' }}>85%</h2>
            <span style={{ color: 'var(--text-secondary)' }}>Quiz Accuracy</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          <div className="glass-card" style={{ padding: '20px', minHeight: '350px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <XAxis dataKey="day" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e2e', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="xp" fill="var(--accent-color)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '20px', minHeight: '350px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Quiz Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={accuracyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {accuracyData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
              <span style={{ color: '#00b894', marginRight: '15px' }}>● Correct</span>
              <span style={{ color: '#d63031' }}>● Incorrect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;