import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; // New Import
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Toast from './components/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [currentView, setCurrentView] = useState('login');
  
  // TOAST STATE
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('currentRole');
    if (savedUser) {
      setUser(savedUser);
      setRole(savedRole || 'student');
    }
  }, []);

  // UPDATED LOGIN HANDLER: Now accepts 'isAdmin' flag
  const handleLogin = (username, isAdmin) => {
    setUser(username);
    const userRole = isAdmin ? 'admin' : 'student';
    setRole(userRole);
    
    localStorage.setItem('currentUser', username);
    localStorage.setItem('currentRole', userRole);
    
    showToast(`Welcome back, ${username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setRole('student');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    setCurrentView('login');
    showToast("Logged out successfully", "info");
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const renderPage = () => {
    // 1. IF LOGGED IN
    if (user) {
      if (role === 'admin') {
        return <AdminDashboard onLogout={handleLogout} showToast={showToast} />;
      }
      
      // Student Routes
      if (currentView === 'dashboard' || currentView === 'login') {
        return <Dashboard username={user} onLogout={handleLogout} onNavigate={handleNavigate} showToast={showToast} />;
      }
      if (currentView === 'leaderboard') {
        return <Leaderboard username={user} onNavigate={() => setCurrentView('dashboard')} />;
      }
      if (currentView === 'profile') {
        return <Profile onNavigate={() => setCurrentView('dashboard')} onUpdateName={setUser} showToast={showToast} />;
      }
      return <Dashboard username={user} onNavigate={handleNavigate} showToast={showToast} />;
    }

    // 2. IF LOGGED OUT
    switch (currentView) {
      case 'signup':
      case 'register': // Handle both names
        return <Register onSignUp={(name) => handleLogin(name, false)} onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} />;
      case 'login':
      default:
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
}

export default App;