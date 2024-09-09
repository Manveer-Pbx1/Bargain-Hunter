import React, { useState } from 'react';

export default function Input({ onFetchProduct }) {
  const [url, setURL] = useState('');
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    onFetchProduct(null, true);
    setError(null); // Reset any previous error

    try {
      const response = await fetch(`http://localhost:3001/scrape?url=${url}`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response=> response.json())
      .then(data => console.log(data));
      
      if (!response.ok) {
        throw new Error("Failed to fetch product data. Please check the URL and try again.");
      }

      const data = await response.json();
      onFetchProduct(data, false); // Send the fetched data to the parent component
    } catch (err) {
      setError(err.message);
      onFetchProduct(null, false); // Stop the loading animation
    }

    setURL(''); // Reset input field after fetch
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex">
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
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
