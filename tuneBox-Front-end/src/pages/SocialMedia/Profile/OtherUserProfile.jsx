import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link, Routes, Route, Navigate, useParams } from "react-router-dom";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import axios from "axios";
import Cookies from "js-cookie";
import { FollowContext } from "./FollowContext";


const OtherUserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const userId = Cookies.get("userId");
  const { followCounts, updateFollowerCount } = useContext(FollowContext);
  const [isFriend, setIsFriend] = useState(false);
  const [friendStatus, setFriendStatus] = useState("Add Friend");

  const toggleFriend = async () => {
    try {
      if (friendStatus === "Friends") {
        await axios.delete(`http://localhost:8080/api/friends/${userId}/${id}`);
        setIsFriend(false);
        setFriendStatus("Add Friend");
      } else if (friendStatus === "Add Friend") {
        await axios.post(`http://localhost:8080/api/friends/${userId}/${id}`);
        setIsFriend(true);
        setFriendStatus("Request Sent");
      }
    } catch (error) {
      console.error("Error toggling friend status:", error);
    }
  };

  const cancelFriendRequest = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/friends/cancel-request/${userId}/${id}`);
      setFriendStatus("Add Friend");
      setIsFriend(false);
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const acceptFriendRequest = async () => {
    try {
      await axios.post(`http://localhost:8080/api/friends/accept/${id}`);
      setFriendStatus("Friends");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineFriendRequest = async () => {
    try {
      await axios.post(`http://localhost:8080/api/friends/decline/${id}`);
      setFriendStatus("Add Friend");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  useEffect(() => {
    const checkFriendStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/friends/check`, {
          params: {
            userId: userId,
            friendId: id,
          },
        });
        if (response.data === "pending") {
          setFriendStatus(userId === id ? "pending" : "Request Sent");
          setIsFriend(false);
        } else if (response.data === "accepted") {
          setIsFriend(true);
          setFriendStatus("Friends");
        } else {
          setIsFriend(false);
          setFriendStatus("Add Friend");
        }
      } catch (error) {
        console.error("Error checking friend status:", error);
      }
    };
    checkFriendStatus();
  }, [id, userId]);

  //
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
        setFollowCountsLocal(response.data);
      } catch (error) {
        console.error("Error fetching follow counts:", error);
      }
    };

    if (id) {
      fetchFollowCounts();
    }
  }, [id]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/follow/is-following`, {
          params: {
            followerId: userId,
            followedId: id,
          }
        });
        setIsFollowing(response.data);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowingStatus();
  }, [id, userId]);

  const toggleFollow = async () => {
    if (isUpdatingFollow) return;
    setIsUpdatingFollow(true);

    try {
      let newFollowerCount = followCountsLocal.followersCount;

      if (isFollowing) {
        await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
          params: {
            followerId: userId,
            followedId: id,
          },
        });

        newFollowerCount = Math.max(newFollowerCount - 1, 0);
        setIsFollowing(false);
      } else {
        await axios.post(`http://localhost:8080/api/follow/follow`, null, {
          params: {
            followerId: userId,
            followedId: id,
          },
        });

        newFollowerCount = newFollowerCount + 1;
        setIsFollowing(true);
      }

      updateFollowerCount(id, newFollowerCount);

      setFollowCountsLocal((prev) => ({
        ...prev,
        followersCount: newFollowerCount,
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
        <div className="col text-center">
          {userId === id ? null : (
            friendStatus === "Request Sent" && userId !== id ? (
              <button className="btn btn-warning" id="cancelRequestButton" onClick={cancelFriendRequest}>
                Cancel Request
              </button>
            ) : friendStatus === "Add Friend" && userId !== id ? (
              <button className="btn btn-success" onClick={toggleFriend}>
                Add Friend
              </button>
            ) : friendStatus === "Friends" && userId !== id ? (
              <span className="text-success">Friends</span>
            ) : friendStatus === "pending" && userId === id ? (
              <div>
                <button className="btn btn-success" onClick={acceptFriendRequest}>
                  Accept
                </button>
                <button className="btn btn-danger" onClick={declineFriendRequest}>
                  Decline
                </button>
              </div>
            ) : null
          )}
        </div>
      </aside>
      <div className="col-sm-9">
        <div className="bg-light border rounded p-4 mt-4">
          <Routes>
            <Route path="activity" element={<Activity />} />
            <Route path="tracks" element={<Track />} />
            <Route path="albums" element={<Albums />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="*" element={<Navigate to="activity" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
