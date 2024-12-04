// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAccountBanned, setIsAccountBanned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccountStatus = async () => {
      try {
        const currentUserId = Cookies.get("userId");
        if (currentUserId) {
          const response = await axios.get(
            `http://localhost:8080/user/check-status/${currentUserId}`,
            { withCredentials: true }
          );
          setIsAccountBanned(response.data.isBanned);
        }
      } catch (error) {
        console.error("Error fetching account status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccountStatus();
  }, []);

  return (
    <UserContext.Provider value={{ isAccountBanned, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Sử dụng export default cho useUser để tránh lỗi
export const useUser = () => React.useContext(UserContext);
