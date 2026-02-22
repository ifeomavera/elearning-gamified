import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; 
import ResetPassword from './pages/ResetPassword';     
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Forum from './pages/Forum';
import Stats from './pages/Stats';
import CourseCatalog from './pages/CourseCatalog';
import LessonView from './pages/LessonView';
import StudyDashboard from './pages/StudyDashboard'; 
import ChatBox from './components/ChatBox'; 
import Banned from './pages/Banned'; 
import Toast from './components/Toast'; // ✅ Import your upgraded Toast
import axios from 'axios';

const ProtectedRoute = ({ user, isBanned, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (isBanned) return <Navigate to="/banned" replace />; 
  return children;
};

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => localStorage.getItem('currentUser'));
  const [currentId, setCurrentId] = useState(() => localStorage.getItem('userId')); 
  const [role, setRole] = useState(() => localStorage.getItem('currentRole')?.toLowerCase() || 'scholar'); 
  const [isBanned, setIsBanned] = useState(() => localStorage.getItem('isBanned') === 'true');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || "👨‍💻");
  const [activeChatFriend, setActiveChatFriend] = useState(null); 
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'light');
  const [activeLesson, setActiveLesson] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ GLOBAL TOAST STATE
  const [toastConfig, setToastConfig] = useState(null);

  const showToast = (message, type = 'success', xpAmount = null) => {
    setToastConfig({ message, type, xpAmount });
  };

  // ✅ SESSION SECURITY: Auto-logout after 30 minutes
  useEffect(() => {
    if (!user) return;
    const checkInactivity = () => {
      const lastAction = localStorage.getItem('lastActionTime');
      const now = Date.now();
      const limit = 30 * 60 * 1000; 
      if (lastAction && (now - lastAction > limit)) {
        handleLogout();
        showToast("Session expired. Please log in again.", "error");
      }
    };
    const updateActivity = () => localStorage.setItem('lastActionTime', Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    const interval = setInterval(checkInactivity, 60000); 
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (usernameFromDB, userRoleFromDB, userId, userIsBanned = false) => {
    const safeUsername = String(usernameFromDB).trim(); 
    const normalizedRole = userRoleFromDB ? String(userRoleFromDB).toLowerCase() : 'scholar';
    setUser(safeUsername);
    setCurrentId(userId); 
    setRole(normalizedRole);
    setIsBanned(userIsBanned); 
    localStorage.setItem('currentUser', safeUsername);
    localStorage.setItem('userId', userId);
    localStorage.setItem('currentRole', normalizedRole);
    localStorage.setItem('isBanned', userIsBanned); 
    localStorage.setItem('lastActionTime', Date.now()); 
    
    if (userIsBanned) { 
      navigate('/banned'); 
    } else { 
      showToast(`Welcome back, ${safeUsername}!`, "success"); 
      navigate('/dashboard'); 
    }
  };

  const handleLogout = () => {
    setUser(null); setCurrentId(null); localStorage.clear(); navigate('/login');
  };

  const handleLessonComplete = async (earnedXP, quizStats) => {
    if (!activeLesson) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://elearning-api-dr6r.onrender.com';
      await axios.put(`${apiUrl}/api/users/${user}/progress`, {
        xpEarned: earnedXP,
        courseId: activeLesson._id,
        courseTitle: activeLesson.title,
        stats: quizStats
      });
      setRefreshTrigger(prev => prev + 1);
      showToast("Milestone Cleared!", "reward", earnedXP); // ✅ Using Reward Toast
      navigate('/dashboard');
    } catch (err) { 
      showToast("Cloud sync failed.", "error"); 
    }
  };

  return (
    <>
      {/* ✅ RENDER GLOBAL TOAST */}
      {toastConfig && (
        <Toast 
          message={toastConfig.message} 
          type={toastConfig.type} 
          xpAmount={toastConfig.xpAmount} 
          onClose={() => setToastConfig(null)} 
        />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/register" element={<Register onSignUp={(n, id, r, b) => handleLogin(n, r, id, b)} onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/banned" element={<Banned />} />
        <Route path="/forgot-password" element={<ForgotPassword onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword onNavigate={(v) => navigate(`/${v}`)} />} />

        <Route path="/dashboard" element={
          <ProtectedRoute user={user} isBanned={isBanned}>
            {role === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} onOpenChat={(f) => setActiveChatFriend(f)} />
            ) : (
              <Dashboard 
                username={user} avatar={avatar} refreshTrigger={refreshTrigger}
                onLogout={handleLogout} onNavigate={(v) => navigate(`/${v}`)} 
                toggleTheme={toggleTheme} currentTheme={theme} 
                onStartLesson={(l) => { setActiveLesson(l); navigate('/lesson'); }} 
                onOpenChat={(f) => setActiveChatFriend(f)} 
              />
            )}
          </ProtectedRoute>
        } />

        <Route path="/study-vault" element={
          <ProtectedRoute user={user} isBanned={isBanned}>
            <StudyDashboard 
              userId={currentId} 
              onNavigate={(v) => navigate(`/${v}`)} 
              showToast={showToast} // ✅ Pass the toast trigger here
            />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={<ProtectedRoute user={user} isBanned={isBanned}><Profile onNavigate={(v) => navigate(`/${v}`)} onUpdateProfile={setUser} /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute user={user} isBanned={isBanned}><Forum username={user} avatar={avatar} onNavigate={(v) => navigate(`/${v}`)} /></ProtectedRoute>} />
        <Route path="/course-catalog" element={<ProtectedRoute user={user} isBanned={isBanned}><CourseCatalog username={user} onNavigate={(v) => navigate(`/${v}`)} /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute user={user} isBanned={isBanned}><Stats username={user} onNavigate={(v) => navigate(`/${v}`)} refreshTrigger={refreshTrigger} /></ProtectedRoute>} />
        <Route path="/lesson" element={<ProtectedRoute user={user} isBanned={isBanned}><LessonView lesson={activeLesson} onComplete={handleLessonComplete} onExit={() => navigate('/dashboard')} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {activeChatFriend && currentId && !isBanned && <ChatBox currentUserId={currentId} friend={activeChatFriend} onClose={() => setActiveChatFriend(null)} />}
    </>
  );
}

export default App;