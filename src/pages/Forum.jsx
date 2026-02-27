import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaPaperPlane, FaCommentDots, FaThumbsUp, FaReply, FaUserPlus, FaSpinner } from 'react-icons/fa';

const Forum = ({ username, avatar, onNavigate }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [activePostId, setActivePostId] = useState(null); 
  const [replyInputs, setReplyInputs] = useState({}); 

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ✅ FETCH REAL POSTS FROM DATABASE
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch community posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = filter === "All" 
    ? posts 
    : posts.filter(post => post.category === filter || (filter === 'General' && !post.category));

  // ✅ CREATE POST IN DATABASE
  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !title.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post(`${apiUrl}/api/posts`, {
        username: username,
        avatar: avatar,
        title: title,
        content: newPost,
        category: "General"
      });
      setPosts([res.data, ...posts]);
      setNewPost("");
      setTitle("");
    } catch (err) {
      console.error("Failed to submit post", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ LIKE POST IN DATABASE
  const handleLike = async (postId) => {
    try {
      await axios.put(`${apiUrl}/api/posts/${postId}/like`, { username });
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(username);
          return {
            ...post,
            likes: isLiked ? post.likes.filter(u => u !== username) : [...post.likes, username]
          };
        }
        return post;
      }));
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handleReplyChange = (postId, text) => {
    setReplyInputs({ ...replyInputs, [postId]: text });
  };

  const submitReply = async (postId) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    // Local update (You can add a real /comments route later)
    setPosts(posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), { username: username, content: text }]
        };
      }
      return post;
    }));
    setReplyInputs({ ...replyInputs, [postId]: "" });
  };

  return (
    <div style={{ padding: '40px', minHeight: '100vh', background: 'var(--bg-body)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="glass-card"
              style={{ width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--card-border)', marginRight: '20px', color: 'var(--text-primary)' }}
            >
              <FaArrowLeft size={18} />
            </button>
            <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>Student Community</h1>
          </div>

          {/* ✅ FIND FRIENDS BUTTON: Connects to Student Directory */}
          <button 
            onClick={() => onNavigate('find-friends')}
            className="glass-card"
            style={{ padding: '10px 20px', borderRadius: '20px', border: '1.5px solid var(--accent-color)', color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaUserPlus /> Find Friends
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '30px' }}>
          
          {/* LEFT: FEED */}
          <div>
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
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '10px 25px', borderRadius: '20px' }}>
                    {submitting ? <FaSpinner className="fa-spin" /> : <>Post <FaPaperPlane style={{ marginLeft: '5px' }} /></>}
                  </button>
                </div>
              </form>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><FaSpinner className="fa-spin" size={30} color="var(--accent-color)" /></div>
            ) : (
              filteredPosts.map(post => (
                <div key={post._id} className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '30px', marginRight: '15px' }}>{post.avatar || "👨‍💻"}</div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{post.username}</div>
                      <div style={{ fontSize: '10px', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', display: 'inline-block', padding: '2px 8px', borderRadius: '10px', marginTop: '2px' }}>
                        {post.category || 'Scholar'}
                      </div>
                    </div>
                  </div>
                  
                  <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{post.content}</p>
                  
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <span onClick={() => handleLike(post._id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: post.likes.includes(username) ? 'var(--accent-color)' : 'inherit' }}>
                      <FaThumbsUp /> {post.likes.length} Likes
                    </span>
                    <span onClick={() => setActivePostId(activePostId === post._id ? null : post._id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaReply /> {post.comments?.length || 0} Comments
                    </span>
                  </div>

                  {activePostId === post._id && (
                    <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      {(post.comments || []).map((c, idx) => (
                        <div key={idx} style={{ marginBottom: '8px', fontSize: '13px' }}>
                          <b style={{ color: 'var(--text-primary)' }}>{c.username}:</b> <span style={{ color: 'var(--text-secondary)' }}>{c.content}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                        <input 
                          value={replyInputs[post._id] || ""}
                          onChange={(e) => handleReplyChange(post._id, e.target.value)}
                          placeholder="Reply..." 
                          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-primary)' }}
                        />
                        <button onClick={() => submitReply(post._id)} className="btn-primary" style={{ padding: '5px 15px' }}><FaPaperPlane /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="glass-card" style={{ padding: '20px', position: 'sticky', top: '20px' }}>
              <h4 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Categories</h4>
              {['All', 'Help', 'Resources', 'Announcements', 'General'].map(cat => (
                <div key={cat} onClick={() => setFilter(cat)} style={{ padding: '10px', cursor: 'pointer', borderRadius: '8px', background: filter === cat ? 'var(--accent-color)' : 'transparent', color: filter === cat ? '#1e1e2e' : 'var(--text-secondary)', fontWeight: filter === cat ? 'bold' : 'normal', marginBottom: '5px' }}>
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