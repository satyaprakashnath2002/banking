import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

// Protected route component that redirects to login if user is not authenticated
const PrivateRoute = ({ requiredRole }) => {
  const { currentUser, loading, tokenVerified } = useAuth();

  // Show loading indicator while checking authentication or token verification
  if (loading || tokenVerified === null) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading authentication...
        </Typography>
      </Box>
    );
  }
  
  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If role is required, check if user has that role
  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect admin to admin dashboard and customer to customer dashboard
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If authenticated and has required role (or no role required), render child routes
  return <Outlet />;
};

export default PrivateRoute; 