import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // TODO: Replace with actual authentication check
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 