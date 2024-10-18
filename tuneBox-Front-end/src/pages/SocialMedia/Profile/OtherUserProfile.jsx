import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link, Routes, Route, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import { FollowContext } from "./FollowContext"; 

const OtherUserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const userId = Cookies.get("userId");
  const { followCounts, updateFollowerCount, updateFollowingCount } = useContext(FollowContext); // Lấy đúng hàm từ context
  
  // Cập nhật số lượng người theo dõi từ followCounts
  const followerCount = useMemo(() => {
    return followCounts && followCounts[id] ? followCounts[id].followersCount : 0;
  }, [followCounts, id]);

  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [followCountsLocal, setFollowCountsLocal] = useState({ followersCount: 0, followingCount: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/${id}/profile`);
        setUserData(response.data);
        setIsBlocked(response.data.isBlocked); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/follow/${id}/followCounts`);
        setFollowCountsLocal(response.data); // Cập nhật followCountsLocal từ server
      } catch (error) {
        console.error("Error fetching follow counts:", error);
      }
    };
  
    if (id) {
      fetchFollowCounts(); // Chỉ tải nếu id tồn tại
    }
  }, [id]);
  
  // Kiểm tra trạng thái theo dõi khi load
  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/follow/is-following`, {
          params: {
            followerId: userId,
            followedId: id
          }
        });
        setIsFollowing(response.data); // Cập nhật trạng thái theo dõi
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowingStatus();
  }, [id, userId]); // Thêm userId vào phụ thuộc

  const toggleFollow = async () => {
    if (isUpdatingFollow) return;
    setIsUpdatingFollow(true);
  
    try {
      // Use followCountsLocal to get the current counts
      let newFollowerCount = followCountsLocal.followersCount; 
      let newFollowingCount = followCountsLocal.followingCount;
  
      if (isFollowing) {
        // Unfollow
        await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
          params: {
            followerId: userId,
            followedId: id,
          },
        });
  
        newFollowerCount = Math.max(newFollowerCount - 1, 0); // Decrease follower count
        setIsFollowing(false);
      } else {
        // Follow
        await axios.post(`http://localhost:8080/api/follow/follow`, null, {
          params: {
            followerId: userId,
            followedId: id,
          },
        });
  
        newFollowerCount = newFollowerCount + 1; // Increase follower count
        setIsFollowing(true);
      }
  
      console.log("Updating follow counts:", { newFollowerCount, newFollowingCount });
  
      // Update context with the new follower counts
      updateFollowerCount(id, newFollowerCount); // Update other user's follower count
      updateFollowingCount(newFollowingCount); // Update current user's following count
  
      // Update local follow counts
      setFollowCountsLocal((prev) => ({
        ...prev,
        followersCount: newFollowerCount, // Local update for the count
        followingCount: newFollowingCount, // You may want to update following count as well if needed
      }));
  
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsUpdatingFollow(false);
    }
  };
  
  const toggleBlock = async () => {
    try {
      if (isBlocked) {
        await axios.delete(`http://localhost:8080/api/blocks/unblock?blockerId=${userId}&blockedId=${id}`);
        setIsBlocked(false);
      } else {
        await axios.post(`http://localhost:8080/api/blocks/block?blockerId=${userId}&blockedId=${id}`);
        setIsBlocked(true);
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  if (!userData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="row container">
      <div className="background border container" style={{ backgroundImage: "url(/src/UserImages/Background/anime-girl.jpg)" }} />
      <aside className="col-sm-3">
        <div>
          <img src={userData.avatar || "/src/UserImages/Avatar/avt.jpg"} className="avatar" alt="avatar" />
          <div className="fs-4 text-small mt-3"><b>{userData.userNickname}</b></div>
          <div>{userData.userName}</div>
        </div>
        <div className="row mt-4">
          <div className="col text-start">
            <button className="btn btn-primary" id="followButton" onClick={toggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="col text-end">
            <button className="btn btn-danger" id="blockButton" onClick={toggleBlock}>
              {isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        </div>
        <div className="row mt-4">
        <div className="col text-center">
  <span>{isNaN(followCountsLocal.followersCount) ? 0 : followCountsLocal.followersCount}</span> <br />
  <span>Follower</span>
</div>
  <div className="col text-center">
    <span>{isNaN(followCountsLocal.followingCount) ? 0 : followCountsLocal.followingCount}</span> <br />
    <span>Following</span>
  </div>
</div>
        {/* Nghệ sĩ yêu thích, Sở trường, Dòng nhạc ưu thích */}
        <div style={{ paddingTop: 30 }}>
          {/* Các phần dữ liệu khác */}
        </div>
      </aside>

      <div className="col-sm-9 d-flex flex-column ">
        <nav className="nav flex-column flex-md-row p-5">
          <Link to="activity" className="nav-link">Activity</Link>
          <Link to="track" className="nav-link">Track</Link>
          <Link to="albums" className="nav-link">Albums</Link>
          <Link to="playlists" className="nav-link">Playlists</Link>
        </nav>
        <article className="p-5">
          <Routes>
            <Route path="activity" element={<Activity />} />
            <Route path="track" element={<Track />} />
            <Route path="albums" element={<Albums />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="/" element={<Navigate to="activity" />} />
          </Routes>
        </article>
      </div>
    </div>
  );
};

export default OtherUserProfile;
