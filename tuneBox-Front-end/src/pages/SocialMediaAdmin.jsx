import React from "react";
import { images } from "../../src/assets/images/images";
import "./SocialMediaAdmin/css/sidebar.css";
import '../pages/SocialMediaAdmin/pageContent/SideBar';
import '../pages/SocialMediaAdmin/pageContent/TopBar';
import PlaylistDetail from "./SocialMediaAdmin/pageContent/PlaylistDetail";
import AlbumDetail from "./SocialMediaAdmin/pageContent/AlbumDetail";
import PostDetail from "./SocialMediaAdmin/pageContent/PostDetail";
import { Link, Route, Routes } from "react-router-dom";
import Albums from "./SocialMediaAdmin/pageContent/Albums";
import Posts from "./SocialMediaAdmin/pageContent/Posts";
import DashBoard from "./SocialMediaAdmin/pageContent/DashBoard";
import Users from "./SocialMediaAdmin/pageContent/Users";
import Playlists from "./SocialMediaAdmin/pageContent/Playlists";
import ReportManagement from "./SocialMediaAdmin/pageContent/ReportManagement";
import Statistical from "./SocialMediaAdmin/pageContent/Statistical";
import StatisticalUser from "./SocialMediaAdmin/pageContent/StatisticalUser";
import StatisticalPost from "./SocialMediaAdmin/pageContent/StatisticalPost";

const SocialMediaAdmin = () => {
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="sidebar col-lg-2 col-md-3 vh-100">
            {/* Logo */}
            <div className="logo p-3">
              <a href="#">
                <img src={images.adminImage} alt width="100%" />
              </a>
            </div>

            {/* Menu */}
            <div className="menus">
              <ul className="list-unstyled">
                <li className="p-3">
                  <i className="fa-solid fa-house" />
                  <a href="/socialadmin/dashboard" className="text-white">
                    Dashboard
                  </a>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-user" />
                  <Link to={"/socialadmin/users"} className="text-white">
                    Users
                  </Link>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-music" />
                  <a href="#" className="text-white">
                    Tracks
                  </a>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-headphones" />
                  <Link to={"/socialadmin/playlists"} className="text-white">
                    Playlists
                  </Link>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-circle-play" />
                  <Link to={"/socialadmin/albums"} className="text-white">
                    Albums
                  </Link>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-newspaper" />
                  
                  <Link to={"/socialadmin/posts"} className="text-white">
                    Post
                  </Link>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-chart-simple" />
                  <Link to={"/socialadmin/statistical"} className="text-white">
                    Statistical
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-10 col-md-9 p-0">
            {/* Topbar */}
            <div className="topbar d-flex justify-content-end align-items-center p-3 bg-light border-bottom">
              <div className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  User name
                  <img
                    src={images.karinaImage} 
                    className="rounded-pill ms-2"
                    alt="User Image"
                    style={{ width: 30, height: 30 }}
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Log Out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Main Content */}
            <div className="container-fluid">
            <Routes>
              <Route path='playlists' element={<Playlists/>} />
              <Route path='albums' element={<Albums/>} />
              {/* <Route path='albumdetail' element={<AlbumDetail/>} /> */}
              <Route path='posts' element={<Posts/>} />
              <Route path='dashboard' element={<DashBoard/>} />
              <Route path='users' element={<Users/>} />
              <Route path='postdetail/:id' element={<PostDetail/>} />
              <Route path='report' element={<ReportManagement/>} />
              <Route path='statistical' element={<Statistical/>}/>
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAdmin;
