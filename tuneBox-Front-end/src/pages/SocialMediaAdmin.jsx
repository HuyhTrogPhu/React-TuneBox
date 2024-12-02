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

import Report from "./SocialMediaAdmin/pageContent/Report";

import TrackDetail from "./SocialMediaAdmin/pageContent/TrackDetail";
import Statistical from "./SocialMediaAdmin/pageContent/Statistical";
import StatisticalUser from "./SocialMediaAdmin/Statistical/StaticUser";
import StaticAlbum from "./SocialMediaAdmin/Statistical/StaticAlbum";
import StaticPlayList from "./SocialMediaAdmin/Statistical/StaticPlayList";
import StaticTrack from "./SocialMediaAdmin/Statistical/StaticTrack";
import StatisticalPost from "./SocialMediaAdmin/pageContent/statisticalPost/StatisticalPost";
import StaticticalReport from "./SocialMediaAdmin/Statistical/StaticticalReport";
import Report from "./SocialMediaAdmin/pageContent/Report";

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
                  <i className="fa-solid fa-flag"/>
                  
                  <Link to={"/socialadmin/Report"} className="text-white">
                  Report
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

            {/* Main Content */}
            <div className="container-fluid">
            <Routes>
              <Route path='playlists' element={<Playlists/>} />
              <Route path='albums' element={<Albums/>} />
              <Route path='Track' element={<Track/>} />
              <Route path='playlists' element={<Playlists/>} />
              
              <Route path='Report' element={<Report/>} />
              <Route path='Statistical' element={<Statistical/>} />
              <Route path='Statistical/UserStatic' element={<StatisticalUser/>} />
              <Route path='Statistical/StaticAlbum' element={<StaticAlbum/>} />
              <Route path='Statistical/StaticPlayList' element={<StaticPlayList/>} />
              <Route path='Statistical/StaticTrack' element={<StaticTrack/>} />
              <Route path="Statistical/StaticPost" element={<StatisticalPost/>}/>
              <Route path="Statistical/StaticticalReport" element={<StaticticalReport/>}/>
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
