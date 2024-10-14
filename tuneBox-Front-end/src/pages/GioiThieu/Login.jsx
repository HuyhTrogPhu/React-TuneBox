import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/bootstrap-icons.css';
import './css/style.css';
import './css/header.css';
import './css/profile.css';
import './js/jquery.min.js';
import './js/bootstrap.min.js';
import './js/jquery.sticky.js';
import './js/click-scroll.js';
import './js/custom.js';
import Header2 from '../../components/Navbar/Header2.jsx';
import Footer2 from '../../components/Footer/Footer2.jsx';
import { images } from "../../assets/images/images.js";


const Login = () => {
  


  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-10 mx-auto">
              <form className="custom-form ticket-form mb-5 mb-lg-0">
                <h2 className="text-center mb-4">Đăng nhập</h2>
                <div className="ticket-form-body">
                  <div className="row">
                    <h6>Tên đăng nhập hoặc email</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        placeholder="Nhập tên đăng nhập hoặc email"
                       
                       
                      />
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: -30 }}>
                    <h6>Mật khẩu</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">Đăng nhập</button>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto" style={{ marginTop: 20, paddingLeft: 20 }}>
                    <span className="text-center">Hoặc tiếp tục với</span>
                  </div>
                  <div className="row d-flex justify-content-center" style={{ marginTop: 20 }}>
                    <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center image-container">
                      <div>
                        <img src={images.google} alt="google" width="65px" height="65px" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 80 }}>
                    <span className="text-center">Bạn chưa có tài khoản?
                      <Link to={'/register'}><b>Đăng kí ngay.</b></Link>
                    </span>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 20 }}>
                    <Link to="/forgot-password" className="text-primary">
                      <b>Quên mật khẩu?</b>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer2 />

    </div>
  );
};

export default Login;