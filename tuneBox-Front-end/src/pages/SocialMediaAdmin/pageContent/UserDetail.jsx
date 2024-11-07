import React from "react";
import "../css/ManagerCustomerDetail.css";
import { images } from "../../../assets/images/images";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/User.css"
import {
  LoadUserDetail,
  LoadUserTrack,
  LoadUser,
  LoadAllPost,
  LoadUserAlbums,
} from "../../../service/SocialMediaAdminService";
const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [userInfor, setInforUser] = useState({});
  const [postCount, setPostCount] = useState(0);
  const [userTrack, setUserTrack] = useState([]);
  const [userAlbums, setUserAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Gọi API của userdetail
      const responseUserDetail = await LoadUserDetail(id);
      if (responseUserDetail.status) {
        setUserDetail(responseUserDetail.data);
        setInforUser(responseUserDetail.dataInformation);
      }

      // Gọi API của user
      const responseUser = await LoadUser(id);
      console.log("user:", responseUser);
      if (responseUser.status) {
        setUser(responseUser.data);
      }

      // Gọi API của Album user
      const responseUserAlbum = await LoadUserAlbums(id);
      console.log("user Album:", responseUserAlbum.data);
      if (responseUserAlbum.status) {
        setUserAlbums(responseUserAlbum.data);
      }

      // Gọi API của track user
      const responseUserTrack = await LoadUserTrack(id);
      console.log("user track:", responseUserTrack);
      setUserTrack(responseUserTrack.data);

      // Đếm số post
      const allPosts = await LoadAllPost(id);
      const userId = parseInt(id);
      const userPosts = allPosts.data.filter((post) => post.userId === userId);
      console.log("User posts:", userPosts);
      setPostCount(userPosts.length);
    };

    fetchData();
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; 
      }
  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Left Sidebar (User Info) */}
        <div className="col-lg-3 bg-light p-4 d-flex flex-column align-items-center bg-secondary-subtle text-start">
          <img
            src="/src/UserImages/Avatar/avt.jpg"
            alt="User Avatar"
            className="avatar img-fluid rounded-circle mb-4"
            style={{ width: "150px", height: "150px" }}
          />
          <h4>User information</h4>
          
          {console.log(userDetail)}
          {console.log(userInfor)}
          <h4 className="">Username: {userInfor.userName}</h4>
          <h4>Email: {userInfor.email}</h4>
          <h4>Create date :{userInfor.createDate}</h4>
          <h4></h4>
          <button className="btn btn-danger w-75 my-2">Ban/UnBan</button>
        </div>

        {/* Right Side (Tracks, Albums, Playlists) */}
        <div className="col-lg-9 p-4">
          {/* Stats Section */}
          <div className="row mb-4 text-center">
            <div className="col-4">
              <div className="stats-box p-3 border rounded">
                <h5>Total Post</h5>
                <h2>
                  {postCount !== undefined && postCount !== null
                    ? postCount
                    : 0}
                </h2>
              </div>
            </div>
            <div className="col-4">
              <div className="stats-box p-3 border rounded">
                <h5>Total Likes</h5>
                <h2>{Array.isArray(user.likes) ? user.likes.length : 0}</h2>
              </div>
            </div>
            <div className="col-4">
              <div className="stats-box p-3 border rounded">
                <h5>Total Comments</h5>
                <h2>
                  {Array.isArray(user.comments) ? user.comments.length : 0}
                </h2>
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
                          Creator: {track.userName || "Unknown"}
                        </p>
                      </div>

                      <div className="track-views d-flex align-items-center">
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            navigate(`/socialadmin/TrackDetail/${track.id}`)
                          }
                        >
                          Views
                        </button>
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
              <div className="album-container">
                {console.log(userAlbums)}
                <h4>All Albums</h4>
                {Array.isArray(userAlbums) ? (
                  userAlbums.length > 0 ? (
                    userAlbums.map((album, index) => (
                      <div
                        key={index}
                        className="album-item d-flex justify-content-between align-items-center p-3 mb-3 bg-light border rounded"
                      >
                        <div className="album-left d-flex align-items-center">
                          <div className="album-thumbnail me-3">
                            <img src={album.albumImage} alt="album img" />
                            <button className="btn btn-dark play-button">
                              <img
                                src={userAlbums.albumImage}
                                alt="album img"
                              />
                              <i className="fa fa-play"></i>
                            </button>
                          </div>
                          <div className="album-info">
                            <h5 className="album-title mb-1">
                              {album.title || "No Title Available"}
                            </h5>
                            <p className="album-details mb-0">
                              {`Tracks: ${album.tracks?.length || 0} `}
                            </p>
                          </div>
                        </div>
                        <div className="album-right">
                          <button className="btn btn-danger"
                           onClick={() =>
                            navigate(`/socialadmin/AlbumDetail/${track.id}`)
                          }>Views</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Albums available</p>
                  )
                ) : (
                  <div className="album-item d-flex justify-content-between align-items-center p-3 mb-3 bg-light border rounded">
                    <div className="album-left d-flex align-items-center">
                      <div className="album-thumbnail me-3">
                       
                          <img src={userAlbums.albumImage} alt="album img" />
                      
                      </div>
                      <div className="album-info">
                        <h5 className="album-title mb-1">
                          {userAlbums.title || "No Title Available"}
                        </h5>
                        <p className="album-details mb-0">
                          {`Tracks: ${
                            userAlbums.tracks?.length || 0
                          }`}
                        </p>
                      </div>
                    </div>
                    <div className="album-right">
                      <button className="btn btn-danger"
                      onClick={() =>
                        navigate(`/socialadmin/AlbumDetail/${userAlbums.id}`)
                      }>Views</button>
                    </div>
                  </div>
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

export default UserDetail;
