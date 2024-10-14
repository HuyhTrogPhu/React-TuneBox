import React, { useEffect, useState, useContext } from "react";
import { Link, Routes, Route, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import { FollowContext } from "./FollowContext"; 
import "./css/profile.css";
import "./css/post.css";
import "./css/button.css";
import "./css/comment.css";
import "./css/modal-create-post.css";
import { fetchDataUser } from "./js/ProfileJS";

const OtherUserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const userId = Cookies.get("UserID");

  const { followerCounts, updateFollowerCount } = useContext(FollowContext); // Sử dụng context

  useEffect(() => {
    const fetchDataAndRender = async () => {
      try {
        const response = await fetchDataUser(id);
        if (response) {
          setUserData(response);

          // Kiểm tra xem User 1 có đang follow OtherUser hay không
          const isFollowingResponse = await axios.get(
            `http://localhost:8080/api/follow/is-following?followerId=${userId}&followedId=${id}`
          );
          setIsFollowing(isFollowingResponse.data);

          // Kiểm tra xem User 1 có đang block OtherUser không
          const isBlockedResponse = await axios.get(
            `http://localhost:8080/api/blocks/is-blocked?blockerId=${userId}&blockedId=${id}`
          );
          setIsBlocked(isBlockedResponse.data);
        } else {
          console.error("No data returned or data structure is incorrect");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchDataAndRender();
  }, [id, userId]);

  // Fetch số lượng người theo dõi của OtherUser khi component mount
  useEffect(() => {
    const fetchFollowerCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/follow/followers-count?userId=${id}`);
        updateFollowerCount(id, response.data); // Cập nhật số lượng người theo dõi cho OtherUser
      } catch (error) {
        console.error("Error fetching follower count:", error);
      }
    };

    fetchFollowerCount();
  }, [id, updateFollowerCount]);

  const toggleFollow = async () => {
    try {
      console.log("Current following state:", isFollowing);
      
      if (isFollowing) {
        const response = await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
          params: {
            followerId: userId,
            followedId: id
          }
        });
        console.log("Unfollow response:", response.data); // Debug response
        // Giảm số lượng người theo dõi của OtherUser
        updateFollowerCount(id, (prevCount) => Math.max(prevCount - 1, 0)); // Cập nhật trong Context
      } else {
        const response = await axios.post(`http://localhost:8080/api/follow/follow`, null, {
          params: {
            followerId: userId,
            followedId: id
          }
        });
        console.log("Follow response:", response.data); // Debug response
        // Tăng số lượng người theo dõi của OtherUser
        updateFollowerCount(id, (prevCount) => prevCount + 1); // Cập nhật trong Context
      }
  
      setIsFollowing((prev) => !prev);
      console.log("Updated following state:", !isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };
  

  const toggleBlock = async () => {
    try {
      if (isBlocked) {
        await axios.delete(
          `http://localhost:8080/api/blocks/unblock?blockerId=${userId}&blockedId=${id}`
        );
        setIsBlocked(false);
      } else {
        await axios.post(
          `http://localhost:8080/api/blocks/block?blockerId=${userId}&blockedId=${id}`
        );
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

<div
        className="background border container"
        style={{
          backgroundImage: "url(/src/UserImages/Background/anime-girl.jpg)",
        }}
      />

    <aside className="col-sm-3">
      <div>
        <img
          src={userData.avatar || "/src/UserImages/Avatar/avt.jpg"}
          className="avatar"
          alt="avatar"
        />
        <div className="fs-4 text-small mt-3">
          <b>{userData.userNickname}</b>
        </div>
        <div className="">{userData.userName}</div>
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
              <span>{followerCounts[id] || 0}</span> <br />
              <span>Follower</span>
            </div>
            <div className="col text-center">
              <span>{followerCounts[userId] || 0}</span> <br />
              <span>Following</span>
            </div>
          </div>
      <div style={{ paddingTop: 30 }}>
        <label>Nghệ sĩ ưu thích</label> <br />
        {userData.inspiredBy && userData.inspiredBy.length > 0 ? (
          userData.inspiredBy.map((Mapdata) => (
            <span
              key={Mapdata.id}
              className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
            >
              {Mapdata.name}
            </span>
          ))
        ) : (
          <p>Không có nghệ sĩ ưu thích nào.</p>
        )}
        <br />
        <label>Sở trường</label> <br />
        {userData.talent && userData.talent.length > 0 ? (
          userData.talent.map((Mapdata) => (
            <span
              key={Mapdata.id}
              className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
            >
              {Mapdata.name}
            </span>
          ))
        ) : (
          <p>Chưa chọn sở trường.</p>
        )}
        <br />
        <label>Dòng nhạc ưu thích</label> <br />
        {userData.genre && userData.genre.length > 0 ? (
          userData.genre.map((Mapdata) => (
            <span
              key={Mapdata.id}
              className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
            >
              {Mapdata.name}
            </span>
          ))
        ) : (
          <p>Không có dòng nhạc ưu thích nào.</p>
        )}
      </div>
    </aside>

    <div className="col-sm-9 d-flex flex-column ">
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
