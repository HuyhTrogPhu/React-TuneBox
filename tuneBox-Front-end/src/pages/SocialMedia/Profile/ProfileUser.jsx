import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { Link, Routes, Route } from "react-router-dom";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import "./css/profile.css";
import "./css/post.css";
import "./css/button.css";
import "./css/comment.css";
import "./css/modal-create-post.css";
import { images } from "../../../assets/images/images";
import { getUserInfo } from "../../../service/UserService";

const ProfileUser = () => {
  const userIdCookie = Cookies.get('userId');
  const [userData, setUserData] = useState({});

  // get user info in profile page
  useEffect(() => {
    if (userIdCookie) {
      const fetchUser = async () => {
        try {
          const userData = await getUserInfo(userIdCookie);
          setUserData(userData); // Gán trực tiếp data từ response vào state
        } catch (error) {
          console.error("Error fetching user", error);
        }
      };
      fetchUser();
    }
  }, [userIdCookie]);

  return (
    <div className="container">
      {/* background */}
      <div
        className="background border container"
        style={{
          backgroundImage: `url(${userData.background || "/src/UserImages/Background/default-bg.jpg"})`,
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
          {/* Thông tin người theo dõi */}
          <div className="row mt-4">
            <div className="col text-center">
              <span>0</span> <br />
              <span>Follower</span>
            </div>
            <div className="col text-center">
              <span>0</span> <br />
              <span>Following</span>
            </div>
          </div>

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
              <p>Không có nghệ sĩ ưu thích nào.</p>
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
              <p>Chưa chọn sở trường.</p>
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
              <p>Không có dòng nhạc ưu thích nào.</p>
            )}
          </div>
        </aside>

        <div className="col-sm-9 d-flex flex-column">
          <nav className="nav flex-column flex-md-row p-5">
            <Link to="activity" className="nav-link">Activity</Link>
            <Link to="track" className="nav-link">Track</Link>
            <Link to="albums" className="nav-link">Albums</Link>
            <Link to="playlists" className="nav-link">Playlists</Link>
          </nav>

          <article className="p-5">
            <Routes>
              <Route path="/activity" element={<Activity />} />
              <Route path="/track" element={<Track />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/playlists" element={<Playlists />} />
            </Routes>
          </article>
        </div>
      </div>
    </div>
  );
};


export default ProfileUser;
