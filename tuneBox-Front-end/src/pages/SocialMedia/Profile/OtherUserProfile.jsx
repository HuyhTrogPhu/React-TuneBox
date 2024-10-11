import React, { useEffect, useState } from "react";
import { Link, Routes, Route, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import "./css/profile.css";
import "./css/post.css";
import "./css/button.css";
import "./css/comment.css";
import "./css/modal-create-post.css";
import { fetchDataUser } from "./js/ProfileJS";

const OtherUserProfile = () => {
  const { id } = useParams(); // Lấy userId từ URL
  const [userData, setUserData] = useState(null); // Đặt mặc định là null
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const fetchDataAndRender = async () => {
      const response = await fetchDataUser(id);
      if (response) { // Kiểm tra nếu phản hồi không phải là null
        // Kiểm tra cấu trúc dữ liệu
        console.log("Response structure:", response);
        setUserData(response); // Nếu không có thuộc tính data, set dữ liệu trực tiếp
        setFollowerCount(response.followers?.length || 0);
        setFollowingCount(response.following?.length || 0);
      } else {
        console.error("No data returned or data structure is incorrect");
      }
    };
    
    fetchDataAndRender();
  }, [id]);
  
  

  // Kiểm tra nếu userData vẫn null
  if (!userData) {
    return <div>Đang tải dữ liệu...</div>; // Hoặc có thể hiển thị spinner/loading
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
              src={userData.avatar || "/src/UserImages/Avatar/avt.jpg"} // Có thể lấy avatar từ userData
              className="avatar"
              alt="avatar"
            />
            <div className="fs-4 text-small mt-3">
              <b>{userData.userNickname}</b>
            </div>
            <div className="">{userData.userName}</div>
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
          {/* Kết thúc thông tin người theo dõi */}

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
              <Route path="/" element={<Navigate to="activity" />} /> {/* Đường dẫn mặc định */}
            </Routes>
          </article>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
