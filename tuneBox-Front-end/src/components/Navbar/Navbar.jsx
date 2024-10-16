import React, { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { getAvatarUser } from "../../service/UserService";
import axios from "axios";
const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate()
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



  useEffect(() => {
    const fetchCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
    };

    fetchCartCount();
  }, []);

    // Hàm đăng xuất
    const handleLogout = async () => {
      try {
        await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
        Cookies.remove('userId'); // Xóa cookie userId
        navigate('/login'); // Chuyển hướng đến trang đăng nhập
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
  

  return (
    <header
      className="row"
      style={{
        alignItems: "center",
      }}
    >
      <div
        className="col"
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <button className="btn">
          <Link to={"/"}>
            <img
              alt="tunebox"
              src={images.logoTuneBox}
              style={{
                marginLeft: "50px",
                marginRight: "50px",
              }}
              width="150"
            />
          </Link>
        </button>
        {/* Trang feed */}
        <button className="btn">
          <Link className="text-decoration-none text-black" to={"/"}>
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
          </Link>
        </button>
        {/* Trang giỏ hàng */}
        <button className="btn">
          <Link
            className="text-decoration-none text-black"
            to={"/HomeEcommerce"}
          >
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
          </Link>
        </button>
      </div>
      <div className="col text-end" style={{ alignItems: "center", }}>
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
          <button className="btn">
            <Link to={'/profileUser'}>
              <img
                alt="Avatar"
                className="avatar_small"
                src={avatarUrl}
                style={{
                  height: "50px",
                  marginBottom: "15px",
                  width: "50px",
                  borderRadius: "50%",
                }}
              />
            </Link>
          </button>
        )}

        {/* Trang giỏ hàng */}
        <button className="btn position-relative">
          <Link to={'/Cart'} className="d-flex align-items-center">
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

        <button className="btn btn-secondary" onClick={handleLogout}>
          <b>Đăng xuất</b>
        </button>
      </div>
      <hr />
    </header>
  );
};

export default Navbar;
