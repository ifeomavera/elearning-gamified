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
import Stats from './pages/Stats'; // <--- NEW IMPORT
import Toast from './components/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("👨‍💻");
  const [role, setRole] = useState('student');
  
  // THEME STATE
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'light');
  
  // NAVIGATION STATE
  const [currentView, setCurrentView] = useState('login');
  const [activeLesson, setActiveLesson] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  // 1. LOAD SAVED DATA
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('currentRole');
    const savedAvatar = localStorage.getItem('userAvatar');
    
    if (savedUser) {
      setUser(savedUser);
      setRole(savedRole || 'student');
      if (savedAvatar) setAvatar(savedAvatar);
      // Ensure we don't get stuck on login if we have a user
      if (currentView === 'login') setCurrentView('dashboard');
    }
  }, []);

  // 2. APPLY THEME
  useEffect(() => {
    if (!user) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('appTheme', theme);
    }
  }, [theme, user]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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
    setCurrentView('dashboard');
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
    setCurrentView('login');
    showToast("Logged out successfully", "info");
  };

  const handleNavigate = (view) => setCurrentView(view);

  // --- START LESSON ---
  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
    setCurrentView('lesson');
  };

  // --- COMPLETE LESSON & SAVE DATA ---
  const handleLessonComplete = (earnedXP) => {
    // 1. Update XP
    const currentXP = parseInt(localStorage.getItem('studentXP') || '2350');
    const newXP = currentXP + earnedXP;
    localStorage.setItem('studentXP', newXP);

    // 2. Mark Course as Completed
    const savedCoursesStr = localStorage.getItem('appCourses');
    if (savedCoursesStr && activeLesson) {
      const courses = JSON.parse(savedCoursesStr);
      const updatedCourses = courses.map(c => 
        c.id === activeLesson.id ? { ...c, completed: true } : c
      );
      localStorage.setItem('appCourses', JSON.stringify(updatedCourses));
    }

    // 3. Return
    setCurrentView('dashboard');
    showToast(`Lesson Completed! +${earnedXP} XP`, "success");
  };

  const renderPage = () => {
    if (user) {
      if (role === 'admin') return <AdminDashboard onLogout={handleLogout} showToast={showToast} />;
      
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
              onExit={() => setCurrentView('dashboard')} 
            />
          );
        case 'forum':
          return (
            <Forum 
              username={user} 
              avatar={avatar} 
              onNavigate={handleNavigate} 
            />
          );
        case 'stats': // <--- NEW ROUTE FOR ANALYTICS
          return (
            <Stats 
              onNavigate={handleNavigate} 
            />
          );
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