import React, { useEffect, useState } from "react";
<<<<<<< HEAD
=======
import Cookies from "js-cookie";
>>>>>>> Gia-Bao
import { Link, Routes, Route, Navigate } from "react-router-dom";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
<<<<<<< HEAD
import axios from "axios"; // Thêm axios
=======
>>>>>>> Gia-Bao
import "./css/profile.css";
import "./css/post.css";
import "./css/button.css";
import "./css/comment.css";
import "./css/modal-create-post.css";
import { images } from "../../../assets/images/images";
<<<<<<< HEAD

const ProfileUser = () => {
  const [userName, setUserName] = useState(""); // State cho username
  const [fullName, setFullName] = useState(""); // State cho tên đầy đủ

  // Hàm để lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/User/current', { withCredentials: true });
      setUserName(response.data.userName); // Giả sử response.data chứa tên người dùng
      setFullName(response.data.fullName); // Lưu tên đầy đủ nếu có
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Gọi fetchUserInfo khi component được mount
  useEffect(() => {
    fetchUserInfo();
=======
import { fetchDataUser } from "./js/ProfileJS";

const ProfileUser = () => {
  const value = Cookies.get("UserID");
  console.log(value);
  const [userData, setUserData] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  useEffect(() => {
    const fetchDataAndRender = async () => {
      const response = await fetchDataUser(value);
      console.log("Data fetched from API:", response);
      if (response && response.data) {
        setUserData(response.data);
        console.log(userData);
        setFollowerCount(userData.followers.length);
        setFollowingCount(userData.following.length);
      }
    };

    fetchDataAndRender();
>>>>>>> Gia-Bao
  }, []);

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
<<<<<<< HEAD
              <b>{fullName || "Tên người dùng"}</b> {/* Hiển thị tên đầy đủ */}
            </div>
            <div className="">{`@${userName.toLowerCase()}`}</div> {/* Hiển thị username */}
=======
              <b>{userData.userNickname}</b>
            </div>
            <div className="">{userData.userName}</div>
>>>>>>> Gia-Bao
          </div>
          {/* 2 nút dưới avatar */}
          <div className="row mt-4">
            {/* nút mua prime */}
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
            {/*kết thúc nút mua prime */}
            {/* nút tới trang sửa profile */}
            <div className="col text-end">
              <Link to={"/ProfileSetting"}>
                <button type="button" className="btn btn-secondary">
<<<<<<< HEAD
                  <img src={images.pen} width="20px" height="20px" alt="setting-btn" />
=======
                  <img
                    src={images.pen}
                    width="20px"
                    height="20px"
                    alt="setting-btn"
                  />
>>>>>>> Gia-Bao
                </button>
              </Link>
            </div>
            {/*kết thúc nút tới trang sửa profile */}
          </div>
          {/* thông tin người theo giõi */}
          <div className="row mt-4">
            <div className="col text-center">
              <span>{followerCount}</span> <br />
              <span>Follower</span>
            </div>
            <div className="col text-center">
<<<<<<< HEAD
              <span>0</span> <br />
              <span>Following</span>
            </div>
            <div className="col text-center">
              <span>0</span> <br />
              <span>Posts</span>
=======
              <span>{followingCount}</span> <br />
              <span>Following</span>
>>>>>>> Gia-Bao
            </div>
          </div>
          {/*kết thúc thông tin người theo giõi */}

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
        <div className="col-sm-9 d-flex flex-column ">
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
<<<<<<< HEAD
              <Route path="activity" element={<Activity />} />
              <Route path="track" element={<Track />} />
              <Route path="albums" element={<Albums />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="/" element={<Navigate to="activity" />} /> {/* Đường dẫn mặc định */}
=======
              <Route path="/activity" element={<Activity />} />
              <Route path="/track" element={<Track />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/playlists" element={<Playlists />} />
              {/* <Route path="/" element={<Navigate to="activity" />} /> Đường dẫn mặc định */}
>>>>>>> Gia-Bao
            </Routes>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
