import React from 'react'
import LandingPage from './components/LandingPage'
import SignUp from './components/SignUp';
import Login from './components/Login';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
export default function App() {
  return (
   <Router>
    <Routes>
      <Route path= "/" element = {<LandingPage/>} />
      <Route path= "/signup" element = {<SignUp/>}/>
      <Route path= "/login" element = {<Login/>}/>
      <Route path= "/home" element = {<ProtectedRoute component={Home}/>}/>
    </Routes>
   </Router>
  )
}