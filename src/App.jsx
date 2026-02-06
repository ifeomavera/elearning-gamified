import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'; // <--- 1. IMPORT THIS
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import LessonView from './pages/LessonView';
import Forum from './pages/Forum';
import Stats from './pages/Stats';
import Credits from './pages/Credits';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

function App() {
  // --- STATE ---
  const [user, setUser] = useState(() => localStorage.getItem('currentUser'));
  const [role, setRole] = useState(() => localStorage.getItem('currentRole') || 'student');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || "👨‍💻");

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  // --- 2. UPDATED ROUTING LOGIC ---
  const [currentView, setCurrentView] = useState(() => {
    // PRIORITY 1: Check if this is a Reset Password Link from Email
    // This allows the link to work even if you are logged in or have saved data
    if (window.location.pathname.startsWith('/reset-password')) {
       return 'reset-password';
    }

    // PRIORITY 2: Check Local Storage (The "Remember Me" feature)
    const saved = localStorage.getItem('currentView');
    if (saved === 'lesson') return 'dashboard';
    if (localStorage.getItem('currentUser') && !saved) return 'dashboard';
    
    // PRIORITY 3: Default to Login
    return saved || 'login';
  });

  const [activeLesson, setActiveLesson] = useState(null);

  const showToast = (message, type = 'success') => {
    if (type === 'error') toast.error(message);
    else if (type === 'info') toast(message, { icon: 'ℹ️' });
    else toast.success(message);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleNavigate = (view) => {
    setCurrentView(view);
    localStorage.setItem('currentView', view);
  };

  const handleLogin = (username, isAdmin) => {
    setUser(username);
    const userRole = isAdmin ? 'admin' : 'student';
    setRole(userRole);
    const currentAvatar = localStorage.getItem('userAvatar') || "👨‍💻";
    setAvatar(currentAvatar);
    
    localStorage.setItem('currentUser', username);
    localStorage.setItem('currentRole', userRole);
    localStorage.setItem('userAvatar', currentAvatar);
    
    toast.success(`Welcome back, ${username}!`);
    handleNavigate('dashboard'); 
  };

  const handleUpdateProfile = (newName, newAvatar) => {
    setUser(newName);    
    setAvatar(newAvatar); 
  };

  const handleLogout = () => {
    setUser(null);
    setRole('student');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('currentView'); 
    setCurrentView('login');
    toast.success("Logged out successfully");
  };

  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
    handleNavigate('lesson');
  };

  const handleLessonComplete = async (earnedXP) => {
    if (!activeLesson) return;
    const toastId = toast.loading("Saving progress...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/users/${user}/progress`, {
        xpEarned: earnedXP,
        courseId: activeLesson.id
      });
      toast.success(`Lesson Completed! +${earnedXP} XP`, { id: toastId });
      handleNavigate('dashboard');
    } catch (err) {
      console.error(err);
      toast.error("Failed to save progress.", { id: toastId });
    }
  };

  // --- RENDER PAGE ---
  const renderPage = () => {
    // 3. SPECIAL CASE: Always show Reset Password if the URL matches, regardless of login status
    if (currentView === 'reset-password') {
        return <ResetPassword onNavigate={handleNavigate} />;
    }

    if (user) {
      if (role === 'admin') {
        return (
          <AdminDashboard 
            onLogout={handleLogout} 
            showToast={showToast} 
            toggleTheme={toggleTheme} 
            currentTheme={theme}
          />
        );
      }
      
      switch (currentView) {
        case 'dashboard':
        case 'login': 
          return (
            <Dashboard 
              username={user} 
              avatar={avatar} 
              onLogout={handleLogout} 
              onNavigate={handleNavigate} 
              showToast={showToast}
              toggleTheme={toggleTheme}
              currentTheme={theme}
              onStartLesson={handleStartLesson}
            />
          );
        case 'leaderboard': return <Leaderboard username={user} avatar={avatar} onNavigate={handleNavigate} />;
        case 'profile': return <Profile onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} showToast={showToast} />;
        case 'lesson': return <LessonView lesson={activeLesson} onComplete={handleLessonComplete} onExit={() => handleNavigate('dashboard')} />;
        case 'forum': return <Forum username={user} avatar={avatar} onNavigate={handleNavigate} />;
        case 'stats': return <Stats onNavigate={handleNavigate} />;
        case 'credits': return <Credits onNavigate={handleNavigate} />;
        default: return <NotFound onNavigate={handleNavigate} />;
      }
    }

    switch (currentView) {
      case 'signup':
      case 'register': return <Register onSignUp={(name) => handleLogin(name, false)} onNavigate={handleNavigate} />;
      case 'forgot-password': return <ForgotPassword onNavigate={handleNavigate} />;
      
      // 4. ADDED CASE HERE JUST IN CASE
      case 'reset-password': return <ResetPassword onNavigate={handleNavigate} />;
      
      case 'login': default: return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      {renderPage()}
    </>
  );
}

export default App;