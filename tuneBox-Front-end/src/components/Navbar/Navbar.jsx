import React, { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { getAvatarUser } from "../../service/UserService";
import { createTrack, listGenre, getTrackByUserId } from "../../service/TrackServiceCus";
import { getNotifications } from "../../service/NotificationService.js";
import { logout } from "../../service/LoginService";
import { Link } from "react-router-dom";

import ReactCountryFlag from "react-country-flag";
import i18n from "../../i18n/i18n.js";

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

  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove('userId'); 
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


  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Hàm thay đổi ngôn ngữ
  };
  return (
    <header className="row" style={{ alignItems: "center" }}>
      {/* Navbar Left */}
      <div className="col d-flex align-items-center">
        <button className="btn" onClick={() => navigate('/')}>
          <img alt="tunebox" src={images.logoTuneBox} width="150" style={{ marginLeft: "50px", marginRight: "50px" }} />
        </button>
        <button className="btn" onClick={() => navigate('/')}>
          <span className="text-decoration-none" style={{ marginRight: "30px" }}>
            <img alt="icon-home" src={images.home} style={{ marginBottom: "15px", marginRight: "15px" }} />
            <b>Feed</b>
          </span>
        </button>
        <button className="btn" onClick={() => navigate('/HomeEcommerce')}>
          <span>
            <img alt="icon-loa" src={images.speaker} width="35" style={{ marginBottom: "15px", marginRight: "15px" }} />
            <b>Shops</b>
          </span>
        </button>
      </div>

      {/* Navbar Right */}
      <div className="col d-flex justify-content-end align-items-center">
        {/* Thông báo */}
        <div>
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
                        <span className="message">{notification.message}</span> <br />
                        <span className="time">{new Date(notification.createdAt).toLocaleTimeString()}</span>
                        <p>{notification.postContent}</p>
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
        <span>
          <img alt="icon-chat" src={images.conversstion} style={{ marginBottom: "15px", marginRight: "30px" }} />
        </span>
        <button className="btn btn-warning" style={{ marginBottom: "15px", marginRight: "30px" }} onClick={handleCartClick}>
          Giỏ hàng
          {cartCount > 0 && (
            <span className="badge bg-danger">{cartCount}</span>
          )}
        </button>
        <span>
          <img alt="avatar" src={avatarUrl} className="avatar" onClick={handleAvatarClick} onMouseEnter={handleMouseEnter} />
        </span>
        {dropdownVisible && (
          <div className="dropdown-menu dropdown-menu-right show" onMouseLeave={handleMouseLeave}>
            <button className="dropdown-item" onClick={() => navigate("/profileUser")}>Trang cá nhân</button>
            <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={getAllGenre}>Đăng tải bài hát</button>
            <button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
        {/* Trang giỏ hàng */}
        <button className="btn">
          <Link to={'/Cart'}>
            <span>
              <img
              alt="icon-giohang"
                src={images.shopping_bag}
                style={{
                  marginBottom: "15px",
                  marginRight: "30px",
                }}
              />
            </span>
          </Link>
        </button>
        {/* Trang tạo track */}
        <button
          className="btn btn-danger"
          style={{
            marginBottom: "15px",
            marginRight: "10px",
          }}
          type="button"
        >
          {" "}
          <img
          alt="icon-plus"
            height="20px"
            src={images.plus_white}
            style={{
              marginBottom: "3px",
              marginRight: "10px",
            }}
            width="20px"
          />{" "}
          <b>Create</b>{" "}
        </button>
        <div className="language-switcher">
          <button onClick={() => changeLanguage("en")}>
            <ReactCountryFlag countryCode="US" svg />
          </button>
          <button onClick={() => changeLanguage("vi")}>
            <ReactCountryFlag countryCode="VN" svg />
          </button>
        </div> 
      </div>
    </header>
  );
};

export default Navbar;
