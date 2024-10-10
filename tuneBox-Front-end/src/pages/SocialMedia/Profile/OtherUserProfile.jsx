import React, { useEffect, useState } from "react";
import { useParams, Link, Routes, Route, Navigate } from "react-router-dom";
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

const OtherUserProfile = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const [userData, setUserData] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchDataUser(userId); // Gọi API để lấy thông tin user
      if (response && response.data) {
        setUserData(response.data);
        setFollowerCount(response.data.followers.length);
        setFollowingCount(response.data.following.length);
      }
    };
    fetchUser();
  }, [userId]);

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
              src="/src/UserImages/Avatar/avt.jpg"
              className="avatar"
              alt="avatar"
            />
            <div className="fs-4 text-small mt-3">
              <b>{userData.userNickname}</b>
            </div>
            <div className="">{userData.userName}</div>
          </div>

          {/* Thông tin người theo giõi */}
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

          {/* Nghệ sĩ yêu thích, sở trường, dòng nhạc yêu thích */}
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
              <Route path="/activity" element={<Activity />} />
              <Route path="/track" element={<Track />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/" element={<Navigate to="activity" />} /> {/* Đường dẫn mặc định */}
            </Routes>
          </article>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
