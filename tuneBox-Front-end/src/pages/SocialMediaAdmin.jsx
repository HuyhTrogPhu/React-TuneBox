import React from "react";
import { images } from "../../src/assets/images/images";

import PlaylistDetail from "./SocialMediaAdmin/pageContent/PlaylistDetail";
import AlbumDetail from "./SocialMediaAdmin/pageContent/AlbumDetail";
import PostDetail from "./SocialMediaAdmin/pageContent/PostDetail";
import { Link, Route, Routes } from "react-router-dom";
import Albums from "./SocialMediaAdmin/pageContent/Albums";
import Posts from "./SocialMediaAdmin/pageContent/Posts";
import DashBoard from "./SocialMediaAdmin/pageContent/DashBoard";
import Users from "./SocialMediaAdmin/pageContent/Users";
import Playlists from "./SocialMediaAdmin/pageContent/Playlists";
import UserDetail from "./SocialMediaAdmin/pageContent/UserDetail";
import Track from "./SocialMediaAdmin/pageContent/Track";
import TrackDetail from "./SocialMediaAdmin/pageContent/TrackDetail";
import Statistical from "./SocialMediaAdmin/pageContent/Statistical";
import StatisticalUser from "./SocialMediaAdmin/Statistical/StaticUser";
import StaticAlbum from "./SocialMediaAdmin/Statistical/StaticAlbum";
import StaticPlayList from "./SocialMediaAdmin/Statistical/StaticPlayList";
import StaticTrack from "./SocialMediaAdmin/Statistical/StaticTrack";


const SocialMediaAdmin = () => {
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="sidebar21 col-lg-2 col-md-3 vh-100">
            {/* Logo */}
            <div className="logo p-3">
              <a href="#">
                <img src={images.adminImage} alt width="100%" />
              </a>
            </div>

            {/* Menu */}
            <div className="menu21">
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
                <i class="fa-brands fa-itunes-note"></i>
                  <Link to={"/socialadmin/Track"} className="text-white">
                    Track
                  </Link>
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
                  <Link to={"/socialadmin/Statistical"} className="text-white">
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
              <Route path='Track' element={<Track/>} />
              <Route path='playlists' element={<Playlists/>} />
              
              
              <Route path='Statistical' element={<Statistical/>} />
              <Route path='Statistical/UserStatic' element={<StatisticalUser/>} />
              <Route path='Statistical/StaticAlbum' element={<StaticAlbum/>} />
              <Route path='Statistical/StaticPlayList' element={<StaticPlayList/>} />
              <Route path='Statistical/StaticTrack' element={<StaticTrack/>} />
              
              <Route path='posts' element={<Posts/>} />
              <Route path='dashboard' element={<DashBoard/>} />
              <Route path='users' element={<Users/>} />
              <Route path='detailUser/:id' element={<UserDetail />} /> 
              <Route path='TrackDetail/:id' element={<TrackDetail />} /> 
              <Route path='PlaylistDetail/:id' element={<PlaylistDetail/>} />
              <Route path='postdetail/:id' element={<PostDetail/>} />
              <Route path='AlbumDetail/:id' element={<AlbumDetail/>} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAdmin;
