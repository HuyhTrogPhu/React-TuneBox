import React, { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { getAvatarUser } from "../../service/UserService";
import { logout } from "../../service/LoginService";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(images.logoTuneBox); // Set avatar mặc định
  const [dropdownVisible, setDropdownVisible] = useState(false); // Trạng thái cho dropdown
  const navigate = useNavigate();

  // Lấy userId từ cookie và fetch avatar
  useEffect(() => {
    const userIdCookie = Cookies.get('userId');
    if (userIdCookie) {
      const fetchAvatar = async () => {
        try {
          const response = await getAvatarUser(userIdCookie);
          console.log("avatar:", response); // Kiểm tra đường dẫn avatar
          setAvatarUrl(response); // Set đường dẫn avatar
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      };
      fetchAvatar();
    }
  }, []);

  // Lấy số lượng sản phẩm trong giỏ hàng từ localStorage
  useEffect(() => {
    const fetchCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
    };

    fetchCartCount();
  }, []);

  // Hàm xử lý khi nhấn Logout
  const handleLogout = async () => {
    try {
      await logout(); 
      Cookies.remove('userId'); // Xóa cookie userId phía client
      setAvatarUrl(images.logoTuneBox); 
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Điều hướng đến trang profile khi nhấn vào avatar
  const handleAvatarClick = () => {
    const userIdCookie = Cookies.get('userId');
    if (userIdCookie) {
      navigate('/profileUser');
    } else {
      navigate('/login');
    }
  };

  // Điều khiển hiển thị dropdown khi hover
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  // Điều hướng giỏ hàng chỉ khi có userId
  const handleCartClick = () => {
    const userIdCookie = Cookies.get('userId');
    if (userIdCookie) {
      navigate('/Cart');
    } else {
      navigate('/login');
    }
  };

  return (
    <header
      className="row"
      style={{
        alignItems: "center",
      }}
    >
      {/* navbar left */}
      <div
        className="col"
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <button className="btn" onClick={() => navigate('/')}>
          <img
            alt="tunebox"
            src={images.logoTuneBox}
            style={{
              marginLeft: "50px",
              marginRight: "50px",
            }}
            width="150"
          />
        </button>
        {/* Trang feed */}
        <button className="btn" onClick={() => navigate('/')}>
          <span
            className="text-decoration-none"
            style={{
              marginRight: "30px",
            }}
          >
            <img
              alt="icon-home"
              src={images.home}
              style={{
                marginBottom: "15px",
                marginRight: "15px",
              }}
            />
            <b>Feed</b>
          </span>
        </button>
        {/* Trang bán hàng */}
        <button className="btn" onClick={() => navigate('/HomeEcommerce')}>
          <span>
            <img
              alt="icon-loa"
              src={images.speaker}
              style={{
                marginBottom: "15px",
                marginRight: "15px",
              }}
              width="35px"
            />
            <b>Shops</b>
          </span>
        </button>
      </div>

      {/* navbar right */}
      <div className="col d-flex text-end" style={{ alignItems: "center", }}>
        <span>
          <img
            alt="icon-chuong"
            src={images.notification}
            style={{
              marginBottom: "15px",
              marginRight: "30px",
            }}
          />
        </span>
        <span>
          <img
            alt="icon-chat"
            src={images.conversstion}
            style={{
              marginBottom: "15px",
              marginRight: "30px",
            }}
          />
        </span>
        {/* Trang get Prime */}
        <button
          className="btn btn-warning "
          style={{
            marginBottom: "15px",
            marginRight: "20px",
          }}
          type="button"
        >
          <span>
            <b>Get</b>
          </span>{" "}
          <img
            alt="icon-crow"
            height="32px"
            src={images.crown}
            style={{
              marginLeft: "10px",
            }}
            width="32px"
          />
        </button>
        {/* Trang cá nhân */}
        {/* Avatar */}
        {avatarUrl && (
          <div
            className="dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              alt="Avatar"
              className="avatar_small"
              src={avatarUrl}
              style={{ height: "50px", width: "50px", borderRadius: "50%", cursor: "pointer" }}
              onClick={handleAvatarClick} // Gọi hàm điều hướng khi nhấn vào avatar
            />
            {dropdownVisible && (
              <ul className="dropdown-menu show">
                <li>
                  <button onClick={handleLogout} className="dropdown-item">
                    Log-out
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}

        {/* Trang giỏ hàng */}
        <button className="btn position-relative" onClick={handleCartClick}>
          <span>
            <img
              alt="icon-giohang"
              src={images.shopping_bag}
              style={{
                marginBottom: "15px",
                marginRight: "10px",
              }}
            />
          </span>
          {/* Hiển thị badge nếu có sản phẩm trong giỏ hàng */}
          {cartCount > 0 && (
            <span className="badge text-bg-secondary">
              {cartCount}
            </span>
          )}
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
      </div>
      <hr />
    </header>
  );
};

export default Navbar;
