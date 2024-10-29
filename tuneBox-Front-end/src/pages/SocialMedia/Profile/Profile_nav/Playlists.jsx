import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPlaylistByUserId,
  createPlaylist,
} from "../../../../service/PlaylistServiceCus";
import Cookies from "js-cookie";
import { images } from "../../../../assets/images/images";
import { ToastContainer, toast } from "react-toastify";

const Playlists = () => {
  const userId = Cookies.get("userId");
  const [errors, setErrors] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [playlistUrl, setPlaylistImageUrl] = useState(images.musicalNote); // ảnh mặc định

  const [newPlayListName, setPlaylistName] = useState("");
  const [newPlaylistImage, setPlaylistImage] = useState(null);
  const [newPlaylistDescription, setPlaylistDescription] = useState("");
  const [selectedType, setSelectedType] = useState("Public");

  const trackIds = [];
  // Lấy danh sách playlist ban đầu
  useEffect(() => {
    fetchListPlaylist();
  }, [userId]);

  const fetchListPlaylist = async () => {
    setIsLoading(true);
    try {
      const playlistResponse = await getPlaylistByUserId(userId);
      setPlaylists(playlistResponse || []);
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
    newPlaylist.append("trackIds", trackIds); // bỏ qua nếu không cần thiết

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
                    <Link>
                      <div className="title">{list.title}</div>
                    </Link>

                    <div className="style">{list.description}</div>

                    <div className="album-details">
                      <span className="tracks">Tracks: 0</span>
                      <span className="likes">Likes: 0</span>
                    </div>
                  </div>

                  <div className="btn-group" style={{ marginLeft: 25 }}>
                    <button
                      className="btn dropdown-toggle no-border"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                    <ul className="dropdown-menu dropdown-menu-lg-end">
                      <li>
                        <Link>
                          <a className="dropdown-item">Edit</a>
                        </Link>
                      </li>
                      <li>
                        <a className="dropdown-item">Delete</a>
                      </li>
                    </ul>
                  </div>
                </div>
              )
          )
        ) : (
          <div className="no-albums">No playlist found</div>
        )}
      </div>

      {/* Modal */}
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
              <div className="row">
                <div className="col-md-4 d-flex align-items-center justify-content-center bg-black">
                  <div className="info-img me-5">
                    <img
                      src={playlistUrl} // Sử dụng URL tạm thời để hiển thị hình ảnh
                      className="avatar border"
                      alt="Avatar"
                    />

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*" // Chỉ cho phép chọn hình ảnh
                      onChange={handleImageChange} // Gọi hàm xử lý khi người dùng chọn file
                    />
                    {errors.image && (
                      <span className="text-danger">{errors.image}</span>
                    )}
                  </div>
                </div>

                <div className="col-md-8">
                  <form className="row">
                    <div className="">
                      <label className="form-label">Playlist Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        value={newPlayListName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Description</label>
                      <textarea
                        cols="50"
                        rows="5"
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        value={newPlaylistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                      ></textarea>
                      {errors.description && (
                        <div className="invalid-feedback">
                          {errors.description}
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <select
                        className="form-select"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)} // Cập nhật trạng thái khi chọn
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                      <small className="text-muted d-block mt-1">
                        *All users can view, listen to, like and share this
                        playlist.
                      </small>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlists;
