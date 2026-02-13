import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SocialHub = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        
        // Fetch real-time activities from the backend
        const res = await axios.get(`${API_URL}/api/users/activities`);
        setActivities(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Social Hub Sync Error:", err);
        setLoading(false);
      }
    };

    fetchSocialData();
    // Auto-refresh activities every 30 seconds
    const interval = setInterval(fetchSocialData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Vici Network...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* --- ACTIVITY FEED --- */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Recent Activity Feed</h3>
        {activities.length > 0 ? (
          activities.map((act, index) => (
            <div key={index} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
              <div className="text-2xl bg-white/10 h-12 w-12 rounded-full flex items-center justify-center shadow-inner">
                {act.avatar || "👤"}
              </div>
              <div>
                <p className="text-sm font-bold">
                  <span className="text-blue-400">{act.username}</span> {act.action}
                </p>
                <p className="text-xs text-gray-400 font-medium">{act.detail}</p>
              </div>
              <div className="ml-auto text-[10px] font-black text-gray-600 uppercase">
                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm">No recent activities to show.</p>
        )}
      </div>

      {/* --- FRIENDS LIST --- */}
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 h-fit">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Study Circle</h3>
          <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            {user?.friends?.length || 0}
          </span>
        </div>
        
        <div className="space-y-4">
          {user?.friends?.length > 0 ? (
            user.friends.map((friend, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold border-2 border-transparent group-hover:border-white/20 transition-all">
                  {friend.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{friend.username}</p>
                  <p className="text-[10px] text-gray-500 font-black uppercase">Level {friend.level || 1}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2 opacity-20">🤝</div>
              <p className="text-xs text-gray-500 font-medium italic">Your circle is empty.</p>
              <button className="mt-4 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Find Classmates →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialHub;