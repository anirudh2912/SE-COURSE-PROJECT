import React, { useState } from "react";

const AlumniCard = ({ alumni }) => {
  const [connected, setConnected] = useState(false);

  return (
    <div className="border p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold">{alumni.name}</h2>
      <p>{alumni.batch}</p>
      <p>{alumni.position}</p>
      <button 
        className={`mt-2 px-4 py-2 rounded ${connected ? 'bg-gray-400' : 'bg-blue-500 text-white'}`} 
        onClick={() => setConnected(true)} 
        disabled={connected}
      >
        {connected ? "Connected" : "Connect"}
      </button>
    </div>
  );
};

export default AlumniCard;
