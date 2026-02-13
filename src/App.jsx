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
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- PERSISTENT STATE ---
  const [user, setUser] = useState(() => localStorage.getItem('currentUser'));
  const [currentId, setCurrentId] = useState(() => localStorage.getItem('userId') || null); 
  const [role, setRole] = useState(() => localStorage.getItem('currentRole') || 'scholar'); 
  const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || "👨‍💻");
  const [activeChatFriend, setActiveChatFriend] = useState(null); 

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  const [activeLesson, setActiveLesson] = useState(null);

  // --- NAVIGATION LOGIC ---
  const handleNavigate = (view) => {
    const routes = {
      dashboard: '/dashboard',
      login: '/login',
      register: '/register',
      'forgot-password': '/forgot-password',
      'hall-of-fame': '/hall-of-fame',
      'course-catalog': '/course-catalog',
      directory: '/directory',
      credits: '/credits' // ✅ Explicit mapping
    };
    navigate(routes[view] || `/${view}`);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- SESSION MANAGEMENT ---
  const handleLogin = (username, userRoleFromDB, userId) => {
    setUser(username);
    setCurrentId(userId);
    setRole(userRoleFromDB);
    
    const currentAvatar = localStorage.getItem('userAvatar') || "👨‍💻";
    setAvatar(currentAvatar);
    
    localStorage.setItem('currentUser', username);
    localStorage.setItem('userId', userId);
    localStorage.setItem('currentRole', userRoleFromDB);
    localStorage.setItem('userAvatar', currentAvatar);
    
    toast.success(`Access Granted. Welcome, ${username}!`);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentId(null);
    setRole('scholar');
    localStorage.clear();
    navigate('/login');
    toast.success("Session terminated safely");
  };

  // --- ACADEMIC LOGIC ---
  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
    navigate('/lesson');
  };

  const handleLessonComplete = async (earnedXP) => {
    if (!activeLesson) return;
    const toastId = toast.loading("Syncing academic record...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      await axios.put(`${apiUrl}/api/users/${user}/progress`, {
        xpEarned: earnedXP,
        courseId: activeLesson.id
      });
      toast.success(`Milestone Cleared! +${earnedXP} XP`, { id: toastId });
      navigate('/dashboard');
    } catch (err) {
      console.error("Progress sync failed:", err);
      toast.error("Cloud sync failed. Check connection.", { id: toastId });
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
        <Route path="/register" element={<Register onSignUp={(name, id, userRole) => handleLogin(name, userRole, id)} onNavigate={handleNavigate} />} />
        <Route path="/forgot-password" element={<ForgotPassword onNavigate={handleNavigate} />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* ✅ PUBLIC ROUTE: Accessible without login for supervisors */}
        <Route path="/credits" element={<Credits onNavigate={handleNavigate} />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {(role === 'admin' || role === 'instructor') ? (
              <AdminDashboard 
                onLogout={handleLogout} 
                toggleTheme={toggleTheme} 
                currentTheme={theme} 
                role={role} 
                onOpenChat={(friend) => setActiveChatFriend(friend)} 
              />
            ) : (
              <Dashboard 
                username={user} 
                avatar={avatar} 
                onLogout={handleLogout} 
                onNavigate={handleNavigate} 
                toggleTheme={toggleTheme} 
                currentTheme={theme} 
                onStartLesson={handleStartLesson}
                onOpenChat={(friend) => setActiveChatFriend(friend)} 
              />
            )}
          </ProtectedRoute>
        } />

        <Route path="/hall-of-fame" element={<ProtectedRoute><HallOfFame username={user} onNavigate={handleNavigate} onOpenChat={(friend) => setActiveChatFriend(friend)} /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard username={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/course-catalog" element={<ProtectedRoute><CourseCatalog username={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/directory" element={<ProtectedRoute><StudentDirectory currentUsername={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile onNavigate={handleNavigate} onUpdateProfile={setUser} /></ProtectedRoute>} />
        <Route path="/lesson" element={<ProtectedRoute><LessonView lesson={activeLesson} onComplete={handleLessonComplete} onExit={() => navigate('/dashboard')} /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><Forum username={user} avatar={avatar} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><Stats onNavigate={handleNavigate} /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>

      {/* ✅ PERSISTENT COMMS */}
      {activeChatFriend && (
        <ChatBox 
          currentUserId={currentId} 
          friend={activeChatFriend} 
          onClose={() => setActiveChatFriend(null)} 
        />
      )}
    </>
  );
}

export default App;