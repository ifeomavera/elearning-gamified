import React from 'react';
import { FaArrowLeft, FaChartBar, FaChartPie, FaFire } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Stats = ({ onNavigate }) => {
  // Mock Data for "XP Earned per Day" (This simulates a week of activity)
  const activityData = [
    { day: 'Mon', xp: 150 },
    { day: 'Tue', xp: 50 },
    { day: 'Wed', xp: 300 },
    { day: 'Thu', xp: 100 },
    { day: 'Fri', xp: 250 },
    { day: 'Sat', xp: 0 },
    { day: 'Sun', xp: 400 }, // Today
  ];

  // Mock Data for "Quiz Accuracy"
  const accuracyData = [
    { name: 'Correct', value: 85 },
    { name: 'Incorrect', value: 15 },
  ];
  const COLORS = ['#00b894', '#d63031']; // Green for correct, Red for incorrect

  return (
    <div style={{ padding: '40px', minHeight: '100vh', fontFamily: 'var(--font-head)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="glass-card"
            style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--card-border)', marginRight: '20px', color: 'var(--text-primary)' }}
          >
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>Learning Analytics</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Track your gamification velocity</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <FaFire size={30} color="#e17055" style={{ marginBottom: '10px' }} />
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>7 Day</h2>
            <span style={{ color: 'var(--text-secondary)' }}>Current Streak</span>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <FaChartBar size={30} color="#0984e3" style={{ marginBottom: '10px' }} />
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>1,250 XP</h2>
            <span style={{ color: 'var(--text-secondary)' }}>Earned this week</span>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <FaChartPie size={30} color="#00b894" style={{ marginBottom: '10px' }} />
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>85%</h2>
            <span style={{ color: 'var(--text-secondary)' }}>Quiz Accuracy</span>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
          
          {/* CHART 1: XP ACTIVITY */}
          <div className="glass-card animate-slide-1" style={{ padding: '30px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Weekly Activity
            </h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="day" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="xp" fill="var(--accent-color)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: ACCURACY */}
          <div className="glass-card animate-slide-1" style={{ padding: '30px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Quiz Performance
            </h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ textAlign: 'center', marginTop: '10px', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#00b894', marginRight: '15px' }}>● Correct (85%)</span>
                <span style={{ color: '#d63031' }}>● Incorrect (15%)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Stats;