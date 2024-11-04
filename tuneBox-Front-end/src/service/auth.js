
import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;
  
    const decodedToken = jwtDecode(token); // Giải mã token
    return decodedToken.role;
  };
  
  export const isUserRole = (role) => {
    const userRole = getUserRole();
    return userRole === role;
  };