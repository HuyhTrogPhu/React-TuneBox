import React from "react";
import "../css/ManagerCustomerDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { images } from "../../../assets/images/images";
import {
  LoadUserDetail,
  LoadUserTrack,
  LoadUser,
  LoadAllPost,
  LoadUserAlbums,
} from "../../../service/SocialMediaAdminService";
const ManagerCustomerDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [postCount, setPostCount] = useState(0);
  const [userTrack, setUserTrack] = useState([]);
  const [userAlbums, setUserAlbums] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      //goi API cua userdetail
      const responseUserDetail = await LoadUserDetail(id);
      console.log("userDetail:", responseUserDetail);
      if (responseUserDetail.status) {
        setUserDetail(responseUserDetail.data);
        console.log(userDetail);
      }
      //goi API cua user
      const responseUser = await LoadUser(id);
      console.log("user:", responseUser);
      if (responseUser.status) {
        setUser(responseUser.data);
        console.log(user);
      }

      //goi API cua Album user
      const responseUserAlbum = await LoadUserAlbums(id);
      console.log("user Album:", responseUserAlbum);
      if (responseUserAlbum.status) {
        setUserAlbums(responseUserAlbum.data.data);
        console.log(userAlbums);
      }

      //goi API cua track user
      const responseUserTrack = await LoadUserTrack(id);
      console.log("user track:", responseUserTrack);
      setUserTrack(responseUserTrack.data);
      console.log(userTrack);

      //dem so post
      const allPosts = await LoadAllPost(id);
      const userId = parseInt(id);
      const userPosts = allPosts.data.filter((post) => post.userId === userId);
      console.log("User posts:", userPosts);
      setPostCount(userPosts.length);
    };
    fetchData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Left Sidebar (User Info) */}
        <div className="col-lg-3 bg-light p-4 d-flex flex-column align-items-center bg-secondary-subtle">
          <img
            src="/src/UserImages/Avatar/avt.jpg"
            alt="User Avatar"
            className="avatar img-fluid rounded-circle mb-4"
            style={{ width: "150px", height: "150px" }}
          />
          <h4>User information</h4>
          <button className="btn btn-danger w-75 my-2">Ban/UnBan</button>
          <button className="btn btn-dark w-75 my-2">Update</button>
        </div>

        {/* Right Side (Tracks, Albums, Playlists) */}
        <div className="col-lg-9 p-4">
          {/* Stats Section */}
          <div className="row mb-4 text-center">
            <div className="col-4">
              <div className="stats-box p-3 border rounded">
                <h5>Total Post</h5>
                <h2>{postCount}</h2>
              </div>
            </div>
            <div className="col-4">
              <div className="stats-box p-3 border rounded">
                <h5>Total Likes</h5>
                <h2>{user.likes}</h2>
              </div>
            </div>
            <div className="col-4">
              <div className="stats-box p-3 border rounded">
                <h5>Total Comments</h5>
                <h2>{user.comments}</h2>
              </div>
            </div>
          </div>

       
          <div className="row">
            <div className="col-md-6">
              
          {/*bat dau cua track */}
              <div className="track-container">
                <h4>All Tracks</h4>
                {Array.isArray(userTrack) && userTrack.length > 0 ? (
                  userTrack.map((track, index) => (
                    <div
                      key={index}
                      className="track-item d-flex justify-content-between p-3 mb-3 bg-light border"
                    >
                    
                      <div className="track-info">
                        <h5 className="track-name mb-2">{track.name}</h5>
                        <p className="track-user">
                        Creator: {track.user || "Unknown"}
                        </p>
                      </div>

                    
                      <div className="track-views d-flex align-items-center">
                        <button className="btn btn-danger">Views</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No tracks available</p>
                )}
              </div>
            </div>

            <div className="col-md-6">
              {/* bat dau cua albums */}
              <div className="track-container">
                <h4>All Albums</h4>
                {Array.isArray(userAlbums) && userAlbums.length > 0 ? (
                  userAlbums.map((track, index) => (
                    <div
                      key={index}
                      className="track-item d-flex justify-content-between p-3 mb-3 bg-light border"
                    >
                    
                      <div className="track-info">
                        <h5 className="track-name mb-2">{track.title}</h5>
                        <p className="track-user">
                          Creator: {track.creator || "creator"}
                        </p>
                      </div>

                    
                      <div className="track-views d-flex align-items-center">
                        <button className="btn btn-danger">Views</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No Albums available</p>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <h4>All Playlists</h4>
              <div className="list-item p-3 mb-3 bg-light border">
                <div className="d-flex justify-content-between">
                  <div>
                    <p>
                      <strong>Name playlist</strong>
                    </p>
                    <p>Name user</p>
                  </div>
                  <div className="text-end">
                    <button className="btn btn-danger">Views</button>
                  </div>
                </div>
              </div>
              {/* Add more playlists as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManagerCustomerDetail;
