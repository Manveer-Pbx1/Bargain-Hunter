import React, { useState } from 'react';

export default function Input({ onFetchProduct }) {
  const [url, setURL] = useState('');

  const handleFetchData = async () => {
    const response = await fetch(`http://localhost:3001/scrape?url=${url}`);
    const data = await response.json();
    onFetchProduct(data); // Send the fetched data to the parent component
  };

  return (
    <div className="flex justify-center mt-8">
      <input
        type="text"
        value={url}
        onChange={(e) => setURL(e.target.value)}
        placeholder="Enter URL to scrape"
        className="border border-gray-300 p-2 rounded-lg mr-2"
      />
      <button
        onClick={handleFetchData}
        className="bg-blue-500 text-white p-2 rounded-lg"
      >
        Fetch Product
      </button>
    </div>
  );
}
