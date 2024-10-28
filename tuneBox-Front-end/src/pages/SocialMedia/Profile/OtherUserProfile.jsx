import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link, Routes, Route, Navigate, useParams } from "react-router-dom";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import axios from "axios";
import Cookies from "js-cookie";
import { getUserInfo, getFriendCount } from "../../../service/UserService";
import { FollowContext } from "./FollowContext";

const OtherUserProfile = () => {
  const { id } = useParams();
  const userId = Cookies.get("userId");
  const { followCounts, updateFollowerCount } = useContext(FollowContext);

  // State management
  const [userData, setUserData] = useState(null);
  const [friendStatus, setFriendStatus] = useState("Add Friend");
  const [friendCount, setFriendCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [followCountsLocal, setFollowCountsLocal] = useState({ followersCount: 0, followingCount: 0 });
  const [requestId, setRequestId] = useState(null);
  //fetch count friends
  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
          try {
              // Lấy số lượng bạn bè
              const count = await getFriendCount(id);
              console.log('Fetched friend count:', count); // Log giá trị friend count
              setFriendCount(count); // Cập nhật số lượng bạn bè
              console.log('Updated friend count state:', count); // Log trạng thái bạn bè
          } catch (error) {
              console.error("Error fetching user", error);
          }
      }
  };  
  
    fetchUser();
  }, [id]);

  // Fetch user data and check friend status
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/${id}/profile`);
        setUserData(response.data);
        setIsBlocked(response.data.isBlocked);
        await checkFriendStatus();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Check friend status
  const checkFriendStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/friends/check`, {
        params: { userId, friendId: id },
      });
      const statusMap = {
        pending: "Pending Request",
        accepted: "Friends",
        default: "Add Friend",
      };
      setFriendStatus(statusMap[response.data] || statusMap.default);
    } catch (error) {
      console.error("Error checking friend status:", error);
    }
  };

  // Fetch follow counts
  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/follow/${id}/followCounts`);
        setFollowCountsLocal(response.data);
      } catch (error) {
        console.error("Error fetching follow counts:", error);
      }
    };

    if (id) {
      fetchFollowCounts();
    }
  }, [id]);

  // Check if following
  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/follow/is-following`, {
          params: { followerId: userId, followedId: id },
        });
        setIsFollowing(response.data);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowingStatus();
  }, [id, userId]);

  // Toggle follow
  const toggleFollow = async () => {
    if (isUpdatingFollow) return;
    setIsUpdatingFollow(true);

    try {
      let newFollowerCount = followCountsLocal.followersCount;

      if (isFollowing) {
        await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
          params: { followerId: userId, followedId: id },
        });
        newFollowerCount = Math.max(newFollowerCount - 1, 0);
        setIsFollowing(false);
      } else {
        await axios.post(`http://localhost:8080/api/follow/follow`, null, {
          params: { followerId: userId, followedId: id },
        });
        newFollowerCount += 1;
        setIsFollowing(true);
      }

      updateFollowerCount(id, newFollowerCount);
      setFollowCountsLocal((prev) => ({ ...prev, followersCount: newFollowerCount }));

    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  // Toggle block status
  const toggleBlock = async () => {
    try {
      const endpoint = isBlocked 
        ? `http://localhost:8080/api/blocks/unblock?blockerId=${userId}&blockedId=${id}`
        : `http://localhost:8080/api/blocks/block?blockerId=${userId}&blockedId=${id}`;

      await axios({ method: isBlocked ? "delete" : "post", url: endpoint });
      setIsBlocked(!isBlocked);
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  // Toggle friend status
  const toggleFriend = async () => {
    try {
      if (friendStatus === "Friends") {
        await unfriend();
      } else if (friendStatus === "Add Friend") {
        const response = await axios.post(`http://localhost:8080/api/friends/${userId}/${id}`);
        setFriendStatus("Request Sent");
        setRequestId(response.data);
      }
    } catch (error) {
      console.error("Error toggling friend status:", error);
    }
  };

  const unfriend = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/friends/${userId}/${id}`);
      setFriendStatus("Add Friend");
      await checkFriendStatus();
    } catch (error) {
      console.error("Error unfriending:", error);
    }
  };

  const cancelFriendRequest = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/friends/cancel-request/${userId}/${id}`);
      setFriendStatus("Add Friend");
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const acceptFriendRequest = async () => {
    try {
      await axios.post(`http://localhost:8080/api/friends/accept/${requestId}`);
      setFriendStatus("Friends");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineFriendRequest = async () => {
    try {
      await axios.post(`http://localhost:8080/api/friends/decline/${requestId}`);
      setFriendStatus("Add Friend");
    } catch (error) {
      console.error("Error declining friend request:", error);
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
          <Link to={`/Follower/${id}`}>
            <span>{isNaN(followCountsLocal.followersCount) ? 0 : followCountsLocal.followersCount}</span> <br />
            <span>Follower</span>
            </Link>
          </div>
          <div className="col text-center">
          <Link to={`/Following/${id}`}>
          <span>{isNaN(followCountsLocal.followingCount) ? 0 : followCountsLocal.followingCount}</span> <br />
          <span>Following</span>
          </Link>
          </div>
          <div className="col text-center">
          <Link to={`/FriendList/${id}`}>
          <span>{friendCount}</span> <br />
          <span>Friends</span>
          </Link>
          </div>
        </div>
        <div className="col text-center">
          {userId === id ? null : (
            <>
              {friendStatus === "Pending Request" ? (
                <div>
                  <span className="text-warning">Pending Request</span>
                  <button className="btn btn-success" onClick={acceptFriendRequest}>Accept</button>
                  <button className="btn btn-danger" onClick={declineFriendRequest}>Decline</button>
                </div>
              ) : friendStatus === "Request Sent" ? (
                <button className="btn btn-warning" onClick={cancelFriendRequest}>Cancel Request</button>
              ) : friendStatus === "Friends" ? (
                <div>
                  <span className="text-success">Friends</span>
                  <button className="btn btn-danger" onClick={unfriend}>Unfriend</button>
                </div>
              ) : (
                <button className="btn btn-success" onClick={toggleFriend}>Add Friend</button>
              )}
            </>
          )}
        </div>
      </aside>
      <div className="col-sm-9 d-flex flex-column">
          <nav className="nav flex-column flex-md-row p-5">
            <Link to="activity" className="nav-link">
              Activity
            </Link>
            <Link to="track" className="nav-link">
              Track
            </Link>
            <Link to="albums" className="nav-link">
              Albums
            </Link>
            <Link to="playlists" className="nav-link">
              Playlists
            </Link>
          </nav>

          <div className="container">
            <Routes>
              <Route path="activity" element={<Activity />} />
              <Route path="track" element={<Track />} />
              <Route path="albums" element={<Albums />} />
              <Route path="playlists" element={<Playlists />} />
            </Routes>
          </div>
        </div>
    </div>
  );
};

export default OtherUserProfile;
