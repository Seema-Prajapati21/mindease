import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Welcoming you back…" />;
  }

  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (e) {}

  if (!token && (!storedUser || !storedUser.email)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
