import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import LessonView from './pages/LessonView';
import Forum from './pages/Forum';
import Stats from './pages/Stats';
import Credits from './pages/Credits'; // <--- 1. ADDED IMPORT HERE
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

  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('currentView');
    if (saved === 'lesson') return 'dashboard';
    if (localStorage.getItem('currentUser') && !saved) return 'dashboard';
    return saved || 'login';
  });

  const [activeLesson, setActiveLesson] = useState(null);

  // Wrapper for toast to keep compatibility
  const showToast = (message, type = 'success') => {
    if (type === 'error') toast.error(message);
    else if (type === 'info') toast(message, { icon: 'ℹ️' });
    else toast.success(message);
  };

  // --- EFFECTS ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- HANDLERS ---
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

  // --- THE NEW GAME LOOP (Saves to Database) ---
  const handleLessonComplete = async (earnedXP) => {
    if (!activeLesson) return;

    // Show loading spinner
    const toastId = toast.loading("Saving progress...");

    try {
      // Send data to Backend
      await axios.put(`https://elearning-api-2tsf.onrender.com/api/users/${user}/progress`, {
        xpEarned: earnedXP,
        courseId: activeLesson.id
      });

      // Success!
      toast.success(`Lesson Completed! +${earnedXP} XP`, { id: toastId });
      
      // Go back to Dashboard (It will auto-refresh with new data)
      handleNavigate('dashboard');

    } catch (err) {
      console.error(err);
      toast.error("Failed to save progress. Check connection.", { id: toastId });
    }
  };

  // --- RENDER PAGE ---
  const renderPage = () => {
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
        case 'leaderboard':
          return <Leaderboard username={user} avatar={avatar} onNavigate={handleNavigate} />;
        case 'profile':
          return <Profile onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} showToast={showToast} />;
        case 'lesson':
          return (
            <LessonView 
              lesson={activeLesson} 
              onComplete={handleLessonComplete}
              onExit={() => handleNavigate('dashboard')} 
            />
          );
        case 'forum':
          return <Forum username={user} avatar={avatar} onNavigate={handleNavigate} />;
        case 'stats': 
          return <Stats onNavigate={handleNavigate} />;
        
        // --- 2. ADDED THE NEW ROUTE HERE ---
        case 'credits':
           return <Credits onNavigate={handleNavigate} />;

        default:
          return <NotFound onNavigate={handleNavigate} />;
      }
    }

    switch (currentView) {
      case 'signup':
      case 'register': return <Register onSignUp={(name) => handleLogin(name, false)} onNavigate={handleNavigate} />;
      case 'forgot-password': return <ForgotPassword onNavigate={handleNavigate} />;
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