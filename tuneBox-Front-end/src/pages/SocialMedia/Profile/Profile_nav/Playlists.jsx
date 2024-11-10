import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getPlaylistByUserId,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../../../../service/PlaylistServiceCus";
import { getLikesCountByPlaylistId } from "../../../../service/likeTrackServiceCus";
import Cookies from "js-cookie";
import { images } from "../../../../assets/images/images";
import { ToastContainer, toast } from "react-toastify";
import "../Profile_nav/css/playlist.css";

const Playlists = () => {
  const userId = Cookies.get("userId");
  const { id } = useParams(); // Lấy ID từ URL
  const [errors, setErrors] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [playlistUrl, setPlaylistImageUrl] = useState(images.musicalNote); // ảnh mặc định

  const [newPlayListName, setPlaylistName] = useState("");
  const [newPlaylistImage, setPlaylistImage] = useState(null);
  const [newPlaylistDescription, setPlaylistDescription] = useState("");
  const [selectedType, setSelectedType] = useState("Public");

  const [editPlayListName, setEditPlaylistName] = useState("");
  const [editPlaylistDescription, setEditPlaylistDescription] = useState("");
  const [editSelectedType, setEditSelectedType] = useState("Public");
  const [playlistId, setPlaylistId] = useState();

  const [likesCount, setLikesCount] = useState();

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const trackIds = [];

  // Lấy danh sách playlist ban đầu
  useEffect(() => {
    fetchListPlaylist();
  }, [userId]);

  const fetchListPlaylist = async () => {
    const targetUserId = id || userId;
    console.log("Target User ID:", targetUserId);

    setIsLoading(true);
    try {
      const playlistResponse = await getPlaylistByUserId(targetUserId);

      // Lọc playlist theo điều kiện type
      const filteredPlaylists = playlistResponse.filter(
        (playlist) => targetUserId === userId || playlist.type === "Public"
      );

      setPlaylists(filteredPlaylists || []);
      console.log("fetchListPlaylist: ", filteredPlaylists);

      const likesCountsMap = {};

      await Promise.all(
        playlistResponse.map(async (item) => {
          try {
            if (item.id) {
              const response = await getLikesCountByPlaylistId(item.id);
              likesCountsMap[item.id] = response.data; // Store the like count for each playlist
            }
          } catch (itemError) {
            console.error(
              `Error fetching likes count for playlist ${item.id}:`,
              itemError
            );
          }
        })
      );

      setLikesCount(likesCountsMap); // Update the state with the like counts
      console.log("Likes count map: ", likesCountsMap);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const newPlaylist = new FormData();
    newPlaylist.append("title", newPlayListName);
    newPlaylist.append("imagePlaylist", newPlaylistImage); // thêm trường này
    newPlaylist.append("description", newPlaylistDescription);
    newPlaylist.append("status", false);
    newPlaylist.append("report", false);
    newPlaylist.append("type", selectedType);
    newPlaylist.append("user", userId); // thêm userId
    newPlaylist.append("trackIds", trackIds);

    // Log nội dung FormData
    console.log("Form Data Contents:");
    for (let [key, value] of newPlaylist.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await createPlaylist(newPlaylist);
      console.log("Playlist created successfully ", response);
      document.getElementById("closeModaplaylist").click();
      toast.success("PlayList created successfully!");
      fetchListPlaylist();
      // Reset form
      setPlaylistName("");
      setPlaylistDescription("");
      setPlaylistImage(null);
      setPlaylistImageUrl(images.musicalNote);
      setSelectedType("Public");
    } catch (error) {
      console.error("Failed to create playlist:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create playlist. Please try again.";
      toast.error(errorMessage);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newPlayListName) newErrors.name = "Playlist name is required.";
    if (!newPlaylistImage) newErrors.image = "Playlist image is required.";
    if (!newPlaylistDescription) {
      newErrors.description = "Description is required.";
    } else if (newPlaylistDescription.length <= 10) {
      newErrors.description = "Description must be more than 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      fetchListPlaylist();
      resetForm();
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

  const resetForm = () => {
    setPlaylistName("");
    setPlaylistDescription("");
    setSelectedType("Public");
    setPlaylistImageUrl(images.musicalNote);
    setErrors({});
  };

  // delete album
  const handDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deletePlaylist(playlistId);
      console.log("Album deleted successfully:", response);
      fetchListPlaylist();
      alert("Playlist deleted successfully!");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="albums">
      <ToastContainer />
      <div className="btn-container">
        <button
          type="button"
          className="btn-new"
          data-bs-toggle="modal"
          data-bs-target="#newPlaylist"
        >
          New
        </button>

        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button type="button" className="btn-search">
            Search
          </button>
        </div>
      </div>

      {/* Playlist List */}
      <div className="post-header-albums">
        {isLoading ? (
          <div>Loading albums...</div>
        ) : playlists && playlists.length > 0 ? (
          playlists.map(
            (list) =>
              !list.status && (
                <div key={list.id} className="album-item">
                  <img
                    src={list.imagePlaylist}
                    className="avatar_small"
                    alt="Avatar"
                  />
                  <div className="info">
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
                    className="fa-regular fa-flag btn-report position-absolute top-8 end-0 me-4 border-0"
                    onClick={() => handleReport(album.id, "album")}
                  ></button>
                )}
                </div>
              )
          )
        ) : (
          <div className="no-albums">No playlist found</div>
        )}
      </div>

      {/* Modal new*/}
      <div
        className="modal fade"
        id="newPlaylist"
        tabIndex="-1"
        aria-labelledby="#newPlaylistLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="newPlaylistLabel">
                New Playlist
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModaplaylist"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={newPlayListName}
                  onChange={(e) => setPlaylistName(e.target.value)}
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
                  value={newPlaylistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
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
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
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
                    className={`form-control ${
                      errors.image ? "is-invalid" : ""
                    }`}
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="playlistImageInput" // Thêm id để tham chiếu
                  />
                  <img
                    src={playlistUrl}
                    alt="Playlist Preview"
                    className="playlist-image-preview"
                    onClick={() =>
                      document.getElementById("playlistImageInput").click()
                    }
                  />
                  {errors.image && (
                    <div className="invalid-feedback">{errors.image}</div>
                  )}
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
                onClick={handleSave}
              >
                Create
              </button>
            </div>
          </div>
        </div>
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
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
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
  );
};

export default Playlists;
