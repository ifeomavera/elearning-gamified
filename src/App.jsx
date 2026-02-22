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
import StudentDirectory from './pages/StudentDirectory';
import ChatBox from './components/ChatBox'; 
import Banned from './pages/Banned'; 
import { Toaster, toast } from 'react-hot-toast';
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (username, userRoleFromDB, userId, userIsBanned = false) => {
    // ✅ CRITICAL FIX: Normalize username to prevent 400 errors from mobile capitalization
    const safeUsername = String(username).toLowerCase().trim();
    const normalizedRole = userRoleFromDB ? String(userRoleFromDB).toLowerCase() : 'scholar';

    setUser(safeUsername);
    setCurrentId(userId); 
    setRole(normalizedRole);
    setIsBanned(userIsBanned); 
    
    localStorage.setItem('currentUser', safeUsername);
    localStorage.setItem('userId', userId);
    localStorage.setItem('currentRole', normalizedRole);
    localStorage.setItem('isBanned', userIsBanned); 
    
    if (userIsBanned) { navigate('/banned'); } 
    else { toast.success(`Welcome, ${safeUsername}!`); navigate('/dashboard'); }
  };

  const handleLogout = () => {
    setUser(null); setCurrentId(null); localStorage.clear(); navigate('/login');
  };

  const handleLessonComplete = async (earnedXP) => {
    if (!activeLesson) return;
    const toastId = toast.loading("Syncing academic record...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/users/${user}/progress`, {
        xpEarned: earnedXP,
        courseId: activeLesson._id 
      });
      setRefreshTrigger(prev => prev + 1);
      toast.success(`Milestone Cleared! +${earnedXP} XP`, { id: toastId });
      navigate('/dashboard');
    } catch (err) { toast.error("Cloud sync failed.", { id: toastId }); }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/register" element={<Register onSignUp={(n, id, r, b) => handleLogin(n, r, id, b)} onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute user={user} isBanned={isBanned}>
            {role === 'admin' ? (
              <AdminDashboard 
                onLogout={handleLogout} 
                onOpenChat={(f) => setActiveChatFriend(f)} // ✅ FIX: Added missing onOpenChat prop
              />
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
        <Route path="/profile" element={<ProtectedRoute user={user} isBanned={isBanned}><Profile onNavigate={(v) => navigate(`/${v}`)} onUpdateProfile={setUser} /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute user={user} isBanned={isBanned}><Forum username={user} avatar={avatar} onNavigate={(v) => navigate(`/${v}`)} /></ProtectedRoute>} />
        <Route path="/course-catalog" element={<ProtectedRoute user={user} isBanned={isBanned}><CourseCatalog username={user} onNavigate={(v) => navigate(`/${v}`)} /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute user={user} isBanned={isBanned}><Stats username={user} onNavigate={(v) => navigate(`/${v}`)} refreshTrigger={refreshTrigger} /></ProtectedRoute>} />
        <Route path="/hall-of-fame" element={<ProtectedRoute user={user} isBanned={isBanned}><HallOfFame username={user} onNavigate={(v) => navigate(`/${v}`)} onOpenChat={(f) => setActiveChatFriend(f)} /></ProtectedRoute>} />
        <Route path="/lesson" element={<ProtectedRoute user={user} isBanned={isBanned}><LessonView lesson={activeLesson} onComplete={handleLessonComplete} onExit={() => navigate('/dashboard')} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      {activeChatFriend && currentId && !isBanned && <ChatBox currentUserId={currentId} friend={activeChatFriend} onClose={() => setActiveChatFriend(null)} />}
    </>
  );
}

export default App;