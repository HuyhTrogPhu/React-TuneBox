import React, { useEffect, useState, useContext } from "react";
import { Link, Routes, Route, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import { FollowContext } from "./FollowContext"; // Import FollowContext
import "./css/profile.css";
import "./css/post.css";
import "./css/button.css";
import "./css/comment.css";
import "./css/modal-create-post.css";
import { fetchDataUser } from "./js/ProfileJS";

const OtherUserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const userId = Cookies.get("UserID");

  const { setFollowerCount: setGlobalFollowerCount, followingCount: globalFollowingCount, setFollowingCount: setGlobalFollowingCount } = useContext(FollowContext);

  useEffect(() => {
    const fetchDataAndRender = async () => {
      try {
        const response = await fetchDataUser(id);
        if (response) {
          setUserData(response);

          // Lấy số lượng follower của OtherUser
          const followersCountResponse = await axios.get(
            `http://localhost:8080/api/follow/followers-count?userId=${id}`
          );
          setFollowerCount(followersCountResponse.data);
          setGlobalFollowerCount(followersCountResponse.data); // Cập nhật số lượng follower trong Context

          // Lấy số lượng following của OtherUser
          const followingCountResponse = await axios.get(
            `http://localhost:8080/api/follow/following-count?userId=${id}`
          );
          setFollowingCount(followingCountResponse.data);

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
  }, [id, userId, setGlobalFollowerCount]);

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
          params: {
            followerId: userId,
            followedId: id
          }
        });
        // Giảm số lượng người theo dõi của OtherUser
        setFollowerCount((prevCount) => Math.max(prevCount - 1, 0));
        setGlobalFollowerCount((prevCount) => Math.max(prevCount - 1, 0)); // Cập nhật trong Context

        // Giảm số lượng following của User 1
        setGlobalFollowingCount((prevCount) => Math.max(prevCount - 1, 0)); // Cập nhật số lượng following của User 1
      } else {
        await axios.post(`http://localhost:8080/api/follow/follow`, null, {
          params: {
            followerId: userId,
            followedId: id
          }
        });
        // Tăng số lượng người theo dõi của OtherUser
        setFollowerCount((prevCount) => prevCount + 1);
        setGlobalFollowerCount((prevCount) => prevCount + 1); // Cập nhật trong Context

        // Tăng số lượng following của User 1
        setGlobalFollowingCount((prevCount) => prevCount + 1); // Cập nhật số lượng following của User 1
      }
      setIsFollowing((prev) => !prev);
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
    <div className="container">
      {/* Hình nền profile */}
      <div
        className="background border container"
        style={{
          backgroundImage: "url(/src/UserImages/Background/anime-girl.jpg)",
        }}
      />

      <div className="row container">
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

          {/* Nút Follow/Unfollow */}
          <div>
            <button id="followButton" onClick={toggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>

          {/* Nút Block/Unblock */}
          <div>
            <button id="blockButton" onClick={toggleBlock}>
              {isBlocked ? "Unblock" : "Block"}
            </button>
          </div>

          {/* Thông tin người theo dõi */}
          <div className="row mt-4">
            <div className="col text-center">
              <span>{followerCount}</span> <br />
              <span>Follower</span>
            </div>
            <div className="col text-center">
              <span>{followingCount}</span> <br />
              <span>Following</span>
            </div>
          </div>

          {/* Các phần thông tin khác */}
          <div style={{ paddingTop: 30 }}>
            <label>Nghệ sĩ ưu thích</label> <br />
            {userData.inspiredBy?.length > 0 ? (
              userData.inspiredBy.map((artist) => (
                <span
                  key={artist.id}
                  className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                >
                  {artist.name}
                </span>
              ))
            ) : (
              <p>Không có nghệ sĩ ưu thích nào.</p>
            )}
            <br />
            <label>Sở trường</label> <br />
            {userData.talent?.length > 0 ? (
              userData.talent.map((talent) => (
                <span
                  key={talent.id}
                  className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                >
                  {talent.name}
                </span>
              ))
            ) : (
              <p>Chưa chọn sở trường.</p>
            )}
            <br />
            <label>Dòng nhạc ưu thích</label> <br />
            {userData.genre?.length > 0 ? (
              userData.genre.map((genre) => (
                <span
                  key={genre.id}
                  className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                >
                  {genre.name}
                </span>
              ))
            ) : (
              <p>Không có dòng nhạc ưu thích nào.</p>
            )}
          </div>
        </aside>

        {/* Phần nội dung chính */}
        <div className="col-sm-9 d-flex flex-column">
          {/* Menu cho các tab */}
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

          {/* Nội dung sẽ thay đổi dựa trên tab được chọn */}
          <article className="p-5">
            <Routes>
              <Route path="activity" element={<Activity userId={id} />} />
              <Route path="track" element={<Track userId={id} />} />
              <Route path="albums" element={<Albums userId={id} />} />
              <Route path="playlists" element={<Playlists userId={id} />} />
              <Route path="/" element={<Navigate to="activity" />} />
            </Routes>
          </article>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
