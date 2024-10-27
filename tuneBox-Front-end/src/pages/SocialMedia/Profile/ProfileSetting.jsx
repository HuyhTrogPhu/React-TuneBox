import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import "../../../pages/SocialMedia/Profile/css/setting.css";
import { fetchDataUser } from "./js/ProfileJS";
import Cookies from 'js-cookie';

import i18n from "../../../i18n/i18n";

import ReactCountryFlag from "react-country-flag";

import { useTranslation } from "react-i18next"; // Import hook dịch
const ProfileSetting = () => {

  const { t } = useTranslation();
  const userId = Cookies.get("userId");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Hàm thay đổi ngôn ngữ
  };

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

  // Hàm để populate các ngày
  const populateDays = () => {
    const daySelect = document.getElementById("daySelect");
    for (let i = 1; i <= 31; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }
  };

  // Hàm để populate các tháng
  const populateMonths = () => {
    const monthSelect = document.getElementById("monthSelect");
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    months.forEach((month, index) => {
      let option = document.createElement("option");
      option.value = index + 1;
      option.textContent = month;
      monthSelect.appendChild(option);
    });
  };

  // Hàm để populate các năm
  const populateYears = () => {
    const yearSelect = document.getElementById("yearSelect");
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      let option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      yearSelect.appendChild(option);
    }
  };

  // Thực hiện populate các dropdown khi component mount
  useEffect(() => {
    populateDays();
    populateMonths();
    populateYears();
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
          <div className="d-flex flex-column flex-shrink-0 p-3">
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <div
                  className={`nav-link text-black ${activeComponent === "Profile" ? "active" : ""}`}
                  onClick={() => handleComponentChange("Profile")}
                >
                  <div className="post-setting m-0">
                    <img src={images.avt} alt="avatar" />
                    <div className="name1">Profile</div>
                  </div>
                </div>
              </li>
              <li>
                <div
                  className={`nav-link text-black ${activeComponent === "Account" ? "active" : ""}`}
                  onClick={() => handleComponentChange("Account")}
                >
                  <div className="post-setting m-0">
                    <img src={images.user} alt="icon-user" />
                    <div className="name1">Account</div>
                  </div>
                </div>
              </li>
              <li>
                <div
                  className={`nav-link text-black ${activeComponent === "Order" ? "active" : ""}`}
                  onClick={() => handleComponentChange("Order")}
                >
                  <div className="post-setting m-0">
                    <img src={images.shopping_bag} alt="icon-shopping" />
                    <div className="name1">Order</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
        <article className="col-sm-9" style={{ paddingTop: 100 }}>
          <div>
            <h3>
            <b>{t("profile_setting")}</b>
            </h3>
          </div>
          <div className="profile-container">
            <div className="profile-avatar">
              <img src={images.avt} className="avatar-setting" alt="Avatar" />
            </div>
            <div className="profile-container">
              <form className="row g-3">
                <div className="row">
                  <label htmlFor="name" style={{ marginLeft: -40 }}>
                    <h6>
                    <b>{t("profile.name")}</b>
                    </h6>
                  </label>
                  <input
                  
                   className="form-control"
                   type="text"
                   placeholder={userData.userName ? userData.userName : t("profile.name")}
                   id="name"
                   style={{
                     backgroundColor: 'rgba(64, 102, 128, 0.078)',
                     height: 40,
                     width: 600,
                     marginTop: -20,
                   }}
                  />
                </div>
                <div className="row">
                  <label htmlFor="location" style={{ marginLeft: -40 }}>
                    <h6>
                    <b>{t("location")}</b>
                    </h6>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder={t("search_city")}
                    id="location"
                    style={{
                      backgroundColor: "rgba(64, 102, 128, 0.078)",
                      height: 40,
                      width: 600,
                      marginTop: -20,
                    }}
                  />
                </div>
                <div>
                  <div
                    className="row g-3 "
                    style={{ marginLeft: -20, marginRight: 160 }}
                  >
                    {/* Gender Selection */}
                    <div className="col-md-4 form-group">
                      <label htmlFor="genderSelect" style={{ marginLeft: -30 }}>
                        <h6>
                        <b>{t("gender")}</b>
                        </h6>
                      </label>
                      <select
                        id="genderSelect"
                        className="form-select"
                        style={{ marginTop: -20 }}
                      >
                        <option
                          value
                          disabled="disabled"
                          hidden
                          selected="selected"
                        >
                          {t("add_gender")}
                          </option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {/* Date Selection */}
                    <div className="col-md-8">
                      <div className="date-selectors">
                        <section className="form-group ">
                          <label
                            htmlFor="daySelect "
                            style={{ marginLeft: -25 }}
                          >
                            <h6>
                            <b>{t("day")}</b>
                            </h6>
                          </label>
                          <div style={{ marginTop: -20 }}>
                            <select id="daySelect" className="form-select" />
                          </div>
                        </section>
                        <section className="form-group">
                          <label
                            htmlFor="monthSelect"
                            style={{ marginLeft: -25 }}
                          >
                            <h6>
                            <b>{t("month")}</b>
                            </h6>
                          </label>
                          <div style={{ marginTop: -20 }}>
                            <select id="monthSelect" className="form-select" />
                          </div>
                        </section>
                        <section className="form-group">
                          <label htmlFor="yearSelect">
                            <h6>
                            <b>{t("year")}</b>
                            </h6>
                          </label>
                          <div style={{ marginTop: -20 }}>
                            <select id="yearSelect" className="form-select" />
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div style={{ marginLeft: 180, marginRight: 170 }}>
            <label htmlFor="About" style={{ marginLeft: -25 }}>
              <h6>
              <b>{t("about")}</b>
              </h6>
            </label>
            <div className="profile-container">
              <textarea
                className="custom-textarea"
                name="about"
                id="About"
                defaultValue={""}
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ProfileSetting;
