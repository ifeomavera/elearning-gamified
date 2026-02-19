import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

const ChatBox = ({ currentUserId, friend, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchMessages = async () => {
      // ✅ IDENTITY CHECK: Prevents the 500 error you saw earlier
      if (!currentUserId || currentUserId === 'undefined' || !friend?._id) return;
      
      try {
        const res = await axios.get(`${apiUrl}/api/social/messages/${currentUserId}/${friend._id}`, {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); 
    return () => clearInterval(interval);
  }, [currentUserId, friend?._id, apiUrl, token]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId || currentUserId === 'undefined') return;

    try {
      const res = await axios.post(`${apiUrl}/api/social/messages/send`, {
        from: currentUserId,
        to: friend._id,
        text: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      toast.error("Signal lost.");
    }
  };

  return (
    <div className="glass-card animate-pop" style={styles.container}>
      <div style={styles.header}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{friend.username}</span>
        <FaTimes cursor="pointer" onClick={onClose} color="var(--text-secondary)" />
      </div>
      <div style={styles.feed}>
        {messages.map((m, i) => (
          <div key={i} style={{
            ...styles.bubble,
            alignSelf: m.sender === currentUserId ? 'flex-end' : 'flex-start',
            background: m.sender === currentUserId ? 'var(--accent-color)' : 'var(--bg-body)',
            color: m.sender === currentUserId ? '#fff' : 'var(--text-primary)'
          }}>
            {m.text}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={handleSend} style={styles.inputForm}>
        <input 
          style={styles.input}
          placeholder="Type message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" style={styles.btn}><FaPaperPlane /></button>
      </form>
    </div>
  );
};

const styles = {
  // ✅ HIGH Z-INDEX: Ensures the box stays on top of all dashboard elements
  container: { position: 'fixed', bottom: '20px', right: '20px', width: '320px', height: '450px', zIndex: 999999, display: 'flex', flexDirection: 'column', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--card-border)', background: 'var(--bg-card)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' },
  header: { padding: '15px', background: 'rgba(128,128,128,0.1)', display: 'flex', justifyContent: 'space-between' },
  feed: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  bubble: { padding: '8px 12px', borderRadius: '12px', fontSize: '13px', maxWidth: '80%' },
  inputForm: { padding: '10px', display: 'flex', gap: '5px' },
  input: { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid var(--card-border)', background: 'var(--bg-body)', color: 'var(--text-primary)', outline: 'none' },
  btn: { background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default ChatBox;