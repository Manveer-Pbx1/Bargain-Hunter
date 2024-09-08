import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import Product from "./Product";
import Input from "./Input";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Home() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.username || sessionStorage.getItem("username");
  const handleProductData = (data, isLoading) => {
    if (data) {
      setProductList((prevList) => [...prevList, data]);
    }
    setLoading(isLoading);
  };

  const handleLogout = async () => {
    try{
      await axios.get("http://localhost:3001/logout", {withCredentials: true});
      sessionStorage.removeItem("username");
      navigate('/login');
    } catch (err){
      console.error(err);
    }
  }

  return (
    <div className="relative min-h-screen">
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
          {/* Loading animation */}
          <svg
            className="animate-spin h-10 w-10 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120.709 5H16v2h4.709A6.002 6.002 0 0012 6.472V2H8v4.472A6.002 6.002 0 003.291 7z"
            ></path>
          </svg>
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
      <div className="relative -top-16 float-right flex">
        <FaUser
          className={`text-3xl ${
            userMenu ? `text-black` : `text-gray-400`
          } cursor-pointer`}
          onClick={() => setUserMenu(!userMenu)}
        />
        {userMenu && (
          <div className="h-[15px] w-[100px] top-[60px] right-1/2 absolute bg-red-300 p-3 rounded-md">
            <button className="text-sm font-semibold text-red-700 absolute bottom-1 left-6"
            onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
        <span className="text-blue-600 h-1 w-1 font-bold relative top-10 justify-center right-5 items-center flex mr-[100px]">
          {name}
        </span>
      </div>
    </div>
  );
}
