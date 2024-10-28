import React, { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { getAvatarUser } from "../../service/UserService";
import { createTrack, listGenre, getTrackByUserId } from "../../service/TrackServiceCus";
import { getNotifications } from "../../service/NotificationService.js";
import { logout } from "../../service/LoginService";
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
  // Cấu hình interceptor cho Axios để thêm Authorization header vào mỗi yêu cầu
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token').trim(); // Lấy token từ localStorage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

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
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
    };

    fetchAvatar();
    fetchCartCount();
  }, [userId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(userId);
        setNotifications(data || []);
        setUnreadCount(data.filter(n => !n.read).length);
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
    if (!newTrackDescription) newErrors.description = "Description is required.";

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
      const response = await logout();
      console.log(response);

      // Xóa cookie userId
      Cookies.remove('userId');

      // Xóa token JWT (nếu lưu trữ trong localStorage)
      localStorage.removeItem('token');

      setAvatarUrl(images.logoTuneBox);

      navigate('/introduce');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAvatarClick = () => {
    if (userId) {
      navigate('/profileUser');
    } else {
      navigate('/login');
    }
  };

  const handleMouseEnter = () => setDropdownVisible(true);
  const handleMouseLeave = () => setDropdownVisible(false);

  const handleCartClick = () => {
    if (userId) {
      navigate('/Cart');
    } else {
      navigate('/login');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/markAsRead/${notificationId}`, {
        method: 'PUT',
      });
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
    await axios.delete(`http://localhost:8080/api/notifications/${notificationId}`); // Thay đổi URL theo API của bạn
    setNotifications(notifications.filter(n => n.id !== notificationId)); // Cập nhật trạng thái
  };
  return (
    <header className="navbar-container">
      {/* Navbar Left */}
      <div className="col-3 d-flex align-items-center">
        <button className="navbar-button" onClick={() => navigate('/')}>
          <img alt="tunebox" src={images.logoTuneBox} width="150" />
        </button>
        <button className="navbar-button" onClick={() => navigate('/')}>
          <span className="text-decoration-none">
            <img alt="icon-home" src={images.home} className="icon" />
            <b>Feed</b>
          </span>
        </button>
        <button className="navbar-button" onClick={() => navigate('/HomeEcommerce')}>
          <span>
            <img alt="icon-loa" src={images.speaker} width="35" className="icon" />
            <b>Shops</b>
          </span>
        </button>
      </div>

      {/* Search in social page */}
      <div className="col-4 d-flex justify-content-center align-items-center">
        <div>
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-btn">
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
            <div className={`notification-dropdown ${notificationVisible ? 'show' : ''}`}>
              <ul className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <li key={index} className="notification-item" onClick={() => handleNotificationClick(notification)}>
                      <div className="notification-content">
                        {notification.type === 'LIKE_POST' ? (
                          <>
                            <span className="message">{`${notification.likerUsername} đã thích bài viết của bạn!`}</span><br />
                            <span className="time">{new Date(notification.createdAt).toLocaleTimeString()}</span>
                            <p>{notification.postContent}</p>
                          </>
                        ) : (
                          <>
                            <span className="message">{notification.message}</span><br />
                            <span className="time">{new Date(notification.createdAt).toLocaleTimeString()}</span>
                            <p>{notification.postContent}</p>
                          </>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="no-notification">Không có thông báo nào.</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <span className="mx-3">
          <img alt="icon-chat" style={{ width: '30px', height: '30px' }} src={images.conversstion} className="icon" />
        </span>

        <button className="mx-3 cart-shopping" onClick={handleCartClick}>
          <i className="fa-solid fa-cart-shopping"></i>
          {cartCount > 0 && (
            <span className="badge bg-danger">{cartCount}</span>
          )}
        </button>

        <span className="mx-3">
          <img alt="avatar-nav" src={avatarUrl} className="avatar-nav m-0" onClick={handleAvatarClick} onMouseEnter={handleMouseEnter} />
        </span>

        {dropdownVisible && (
          <div className="dropdown-menu dropdown-menu-right show dropdo" onMouseLeave={handleMouseLeave}>
            <button className="dropdown-item" onClick={() => navigate("/profileUser")}>Trang cá nhân</button>
            <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    </header>

  );
};

export default Navbar;
