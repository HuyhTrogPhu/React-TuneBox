import React, { useEffect, useState, useContext,useRef  } from "react";
import { Link, Routes, Route, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import { FollowContext } from "./FollowContext"; 

const OtherUserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const userId = Cookies.get("userId");


  const { followerCounts, updateFollowerCount } = useContext(FollowContext);

  const followerCountRef = useRef(followerCounts[id] || 0);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  useEffect(() => {
    if (!id || !userId) return;
  
    const fetchDataAndRender = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/${id}/profile`);
        if (response.data) {
          setUserData(response.data);
          const isFollowingResponse = await axios.get(`http://localhost:8080/api/follow/is-following?followerId=${userId}&followedId=${id}`);
          setIsFollowing(isFollowingResponse.data);
          const isBlockedResponse = await axios.get(`http://localhost:8080/api/blocks/is-blocked?blockerId=${userId}&blockedId=${id}`);
          setIsBlocked(isBlockedResponse.data);
  
          // Cập nhật số lượng người theo dõi từ response
          followerCountRef.current = response.data.followerCount || 0;
          updateFollowerCount(id, followerCountRef.current);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchDataAndRender();
  }, [id, userId, updateFollowerCount]); // Hãy đảm bảo chỉ phụ thuộc vào những gì thực sự cần
  

  const toggleFollow = async () => {
    if (isUpdatingFollow) return; // Nếu đang cập nhật thì không thực hiện thêm
    setIsUpdatingFollow(true);
  
    try {
      const currentCount = followerCounts[id] || 0;
      let newCount;
  
      if (isFollowing) {
        await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
          params: {
            followerId: userId,
            followedId: id
          }
        });
        setIsFollowing(false);
        newCount = Math.max(currentCount - 1, 0);
      } else {
        await axios.post(`http://localhost:8080/api/follow/follow`, null, {
          params: {
            followerId: userId,
            followedId: id
          }
        });
        setIsFollowing(true);
        newCount = currentCount + 1;
      }
  
      updateFollowerCount(id, newCount);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsUpdatingFollow(false); // Đặt lại sau khi hoàn tất
    }
  };

  const toggleBlock = async () => {
    try {
      if (isBlocked) {
        await axios.delete(`http://localhost:8080/api/blocks/unblock?blockerId=${userId}&blockedId=${id}`);
        setIsBlocked(false);
      } else {
        await axios.post(`http://localhost:8080/api/blocks/block?blockerId=${userId}&blockedId=${id}`);
        setIsBlocked(true);
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  if (!userData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="row container">
      <div className="background border container" style={{ backgroundImage: "url(/src/UserImages/Background/anime-girl.jpg)" }} />
      <aside className="col-sm-3">
        <div>
          <img src={userData.avatar || "/src/UserImages/Avatar/avt.jpg"} className="avatar" alt="avatar" />
          <div className="fs-4 text-small mt-3"><b>{userData.userNickname}</b></div>
          <div>{userData.userName}</div>
        </div>
        <div className="row mt-4">
          <div className="col text-start">
            <button className="btn btn-primary" id="followButton" onClick={toggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="col text-end">
            <button className="btn btn-danger" id="blockButton" onClick={toggleBlock}>
              {isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col text-center">
          <span>{followerCountRef.current}</span> <br />
          <span>Follower</span>
          </div>
          <div className="col text-center">
            <span>{followerCounts[userId] || 0}</span> <br />
            <span>Following</span>
          </div>
        </div>
        <div style={{ paddingTop: 30 }}>
          <label>Nghệ sĩ ưu thích</label> <br />
          {userData.inspiredBy && userData.inspiredBy.length > 0 ? (
            userData.inspiredBy.map((Mapdata) => (
              <span key={Mapdata.id} className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1">
                {Mapdata.name}
              </span>
            ))
          ) : (
            <p>Không có nghệ sĩ ưu thích nào.</p>
          )}
          <br />
          <label>Sở trường</label> <br />
          {userData.talent && userData.talent.length > 0 ? (
            userData.talent.map((Mapdata) => (
              <span key={Mapdata.id} className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1">
                {Mapdata.name}
              </span>
            ))
          ) : (
            <p>Chưa chọn sở trường.</p>
          )}
          <br />
          <label>Dòng nhạc ưu thích</label> <br />
          {userData.genre && userData.genre.length > 0 ? (
            userData.genre.map((Mapdata) => (
              <span key={Mapdata.id} className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1">
                {Mapdata.name}
              </span>
            ))
          ) : (
            <p>Không có dòng nhạc ưu thích nào.</p>
          )}
        </div>
      </aside>

      <div className="col-sm-9 d-flex flex-column ">
        <nav className="nav flex-column flex-md-row p-5">
          <Link to="activity" className="nav-link">Activity</Link>
          <Link to="track" className="nav-link">Track</Link>
          <Link to="albums" className="nav-link">Albums</Link>
          <Link to="playlists" className="nav-link">Playlists</Link>
        </nav>
        <article className="p-5">
          <Routes>
            <Route path="activity" element={<Activity />} />
            <Route path="track" element={<Track />} />
            <Route path="albums" element={<Albums />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="/" element={<Navigate to="activity" />} />
          </Routes>
        </article>
      </div>
    </div>
  );
};

export default OtherUserProfile;

