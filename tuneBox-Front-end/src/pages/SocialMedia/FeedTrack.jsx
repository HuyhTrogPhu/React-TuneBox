import React, { useEffect, useState, useRef } from "react";
import { images } from "../../assets/images/images";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { Link, Routes, Route } from "react-router-dom";
import Picker from "@emoji-mart/react";
import { getAllTracks, listGenre } from "../../service/TrackServiceCus";
import WaveFormFeed from "../SocialMedia/Profile/Profile_nav/WaveFormFeed";
import {

  addLike,
  checkUserLikeTrack,
  removeLike,
  getLikesCountByTrackId,
} from "../../service/likeTrackServiceCus";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersToFollow from './Profile/UsersToFollow';
import {
  getPlaylistByUserId,
  getPlaylistById,
  updatePlaylist,
} from "../../service/PlaylistServiceCus";
import { getUserInfo } from "../../service/UserService";



const FeedTrack = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = Cookies.get("userId");

  // track
  const [tracks, setTracks] = useState([]);
  const [likedTracks, setLikedTracks] = useState({});
  const [countLikedTracks, setCountLikedTracks] = useState({});
  const [selectedTrack, setSelectedTrack] = useState(null); // State cho track duoc chon
  const [selectedGenre, setSelectedGenre] = useState(""); // Store the selected genre
  const [genres, setGenres] = useState([]);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [ReportId, setReportId] = useState(null);
  const [reportType, setReportType] = useState('');
  const [reportMessage, setReportMessage] = useState("");


  const handleAvatarClick = (post) => {
    console.log("Current User ID:", currentUserId);
    console.log("Post User ID:", post.userId);

    if (String(post.userId) === String(currentUserId)) {
      console.log("Navigating to ProfileUser");
      navigate("/profileUser");
    } else {
      console.log("Navigating to OtherUserProfile");
      navigate(`/profile/${post.userId}`);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    fetchGenre(); // Fetch genres when the component mounts
  }, []);

  const fetchGenre = async () => {
    try {
      const genreResponse = await listGenre(); // Assuming listGenre is your API call
      console.log(genreResponse.data);
      setGenres(genreResponse.data); // Store the fetched genres in state
    } catch (error) {
      console.log("Error fetching genres:", error);
    }
  };

  const fetchTracks = async () => {
    try {
      const response = await getAllTracks();
      setTracks(response);
      console.log("get all track: ", response);

      // ktra trạng thái like cho mỗi track
      const likedStatus = await Promise.all(
        response.map(async (track) => {
          const liked = await checkUserLikeTrack(track.id, currentUserId);
          const count = await getLikesCountByTrackId(track.id);
          console.log(
            "userId:",
            currentUserId,
            "trackId:",
            track.id,
            "- likeStatus: ",
            liked
          );
          return { id: track.id, liked, count }; // Trả về id và trạng thái liked
        })
      );

      // cap nhat likedTracks
      const updatedLikedTracks = {};
      const updatedCountTracks = {};
      likedStatus.forEach(({ id, liked, count }) => {
        updatedLikedTracks[id] = liked; // Gán trạng thái liked cho từng track
        updatedCountTracks[id] = count;
      });
      setLikedTracks(updatedLikedTracks); // Cập nhật trạng thái likedTracks
      setCountLikedTracks(updatedCountTracks);
      console.log("Cập nhật trạng thái likedTracks: ", updatedLikedTracks);
      console.log("Cập nhật trạng thái likedTracks: ", updatedCountTracks);
    } catch (error) {
      console.error("Error fetching all track:", error);
    }
  };
  const handleLikeTrack = async (trackId) => {
    try {
      if (likedTracks[trackId]?.data) {
        // nếu đã thích, gọi hàm xóa like
        await removeLike(currentUserId, trackId);
        setLikedTracks((prev) => ({
          ...prev,
          [trackId]: { data: false }, // cập nhật trạng thái liked thành false
        }));

        fetchTracks();
        console.error("Đã xóa like:", trackId);
      } else {
        // nếu chưa thích, gọi hàm thêm like
        await addLike(currentUserId, trackId, null);
        setLikedTracks((prev) => ({
          ...prev,
          [trackId]: { data: true }, // cập nhật trạng thái liked thành true
        }));
        fetchTracks();
        console.error("Đã like:", trackId);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý like:", error);
    }
  };
  // Ham xoa track
  const deleteTrack = async (trackId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Track?"
    ); // Xac nhan xoa
    if (!confirmDelete) return; // Khong xoa neu nguoi dung khong dong y
    try {
      await axios.delete(`http://localhost:8080/customer/tracks/${trackId}`, {
        withCredentials: true,
      });
      fetchTracks(); // Cap nhat danh sach track sau khi xoa
    } catch (error) {
      console.error(
        "Error deleting track:",
        error.response?.data || error.message
      ); // Log loi neu co
    }
  };
  const handleEditClick = (track) => {
    // Tạo một đối tượng track mới với đầy đủ thông tin
    const updatedTrack = {
      ...track,
      // Giữ nguyên URL của ảnh hiện tại thay vì tạo Blob mới
      imageTrack: track.imageTrack,
      // Giữ nguyên thông tin file nhạc hiện tại
      trackFile: {
        name: track.trackFileName || "Current track file", // Thêm tên file nếu có
      },
    };

    setSelectedTrack(updatedTrack);

    // Set genre ID từ track hiện tại
    if (track.genre) {
      setSelectedGenre(track.genre.id.toString());
    }

    const editModal = document.getElementById("editModal");
    editModal.classList.add("show");
    editModal.style.display = "block";
    document.body.classList.add("modal-open");
  };
  // Save track after editing
  const handleSave = async () => {
    if (!selectedTrack) return;

    const formData = new FormData();
    formData.append("name", selectedTrack.name);
    formData.append("description", selectedTrack.description);
    formData.append("status", selectedTrack.status);
    formData.append("report", selectedTrack.report);
    formData.append("userId", currentUserId);
    formData.append("genre", selectedGenre);

    // Chỉ gửi file mới nếu người dùng đã chọn file mới
    if (selectedTrack.trackFile instanceof File) {
      formData.append("trackFile", selectedTrack.trackFile);
    }

    // Chỉ gửi ảnh mới nếu người dùng đã chọn ảnh mới
    if (selectedTrack.trackImage instanceof File) {
      formData.append("trackImage", selectedTrack.trackImage);
    }

    try {
      await axios.put(
        `http://localhost:8080/customer/tracks/${selectedTrack.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      fetchTracks();
      setSelectedTrack(null);

      const editModal = document.getElementById("editModal");
      editModal.classList.remove("show");
      editModal.style.display = "none";
      document.body.classList.remove("modal-open");
    } catch (error) {
      console.error(
        "Error updating track:",
        error.response?.data || error.message
      );
    }
  };
  // end track


  // playlist
  // list
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [trackToAddPlayList, setTrackToAddPlayList] = useState(null);



  const fetchListPlaylist = async () => {
    try {

      const playlistResponse = await getPlaylistByUserId(currentUserId);
      setPlaylists(playlistResponse);
      console.log("playlist  ", playlistResponse);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };
  const addToPlaylist = (trackId) => {
    setShowModal(true); // Mở modal
    setTrackToAddPlayList(trackId);
  };

  useEffect(() => {
    fetchListPlaylist();
  }, [currentUserId]);

  const handleCloseModal = () => {
    setShowModal(false); // Đóng modal
  };
  const handleAddTrackToPlaylist = async (playlistId) => {
    try {
      // lấy thong tin htai cua lít
      const currentPlaylist = await getPlaylistById(playlistId);
      console.log("currentPlaylist: ", currentPlaylist.data);
      const formData = new FormData();
      // Kiểm tra xem track đã tồn tại trong playlist chưa
      const existingTracks = currentPlaylist.data.tracks; // Danh sách track hiện có trong playlist
      if (existingTracks.includes(trackToAddPlayList)) {
        toast.error("Track đã tồn tại trong playlist!");
        return; // Dừng thực hiện nếu track đã tồn tại
      }
      formData.append("trackIds", trackToAddPlayList);
      formData.append("title", currentPlaylist.data.title);
      formData.append("imagePlaylist", currentPlaylist.data.imagePlaylist); // thêm trường này
      formData.append("description", currentPlaylist.data.description);
      formData.append("status", false);
      formData.append("report", false);
      formData.append("type", currentPlaylist.data.type);
      formData.append("user", currentUserId);
      console.log("handleAddTrackToPlaylist: ", currentPlaylist.data.title);
      await updatePlaylist(playlistId, formData);
      toast.success(" Add Track to Playlist successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create add track to playlist:", error);
      const errorMessage =
        error.response?.data?.message || "Failed. Please try again.";
      toast.error(errorMessage);
    }
  };
  // end playlist

  // report post 
  const handleReport = (id, type) => {
    console.log('ID to report:', id); // Kiểm tra giá trị ID
    console.log('Type to report:', type); // Kiểm tra giá trị type
    setReportId(id);
    setReportType(type);
    setShowReportModal(true);
  };
  const handleSubmit = () => {
    console.log('Report Type before submit:', reportType); // Kiểm tra giá trị type

    if (!ReportId || !reportType) {
      setReportMessage("ID hoặc loại báo cáo không hợp lệ.");
      return;
    }

    // Gọi hàm submitReport với các giá trị đúng
    submitReport(currentUserId, ReportId, reportType, reportReason);
  };
  const submitReport = async (userId, reportId, reportType, reason) => {
    try {
      const token = localStorage.getItem("jwtToken"); // Hoặc từ nơi bạn lưu trữ JWT token

      const reportExists = await checkReportExists(userId, reportId, reportType);
      if (reportExists) {
        setReportMessage("Bạn đã báo cáo nội dung này rồi.");
        toast.warn("Bạn đã báo cáo nội dung này rồi."); // Hiển thị toast cảnh báo
      } else {
        const reportData = {
          userId: userId,
          postId: reportType === 'post' ? reportId : null,
          trackId: reportType === 'track' ? reportId : null,
          albumId: reportType === 'album' ? reportId : null,
          type: reportType,
          reason: reason
        };

        const response = await axios.post('http://localhost:8080/api/reports', reportData, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}` // Thêm JWT token vào header
          }
        });

        console.log('Report submitted successfully:', response.data);
        setReportMessage("Báo cáo đã được gửi thành công.");
        toast.success("Báo cáo đã được gửi thành công."); // Hiển thị toast thông báo thành công
        setShowReportModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      if (error.response && error.response.status === 401) {
        navigate('/login?error=true');
      } else {
        setReportMessage("Đã có lỗi xảy ra khi gửi báo cáo.");
        toast.error("Đã có lỗi xảy ra khi gửi báo cáo."); // Hiển thị toast thông báo lỗi
      }
    }
  };
  const checkReportExists = async (userId, reportId, reportType) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reports/check`, {
        params: {
          userId: userId,
          postId: reportType === 'post' ? reportId : null,
          trackId: reportType === 'track' ? reportId : null,
          albumId: reportType === 'album' ? reportId : null,
          type: reportType,
        },
        withCredentials: true,
      });
      console.log('Check report response:', response.data);
      return response.data.exists; // Giả sử API trả về trạng thái tồn tại của báo cáo
    } catch (error) {
      console.error('Lỗi mạng:', error);
    }
  };

  return (
    <div>
      {/* Phần hiển thị track */}
      <div className="container p-0">
        {tracks.map((track) => {
          const createdAt = track.createDate ? new Date(track.createDate) : null;
          return (
            <div className="post border" key={track.id}>
              {/* Tiêu đề */}
              <div className="post-header position-relative">
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleAvatarClick(track)}
                  aria-label="Avatar"
                >
                  <img
                    src={track.avatar}
                    className="avatar_small"
                    alt="Avatar"
                  />
                </button>
                <div>
                  <div className="name">
                    {track.userNickname || "Unknown User"}
                  </div>
                  <div className="time">
                    {createdAt && !isNaN(createdAt.getTime())
                      ? format(createdAt, "hh:mm a, dd MMM yyyy")
                      : "Invalid date"}
                  </div>
                </div>
                {/* Dropdown cho bài viết */}
                {String(track.userId) === String(currentUserId) ? (
                  <div className="dropdown position-absolute top-0 end-0">
                    <button
                      className="btn btn-options dropdown-toggle"
                      type="button"
                      id={`dropdownMenuButton-${track.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      ...
                    </button>
                    <ul className="dropdown-menu"
                      aria-labelledby={`dropdownMenuButton-${track.id}`}>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => addToPlaylist(track.id)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>{" "}
                          Add to playlist
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => handleEditClick(track)}>
                          <i className='fa-solid fa-pen-to-square'></i>Edit
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => deleteTrack(track.id)}>
                          <i className='fa-solid fa-trash '></i>Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="dropdown position-absolute top-0 end-0">
                    <ul>
                      <li>
                        <button className="fa-regular fa-flag btn-report border border-0" onClick={() => handleReport(track.id, 'track')}></button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => addToPlaylist(track.id)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>{" "}
                          Add to playlist
                        </button>
                      </li>
                    </ul>
                  </div>

                )}
              </div>

              <div className="post-content description">
                {track.description || "Unknown description"}
              </div>
              {/* Nội dung */}
              <div className="track-content audio">
                <WaveFormFeed
                  audioUrl={track.trackFile}
                  track={track}
                  className="track-waveform "
                />
              </div>

              {/* Like/Comment */}
              <div className="row d-flex justify-content-start align-items-center">
                {/* Like track*/}
                <div className="col-2 mt-2 text-center">
                  <div className="like-count">
                    {countLikedTracks[track.id]?.data || 0} {/* Hiển thị số lượng like */}
                    <i
                      className={`fa-solid fa-heart ${likedTracks[track.id]?.data
                        ? "text-danger"
                        : "text-muted"
                        }`}
                      onClick={() => handleLikeTrack(track.id)}
                      style={{ cursor: "pointer", fontSize: "25px" }} // Thêm style để biểu tượng có thể nhấn
                    ></i>
                  </div>
                </div>

                {/* share track*/}
                <div className="col-2 mt-2 text-center">
                  <div className="d-flex justify-content-center align-items-center">
                    <i
                      type="button"
                      style={{ fontSize: "20px", color: "black" }}
                      className="fa-solid fa-share"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal for editing track */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editTrackModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editTrackModalLabel">
                Edit Track
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={() => handleSave()}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row">
                {/* Track Name */}
                <div className="mb-3">
                  <label className="form-label">Track Name: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedTrack ? selectedTrack.name : ""}
                    onChange={(e) =>
                      setSelectedTrack({
                        ...selectedTrack,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Image Track */}
                <div className="mt-3">
                  <label className="form-label">Image Track: </label>
                  {selectedTrack && (
                    <div>
                      <img
                        src={selectedTrack.imageTrack}
                        alt="Current Track"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                      <div className="custom-file mt-2">
                        <input
                          type="file"
                          id="fileInput"
                          className="custom-file-input"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSelectedTrack({
                                ...selectedTrack,
                                trackImage: e.target.files[0],
                              });
                            }
                          }}
                          style={{ display: "none" }}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="fileInput"
                        >
                          Choose new file
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* File Track */}
                <div className="mt-3">
                  <label className="form-label">Current File Track: </label>
                  <label className="custom-file-label" htmlFor="fileInput">
                    Choose file
                  </label>
                  {selectedTrack && (
                    <div>
                      <p>
                        Current file:{" "}
                        {selectedTrack.trackFileName || selectedTrack.name}
                      </p>
                      <div className="custom-file mt-2">
                        <input
                          type="file"
                          id="fileInput"
                          className="custom-file-input"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSelectedTrack({
                                ...selectedTrack,
                                trackFile: e.target.files[0],
                              });
                            }
                          }}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Select Genre */}
                <div className="mt-3">
                  <label className="form-label">Genre</label>
                  <select
                    className="form-select"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    {genres.map((genre) => (
                      <option
                        key={genre.id}
                        value={genre.id}
                        // Set selected cho genre hiện tại
                        selected={selectedTrack?.genre?.id === genre.id}
                      >
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="mt-3">
                  <label className="form-label">Description</label>
                  <textarea
                    cols="50"
                    rows="5"
                    className="form-control"
                    value={selectedTrack ? selectedTrack.description : ""}
                    onChange={(e) =>
                      setSelectedTrack({
                        ...selectedTrack,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const editModal = document.getElementById("editModal");
                  editModal.classList.remove("show");
                  editModal.style.display = "none";
                  document.body.classList.remove("modal-open");
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Track
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end modal edit */}

      {/* Modal để chọn playlist */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chọn Playlist</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <ul className="list-group">
                {playlists.map(
                  (playlist) =>
                    !playlist.status && (
                      <div key={playlist.id} className="post-header-track m-5">
                        <img
                          src={playlist.imagePlaylist}
                          className="avatar_small"
                          alt="playlist"
                        />
                        <div className="info">
                          <div className="name">{playlist.title}</div>
                        </div>
                        <div className="btn-group" style={{ marginLeft: 25 }}>
                          <button
                            type="button"
                            className="btn-new rounded-5"
                            onClick={() =>
                              handleAddTrackToPlaylist(playlist.id)
                            }
                          >
                            add
                          </button>
                        </div>
                      </div>
                    )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Modal để chọn playlist */}
            {/* Modal báo cáo */}
            {showReportModal && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Báo cáo nội dung</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    // Reset dữ liệu khi đóng modal
                    setShowReportModal(false);
                    setReportReason(""); // Reset lý do báo cáo
                    setReportMessage(""); // Reset thông báo
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {reportMessage && <div className="alert alert-danger">{reportMessage}</div>} {/* Thông báo lỗi hoặc thành công */}
                <h6>Chọn lý do báo cáo:</h6>
                <div className="mb-3">
                  {["Nội dung phản cảm", "Vi phạm bản quyền", "Spam hoặc lừa đảo", "Khác"].map((reason) => (
                    <label className="d-block" key={reason}>
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        onChange={(e) => setReportReason(e.target.value)}
                      /> {reason}
                    </label>
                  ))}
                </div>
                <textarea
                  className="form-control mt-2"
                  placeholder="Nhập lý do báo cáo"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => submitReport(currentUserId, ReportId, reportType, reportReason)}
                  className="btn btn-primary"
                >
                  Báo cáo
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason(""); // Reset lý do báo cáo
                    setReportMessage(""); // Reset thông báo
                  }}
                >
                  Đóng
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedTrack
