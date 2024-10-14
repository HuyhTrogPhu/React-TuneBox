import React, { useEffect, useState } from "react";
import "./css/bootstrap.min.css";
import "./css/bootstrap-icons.css";
import "./css/style.css";
import "./css/header.css";
import "./css/profile.css";

import "./js/jquery.min.js";
import "./js/bootstrap.min.js";
import "./js/jquery.sticky.js";
import "./js/click-scroll.js";
import "./js/custom.js";

import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
import { Link } from "react-router-dom";

const UserInfomation = () => {

  const [avartar, setAvartar] = useState(images.logoTuneBox);
  const [name, setName] = useState('');


  // Hàm xử lý khi thay đổi ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvartar(e.target.result); // Cập nhật ảnh logo
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm mở hộp thoại chọn ảnh
  const handleLogoClick = () => {
    document.getElementById("logoInput").click();
  };


  return (
    <div>
      <div>
        <div className="sticky-wrapper">
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <Link to={"/"}>
                <img src={images.logoTuneBox} alt="logo" width="100px" />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
            </div>
          </nav>
        </div>

        <section className="ticket-section section-padding">
          <div className="section-overlay" />
          <div className="container">
            <div className="row">
              <div className=''>
                <div className=" d-flex justify-content-center align-items-center user ">
                  <div className="overlay" />
                  <div className="profile-setup-card text-center p-4 rounded-3">
                    <h5 className="mb-4">Đặt tên người dùng</h5>
                    <p className="text-muted mb-3 fontchu">
                      Hãy đặt tên người dùng để bạn bè và mọi người dễ dàng tìm
                      kiếm bạn trên TuneBox.
                    </p>
                    {/* Logo tuneBox */}
                    <img
                      src={avartar}
                      alt="avartar"
                      className="profile-icon border border-danger rounded-circle d-flex justify-content-center align-items-center mb-3"
                      onClick={handleLogoClick}
                      style={{ width: '100px', height: '100px' }}
                    />

                    {/* Input ẩn để chọn ảnh */}
                    <input
                      type="file"
                      id="logoInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <form className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username"
                      />
                    </form >
                    <button
                      className="btn btn-dark w-100"

                    >
                      <Link to={'/inspiredBy'}> Tiếp tục</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer2 />
    </div>
  );
};

export default UserInfomation;
