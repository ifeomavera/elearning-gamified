import { useState } from 'react';
import { motion } from 'framer-motion';

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="flex justify-center items-center cursor-pointer" 
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-64 h-80"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front of Card */}
        <div 
          className="absolute inset-0 bg-white border-2 border-indigo-500 rounded-xl flex items-center justify-center p-6 text-center shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h3 className="text-lg font-bold text-gray-800">{question}</h3>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 bg-indigo-600 rounded-xl flex items-center justify-center p-6 text-center shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)' 
          }}
        >
          <p className="text-white text-md font-medium">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;