import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserRole } from "../../service/auth";

// Component để bảo vệ route
const ProtectedRoute = ({ allowedRole }) => {
  const userRole = getUserRole();

  if (!userRole || userRole !== allowedRole) {
    // Hiển thị thông báo và chuyển hướng về trang login
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'Your account does not have permission to access this link. Please log in with a licensed account!',
    });
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
