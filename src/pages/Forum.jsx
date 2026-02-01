import React, { useState } from 'react';
// FIX: Removed 'FaSend', using 'FaPaperPlane' instead
import { FaArrowLeft, FaPaperPlane, FaCommentDots, FaThumbsUp, FaReply } from 'react-icons/fa';

const Forum = ({ username, avatar, onNavigate }) => {
  const [posts, setPosts] = useState([
    { 
      id: 1, author: "Sarah J.", avatar: "👩‍💻", badge: "Scholar", 
      title: "Help with React Hooks?", content: "I'm stuck on useEffect, can anyone explain the dependency array?", 
      category: "Help", likes: 5, comments: [
        { user: "David K.", text: "Think of it as 'Run this code ONLY when these variables change'." },
        { user: "System", text: "Check Module 2 for a full guide!" }
      ] 
    },
    { 
      id: 2, author: "David K.", avatar: "🦸‍♂️", badge: "Quiz Master", 
      title: "Found a great resource for CSS Grid", content: "Check out this guide, it helped me understand layout better!", 
      category: "Resources", likes: 12, comments: [
        { user: "Sarah J.", text: "Thanks for sharing!" }
      ] 
    },
    { 
      id: 3, author: "System", avatar: "🤖", badge: "Admin", 
      title: "Welcome to the Community!", content: "Be kind and helpful to your peers.", 
      category: "Announcements", likes: 99, comments: [] 
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("All");
  
  const [activePostId, setActivePostId] = useState(null); 
  const [replyInputs, setReplyInputs] = useState({}); 

  const filteredPosts = filter === "All" 
    ? posts 
    : posts.filter(post => post.category === filter);

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPost.trim() || !title.trim()) return;

    const post = {
      id: Date.now(),
      author: username,
      avatar: avatar,
      badge: "Level 3",
      title: title,
      content: newPost,
      category: "General",
      likes: 0,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setTitle("");
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleReplyChange = (postId, text) => {
    setReplyInputs({ ...replyInputs, [postId]: text });
  };

  const submitReply = (postId) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { user: username, text: text }]
        };
      }
      return post;
    }));

    setReplyInputs({ ...replyInputs, [postId]: "" });
  };

  const toggleComments = (id) => {
    setActivePostId(activePostId === id ? null : id);
  };

  return (
    <div style={{ padding: '40px', minHeight: '100vh', fontFamily: 'var(--font-head)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button 
            onClick={() => onNavigate('dashboard')}
            className="glass-card"
            style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--card-border)', marginRight: '20px', color: 'var(--text-primary)' }}
          >
            <FaArrowLeft size={18} />
          </button>
          <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>Student Community</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '30px' }}>
          
          {/* LEFT: FEED */}
          <div>
            {/* NEW POST CARD */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
              <h3 style={{ marginTop: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCommentDots color="var(--accent-color)" /> Start a Discussion
              </h3>
              <form onSubmit={handlePost}>
                <input 
                  type="text" placeholder="Topic Title..." 
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.1)', color: 'var(--text-primary)' }}
                />
                <textarea 
                  placeholder="What's on your mind?" rows="3"
                  value={newPost} onChange={(e) => setNewPost(e.target.value)}
                  style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.1)', color: 'var(--text-primary)', resize: 'none' }}
                />
                <div style={{ textAlign: 'right' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '10px 25px', borderRadius: '20px' }}>
                    Post <FaPaperPlane style={{ marginLeft: '5px' }} />
                  </button>
                </div>
              </form>
            </div>

            {/* POSTS LIST */}
            {filteredPosts.map(post => (
              <div key={post.id} className="glass-card animate-slide-1" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ fontSize: '30px', marginRight: '15px' }}>{post.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{post.author}</div>
                    <div style={{ fontSize: '10px', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', display: 'inline-block', padding: '2px 8px', borderRadius: '10px', marginTop: '2px' }}>
                      {post.badge}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)', padding: '5px 10px', borderRadius: '10px' }}>
                    {post.category}
                  </div>
                </div>
                
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>{post.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{post.content}</p>
                
                {/* ACTIONS */}
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <span 
                    onClick={() => handleLike(post.id)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <FaThumbsUp /> {post.likes} Likes
                  </span>

                  <span 
                    onClick={() => toggleComments(post.id)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: activePostId === post.id ? 'var(--accent-color)' : 'inherit' }}
                  >
                    <FaReply /> {post.comments.length} Comments
                  </span>
                </div>

                {/* COMMENTS SECTION */}
                {activePostId === post.id && (
                  <div className="animate-fade" style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    {post.comments.length > 0 ? (
                      post.comments.map((c, idx) => (
                        <div key={idx} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '13px' }}>{c.user}: </span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{c.text}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No comments yet. Be the first!</p>
                    )}
                    
                    {/* REPLY INPUT */}
                    <div style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                      <input 
                        value={replyInputs[post.id] || ""}
                        onChange={(e) => handleReplyChange(post.id, e.target.value)}
                        placeholder="Write a reply..." 
                        onKeyDown={(e) => e.key === 'Enter' && submitReply(post.id)}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                      <button 
                        onClick={() => submitReply(post.id)}
                        className="btn-primary" 
                        style={{ padding: '8px 15px', borderRadius: '4px', fontSize: '12px' }}
                      >
                        {/* FIX: Using FaPaperPlane here instead of FaSend */}
                        <FaPaperPlane />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="glass-card" style={{ padding: '20px', position: 'sticky', top: '20px' }}>
              <h4 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Categories</h4>
              {['All', 'Help', 'Resources', 'Announcements', 'General'].map(cat => (
                <div 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{ 
                    padding: '10px', cursor: 'pointer', borderRadius: '8px', marginBottom: '5px',
                    background: filter === cat ? 'var(--accent-color)' : 'transparent',
                    color: filter === cat ? '#1e1e2e' : 'var(--text-secondary)',
                    fontWeight: filter === cat ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Forum;