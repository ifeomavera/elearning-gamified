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

// ✅ UPGRADED: ProtectedRoute now checks for Bans and intercepts navigation
const ProtectedRoute = ({ user, isBanned, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (isBanned) return <Navigate to="/banned" replace />; 
  return children;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => localStorage.getItem('currentUser'));
  
  const [currentId, setCurrentId] = useState(() => {
    const savedId = localStorage.getItem('userId');
    return (savedId && savedId !== 'undefined' && savedId !== 'null') ? savedId : null;
  }); 
  
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('currentRole');
    return savedRole ? savedRole.toLowerCase() : 'scholar';
  }); 

  const [isBanned, setIsBanned] = useState(() => localStorage.getItem('isBanned') === 'true');

  const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || "👨‍💻");
  const [activeChatFriend, setActiveChatFriend] = useState(null); 

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (currentId && currentId !== 'undefined' && currentId !== 'null') {
      localStorage.setItem('userId', currentId);
    }
  }, [currentId]);

  const handleNavigate = (view) => {
    const routes = {
      dashboard: '/dashboard',
      login: '/login',
      register: '/register',
      'forgot-password': '/forgot-password',
      'hall-of-fame': '/hall-of-fame',
      'course-catalog': '/course-catalog',
      directory: '/directory',
      credits: '/credits' 
    };
    navigate(routes[view] || `/${view}`);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (username, userRoleFromDB, userId, userIsBanned = false) => {
    if (!userId || userId === 'undefined') {
      console.error("Critical Auth Error: Missing User ID in handshake.");
      return toast.error("Identity sync failed. Please contact admin.");
    }

    const normalizedRole = userRoleFromDB ? String(userRoleFromDB).toLowerCase() : 'scholar';

    setUser(username);
    setCurrentId(userId); 
    setRole(normalizedRole);
    setIsBanned(userIsBanned); 
    
    const currentAvatar = localStorage.getItem('userAvatar') || "👨‍💻";
    setAvatar(currentAvatar);
    
    localStorage.setItem('currentUser', username);
    localStorage.setItem('userId', userId);
    localStorage.setItem('currentRole', normalizedRole);
    localStorage.setItem('userAvatar', currentAvatar);
    localStorage.setItem('isBanned', userIsBanned); 
    
    if (userIsBanned) {
      toast.error("Account access is restricted.");
      navigate('/banned');
    } else {
      toast.success(`Access Granted. Welcome, ${username}!`);
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentId(null);
    setRole('scholar');
    setIsBanned(false); 
    setActiveChatFriend(null);
    localStorage.clear();
    navigate('/login');
    toast.success("Session terminated safely");
  };

  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
    navigate('/lesson');
  };

  const handleLessonComplete = async (earnedXP) => {
    if (!activeLesson) return;
    const toastId = toast.loading("Syncing academic record...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/users/${user}/progress`, {
        xpEarned: earnedXP,
        courseId: activeLesson._id // ✅ FIXED: Changed .id to ._id for MongoDB sync
      });
      toast.success(`Milestone Cleared! +${earnedXP} XP`, { id: toastId });
      navigate('/dashboard');
    } catch (err) {
      console.error("Progress sync failed:", err);
      toast.error("Cloud sync failed. Check connection.", { id: toastId });
    }
  };

  const openChat = (friend) => {
    console.log("Chat signal received for:", friend?.username, "Target ID:", friend?._id || friend?.id);
    if (friend && (friend._id || friend.id)) {
      setActiveChatFriend(friend);
    } else {
      toast.error("Unable to establish secure comms link.");
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} onNavigate={handleNavigate} />} />
        <Route path="/register" element={<Register onSignUp={(name, id, uRole, isBanned) => handleLogin(name, uRole, id, isBanned)} onNavigate={handleNavigate} />} />
        <Route path="/forgot-password" element={<ForgotPassword onNavigate={handleNavigate} />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/credits" element={<Credits onNavigate={handleNavigate} />} />

        {/* ✅ THE JAIL: Banned Route */}
        <Route path="/banned" element={
          user && isBanned ? <Banned onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />
        } />

        {/* ✅ PROTECTED ROUTES */}
        <Route path="/dashboard" element={
          <ProtectedRoute user={user} isBanned={isBanned}>
            {(role === 'admin' || role === 'instructor') ? (
              <AdminDashboard 
                onLogout={handleLogout} 
                toggleTheme={toggleTheme} 
                currentTheme={theme} 
                role={role} 
                onOpenChat={openChat} 
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
                onOpenChat={openChat} 
              />
            )}
          </ProtectedRoute>
        } />

        <Route path="/hall-of-fame" element={<ProtectedRoute user={user} isBanned={isBanned}><HallOfFame username={user} onNavigate={handleNavigate} onOpenChat={openChat} /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute user={user} isBanned={isBanned}><Leaderboard username={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/course-catalog" element={<ProtectedRoute user={user} isBanned={isBanned}><CourseCatalog username={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/directory" element={<ProtectedRoute user={user} isBanned={isBanned}><StudentDirectory currentUsername={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user} isBanned={isBanned}><Profile onNavigate={handleNavigate} onUpdateProfile={setUser} /></ProtectedRoute>} />
        <Route path="/lesson" element={<ProtectedRoute user={user} isBanned={isBanned}><LessonView lesson={activeLesson} onComplete={handleLessonComplete} onExit={() => navigate('/dashboard')} /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute user={user} isBanned={isBanned}><Forum username={user} avatar={avatar} onNavigate={handleNavigate} /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute user={user} isBanned={isBanned}><Stats username={user} onNavigate={handleNavigate} /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>

      {/* Persistent Messenger */}
      {activeChatFriend && currentId && !isBanned && (
        <div style={{ position: 'fixed', zIndex: 100000, bottom: 0, right: 0 }}>
            <ChatBox 
              currentUserId={currentId} 
              friend={activeChatFriend} 
              onClose={() => setActiveChatFriend(null)} 
            />
        </div>
      )}
    </>
  );
}

export default App;