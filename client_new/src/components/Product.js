import React from "react";

export default function Product({ product }) {
  return (
    <div className="relative top-20 mb-2 items-center">
      <div className="max-w-xs bg-white shadow-md rounded-lg transform hover:-rotate-2 transition-transform duration-200 cursor-pointer">
        <img
          className="w-full h-32 object-cover rounded-t-lg"
          src={product.imgURL}
          alt={product.title}
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="mt-1 text-sm font-bold">Price: INR {product.price}</p>
          <div className="flex items-center mt-2">
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927a.25.25 0 01.902 0l1.513 3.065a.25.25 0 00.188.137l3.384.492a.25.25 0 01.138.426l-2.45 2.39a.25.25 0 00-.072.221l.579 3.373a.25.25 0 01-.363.263L10 12.348a.25.25 0 00-.233 0l-3.03 1.592a.25.25 0 01-.363-.263l.579-3.373a.25.25 0 00-.072-.221l-2.45-2.39a.25.25 0 01.138-.426l3.384-.492a.25.25 0 00.188-.137l1.513-3.065z" />
            </svg>
            <p className="ml-2 text-sm font-medium">
              <i>{product.rating}</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
