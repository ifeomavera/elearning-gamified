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
import Toast from './components/Toast';

function App() {
  // 1. INSTANTLY LOAD USER & ROLE
  const [user, setUser] = useState(() => localStorage.getItem('currentUser'));
  const [role, setRole] = useState(() => localStorage.getItem('currentRole') || 'student');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || "👨‍💻");

  // 2. INSTANTLY LOAD THEME
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  // 3. INSTANTLY LOAD VIEW
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('currentView');
    if (saved === 'lesson') return 'dashboard';
    if (localStorage.getItem('currentUser') && !saved) return 'dashboard';
    return saved || 'login';
  });

  const [activeLesson, setActiveLesson] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // 4. THEME UPDATER
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
    
    showToast(`Welcome back, ${username}!`);
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
    showToast("Logged out successfully", "info");
  };

  // --- LESSON LOGIC ---
  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
    handleNavigate('lesson');
  };

  const handleLessonComplete = (earnedXP) => {
    const currentXP = parseInt(localStorage.getItem('studentXP') || '2350');
    const newXP = currentXP + earnedXP;
    localStorage.setItem('studentXP', newXP);

    const savedCoursesStr = localStorage.getItem('appCourses');
    if (savedCoursesStr && activeLesson) {
      const courses = JSON.parse(savedCoursesStr);
      const updatedCourses = courses.map(c => 
        c.id === activeLesson.id ? { ...c, completed: true } : c
      );
      localStorage.setItem('appCourses', JSON.stringify(updatedCourses));
    }

    showToast(`Lesson Completed! +${earnedXP} XP`, "success");
    handleNavigate('dashboard');
  };

  // --- RENDER PAGE ---
  const renderPage = () => {
    if (user) {
      // FIX: PASS THEME PROPS TO ADMIN DASHBOARD
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
      {renderPage()}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

export default App;