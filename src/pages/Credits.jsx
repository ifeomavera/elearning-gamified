import React from 'react';

const Credits = ({ onNavigate }) => {
  const team = {
    supervisor: "Mrs. Daramola", // Update with her full surname when you get it!
    developers: [
      "Masade Osahon Paul",
      "Member Name 2", // Replace these with your actual group members
      "Member Name 3"
    ],
    university: "Babcock University",
    department: "Software Engineering",
    project: "Design and Implementation of an E-learning System with Gamification Features"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center border-t-4 border-indigo-600">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{team.project}</h1>
        <p className="text-indigo-600 font-medium mb-6 uppercase tracking-wider text-sm">Project Credits</p>
        
        <div className="space-y-6 text-left">
          {/* Supervisor Section */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-1">Project Supervisor</h2>
            <p className="text-lg font-semibold text-gray-800">{team.supervisor}</p>
          </div>

          {/* Developers Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Development Team</h2>
            <ul className="list-disc list-inside text-gray-700 font-medium space-y-1">
              {team.developers.map((dev, index) => (
                <li key={index}>{dev}</li>
              ))}
            </ul>
          </div>

          {/* Institution Section */}
          <div className="px-4">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Institution</h2>
            <p className="text-md text-gray-700">{team.university}</p>
            <p className="text-sm text-gray-500 italic">{team.department}</p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('dashboard')}
          className="mt-8 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Credits;