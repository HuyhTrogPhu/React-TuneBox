import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import "../../../pages/SocialMedia/Profile/css/setting.css";
import { fetchDataUser } from "./js/ProfileJS";
import Cookies from 'js-cookie';

import i18n from "../../../i18n/i18n";

import ReactCountryFlag from "react-country-flag";

import { useTranslation } from "react-i18next"; // Import hook dịch
const ProfileSetting = () => {
  // State để quản lý component đang được hiển thị
  const [activeComponent, setActiveComponent] = useState("Profile");

  // Hàm để thay đổi component hiển thị khi click vào các tab
  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
  };
  

  return (
    <div className="">
      <div className="row">
        <aside className="col-sm-3">
          <div className="d-flex flex-column flex-shrink-0 p-3">
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <div
                  className={`nav-link text-black ${
                    activeComponent === "Profile" ? "active" : ""
                  }`}
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
                  className={`nav-link text-black ${
                    activeComponent === "Account" ? "active" : ""
                  }`}
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
                  className={`nav-link text-black ${
                    activeComponent === "Order" ? "active" : ""
                  }`}
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

        <article className="col-sm-9">
          {activeComponent === "Profile" && <Profile />}
          {activeComponent === "Account" && <Account />}
          {activeComponent === "Order" && <CustomerOrder />}
        </article>
      </div>
    </div>
  );
};

export default ProfileSetting;
