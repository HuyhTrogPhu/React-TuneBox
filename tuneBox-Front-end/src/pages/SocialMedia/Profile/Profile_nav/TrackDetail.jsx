import React, { useEffect, useState } from "react";
import "./css/Trackdetail.css";
import { useParams, useLocation } from "react-router-dom";
import { getTrackById } from "../../../../service/TrackServiceCus";
import { images } from '../../../../assets/images/images';
import Waveform from "../Profile_nav/Waveform";

function Trackdetail() {
  const { id } = useParams();
  const location = useLocation();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  // Hiển thị thông báo đang tải hoặc lỗi
  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;
  
  // Nếu không có track, hiển thị thông báo không tìm thấy
  if (!track) return <p>Sản phẩm không tồn tại hoặc không thể tìm thấy.</p>;
  

  return (
    <div className="container">
      <div className="container track-page-header">
        <div className="adaptive-content">
          {/* Truyền URL âm thanh từ Cloudinary cho Waveform và drop track*/}
          <Waveform audioUrl={track.trackFile} track={track} />

        </div>
        <div className="adaptive-content track-player-actions">
          <div className="track-player-actions-column">
            <button className="btn">
              <img src={images.heart} className="btn-icon" alt="Like" />
              32
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
        <div className="col-md-7 border rounded">
          <div className="mb-2">
            <div className="comment-section">
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
        <div className="col-md-4 border rounded ms-5">
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
