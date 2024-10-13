import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { Link, Routes, Route, Navigate } from "react-router-dom";
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
import { fetchDataUser } from "./js/ProfileJS";
import { FollowContext } from './FollowContext'; // Đảm bảo import đúng context

const ProfileUser = () => {
  const userId = Cookies.get("UserID");
  const { followerCount, setFollowerCount, followingCount, setFollowingCount } = useContext(FollowContext);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchDataAndRender = async () => {
      const response = await fetchDataUser(userId);
      if (response && response.data) {
        setUserData(response.data);
        setFollowerCount(response.data.followers.length); // Cập nhật số lượng người theo dõi
        setFollowingCount(response.data.following.length); // Cập nhật số lượng người đang theo dõi
      }
    };

    fetchDataAndRender();
  }, [userId, setFollowerCount, setFollowingCount]);

  return (
    <div className="container">
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
              src="/src/UserImages/Avatar/avt.jpg"
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
              <button
                type="button"
                style={{ width: 180 }}
                className="btn btn-dark"
              >
                <img
                  alt="leverup"
                  src={images.level_up}
                  width="20px"
                  height="20px"
                  style={{ marginRight: 20 }}
                />
                <b>Get Prime</b>
              </button>
            </div>
            <div className="col text-end">
              <Link to={"/ProfileSetting"}>
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
              <Route path="/activity" element={<Activity />} />
              <Route path="/track" element={<Track />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/" element={<Navigate to="activity" />} />
            </Routes>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
