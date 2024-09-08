import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ component: Component, ...rest }) {
  const isAuthenticated = checkAuth();

 async function checkAuth() {
    const token = await document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    return token !== undefined;
    //debugged: async-await was required.
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
}
