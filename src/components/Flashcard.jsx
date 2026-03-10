import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSyncAlt } from 'react-icons/fa';

const Flashcard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="flex justify-center items-center cursor-pointer" 
      style={{ perspective: '1000px', margin: '20px auto', width: '100%', maxWidth: '500px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-64"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front of Card */}
        <div 
          className="absolute inset-0 rounded-xl flex flex-col items-center justify-center p-8 text-center shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden',
            background: 'var(--bg-card)',
            border: '2px solid var(--accent-color)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
            {front}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '8px' }}>
            <FaSyncAlt /> Click to Reveal
          </p>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 rounded-xl flex items-center justify-center p-8 text-center shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            background: 'var(--accent-color)',
            border: '2px solid var(--accent-color)',
            boxShadow: '0 10px 30px rgba(108, 92, 231, 0.3)'
          }}
        >
          <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '500', margin: 0, lineHeight: '1.6' }}>
            {back}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;