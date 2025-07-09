import React from "react";
import useAuth from "../Hooks/useAuth";
import { Navigate, useLocation, useNavigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user) {
    return (
      <Navigate state={{ from: location.pathname }} to="/login"></Navigate>
    );
  }
  return children;
};

export default PrivateRoute;
