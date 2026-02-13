import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaTimes, FaSpinner } from 'react-icons/fa';

const ChatBox = ({ currentUserId, friend, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Matches your social.js: router.get('/chat/:user1/:user2')
        const res = await axios.get(`${apiUrl}/api/social/chat/${currentUserId}/${friend._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Chat sync error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // Polling every 4s to stay safe
    return () => clearInterval(interval);
  }, [currentUserId, friend._id, apiUrl]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Matches your social.js: router.post('/message')
      const res = await axios.post(`${apiUrl}/api/social/message`, {
        sender: currentUserId,
        recipient: friend._id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return (
    <div className="glass-card messenger-popup" style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '320px', height: '450px',
      display: 'flex', flexDirection: 'column', zIndex: 10000, border: '1.5px solid var(--accent-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden'
    }}>
      <div style={{ padding: '12px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(108, 92, 231, 0.1)' }}>
        <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>{friend.username}</h4>
        <FaTimes onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-body)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}><FaSpinner className="spin" /></div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.sender === currentUserId ? 'flex-end' : 'flex-start',
              background: msg.sender === currentUserId ? 'var(--accent-color)' : 'var(--card-border)',
              color: msg.sender === currentUserId ? '#fff' : 'var(--text-primary)',
              padding: '8px 14px', borderRadius: '15px', fontSize: '13px', maxWidth: '85%'
            }}>
              {msg.content}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} style={{ padding: '10px', display: 'flex', gap: '8px', borderTop: '1px solid var(--card-border)', background: 'var(--bg-body)' }}>
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message..."
          style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: 'none', padding: '8px 12px', borderRadius: '20px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
        />
        <button type="submit" style={{ background: 'var(--accent-color)', border: 'none', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;