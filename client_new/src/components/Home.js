import React, { useState } from 'react';
import Product from './Product';
import Input from './Input';

export default function Home() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleProductData = (data, isLoading) => {
    if (data) {
      setProductList((prevList) => [...prevList, data]);
    }
    setLoading(isLoading);
  };

  return (
    <div className="relative min-h-screen">
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
          <Input onFetchProduct={handleProductData} />
          <div className="flex flex-col items-center mt-8">
            <div className="max-w-xs bg-white shadow-md rounded-lg transform hover:-rotate-2 transition-transform duration-200 cursor-pointer">
              <div className="animate-pulse w-full h-32 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4">
                <div className="animate-pulse h-4 bg-gray-300 rounded mb-2"></div>
                <div className="animate-pulse h-4 bg-gray-300 rounded mb-2"></div>
                <div className="animate-pulse h-4 bg-gray-300 rounded mb-2"></div>
                <div className="flex items-center mt-2">
                  <div className="animate-pulse bg-gray-300 rounded w-4 h-4 text-yellow-400"></div>
                  <div className="animate-pulse ml-2 h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Input onFetchProduct={handleProductData} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {productList.map((prod, index) => (
              <Product key={index} product={prod} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
