import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ isAuthenticated }) {
    
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}