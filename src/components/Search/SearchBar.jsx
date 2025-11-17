import React, { useState } from 'react';


function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  // Esta função agora lida com a mudança
  const handleChange = (e) => {
    const newTerm = e.target.value;
    

    setTerm(newTerm);
    

    onSearch(newTerm);
  };

  return (
    <div className="relative w-full md:w-auto">
      <input
        type="text"
        value={term}
        onChange={handleChange}
        placeholder="Buscar por nome..."
        className="w-full md:w-72 border border-gray-300 rounded-lg py-2 pl-10 pr-4
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 "
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <SearchIcon />
      </div>
    </div>
  );
}