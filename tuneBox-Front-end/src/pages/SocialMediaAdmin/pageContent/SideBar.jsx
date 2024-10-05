import React from "react";
import { images } from "../../../assets/images/images";
import "../css/sidebar.css";

const SideBar = () => {
  return (
    <div className="sidebar col-lg-2 col-md-3 vh-100">
      {/* Logo */}
      <div className="logo p-3">
        <a href="#">
          <img src={images.adminImage} alt width="100%" />
        </a>
      </div>
      {/* Menu */}
      <div className="menu">
        <ul className="list-unstyled">
          <li className="p-3">
            <i className="fa-solid fa-house" />
            <a href="/socialadmin" className="text-white">
              Dashboard
            </a>
          </li>
          <li className="p-3">
            <i className="fa-solid fa-user" />
            <a href="#" className="text-white">
              Users
            </a>
          </li>
          <li className="p-3">
            <i className="fa-solid fa-music" />
            <a href="#" className="text-white">
              Tracks
            </a>
          </li>
          <li className="p-3">
            <i className="fa-solid fa-headphones" />
            <a href="#" className="text-white">
              Playlists
            </a>
          </li>
          <li className="p-3">
            <i className="fa-solid fa-circle-play" />
            <a href="#" className="text-white">
              Albums
            </a>
          </li>
          <li className="p-3">
            <i className="fa-solid fa-newspaper" />
            <a href="#" className="text-white">
              Post
            </a>
          </li>
          <li className="p-3">
            <i className="fa-solid fa-chart-simple" />
            <a href="#" className="text-white">
              Statistical
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
