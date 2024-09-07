import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "./Home";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth-check", {
          withCredentials: true,
        });
        if (response.data.authenticated) {
          sessionStorage.setItem("username", formData.username);
          navigate("/login");
        }
      } catch (e) {
        console.log(e);
      }
    };
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
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/signup",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsVerificationSent(true); // Set to show verification input
      } else {
        setErrorMsg(response.data.message);
      }
    } catch (e) {
      console.log(e);
      setErrorMsg("Signup failed. Please try again.");
    }
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/verify",
        {
          email: formData.email,
          verificationCode: formData.verificationCode,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsSignedUp(true);
        navigate("/login");
      } else {
        setErrorMsg(response.data.message);
      }
    } catch (e) {
      console.log(e);
      setErrorMsg("Verification failed. Please try again.");
    }
  };

  return (
    <div>
      {!isVerificationSent ? (
        <div className="w-[450px] h-[530px] ml-auto mr-auto border-8 border-dashed border-black bg-green-400 p-4 m-4 shadow-lg">
          <h1 className="text-4xl font-bold text-center italic">SIGN UP</h1>
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
              <label className="font-bold">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-2 border-black p-2 m-2 font-bold mx-10"
                placeholder="Enter your email"
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
            <div className="my-4 mx-2">
              <label className="font-bold">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="border-2 border-black p-2 m-2 mx-[80px] font-bold"
                placeholder="Re-enter your password"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white p-2 rounded-md hover:bg-white hover:text-black hover:border-black border-2 border-black font-bold translate-x-40"
            >
              SIGN UP
            </button>
            {/* account already exists? */}
            <p className="text-center text-md translate-y-4 font-bold italic">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-800 cursor-pointer"
              >
                LOGIN
              </span>
            </p>
          </form>
        </div>
      ) : (
        <div className="w-[450px] h-[300px] ml-auto mr-auto border-8 border-black bg-green-400 p-4 m-4 shadow-lg">
          <h1 className="text-4xl font-bold text-center italic">VERIFY EMAIL</h1>
          {errorMsg && <p className="text-red-800 text-center">{errorMsg}</p>}
          <input
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleChange}
            placeholder="Enter verification code"
            className="border-2 border-black p-2 m-2 font-bold"
          />
          <button
            onClick={handleVerification}
            className="bg-black text-white p-2 rounded-md hover:bg-white hover:text-black hover:border-black border-2 border-black font-bold translate-x-40"
          >
            VERIFY
          </button>
        </div>
      )}
    </div>
  );
}
