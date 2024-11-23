import React from "react";
import "../css/ManagerCustomerDetail.css";
import { images } from "../../../assets/images/images";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/User.css";
import {
  LoadUserDetail,
  LoadUserTrack,
  LoadUser,
  LoadUserAlbums,
  LoadUserPlayList,
  banUser,
  unbanUser
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
  const [userPlayLists, setPlayLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API của user
        const responseUser = await LoadUser(id);
        if (responseUser.status) {
          setUser(responseUser.data);
          setIsBanned(responseUser.data.status === "BANNED"); // Cập nhật trạng thái từ API LoadUser
        }
  
        // Gọi API của userDetail
        const responseUserDetail = await LoadUserDetail(id);
        if (responseUserDetail.status) {
          setUserDetail(responseUserDetail.data);
          setInforUser(responseUserDetail.data.userInformation);
        }
  
        // Các API khác (Albums, Playlists, Tracks)
        const responseUserAlbum = await LoadUserAlbums(id);
        if (responseUserAlbum.status) {
          setUserAlbums(responseUserAlbum.data);
        }
  
        const responseUserPlayList = await LoadUserPlayList(id);
        if (responseUserPlayList.status) {
          setPlayLists(responseUserPlayList.data);
        }
  
        const responseUserTrack = await LoadUserTrack(id);
        setUserTrack(responseUserTrack.data);
  
        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

  const handleBanUnban = async () => {
    try {
      if (isBanned) {
        await unbanUser(id); // Gọi API mở khóa người dùng
        alert("Người dùng đã được mở khóa.");
      } else {
        await banUser(id); // Gọi API khóa người dùng
        alert("Người dùng đã bị khóa.");
      }
  
      // Cập nhật lại trạng thái bằng cách gọi API LoadUser
      const responseUser = await LoadUser(id);
      if (responseUser.status) {
        setIsBanned(responseUser.data.status === "BANNED");
      }
    } catch (error) {
      console.error("Error updating user ban status:", error);
      alert("Không thể cập nhật trạng thái người dùng.");
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Left Sidebar (User Info) */}

        <div className="col-lg-3 bg-light p-4 d-flex flex-column align-items-center bg-secondary-subtle text-start">
          {userDetail && userDetail.userInformation ? (
            <img
              src={userDetail.userInformation.avatar}
              alt="User Avatar"
              className="avatar img-fluid rounded-circle mb-4"
              style={{ width: "150px", height: "150px" }}
            />
          ) : (
            <img
              src=""
              alt="No Avatar Available"
              className="avatar img-fluid rounded-circle mb-4"
              style={{
                width: "150px",
                height: "150px",
                backgroundColor: "#f0f0f0",
              }}
            />
          )}
          <h4>User information</h4>

          {console.log("userdetail", userDetail)}
          {console.warn("userinfor", userInfor)}
          <div className="content-start">
            <label class="d-block fw-bold">Username</label>
            <label class="d-block mb-2">{userInfor.name}</label>

            <label class="d-block fw-bold">Email</label>
            <label class="d-block mb-2">{userDetail.email}</label>

            <label class="d-block fw-bold">Create Date</label>
            <label class="d-block mb-2">{userDetail.createDate}</label>
          </div>

          <button
  className={`btn ${isBanned ? "btn-success" : "btn-danger"} mt-4`}
  onClick={handleBanUnban}
>
  {isBanned ? "Unban User" : "Ban User"}
</button>


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
                <h2>{userDetail.likeCount}</h2>
              </div>
            </div>
            <div className="col-4">
              <div className="stats-box p-3 border rounded">
                <h5>Total Comments</h5>
                <h2>{userDetail.commentCount}</h2>
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
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              navigate(`/socialadmin/AlbumDetail/${album.id}`)
                            }
                          >
                            Views
                          </button>
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
                          {`Tracks: ${userAlbums.tracks?.length || 0}`}
                        </p>
                      </div>
                    </div>
                    <div className="album-right">
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          navigate(`/socialadmin/AlbumDetail/${userAlbums.id}`)
                        }
                      >
                        Views
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              {/* bat dau cua PlaylistDetail */}
              <div className="album-container">
                {console.log(userAlbums)}
                <h4>All PlayLists</h4>
                {Array.isArray(userPlayLists) ? (
                  userPlayLists.length > 0 ? (
                    userPlayLists.map((album, index) => (
                      <div
                        key={index}
                        className="album-item d-flex justify-content-between align-items-center p-3 mb-3 bg-light border rounded"
                      >
                        <div className="album-left d-flex align-items-center">
                          <div className="album-thumbnail me-3">
                            <img src={album.imagePlaylist} alt="album img" />
                            <button className="btn btn-dark play-button">
                              <img
                                src={userPlayLists.imagePlaylist}
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
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              navigate(
                                `/socialadmin/PlaylistDetail/${album.id}`
                              )
                            }
                          >
                            Views
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Albums available</p>
                  )
                ) : (
                  <div
                    className="album-item d-flex justify-content
                  -between align-items-center p-3 mb-3 bg-light border rounded"
                  >
                    <div className="album-left d-flex align-items-center">
                      <div className="album-thumbnail me-3">
                        <img
                          src={userPlayLists.imagePlaylist}
                          alt="album img"
                        />
                      </div>
                      <div className="album-info">
                        <h5 className="album-title mb-1">
                          {userPlayLists.title || "No Title Available"}
                        </h5>
                        <p className="album-details mb-0">
                          {`Tracks: ${userPlayLists.tracks?.length || 0}`}
                        </p>
                      </div>
                    </div>
                    <div className="album-right">
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          navigate(
                            `/socialadmin/PlaylistDetail/${userAlbums.id}`
                          )
                        }
                      >
                        Views
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
