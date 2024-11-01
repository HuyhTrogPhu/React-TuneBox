import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import LikePost from "./Profile_nav/LikePost";
import { getUserInfo, getFriendCount } from "../../../service/UserService"; // Nhập hàm lấy số lượng bạn bè
import "./css/profile.css";
import "./css/post.css";
import "./css/button.css";
import "./css/comment.css";
import "./css/modal-create-post.css";
import { images } from "../../../assets/images/images";
import { FollowContext } from "./FollowContext";

const ProfileUser = () => {
  const userIdCookie = Cookies.get("userId");
  const { followCounts } = useContext(FollowContext);
  const [userData, setUserData] = useState({});
  const [followCount, setFollowCount] = useState({
    followerCount: 0,
    followingCount: 0,
  });
  const [friendCount, setFriendCount] = useState(0); // Trạng thái lưu số lượng bạn bè
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState("");

  // Cấu hình interceptor cho Axios để thêm Authorization header vào mỗi yêu cầu
  // axios.interceptors.request.use(
  //   (config) => {
  //     const token = localStorage.getItem('token').trim(); // Lấy token từ localStorage
  //       if (token) {
  //           config.headers['Authorization'] = token; 
  //       }
  //       return config;
  //   },
  //   (error) => {
  //       return Promise.reject(error);
  //   }
  // );

  useEffect(() => {
    const fetchUser = async () => {
      if (userIdCookie) {
        try {
          const userData = await getUserInfo(userIdCookie);
          setUserData(userData);
          console.log("User data fetched from API:", userData);
          // Lấy số lượng bạn bè
          const count = await getFriendCount(userIdCookie);
          console.log("Fetched friend count:", count); // Log giá trị friend count
          setFriendCount(count); // Cập nhật số lượng bạn bè
          console.log("Updated friend count state:", count); // Log trạng thái bạn bè
        } catch (error) {
          console.error("Error fetching user", error);
        }
      }
    };

    fetchUser();
  }, [userIdCookie]);

  useEffect(() => {
    const counts = followCounts[userIdCookie] || {
      followerCount: 0,
      followingCount: 0,
    };
    setFollowCount(counts);
    console.log("Updated follow counts:", counts);
  }, [followCounts, userIdCookie]);

  return (
    <div className="container">
      {/* Background */}
      <div
        className="background border container"
        style={{
          backgroundImage: `url(${userData.background || "/src/UserImages/Background/default-bg.jpg"
            })`,
        }}
      />
      <div className="row container">
        <aside className="col-sm-3">
          <div>
            {/* Avatar */}
            <img
              src={userData.avatar || "/src/UserImages/Avatar/default-avt.jpg"}
              className="avatar"
              alt="avatar"
              style={{ width: '100px', height: '100px' }}
            />
          </div>
          <div className="row mt-4">
            <div className="col">
              <div className="fs-4 text-small">
                <b>{userData.name}</b>
              </div>
              <div className="">{userData.userName}</div>
            </div>
            <div className="col text-end">
              <Link to="/ProfileSetting">
                <button type="button" className="btn btn-secondary">
                  <img
                    src={images.pen}
                    width="20px"
                    height="20px"
                    alt="setting-btn"
                  />
                </button>
              </Link>
            </div>
          </div>
          {/* Display follower, following, and friend counts */}
          <div className="row mt-4">
            <div className="col text-center">
              <Link to={`/Follower/${userIdCookie}`}>
                <span>{followCount.followerCount}</span> <br />
                <span>Follower</span>
              </Link>
            </div>
            <div className="col text-center">
              <Link to={`/Following/${userIdCookie}`}>
                <span>{followCount.followingCount}</span> <br />
                <span>Following</span>
              </Link>
            </div>
            <div className="col text-center">
              <Link to={`/FriendList/${userIdCookie}`}>
                <span>{friendCount}</span> <br />
                <span>Friends</span>
              </Link>
            </div>
          </div>
          {/* Display InspiredBy, Talent, and Genre */}
          <div style={{ paddingTop: 30 }}>
            <label>InspiredBy</label> <br />
            {userData.inspiredBy && userData.inspiredBy.length > 0 ? (
              userData.inspiredBy.map((name, index) => (
                <span
                  key={index}
                  className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                >
                  {name}
                </span>
              ))
            ) : (
              <p>No favorite artists.</p>
            )}
            <br />
            <label>Talent</label> <br />
            {userData.talent && userData.talent.length > 0 ? (
              userData.talent.map((name, index) => (
                <span
                  key={index}
                  className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                >
                  {name}
                </span>
              ))
            ) : (
              <p>No talents selected.</p>
            )}
            <br />
            <label>Genre</label> <br />
            {userData.genre && userData.genre.length > 0 ? (
              userData.genre.map((name, index) => (
                <span
                  key={index}
                  className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                >
                  {name}
                </span>
              ))
            ) : (
              <p>No favorite genres.</p>
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
            <Link to={`likepost/${userIdCookie}`} className="nav-link"></Link>
          </nav>

          <div className="container">
            <Routes>
              <Route path="/" element={<Navigate to="activity" />} />
              <Route path="activity" element={<Activity />} />
              <Route path="track" element={<Track />} />
              <Route path="albums" element={<Albums />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="likepost/:userId" element={<LikePost />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;