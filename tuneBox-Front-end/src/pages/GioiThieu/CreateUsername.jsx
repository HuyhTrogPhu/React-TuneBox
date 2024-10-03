import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "./js/sothich.js";

import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
const CreateUsername = ({updateFormData}) => {
  const [userNickname, setuserNickname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    updateFormData({ userNickname });
    navigate("/artist");
  };

  return (
    <div>
      <div>
        <div className="sticky-wrapper">
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <a className="fontlogo" href="index.html">
                <img src={images.logoTuneBox} alt="logo" width="100px" />
              </a>
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
              <div className>
                <div className=" d-flex justify-content-center align-items-center user ">
                  <div className="overlay" />
                  <div className="profile-setup-card text-center p-4 rounded-3">
                    <h5 className="mb-4"> Đặt tên người dùng</h5>
                    <p className="text-muted mb-3 fontchu">
                      Hãy đặt tên người dùng để bạn bè và mọi người dễ dàng tìm
                      kiếm bạn trên TuneBox.
                    </p>
                    <div className="profile-icon bg-primary rounded-circle d-flex justify-content-center align-items-center mb-3">
                      <span className="text-white display-4">P</span>
                    </div>
                    <form className="mb-3" onSubmit={handleSubmit}>
                      <input
                        type="text"
                        className="form-control l1"
                        defaultValue
                        placeholder="Nhập tên"
                        value={userNickname}
                        onChange={(e) => setuserNickname(e.target.value)}
                        required
                      />
                    </form >
                    <button
                      className="btn btn-dark w-100"
                      onClick={handleSubmit}
                    >
                      {" "}
                      Tiếp tục
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

export default CreateUsername;
