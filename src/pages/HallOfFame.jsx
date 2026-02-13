import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { socialApi } from '../api/social'; // Import the helper we just made

const HallOfFame = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user from local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(storedUser);
    fetchUsers(storedUser);
  }, []);

  const fetchUsers = async (myUser) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${API_URL}/api/users`); // Assuming you have a route to get all users
      
      // Sort users by XP (Highest first)
      const sortedUsers = res.data.sort((a, b) => b.xp - a.xp);
      setUsers(sortedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetUserId) => {
    try {
      await socialApi.sendRequest(currentUser._id, targetUserId);
      alert('Friend Request Sent!');
      // Optional: Refresh list to update button state (advanced)
    } catch (error) {
      alert(error.response?.data?.error || 'Error sending request');
    }
  };

  // Helper to check friend status
  const getFriendStatus = (targetUser) => {
    if (!currentUser) return 'none';
    if (targetUser.friends.includes(currentUser._id)) return 'friend';
    if (targetUser.friendRequests.some(r => r.from === currentUser._id)) return 'pending';
    return 'none';
  };

  if (loading) return <div className="text-center mt-20 text-white">Loading Champions...</div>;

  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 p-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-12 text-yellow-400 drop-shadow-lg">🏆 Hall of Fame 🏆</h1>

      {/* --- TOP 3 PODIUM --- */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16">
        {topThree.map((user, index) => {
          let cardStyle = "";
          let badge = "";
          let height = "";
          
          if (index === 0) { // 1st Place (Gold)
             cardStyle = "bg-yellow-500 from-yellow-400 to-yellow-600 border-yellow-300";
             badge = "👑";
             height = "h-80"; 
          } else if (index === 1) { // 2nd Place (Silver)
             cardStyle = "bg-gray-400 from-gray-300 to-gray-500 border-gray-200";
             badge = "🥈";
             height = "h-72";
          } else { // 3rd Place (Bronze)
             cardStyle = "bg-orange-500 from-orange-400 to-orange-600 border-orange-300";
             badge = "🥉";
             height = "h-64";
          }

          return (
            <div key={user._id} className={`relative flex flex-col items-center justify-center w-64 ${height} rounded-t-3xl shadow-2xl border-t-4 ${cardStyle} bg-gradient-to-b transform hover:scale-105 transition duration-300`}>
              <div className="text-6xl mb-4">{badge}</div>
              <h2 className="text-2xl font-bold uppercase tracking-wider">{user.username}</h2>
              <p className="text-lg font-mono mt-2 opacity-90">{user.xp} XP</p>
              <p className="text-sm mt-1 opacity-75">Level {user.level}</p>

              {/* Action Button */}
              {currentUser && currentUser._id !== user._id && (
                <button 
                  onClick={() => handleSendRequest(user._id)}
                  className="mt-6 px-6 py-2 bg-white text-gray-900 font-bold rounded-full shadow-md hover:bg-gray-100 transition"
                  disabled={getFriendStatus(user) !== 'none'}
                >
                  {getFriendStatus(user) === 'friend' ? 'Chat' : 
                   getFriendStatus(user) === 'pending' ? 'Pending' : 'Add Friend'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* --- THE REST OF THE LIST --- */}
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-6 text-gray-300 border-b border-gray-600 pb-2">Honorable Mentions</h3>
        {others.map((user, index) => (
          <div key={user._id} className="flex items-center justify-between p-4 mb-3 bg-white/5 hover:bg-white/10 rounded-lg transition">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-mono font-bold text-gray-400 w-8">#{index + 4}</span>
              <div>
                <p className="text-lg font-bold">{user.username}</p>
                <p className="text-sm text-gray-400">Level {user.level}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="font-mono text-yellow-400 font-bold">{user.xp} XP</span>
              {currentUser && currentUser._id !== user._id && (
                <button 
                  onClick={() => handleSendRequest(user._id)}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                    getFriendStatus(user) === 'none' 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                  disabled={getFriendStatus(user) !== 'none'}
                >
                  {getFriendStatus(user) === 'friend' ? 'Message' : 
                   getFriendStatus(user) === 'pending' ? 'Sent' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfFame;