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
} from "../../../service/SocialMediaAdminService";
import PlaylistTable from "./Table/PlaylistTable";
import AlbumTable from "./Table/AlbumTable";
import TrackTable from "./Table/TrackTable";

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

  useEffect(() => {
    const fetchData = async () => {
      // Gọi API của userdetail
      const responseUserDetail = await LoadUserDetail(id);
      if (responseUserDetail.status) {
        setUserDetail(responseUserDetail.data);
        setInforUser(responseUserDetail.data.userInformation);
      }

      // Gọi API của user
      const responseUser = await LoadUser(id);
      console.log("user:", responseUser);
      if (responseUser.status) {
        setUser(responseUser.data);
        setUserTrack(responseUser.data.tracks);
      }

      // Gọi API của Album user
      const responseUserAlbum = await LoadUserAlbums(id);
      console.log("user Album:", responseUserAlbum.data);
      if (responseUserAlbum.status) {
        setUserAlbums(responseUserAlbum.data);
      }

      // Gọi API của PlayList user
      const responseUserPlayList = await LoadUserPlayList(id);
      console.log("user PlayList:", responseUserPlayList.data);
      if (responseUserPlayList.status) {
        setPlayLists(responseUserPlayList.data);
      }
    };

    fetchData();
    setLoading(false);
  }, []);

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
          <div class="content-start">
            <label class="d-block fw-bold">Username</label>
            <label class="d-block mb-2">{userInfor.name}</label>

            <label class="d-block fw-bold">Email</label>
            <label class="d-block mb-2">{userDetail.email}</label>

            <label class="d-block fw-bold">Create Date</label>
            <label class="d-block mb-2">{userDetail.createDate}</label>

            <label class="d-block fw-bold">Location</label>
            <label class="d-block mb-2">
              {userDetail.location || "No Data"}
            </label>

            <label className="d-block fw-bold">Genre</label>
            <label className="d-block mb-2">
              {userDetail.genre && userDetail.genre.length > 0 ? (
                userDetail.genre.map((gdata, index) => (
                  <span
                    key={index}
                    className="badge rounded-pill text-bg-warning"
                  >
                    {gdata.name}
                  </span>
                ))
              ) : (
                <span>No Data</span>
              )}
            </label>

            <label className="d-block fw-bold">Inspired By</label>
            <label className="d-block mb-2">
              {userDetail.inspiredBy && userDetail.inspiredBy.length > 0 ? (
                userDetail.inspiredBy.map((gdata, index) => (
                  <span
                    key={index}
                    className="badge rounded-pill text-bg-warning"
                  >
                    {gdata.name}
                  </span>
                ))
              ) : (
                <span>No Data</span>
              )}
            </label>

            <label className="d-block fw-bold">Talent</label>
            <label className="d-block mb-2">
              {userDetail.talent && userDetail.talent.length > 0 ? (
                userDetail.talent.map((gdata, index) => (
                  <span
                    key={index}
                    className="badge rounded-pill text-bg-warning"
                  >
                    {gdata.name}
                  </span>
                ))
              ) : (
                <span>No Data</span>
              )}
            </label>

            <label class="d-block fw-bold">About</label>
            <label class="d-block mb-2">{userDetail.about || "No Data"}</label>
          </div>
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

          <TrackTable userTrack={userTrack} />
          <AlbumTable userAlbums={userAlbums} />
          <PlaylistTable userPlayLists={userPlayLists} />
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
