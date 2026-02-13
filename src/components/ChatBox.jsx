import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaMinus, FaChevronUp, FaArrowsAlt } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ChatBox = ({ currentUserId, friend, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  
  // DRAGGING STATE
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: window.innerHeight - 440 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const scrollRef = useRef();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // --- 1. COMMS SYNC ---
  useEffect(() => {
    const fetchMessages = async () => {
      // ✅ GUARD: Prevent backend crash if ID is missing (Resolves your 500 error)
      if (!currentUserId || !friend?._id || currentUserId === 'null') return;
      
      try {
        const res = await axios.get(`${apiUrl}/api/social/messages/${currentUserId}/${friend._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Comms link failed:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [currentUserId, friend?._id, apiUrl]);

  // Auto-scroll to latest signal
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 2. SIGNAL DISPATCH ---
  const handleSend = async (e) => {
    e.preventDefault();
    // ✅ GUARD: Prevent sending if identity is unauthorized
    if (!newMessage.trim() || !currentUserId || currentUserId === 'null') {
      return toast.error("Identity verification failed. Please re-login.");
    }

    try {
      const res = await axios.post(`${apiUrl}/api/social/messages/send`, {
        from: currentUserId,
        to: friend._id,
        text: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      toast.error("Signal lost. Check server link.");
    }
  };

  // --- 3. DRAGGING LOGIC ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)} 
        style={{ ...styles.minimizedTab, left: position.x + 100, top: window.innerHeight - 60 }}
      >
        <span>💬 {friend.username}</span>
        <FaChevronUp />
      </div>
    );
  }

  return (
    <div className="glass-card animate-pop" style={{ ...styles.floatingContainer, left: position.x, top: position.y }}>
      {/* Draggable Header */}
      <div style={styles.header} onMouseDown={handleMouseDown}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'grab' }}>
          <div style={styles.onlineStatus}></div>
          <span style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text-primary)' }}>{friend.username}</span>
          <FaArrowsAlt size={10} style={{ opacity: 0.5 }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', opacity: 0.7, color: 'var(--text-secondary)' }}>
          <FaMinus cursor="pointer" onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} />
          <FaTimes cursor="pointer" onClick={(e) => { e.stopPropagation(); onClose(); }} />
        </div>
      </div>

      {/* Comms Feed */}
      <div style={styles.messageArea}>
        {messages.map((m, i) => (
          <div key={i} style={{
            ...styles.msgBubble,
            alignSelf: m.sender === currentUserId ? 'flex-end' : 'flex-start',
            background: m.sender === currentUserId ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
            color: m.sender === currentUserId ? '#fff' : 'var(--text-primary)'
          }}>
            {m.text}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Terminal */}
      <form onSubmit={handleSend} style={styles.inputForm}>
        <input 
          autoFocus
          style={styles.input}
          placeholder="Type secure message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" style={styles.sendBtn}><FaPaperPlane size={14} /></button>
      </form>
    </div>
  );
};

const styles = {
  floatingContainer: {
    position: 'fixed', width: '300px', height: '400px',
    zIndex: 999999, display: 'flex', flexDirection: 'column', 
    background: 'var(--bg-card)', border: '1px solid var(--card-border)',
    borderRadius: '12px', overflow: 'hidden', pointerEvents: 'all',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)'
  },
  minimizedTab: {
    position: 'fixed', width: '200px', height: '45px',
    background: 'var(--accent-color)', color: '#fff', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px',
    cursor: 'pointer', zIndex: 999999, fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
  },
  header: { padding: '12px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', userSelect: 'none' },
  onlineStatus: { width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 8px #2ecc71' },
  messageArea: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
  msgBubble: { padding: '8px 12px', borderRadius: '12px', fontSize: '12px', maxWidth: '85%', lineHeight: '1.4' },
  inputForm: { padding: '12px', display: 'flex', gap: '8px', borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.1)' },
  input: { flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px 15px', borderRadius: '20px', color: 'var(--text-primary)', outline: 'none', fontSize: '12px' },
  sendBtn: { background: 'var(--accent-color)', border: 'none', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default ChatBox;