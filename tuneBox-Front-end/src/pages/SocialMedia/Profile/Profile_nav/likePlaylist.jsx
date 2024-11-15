import React, { useEffect, useState } from "react";
import { getAllPlaylistByUserId } from "../../../../service/likeTrackServiceCus";
import {
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
} from "../../../../service/PlaylistServiceCus";
import Cookies from "js-cookie";
import "./css/albums.css";
import "./css/likePlaylist.css";
import { Link } from "react-router-dom";
import UsersToFollow from "../UsersToFollow";
import { images } from "../../../../assets/images/images";
import { ToastContainer, toast } from "react-toastify";
import { getLikesCountByPlaylistId } from "../../../../service/likeTrackServiceCus";

const LikePlaylists = () => {
  const userId = Cookies.get("userId");
  console.log("cookie: ", userId);
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likesCount, setLikesCount] = useState();

  const tokenjwt = localStorage.getItem("jwtToken");

  // Fetch initial data
  useEffect(() => {
    fetchPlayList();
  }, [userId]);

  // fetch list album
  const fetchPlayList = async () => {
    setIsLoading(true);
    try {
      const likedPlayList = await getAllPlaylistByUserId(userId);
      // console.log("list like playlist: ", likedPlayList);

      const fetchedPlayList = [];
      const likesCountsMap = {};

      await Promise.all(
        likedPlayList.map(async (item) => {
          try {
            if (item.playlistId) {
              const response = await getPlaylistById(item.playlistId);
              // Kiểm tra xem trackResponse có data không
              if (response && response.data) {
                fetchedPlayList.push(response.data);
                // await checkTrackLikeStatus(trackResponse.data.id); //kta
              }

              const count = await getLikesCountByPlaylistId(item.playlistId);
              likesCountsMap[item.playlistId] = count.data;
            }
          } catch (itemError) {
            console.error(`Error fetching item ${item.playlistId}:`, itemError);
          }
        })
      );

      setLikesCount(likesCountsMap);
      setPlaylist(fetchedPlayList);
      console.log("Fetched Posts:", fetchedPlayList);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("list like album []: ", playlist);
  }, [playlist]); // Chỉ log khi playlist thay đổi

  // edit
  const [errors, setErrors] = useState({});
  const [playlistUrl, setPlaylistImageUrl] = useState(images.musicalNote);
  const [newPlaylistImage, setPlaylistImage] = useState(null);
  const [playlistId, setPlaylistId] = useState();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [editPlayListName, setEditPlaylistName] = useState("");
  const [editPlaylistDescription, setEditPlaylistDescription] = useState("");
  const [editSelectedType, setEditSelectedType] = useState("Public");

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lưu trữ file hình ảnh được chọn
    if (file) {
      setPlaylistImage(file); // Lưu trữ file để gửi khi tạo album
      setPlaylistImageUrl(URL.createObjectURL(file)); // Tạo URL tạm thời cho hình ảnh
    }
  };

  const handleEditClick = (playlist) => {
    setPlaylistId(playlist.id);
    setSelectedPlaylist(playlist);
    setEditPlaylistName(playlist.title);
    setEditPlaylistDescription(playlist.description);
    setEditSelectedType(playlist.type);
    setPlaylistImageUrl(playlist.imagePlaylist || images.musicalNote);
  };

  const SaveEdit = async (playlistId) => {
    if (!validateEditForm()) return; // Validate form before saving
    try {
      const formData = new FormData();

      formData.append("title", editPlayListName);
      formData.append(
        "imagePlaylist",
        newPlaylistImage || selectedPlaylist.imagePlaylist
      ); // nếu không có hình ảnh mới, giữ hình ảnh cũ
      formData.append("description", editPlaylistDescription);
      formData.append("status", false);
      formData.append("report", false);
      formData.append("type", editSelectedType);
      formData.append("user", userId);

      await updatePlaylist(playlistId, formData);

      toast.success("Update Playlist successfully!");
      fetchPlayList();
      document.getElementById("closeEditModelplaylist").click(); // Đóng modal sau khi lưu
    } catch (error) {
      console.error("Failed to update playlist:", error);
      const errorMessage =
        error.response?.data?.message || "Failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!editPlayListName) newErrors.name = "Playlist name is required.";
    if (!editPlaylistDescription) {
      newErrors.description = "Description is required.";
    } else if (editPlaylistDescription.length <= 10) {
      newErrors.description = "Description must be more than 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // edit end

  // delete playlist
  const handDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deletePlaylist(playlistId);
      console.log("Album deleted successfully:", response);
      fetchPlayList();
      toast.success("Playlist deleted successfully!");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete Playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // dele end
  return (
    <div className="playlist mt-5">
      <ToastContainer />
      <h1 className="search-results-title text-center mb-5">Liked PlayList</h1>
      <div className="row container-fluid">
        {/* trái */}
        <div className="col-3 sidebar bg-light text-center">
          <ul className="list-unstyled">
            <h1 className="search-results-title">Orther</h1>
            <li className="left mb-4">
              <Link to={"/likepost"} className="d-flex align-items-center">
                <img
                  src={images.feedback}
                  alt="icon"
                  width={20}
                  className="me-2"
                />
                <span className="fw-bold">Bài viết đã thích</span>
              </Link>
            </li>
            <li className="left mb-4">
              <Link to={"/likeAlbums"} className="d-flex align-items-center">
                <img
                  src={images.music}
                  alt="icon"
                  width={20}
                  className="me-2"
                />
                <span className="fw-bold">Albums đã thích</span>
              </Link>
            </li>

            <li className="left mb-4">
              <Link
                to={"/FriendRequests"}
                className="d-flex align-items-center"
              >
                <span className="fw-bold">Danh sách lời mời kết bạn</span>
              </Link>
            </li>
          </ul>
        </div>
        {/* main content */}
        <div className="playlist-content col-6">
          {/* Play List */}
          <div className="post-header-albums">
            {isLoading ? (
              <div>Loading playlist...</div>
            ) : playlist && playlist.length > 0 ? (
              playlist.map(
                (list) =>
                  !list.status && (
                    <div key={list.id} className="album-item">
                      <img
                        src={
                          list.imagePlaylist || "/src/UserImages/Avatar/avt.jpg"
                        }
                        className="avatar_small"
                        alt="Album Cover"
                      />
                      <div className="info">
                        {/* link album detail */}
                        <Link
                          to={{
                            pathname: `/playlist/${list.id}`,
                            state: { list },
                          }}
                        >
                          <div className="title">{list.title}</div>
                        </Link>

                        <div className="style">{list.description}</div>

                        <div className="album-details">
                          <span className="tracks">
                            Tracks: {list.tracks.length}
                          </span>
                          <span className="likes">
                            Likes:{" "}
                            {likesCount && likesCount[list.id]
                              ? likesCount[list.id]
                              : 0}
                          </span>
                        </div>
                      </div>

                      {String(list.creatorId) === String(userId) ? (
                        <div className="btn-group" style={{ marginLeft: 25 }}>
                          <button
                            className="btn dropdown-toggle no-border"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          />
                          <ul className="dropdown-menu dropdown-menu-lg-end">
                            <li>
                              <a
                                className="dropdown-item"
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#editPlaylist"
                                onClick={() => handleEditClick(list)}
                              >
                                Edit
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                onClick={() => handDeletePlaylist(list.id)}
                              >
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <button
                          className="fa-regular fa-flag btn-report ms-3 top-8 border-0"
                          // onClick={() => handleReport(list.id, "album")}
                        ></button>
                      )}
                    </div>
                  )
              )
            ) : (
              <div className="no-albums">No playlist found</div>
            )}
          </div>
        </div>
        {/* phải */}
        <div className="col-3 sidebar bg-light text-center">
          <ul className="list-unstyled">
            <li className=" mb-4">
              <UsersToFollow userId={userId} token={tokenjwt} />
            </li>
          </ul>
        </div>

        {/* Modal edit*/}
        <div
          className="modal fade"
          id="editPlaylist"
          tabIndex="-1"
          aria-labelledby="#editPlaylistLabel"
          aria-hidden="true"
          data-bs-backdrop="false"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editPlaylistLabel">
                  Edit Playlist
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="closeEditModelplaylist"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    value={editPlayListName}
                    onChange={(e) => setEditPlaylistName(e.target.value)}
                    placeholder="Enter playlist name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    value={editPlaylistDescription}
                    onChange={(e) => setEditPlaylistDescription(e.target.value)}
                    placeholder="Enter playlist description"
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={editSelectedType}
                    onChange={(e) => setEditSelectedType(e.target.value)}
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Playlist Image</label>
                  <div className="position-relative">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                      style={{ display: "none" }} // Ẩn nút chọn file thực tế
                      id="playlistImageInput" // Thêm id để tham chiếu
                    />
                    <img
                      src={playlistUrl}
                      alt="Playlist Preview"
                      className="playlist-image-preview"
                      onClick={() =>
                        document.getElementById("playlistImageInput").click()
                      } // Kích hoạt input khi nhấp vào hình
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => SaveEdit(playlistId)}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikePlaylists;
