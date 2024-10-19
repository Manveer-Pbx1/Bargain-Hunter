import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication only once on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("https://bargain-hunter.onrender.com/auth-check");
        console.log("Auth check response: ", response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Run the checkAuth function once when the component mounts
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://bargain-hunter.onrender.com/login",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      );
      console.log(response.data);
      console.log(response.data.success);
      if (response.data.success) {
        // Redirect to home after successful login
        navigate("/home", { state: { username: formData.username } });
      } else {
        setErrorMsg(response.data.message);
      }
    } catch (e) {
      console.log(e);
      setErrorMsg("Login failed. Please try again.");
    }
  };

  // Don't render the form while loading the auth check
  if (isLoading) {
    return <div className='text-center font-bold text-xl'>Loading...</div>;
  }

  return (
    <div>
      <div className="w-[450px] h-[430px] ml-auto mr-auto border-8 border-dashed border-black bg-yellow-300 p-4 m-4 shadow-lg">
        <h1 className="text-4xl font-bold text-center italic">LOG IN</h1>
        {errorMsg && <p className="text-red-500 font-bold text-center">{errorMsg}!</p>}
        <form onSubmit={handleSubmit}>
          <div className="my-4 mx-2">
            <label className="font-bold">Username:</label>
            <input
              type="text"
              className="border-2 border-black p-2 m-2 font-bold italic"
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="my-4 mx-2">
            <label className="font-bold">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border-2 border-black p-2 m-2 font-bold"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white p-2 rounded-md hover:bg-white hover:text-black hover:border-black border-2 border-black font-bold translate-x-40"
          >
            LOG IN
          </button>
          {/* New user? */}
          <p className="text-center text-md translate-y-4 font-bold italic">
            New to Bargain-Hunter?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-800 cursor-pointer"
            >
              SIGN UP
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
