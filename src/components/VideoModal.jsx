import React from 'react';
import { FaTimes } from 'react-icons/fa';

const VideoModal = ({ isOpen, onClose, onComplete, title, videoId }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <FaTimes size={20}/>
          </button>
        </div>

        {/* Video Player */}
        <div style={styles.videoWrapper}>
          <iframe 
            width="100%" height="315" 
            src={`https://www.youtube.com/embed/${videoId}`} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        {/* Action Button */}
        <button onClick={onComplete} style={styles.finishBtn}>
          ✅ I Have Finished Watching (+XP)
        </button>
      </div>
    </div>
  );
};

// Define the styles object here at the bottom
const styles = {
  overlay: { 
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    zIndex: 1000 
  },
  modal: { 
    backgroundColor: 'white', borderRadius: '12px', 
    width: '90%', maxWidth: '600px', padding: '20px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)' 
  },
  header: { 
    display: 'flex', justifyContent: 'space-between', 
    alignItems: 'center', marginBottom: '20px' 
  },
  closeBtn: { 
    background: 'none', border: 'none', 
    cursor: 'pointer', color: '#636e72' 
  },
  videoWrapper: { 
    marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' 
  },
  finishBtn: { 
    width: '100%', padding: '15px', 
    background: '#00b894', color: 'white', 
    border: 'none', borderRadius: '8px', 
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' 
  }
};

export default VideoModal;