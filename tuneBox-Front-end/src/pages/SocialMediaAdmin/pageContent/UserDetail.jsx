import React from "react";
import "../css/ManagerCustomerDetail.css";
import { images } from "../../../assets/images/images";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music, Users, ShoppingBag, Disc, Radio } from "lucide-react";
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
  const [isBanned, setIsBanned] = useState(false);

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

      // Gọi API của track user
      const responseUserTrack = await LoadUserTrack(id);
      console.log("user track:", responseUserTrack);
      setUserTrack(responseUserTrack.data);
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
  

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Left Sidebar (User Info) */}
        <div className="col-lg-5 bg-light p-4 d-flex flex-column align-items-center bg-secondary-subtle text-start">
          {" "}
          <div className="card-body text-center position-relative">
            <div className="position-absolute top-0 start-50 translate-middle">
              <img
                src={userInfor.avatar}
                alt="User Avatar"
                className="rounded-circle border border-4 border-white shadow"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="pt-5 mt-5">
              <h4 className="fw-bold mb-1">{userDetail.userName}</h4>
              <p className="text-muted mb-3">{userDetail.email}</p>

              {/* Stats Grid */}

              {console.warn("userdetail", userDetail)}
              {console.warn("userinfor", userInfor)}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="p-3 border rounded bg-light">
                    <Users className="mb-2" />
                    <h6 className="mb-1">Followers</h6>
                    <h5 className="mb-0">{userDetail.followerCount}</h5>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 border rounded bg-light">
                    <Users className="mb-2" />
                    <h6 className="mb-1">Following</h6>
                    <h5 className="mb-0">{userDetail.followingCount}</h5>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 border rounded bg-light">
                    <ShoppingBag className="mb-2" />
                    <h6 className="mb-1">Orders</h6>
                    <h5 className="mb-0">{userDetail.odersCount}</h5>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 border rounded bg-light">
                    <Disc className="mb-2" />
                    <h6 className="mb-1">Albums</h6>
                    <h5 className="mb-0">{userDetail.albumCount}</h5>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 border rounded bg-light">
                    <Radio className="mb-2" />
                    <h6 className="mb-1">Tracks</h6>
                    <h5 className="mb-0">
                      {userDetail.tracks
                        ? userDetail.tracks.length
                        : "No Track Created"}
                    </h5>
                  </div>
                </div>
              </div>

              {/* User Interests */}
              <div className="text-start mb-4">
                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Inspired By</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {userDetail.inspiredBy &&
                    userDetail.inspiredBy.length > 0 ? (
                      userDetail.inspiredBy.map((item, index) => (
                        <span key={index} className="badge bg-primary">
                          {item.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No data available</span>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Talents</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {userDetail.talent && userDetail.talent.length > 0 ? (
                      userDetail.talent.map((item, index) => (
                        <span key={index} className="badge bg-success">
                          {item.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No data available</span>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Genres</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {userDetail.genre && userDetail.genre.length > 0 ? (
                      userDetail.genre.map((item, index) => (
                        <span key={index} className="badge bg-info">
                          {item.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No data available</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-muted mb-3">
                Joined: {new Date(user.createDate).toLocaleDateString("vi-VN")}
              </p>

              <button
  className={`btn ${isBanned ? "btn-success" : "btn-danger"} mt-4`}
  onClick={handleBanUnban}
>
  {isBanned ? "Unban User" : "Ban User"}
</button>
            </div>
          </div>




        </div>

        {/* Right Side (Tracks, Albums, Playlists) */}
        <div className="col-lg-7 p-4">
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