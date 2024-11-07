import React, { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { useNavigate,Link } from "react-router-dom";
import Cookies from "js-cookie";
import { getAvatarUser, search } from "../../service/UserService";
import {
  createTrack,
  listGenre,
  getTrackByUserId,
} from "../../service/TrackServiceCus";
import { getNotifications } from "../../service/NotificationService.js";
import { logout } from "../../service/LoginService";
import { SwipeableList, SwipeableListItem, SwipeAction } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import axios from "axios";

const Navbar = () => {
  const [newTrackName, setTrackName] = useState("");
  const [newTrackImage, setTrackImage] = useState(null);
  const [newTrackFile, setTrackFile] = useState(null);
  const [newTrackGenre, setTrackGenre] = useState("");
  const [newTrackDescription, setTrackDescription] = useState("");

  const [errors, setErrors] = useState({});
  const [genres, setGenre] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(images.logoTuneBox);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const userId = Cookies.get("userId");

  // search
  const [keyword, setKeyword] = useState("");

  const handleSearch = async () => {
    if (!keyword) return; // Không tìm kiếm nếu không có từ khóa
    try {
      const results = await search(keyword);
      console.log("ket qua search: ", results); // Xử lý kết quả tìm kiếm ở đây
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`, {
        state: { results },
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Gọi tìm kiếm khi nhấn phím Enter
    }
  };
  // end search

  useEffect(() => {
    if (!userId) {
      console.error("UserID không tồn tại trong cookies");
    }
  }, [userId]);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (userId) {
        try {
          const response = await getAvatarUser(userId);
          setAvatarUrl(response);
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      }
    };

    const fetchCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      const totalCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(totalCount);
    };

    fetchAvatar();
    fetchCartCount();
    getAllGenre();
  }, [userId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(userId);
        setNotifications(data || []);
        setUnreadCount(data.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const getAllGenre = async () => {
    try {
      const response = await listGenre();
      setGenre(response.data);
    } catch (error) {
      console.error("Error fetching Genre", error);
    }
  };

  const getAllTrack = async () => {
    if (!userId) return;

    try {
      const response = await getTrackByUserId(userId);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching track", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newTrackName) newErrors.name = "Track name is required.";
    if (!newTrackImage) newErrors.image = "Track image is required.";
    if (!newTrackFile) newErrors.file = "Track file is required.";
    if (!newTrackGenre) newErrors.genre = "Track genre is required.";
    if (!newTrackDescription)
      newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const newTrack = new FormData();
    newTrack.append("name", newTrackName);
    newTrack.append("trackImage", newTrackImage);
    newTrack.append("trackFile", newTrackFile);
    newTrack.append("genre", newTrackGenre);
    newTrack.append("description", newTrackDescription);
    newTrack.append("status", false);
    newTrack.append("report", false);
    newTrack.append("user", userId);

    try {
      await createTrack(newTrack);
      console.log("Track created successfully");
      document.getElementById("closeModal").click();
      resetForm();
      getAllTrack();
    } catch (error) {
      console.error("Error creating track:", error);
    }
  };

  // log-out
  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove("userId");
      setAvatarUrl(images.logoTuneBox);
      navigate("/introduce");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAvatarClick = () => {
    if (userId) {
      navigate("/profileUser");
    } else {
      navigate("/login");
    }
  };

  const handleMouseEnter = () => setDropdownVisible(true);
  const handleMouseLeave = () => setDropdownVisible(false);

  const handleCartClick = () => {
    if (userId) {
      navigate("/Cart");
    } else {
      navigate("/login");
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:8080/api/notifications/markAsRead/${notificationId}`,
        {
          method: "PUT",
        }
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const resetForm = () => {
    setTrackName("");
    setTrackImage(null);
    setTrackFile(null);
    setTrackGenre("");
    setTrackDescription("");
    setErrors({});
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    navigate(`/post/${notification.postId}`);
  };

  const handleDelete = async (notificationId) => {
    await axios.delete(
      `http://localhost:8080/api/notifications/${notificationId}`
    ); // Thay đổi URL theo API của bạn
    setNotifications(notifications.filter((n) => n.id !== notificationId)); // Cập nhật trạng thái
  };

  const validateImageFile = (file) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or GIF)";
    }
    return "";
  };

  const validateAudioFile = (file) => {
    if (file.type !== "audio/mpeg" && !file.name.endsWith(".mp3")) {
      return "Please upload a valid MP3 file";
    }
    return "";
  };
  //Xóa từng thông báo
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${notificationId}`);
      // Update notifications in state
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  //Xóa tất cả thông báo đã đọc
  const handleDeleteAllReadNotifications = async (userId) => {
    try {
      // Thêm userId vào URL
      await axios.delete(`http://localhost:8080/api/notifications/delete-read`, {
        params: { userId },
      });
      console.log("Đã xóa tất cả thông báo đã đọc.");
    } catch (error) {
      console.error("Lỗi khi xóa tất cả thông báo đã đọc:", error.response.data);
    }
  };



  return (
    <header className="navbar-container ">
      {/* Navbar Left */}
      <div className="col-3 d-flex align-items-center">
        <button className="navbar-button" onClick={() => navigate("/")}>
          <img alt="tunebox" src={images.logoTuneBox} width="150" />
        </button>
        <button className="navbar-button" onClick={() => navigate("/")}>
          <span className="text-decoration-none">
            <img alt="icon-home" src={images.home} className="icon" />
            <b>Feed</b>
          </span>
        </button>
        <button
          className="navbar-button"
          onClick={() => navigate("/HomeEcommerce")}
        >
          <span>
            <img
              alt="icon-loa"
              src={images.speaker}
              width="35"
              className="icon"
            />
            <b>Shops</b>
          </span>
        </button>
      </div>

      {/* Search in social page */}
      <div className="col-4 d-flex justify-content-center align-items-center">
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)} // Cập nhật state khi người dùng nhập
            onKeyDown={handleKeyDown} // Xử lý sự kiện nhấn phím
          />
          <button className="search-btn" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      {/* Navbar Right */}
      <div className="col-5 d-flex justify-content-center align-items-center">
        {/* Thông báo */}
        <div className="d-flex align-items-center">
          <span className="notification-icon">
            <img
              alt="icon-chuong"
              src={images.notification}
              className="notification-icon"
              onClick={() => setNotificationVisible(!notificationVisible)}
            />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </span>

          {notificationVisible && (
            <div className={`notification-dropdown ${notificationVisible ? "show" : ""}`}>
              <SwipeableList>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <SwipeableListItem
                      key={notification.id}
                      swipeRight={{
                        content: <div className="delete-action">Xóa</div>,
                        action: () => {
                          console.log("Swiped right for id:", notification.id);
                          deleteNotification(notification.id);
                        },
                      }}
                    >
                      <div className={`notification-item ${!notification.read ? "unread" : ""}`}>
                        {!notification.read && <span className="red-dot"></span>}
                        <div
                          className="notification-content"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          {notification.type === "LIKE_POST" ? (
                            <>
                              <span className="message">{`${notification.likerUsername} đã thích bài viết của bạn!`}</span>
                              <br />
                              <span className="time">{new Date(notification.createdAt).toLocaleTimeString()}</span>
                              <p>{notification.postContent}</p>
                            </>
                          ) : (
                            <>
                              <span className="message">{notification.message}</span>
                              <br />
                              <span className="time">{new Date(notification.createdAt).toLocaleTimeString()}</span>
                              <p>{notification.postContent}</p>
                            </>
                          )}
                        </div>
                        {/* Thêm nút xóa ở đây */}
                        <button onClick={() => deleteNotification(notification.id)} className="delete-notification-button">
                          Xóa
                        </button>
                      </div>
                    </SwipeableListItem>
                  ))
                ) : (
                  <li className="no-notification">Không có thông báo nào.</li>
                )}
              </SwipeableList>

              <button onClick={handleDeleteAllReadNotifications(userId)} className="delete-all-read">
                Xóa tất cả thông báo đã xem
              </button>
            </div>
          )}
        </div>

        {/* chat */}
        <span className="mx-3">
          <Link to={'/chat'}>
          <img
            alt="icon-chat"
            style={{ width: "30px", height: "30px" }}
            src={images.conversstion}
            className="icon"
          />
          </Link>
        </span>

        {/* cart */}
        <button className="mx-3 cart-shopping" onClick={handleCartClick}>
          <i className="fa-solid fa-cart-shopping"></i>
          {cartCount > 0 && (
            <span className="badge bg-danger">{cartCount}</span>
          )}
        </button>

        {/* avatar */}
        <span className="mx-3">
          <img
            alt="avatar-user"
            src={avatarUrl}
            className="avatar-user"
            onClick={handleAvatarClick}
            onMouseEnter={handleMouseEnter}
          />
        </span>

        {/* drop down */}
        {dropdownVisible && (
          <div
            className=" dropdown-menu show"
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="dropdown-item"
              onClick={() => navigate("/profileUser")}
            >
              Profile
            </button>

            <button className="dropdown-item" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        )}

        {/* add track */}
        <button
          className="add-track"
          data-bs-toggle="modal"
          data-bs-target="#addTrackModal"
          onClick={getAllGenre}
        >
          Create
        </button>
      </div>

      {/* start modal add */}
      <div
        className="modal fade"
        id="addTrackModal"
        tabIndex="-1"
        aria-labelledby="addTrackModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addTrackModalLabel">
                Add Track
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <form action="" className="row">
                  <div className="mb-3">
                    <label className="form-label">Track Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      value={newTrackName}
                      onChange={(e) => setTrackName(e.target.value)}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Image Track</label>
                    <input
                      type="file"
                      className={`form-control ${
                        errors.image ? "is-invalid" : ""
                      }`}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const imageError = validateImageFile(file);
                          if (imageError) {
                            setErrors((prev) => ({
                              ...prev,
                              image: imageError,
                            }));
                            return;
                          }
                          setErrors((prev) => ({ ...prev, image: "" }));
                          setTrackImage(file);
                        }
                      }}
                    />
                    {errors.image && (
                      <div className="invalid-feedback d-block">
                        {errors.image}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">File Track</label>
                    <input
                      type="file"
                      className={`form-control ${
                        errors.file ? "is-invalid" : ""
                      }`}
                      accept=".mp3"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const audioError = validateAudioFile(file);
                          if (audioError) {
                            setErrors((prev) => ({
                              ...prev,
                              file: audioError,
                            }));
                            return;
                          }
                          setErrors((prev) => ({ ...prev, file: "" }));
                          setTrackFile(file);
                        }
                      }}
                    />
                    {errors.file && (
                      <div className="invalid-feedback d-block">
                        {errors.file}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Genre</label>
                    <select
                      className={`form-select ${
                        errors.genre ? "is-invalid" : ""
                      }`}
                      value={newTrackGenre}
                      onChange={(e) => setTrackGenre(e.target.value)}
                    >
                      <option value="" disabled>
                        Select genre
                      </option>
                      {genres && genres.length > 0 ? (
                        genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No genres available</option>
                      )}
                    </select>
                    {errors.genre && (
                      <div className="invalid-feedback">{errors.genre}</div>
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
                      value={newTrackDescription}
                      onChange={(e) => setTrackDescription(e.target.value)}
                    ></textarea>
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
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
      </div>
      {/* end modal add */}
    </header>
  );
};

export default Navbar;
