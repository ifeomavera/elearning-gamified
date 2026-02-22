import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Flashcard from '../components/Flashcard';

const StudyDashboard = ({ userId }) => {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await axios.get(`https://elearning-api-dr6r.onrender.com/api/study-vault/user/${userId}`);
      setMaterials(res.data);
    };
    fetchMaterials();
  }, [userId]);

  const generateAI = async (materialId, type) => {
    setLoading(true);
    try {
      const res = await axios.post('https://elearning-api-dr6r.onrender.com/api/study-vault/generate-study-material', {
        materialId,
        userId,
        type,
        count: 10 // As requested, they can get more than 5!
      });
      
      // If flashcards, parse JSON. If summary, keep as string.
      const content = type === 'flashcards' ? JSON.parse(res.data.data) : res.data.data;
      setAiResult({ type, content });
      alert(res.data.message); // Show the +XP alert!
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Personal Study Vault</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Material List */}
        <div className="space-y-4">
          {materials.map((item) => (
            <div key={item._id} className={`p-4 rounded-lg border cursor-pointer ${selectedMaterial?._id === item._id ? 'border-indigo-500 bg-indigo-50' : 'bg-white'}`} onClick={() => setSelectedMaterial(item)}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.category}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => generateAI(item._id, 'summary')} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Summarize</button>
                <button onClick={() => generateAI(item._id, 'flashcards')} className="text-xs bg-purple-600 text-white px-2 py-1 rounded">Flashcards</button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Output Area */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-inner p-6">
          {loading ? <p>AI is thinking... (+XP incoming)</p> : (
            <>
              {aiResult?.type === 'summary' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Study Summary</h2>
                  <div className="whitespace-pre-line">{aiResult.content}</div>
                </div>
              )}
              {aiResult?.type === 'flashcards' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {aiResult.content.map((card, idx) => (
                    <Flashcard key={idx} question={card.question} answer={card.answer} />
                  ))}
                </div>
              )}
              {!aiResult && <p className="text-center text-gray-400 mt-20">Select a document and click an AI tool to start studying!</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyDashboard;