import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [followerCounts, setFollowerCounts] = useState({});
  const [followingCounts, setFollowingCounts] = useState({});
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchCounts = async () => {
      if (userId) {
        try {
          const followerCountResponse = await axios.get(`http://localhost:8080/api/follow/followers-count?userId=${userId}`);
          const followingCountResponse = await axios.get(`http://localhost:8080/api/follow/following-count?userId=${userId}`);

          setFollowerCounts((prev) => ({
            ...prev,
            [userId]: followerCountResponse.data,
          }));
          setFollowingCounts((prev) => ({
            ...prev,
            [userId]: followingCountResponse.data,
          }));
        } catch (error) {
          console.error("Error fetching counts:", error);
        }
      }
    };

    fetchCounts();
  }, [userId]);

// Trong FollowContext.jsx
const updateFollowerCount = (userId, newCount) => {
  setFollowerCounts((prevCounts) => ({
    ...prevCounts,
    [userId]: newCount,
  }));
};

  const updateFollowingCount = (userId, count) => {
    setFollowingCounts((prev) => ({
      ...prev,
      [userId]: count,
    }));
  };

  return (
    <FollowContext.Provider value={{ followerCounts, updateFollowerCount, followingCounts, updateFollowingCount }}>
      {children}
    </FollowContext.Provider>
  );
};