import React from 'react';
import { FaUserTie, FaCode, FaUniversity, FaArrowLeft } from 'react-icons/fa';

const Credits = ({ onNavigate }) => {
  const team = {
    supervisor: "Mrs. Daramola", 
    developers: [
      "Masade Osahon Paul",
      "Ezeka Ifeoma Vera",
      "Okochi-Thompson Obarido Junior"
    ],
    university: "Babcock University",
    department: "Software Engineering",
    project: "Design and Implementation of an E-learning System with Gamification Features"
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)', // Deep modern gradient
      fontFamily: "'Inter', sans-serif",
      overflowY: 'auto' // Ensures scrolling on small screens
    }}>
      
      {/* MAIN GLASS CARD */}
      <div className="glass-card" style={{
        background: 'rgba(255, 255, 255, 0.85)', // More transparent
        backdropFilter: 'blur(12px)', // The "Glass" effect
        WebkitBackdropFilter: 'blur(12px)',
        padding: '50px 40px',
        borderRadius: '30px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '700px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}>
        
        {/* PROJECT TITLE */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '800',
            color: '#1a1a2e', 
            lineHeight: '1.4',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {team.project}
          </h1>
          <div style={{ height: '4px', width: '60px', background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)', margin: '0 auto', borderRadius: '2px' }}></div>
        </div>
        
        <div style={{ display: 'grid', gap: '25px', textAlign: 'left' }}>
          
          {/* SUPERVISOR CARD */}
          <div style={{ 
            background: 'linear-gradient(to right, rgba(108, 92, 231, 0.1), rgba(255,255,255,0.5))', 
            padding: '20px 30px', 
            borderRadius: '16px', 
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            borderLeft: '5px solid #6c5ce7'
          }}>
            <div style={{ background: '#6c5ce7', color: 'white', padding: '12px', borderRadius: '50%' }}>
               <FaUserTie size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6c5ce7', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '1px' }}>
                Project Supervisor
              </h2>
              <p style={{ fontSize: '20px', fontWeight: '700', color: '#2d3436', margin: 0 }}>
                {team.supervisor}
              </p>
            </div>
          </div>

          {/* TEAM CARD */}
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f2f6', paddingBottom: '15px' }}>
              <FaCode color="#e17055" size={18} />
              <h2 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#636e72', fontWeight: 'bold', margin: 0 }}>
                Development Team
              </h2>
            </div>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {team.developers.map((dev, index) => (
                <div key={index} style={{ 
                  padding: '12px 15px', 
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  color: '#2d3436',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'transform 0.2s ease',
                  cursor: 'default'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <span style={{ color: '#b2bec3', fontSize: '12px' }}>0{index + 1}</span>
                  {dev}
                </div>
              ))}
            </div>
          </div>

          {/* INSTITUTION FOOTER */}
          <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.7 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '5px' }}>
              <FaUniversity />
              <p style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{team.university}</p>
            </div>
            <p style={{ fontSize: '13px', fontStyle: 'italic', margin: 0 }}>{team.department}</p>
          </div>

        </div>

        {/* GLOWING ACTION BUTTON */}
        <button 
          onClick={() => onNavigate('dashboard')}
          style={{
            marginTop: '40px',
            padding: '16px 40px',
            background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 20px rgba(108, 92, 231, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(108, 92, 231, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(108, 92, 231, 0.4)';
          }}
        >
          <FaArrowLeft /> Return to Dashboard
        </button>

      </div>
    </div>
  );
};

export default Credits;