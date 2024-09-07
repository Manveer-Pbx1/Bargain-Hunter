import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ element: Component, ...rest }) {
  const isAuthenticated = checkAuth();

  function checkAuth() {
    // Get all cookies
    const cookies = document.cookie.split(';');
    // Find the token
    const token = cookies.find(cookie => cookie.trim().startsWith('token='));
    // If token exists, return true, otherwise return false
    return token !== undefined;
  }

  return isAuthenticated ? 
  <Component {...rest} /> : <Navigate to="/login"/>
}
