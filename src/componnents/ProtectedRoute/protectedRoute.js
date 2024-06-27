// components/PrivateRoute.js
import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../../Redux/Actions/userActions';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!getCookie('authToken'); // Suppose you store the token in localStorage

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;    
};

export default PrivateRoute;