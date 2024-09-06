import React from "react";
import { useNavigate } from "react-router-dom";
export default function BigButton() {
  const navigate = useNavigate();

  const handleSignupNavigate = () => {
    navigate('/signup');
  }
  return (
    <div>
      <div className="w-[180px] h-[180px] border-[55px] cursor-pointer hover:bg-black border-black  items-center flex absolute top-0 translate-x-[550px] translate-y-[250px] rounded-full  bg-white text-black hover:text-white" onClick={handleSignupNavigate}>
        <span className="text-md font-bold">SIGN UP!</span>
      </div>
    </div>
  );
}
