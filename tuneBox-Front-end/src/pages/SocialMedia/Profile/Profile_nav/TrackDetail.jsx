import React, { useEffect, useState } from "react";
import "./css/Trackdetail.css";
import { useParams, useLocation } from "react-router-dom";
import { getTrackById } from "../../../../service/TrackServiceCus";
import {
  addLike,
  removeLike,
  checkUserLikeTrack,
  getLikesByTrackId,
} from "../../../../service/likeTrackServiceCus";
import { images } from "../../../../assets/images/images";
import Waveform from "../Profile_nav/Waveform";
import Cookies from "js-cookie";

function Trackdetail() {
  const { id } = useParams();
  const location = useLocation();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const userId = Cookies.get("UserID"); // Lay userId tu cookies
  console.log("trackid: ", id);
  console.log("userid: ", userId);

  // Gọi service lấy track
  useEffect(() => {
    const fetchDetailTrack = async () => {
      try {
        const response = await getTrackById(id);
        setTrack(response.data);
        console.log("track: ", response.data);
      } catch (err) {
        setError("Không tìm thấy Track");
        console.error("Lỗi khi lấy track:", err);
      } finally {
        setLoading(false);
      }
    };

    if (location.state && location.state.track) {
      setTrack(location.state.track);
      setLoading(false);
    } else {
      fetchDetailTrack(); // Gọi hàm API
    }
  }, [id, location.state]);

  // Kiểm tra số lượng likes của track
  useEffect(() => {
    const fetchLikesCount = async () => {
      if (track) {
        try {
          const response = await getLikesByTrackId(id); // Gọi API để lấy danh sách likes
          console.log("Fetched likes data: ", response); // Log toàn bộ phản hồi

          // Lấy số lượng likes từ response.data
          setLikeCount(response.data.length); // Cập nhật likeCount bằng chiều dài của mảng trong response.data
          console.log("Likes count: ", response.data.length); // Đảm bảo count được in ra
        } catch (error) {
          console.error("Lỗi khi lấy số lượng likes:", error);
        }
      }
    };

    fetchLikesCount();
  }, [track]);
  // Kiểm tra người dùng đã thích track chưa
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (track) {
        try {
          const response = await checkUserLikeTrack(id, userId); // Gọi API kiểm tra
          setLiked(response.data); // Thiết lập liked dựa trên response
          console.log("set like: ", response.data);
        } catch (error) {
          console.error("Lỗi khi kiểm tra like trong track:", error);
        }
      }
    };

    checkLikeStatus();
  }, [track, userId]);

  // Like click
  const handleLikeClick = async () => {
    // Đảo trạng thái liked
    const newLiked = !liked;
    // Cập nhật số lượng likes dựa trên trạng thái mới
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;
    // Cập nhật trạng thái UI ngay lập tức
    setLiked(newLiked);
    setLikeCount(newLikeCount);

    try {
      if (liked) {
        await removeLike(userId, track.id); // Xóa like
        setLikeCount(likeCount - 1);
      } else {
        await addLike(userId, track.id, null); // Thêm like
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked); // Đảo trạng thái liked
    } catch (error) {
      console.error("Lỗi khi xử lý like:", error);
    }
  };

  // Hiển thị thông báo đang tải hoặc lỗi
  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;

  // Nếu không có track, hiển thị thông báo không tìm thấy
  if (!track) return <p>Sản phẩm không tồn tại hoặc không thể tìm thấy.</p>;

  return (
    <div className="container">
      <div className="container track-page-header p-0">
        {/* Truyền URL âm thanh từ Cloudinary cho Waveform và drop track*/}
        <Waveform audioUrl={track.trackFile} track={track} />

        <div className="adaptive-content track-player-actions">
          <div className="track-player-actions-column">
            <button className="btn" onClick={handleLikeClick}>
              <img
                src={liked ? images.heartFilled : images.heart}
                className="btn-icon"
                alt="Like"
              />
              {likeCount} {/* Hiển thị số lượng like */}
            </button>
            <button className="btn">
              <img src={images.conversstion} className="btn-icon" alt="share" />
              Comment
            </button>
          </div>
          <div className="track-player-actions-column">
            <div className="btn-group" style={{ marginLeft: 25 }}>
              <button
                className="btn dropdown-toggle no-border"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu dropdown-menu-lg-end">
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => handleEditClick(track)}
                  >
                    Edit
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => deleteTrack(track.id)}
                  >
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-2 mt-3">
        <div className="col-md-7 border rounded-3 ms-4 ">
          <div className="mb-2">
            <div className="comment-section ">
              <textarea
                className="comment-input"
                style={{ resize: "none" }}
                rows={1}
                placeholder="Viết một bình luận..."
                defaultValue={""}
              />
              <div className="comment mt-2">
                <img src="/src/UserImages/Avatar/avt.jpg" alt="Commenter" />
                <div className="comment-content">
                  <div className="comment-author">Huynh Trong Phu</div>
                  <div className="comment-time">12:00 AM, 8 Sep 2024</div>
                  <p>Chào em nhé người đẹp!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 border rounded-3 ms-5">
          <div className="row align-items-center">
            <div className="col-auto post-header">
              <img
                src="/src/UserImages/Avatar/avt.jpg"
                className="avatar_small"
                alt="avatar"
              />
              <span>{track.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trackdetail;
