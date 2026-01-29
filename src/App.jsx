import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Toast from './components/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("👨‍💻"); // NEW: Avatar State
  const [role, setRole] = useState('student');
  const [currentView, setCurrentView] = useState('login');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('currentRole');
    const savedAvatar = localStorage.getItem('userAvatar'); // Load avatar
    
    if (savedUser) {
      setUser(savedUser);
      setRole(savedRole || 'student');
      if (savedAvatar) setAvatar(savedAvatar);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (username, isAdmin) => {
    setUser(username);
    const userRole = isAdmin ? 'admin' : 'student';
    setRole(userRole);
    
    // Set default avatar if none exists
    const currentAvatar = localStorage.getItem('userAvatar') || "👨‍💻";
    setAvatar(currentAvatar);

    localStorage.setItem('currentUser', username);
    localStorage.setItem('currentRole', userRole);
    localStorage.setItem('userAvatar', currentAvatar);
    
    showToast(`Welcome back, ${username}!`);
    setCurrentView('dashboard');
  };

  // NEW: Handle Profile Updates (Name + Avatar)
  const handleUpdateProfile = (newName, newAvatar) => {
    setUser(newName);
    setAvatar(newAvatar);
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
    if (user) {
      if (role === 'admin') {
        return <AdminDashboard onLogout={handleLogout} showToast={showToast} />;
      }
      if (currentView === 'dashboard') {
        // Pass avatar to Dashboard
        return <Dashboard username={user} avatar={avatar} onLogout={handleLogout} onNavigate={handleNavigate} showToast={showToast} />;
      }
      if (currentView === 'leaderboard') {
        // Pass avatar to Leaderboard
        return <Leaderboard username={user} avatar={avatar} onNavigate={() => setCurrentView('dashboard')} />;
      }
      if (currentView === 'profile') {
        // Pass handleUpdateProfile
        return <Profile onNavigate={() => setCurrentView('dashboard')} onUpdateProfile={handleUpdateProfile} showToast={showToast} />;
      }
      return <Dashboard username={user} avatar={avatar} onLogout={handleLogout} onNavigate={handleNavigate} showToast={showToast} />;
    }

    switch (currentView) {
      case 'signup':
      case 'register':
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

export default App;