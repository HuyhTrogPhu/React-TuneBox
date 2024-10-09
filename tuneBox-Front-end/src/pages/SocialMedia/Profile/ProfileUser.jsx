import React, { useEffect, useState } from "react";
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
// import "./Profile_nav/css/activity.css"

import i18n from "../../../i18n/i18n";

import ReactCountryFlag from "react-country-flag";

import { useTranslation } from "react-i18next"; // Import hook dịch
const ProfileUser = () => {
  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Hàm thay đổi ngôn ngữ
  };
  const value = Cookies.get("UserID");
  // console.log(value);
  const [userData, setUserData] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  useEffect(() => {
    const fetchDataAndRender = async () => {
      const response = await fetchDataUser(value);
      // console.log("Data fetched from API:", response);
      if (response && response.data) {
        setUserData(response.data);
        console.log(userData);
        setFollowerCount(userData.followers.length);
        setFollowingCount(userData.following.length);
      }
    };

    fetchDataAndRender();
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
              <b>{userData.userNickname}</b>
            </div>
            <div className="">{userData.userName}</div>
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
                <b>{t("profile.get_prime")}</b>
                </button>
            </div>
            {/*kết thúc nút mua prime */}
            {/* nút tới trang sửa profile */}
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
            {/*kết thúc nút tới trang sửa profile */}
          </div>
          {/* thông tin người theo giõi */}
          <div className="row mt-4">
            <div className="col text-center">
              <span>{followerCount}</span> <br />
              <span>{t("profile.followers")}</span>
            </div>
            <div className="col text-center">
              <span>{followingCount}</span> <br />
              <span>{t("profile.following")}</span>
            </div>
          </div>
          {/*kết thúc thông tin người theo giõi */}

          <div style={{ paddingTop: 30 }}>
          <label>{t("profile.favorite_artists")}</label> <br />
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
              <p>{t("profile.no_inspired_artists")}</p>
            )}
            <br />
            <label>{t("profile.talents")}</label> <br />
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
              <p>{t("profile.no_talents")}</p>
            )}
             <br />
             <label>{t("profile.favorite_genres")}</label> <br />
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
              <p>{t("profile.no_favorite_genres")}</p>
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
              <Route path="/activity" element={<Activity />} />
              <Route path="/track" element={<Track />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/" element={<Navigate to="activity" />} /> Đường dẫn mặc định
            </Routes>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
