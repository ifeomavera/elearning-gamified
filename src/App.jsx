import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import LessonView from './pages/LessonView';
import Forum from './pages/Forum';
import Stats from './pages/Stats';
import Credits from './pages/Credits';
import HallOfFame from './pages/HallOfFame';
import CourseCatalog from './pages/CourseCatalog';
import StudentDirectory from './pages/StudentDirectory'; // ✅ Added Student Directory import
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [user, setUser] = useState(() => localStorage.getItem('currentUser'));
  const [role, setRole] = useState(() => localStorage.getItem('currentRole') || 'student');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || "👨‍💻");

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  const [activeLesson, setActiveLesson] = useState(null);

  // --- HELPER: Navigation mapping ---
  const handleNavigate = (view) => {
    if (view === 'dashboard') navigate('/dashboard');
    else if (view === 'login') navigate('/login');
    else if (view === 'register') navigate('/register');
    else if (view === 'forgot-password') navigate('/forgot-password');
    else if (view === 'hall-of-fame') navigate('/hall-of-fame');
    else if (view === 'course-catalog') navigate('/course-catalog');
    else if (view === 'directory') navigate('/directory'); // ✅ Added Directory mapping
    else navigate(`/${view}`);
  };

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
    navigate('/dashboard'); 
  };

  const handleUpdateProfile = (newName, newAvatar) => {
    setUser(newName);    
    setAvatar(newAvatar); 
  };

  const handleLogout = () => {
    setUser(null);
    setRole('student');
    localStorage.clear();
    navigate('/login');
    toast.success("Logged out successfully");
  };

  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
    navigate('/lesson');
  };

  const handleLessonComplete = async (earnedXP) => {
    if (!activeLesson) return;
    const toastId = toast.loading("Saving progress...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      await axios.put(`${apiUrl}/api/users/${user}/progress`, {
        xpEarned: earnedXP,
        courseId: activeLesson.id
      });
      toast.success(`Lesson Completed! +${earnedXP} XP`, { id: toastId });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error("Failed to save progress.", { id: toastId });
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} onNavigate={handleNavigate} />} />
        <Route path="/register" element={<Register onSignUp={(name) => handleLogin(name, false)} onNavigate={handleNavigate} />} />
        <Route path="/forgot-password" element={<ForgotPassword onNavigate={handleNavigate} />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            {role === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} showToast={showToast} toggleTheme={toggleTheme} currentTheme={theme} />
            ) : (
              <Dashboard username={user} avatar={avatar} onLogout={handleLogout} onNavigate={handleNavigate} showToast={showToast} toggleTheme={toggleTheme} currentTheme={theme} onStartLesson={handleStartLesson} />
            )}
          </ProtectedRoute>
        } />

        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard username={user} avatar={avatar} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/hall-of-fame" element={<ProtectedRoute><HallOfFame onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/course-catalog" element={<ProtectedRoute><CourseCatalog username={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        
        {/* ✅ Added Protected Directory Route */}
        <Route path="/directory" element={<ProtectedRoute><StudentDirectory currentUsername={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        
        <Route path="/profile" element={<ProtectedRoute><Profile onNavigate={handleNavigate} onUpdateProfile={handleUpdateProfile} showToast={showToast} /></ProtectedRoute>} />
        <Route path="/lesson" element={<ProtectedRoute><LessonView lesson={activeLesson} onComplete={handleLessonComplete} onExit={() => navigate('/dashboard')} /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><Forum username={user} avatar={avatar} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><Stats onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/credits" element={<ProtectedRoute><Credits onNavigate={handleNavigate} /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default App;