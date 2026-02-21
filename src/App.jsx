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

// ✅ AUTH GUARD: Bulletproof protection for routes
const ProtectedRoute = ({ user, isBanned, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (isBanned) return <Navigate to="/banned" replace />; 
  return children;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // AUTHENTICATION STATE
  const [user, setUser] = useState(() => localStorage.getItem('currentUser'));
  const [currentId, setCurrentId] = useState(() => {
    const savedId = localStorage.getItem('userId');
    return (savedId && savedId !== 'undefined' && savedId !== 'null') ? savedId : null;
  }); 
  const [role, setRole] = useState(() => localStorage.getItem('currentRole')?.toLowerCase() || 'scholar'); 
  const [isBanned, setIsBanned] = useState(() => localStorage.getItem('isBanned') === 'true');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || "👨‍💻");

  // SYSTEM STATE
  const [activeChatFriend, setActiveChatFriend] = useState(null); 
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'light');
  const [activeLesson, setActiveLesson] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ Crucial for real-time dashboard sync

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // ✅ SYNC LOGIC: Triggers re-fetch when external data changes
  const handleEnrollSuccess = () => setRefreshTrigger(prev => prev + 1);

  const handleLogin = (username, userRoleFromDB, userId, userIsBanned = false) => {
    if (!userId || userId === 'undefined') return toast.error("Handshake failed.");
    const normalizedRole = userRoleFromDB ? String(userRoleFromDB).toLowerCase() : 'scholar';
    setUser(username); setCurrentId(userId); setRole(normalizedRole); setIsBanned(userIsBanned); 
    localStorage.setItem('currentUser', username); localStorage.setItem('userId', userId);
    localStorage.setItem('currentRole', normalizedRole); localStorage.setItem('isBanned', userIsBanned); 
    if (userIsBanned) { navigate('/banned'); } else { toast.success(`Welcome, ${username}!`); navigate('/dashboard'); }
  };

  const handleLogout = () => {
    setUser(null); setCurrentId(null); setRole('scholar'); setIsBanned(false); 
    setActiveChatFriend(null); localStorage.clear(); navigate('/login');
    toast.success("Session terminated safely");
  };

  const handleStartLesson = (lesson) => { setActiveLesson(lesson); navigate('/lesson'); };

  const handleLessonComplete = async (earnedXP) => {
    if (!activeLesson) return;
    const toastId = toast.loading("Finalizing Academic Progress...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/users/${user}/progress`, { xpEarned: earnedXP, courseId: activeLesson._id });
      setRefreshTrigger(prev => prev + 1); // ✅ Immediate Dashboard refresh
      toast.success(`Success! +${earnedXP} XP Earned`, { id: toastId });
      navigate('/dashboard');
    } catch (err) { toast.error("Sync failed.", { id: toastId }); }
  };

  const openChat = (friend) => { if (friend && (friend._id || friend.id)) setActiveChatFriend(friend); };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* PUBLIC ACCESS */}
        <Route path="/login" element={<Login onLogin={handleLogin} onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/register" element={<Register onSignUp={(n, id, r, b) => handleLogin(n, r, id, b)} onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/forgot-password" element={<ForgotPassword onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/credits" element={<Credits onNavigate={(v) => navigate(`/${v}`)} />} />
        <Route path="/banned" element={user && isBanned ? <Banned onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />} />

        {/* CORE PROTECTED ENGINE */}
        <Route path="/dashboard" element={
          <ProtectedRoute user={user} isBanned={isBanned}>
            {(role === 'admin' || role === 'instructor') ? (
              <AdminDashboard onLogout={handleLogout} toggleTheme={toggleTheme} currentTheme={theme} role={role} onOpenChat={openChat} />
            ) : (
              <Dashboard 
                username={user} avatar={avatar} onLogout={handleLogout} onNavigate={(v) => navigate(`/${v}`)} 
                toggleTheme={toggleTheme} currentTheme={theme} onStartLesson={handleStartLesson}
                onOpenChat={openChat} refreshTrigger={refreshTrigger} 
              />
            )}
          </ProtectedRoute>
        } />

        <Route path="/course-catalog" element={<ProtectedRoute user={user} isBanned={isBanned}><CourseCatalog username={user} onNavigate={(v) => navigate(`/${v}`)} onEnrollSuccess={handleEnrollSuccess} /></ProtectedRoute>} />
        <Route path="/lesson" element={<ProtectedRoute user={user} isBanned={isBanned}><LessonView lesson={activeLesson} onComplete={handleLessonComplete} onExit={() => navigate('/dashboard')} /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute user={user} isBanned={isBanned}><Stats username={user} onNavigate={(v) => navigate(`/${v}`)} refreshTrigger={refreshTrigger} /></ProtectedRoute>} />
        <Route path="/hall-of-fame" element={<ProtectedRoute user={user} isBanned={isBanned}><HallOfFame username={user} onNavigate={(v) => navigate(`/${v}`)} onOpenChat={openChat} /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute user={user} isBanned={isBanned}><Leaderboard username={user} onNavigate={(v) => navigate(`/${v}`)} /></ProtectedRoute>} />
        <Route path="/directory" element={<ProtectedRoute user={user} isBanned={isBanned}><StudentDirectory currentUsername={user} onNavigate={(v) => navigate(`/${v}`)} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user} isBanned={isBanned}><Profile onNavigate={(v) => navigate(`/${v}`)} onUpdateProfile={setUser} /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute user={user} isBanned={isBanned}><Forum username={user} avatar={avatar} onNavigate={(v) => navigate(`/${v}`)} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>

      {/* MESSENGER SYSTEM */}
      {activeChatFriend && currentId && !isBanned && (
        <div style={{ position: 'fixed', zIndex: 100000, bottom: 0, right: 0 }}>
            <ChatBox currentUserId={currentId} friend={activeChatFriend} onClose={() => setActiveChatFriend(null)} />
        </div>
      )}
    </>
  );
}

export default App;