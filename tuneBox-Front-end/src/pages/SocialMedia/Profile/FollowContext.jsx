import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [followCounts, setFollowCounts] = useState({});
  const currentUserId = Cookies.get("userId");

  useEffect(() => {
    const fetchFollowCounts = async () => {
      if (currentUserId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/follow/${currentUserId}/followCounts`);
          console.log("Fetched follow counts:", response.data); // Kiểm tra dữ liệu nhận được
          setFollowCounts((prev) => ({
            ...prev,
            [currentUserId]: {
              followerCount: response.data.followersCount,
              followingCount: response.data.followingCount,
            },
          }));
        } catch (error) {
          console.error("Error fetching follow counts:", error);
        }
      }
    };
    

    fetchFollowCounts();

    return () => {
      setFollowCounts({});
    };
  }, [currentUserId]);

  const updateFollowerCount = (otherUserId, newCount) => {
    setFollowCounts((prevCounts) => ({
      ...prevCounts,
      [otherUserId]: {
        ...prevCounts[otherUserId],
        followerCount: newCount, // sử dụng followerCount nhất quán
      },
    }));
  };

  const updateFollowingCount = (newCount) => {
    setFollowCounts((prev) => ({
      ...prev,
      [currentUserId]: {
        ...prev[currentUserId],
        followingCount: newCount,
      },
    }));
  };

  const toggleFollow = async () => {
    if (isUpdatingFollow) return;
    setIsUpdatingFollow(true);
  
    try {
      let newFollowerCount = followerCount; // Dùng followerCount lấy từ useMemo
      let newFollowingCount = followCounts[currentUserId]?.followingCount || 0;
  
      if (isFollowing) {
        // Unfollow
        await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
          params: {
            followerId: userId,
            followedId: id,
          },
        });
        newFollowerCount = Math.max(followerCount - 1, 0);
        newFollowingCount = Math.max(newFollowingCount - 1, 0);
        setIsFollowing(false);
      } else {
        // Follow
        await axios.post(`http://localhost:8080/api/follow/follow`, null, {
          params: {
            followerId: userId,
            followedId: id,
          },
        });
        newFollowerCount = followerCount + 1;
        newFollowingCount += 1;
        setIsFollowing(true);
      }
  
      // Cập nhật ngay lập tức vào FollowContext
      updateFollowerCount(id, newFollowerCount);
      updateFollowingCount(newFollowingCount);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsUpdatingFollow(false);
    }
  };
  
  
  return (
    <FollowContext.Provider
      value={{
        followCounts,
        updateFollowerCount,
        updateFollowingCount,
        toggleFollow,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
};