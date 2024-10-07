import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { images } from "../../../assets/images/images";
import "../../../pages/SocialMedia/Profile/css/setting.css";
import { fetchDataUser } from "./js/ProfileJS";
import { Link, Route, Routes } from "react-router-dom";
import Account from "./setting_nav/account";
import Profile from "./setting_nav/profile";
const ProfileSetting = () => {
  // Hàm để set 'active' cho các link khi click
  useEffect(() => {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navLinks.forEach((nav) => nav.classList.remove("active"));
        this.classList.add("active");
      });
    });

    // Cleanup event listener khi component unmount
    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener("click", function () {});
      });
    };
  }, []);

  const value = Cookies.get("UserID");
  console.log(value);
  const [userData, setUserData] = useState([]);
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
  }, []);
  return (
    <div className="container">
      <div className="row">
        <aside className="col-sm-3">
          <a href className="text-black text-decoration-none">
            <div className="post-header post">
              <img src={images.avt} className="avatar_small" alt="Avatar" />
              <div className="info1">
                <div className="name1">{userData.userName}</div>
                <div className="author1">Back to profile</div>
              </div>
            </div>
          </a>
          <div className="d-flex flex-column flex-shrink-0 p-3">
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <Link to={'profile'}
                  className="nav-link text-black"
                  aria-current="page"
                >
                  <div className="post-setting">
                    <img src={images.avt} alt="avatar" />
                    <div className="name1">Profile</div>
                  </div>
                </Link>
              </li>
              <li>
                <Link to={'Account'} href="#Account" className="nav-link text-black">
                  <div className="post-setting">
                    <img src={images.user} alt="icon-user" />
                    <div className="name1">Account</div>
                  </div>
                </Link>
              </li>
              <li>
                <a href="#Prime" className="nav-link text-black">
                  <div className="post-setting">
                    <img src={images.crown} alt="icon-crow" />
                    <div className="name1">Prime</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="#Order" className="nav-link text-black">
                  <div className="post-setting">
                    <img src={images.shopping_bag} alt="icon-shopping" />
                    <div className="name1">Order</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="#Bell" className="nav-link text-black">
                  <div className="post-setting">
                    <img
                      src={images.bell}
                      alt="icon-bell"
                      style={{ backgroundColor: "rgb(232, 232, 186)" }}
                    />
                    <div className="name1">Notification</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </aside>
        <article className="col-sm-9" style={{ paddingTop: 100 }}>
          <Routes>
            <Route path="account" element= {<Account />} />
            <Route path="profile" element= {<Profile />} />
          </Routes>
        </article>
      </div>
    </div>
  );
};
export default ProfileSetting;
