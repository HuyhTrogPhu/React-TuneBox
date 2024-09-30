import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Điều hướng sau khi đăng nhập
import axios from 'axios';
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
import './js/sothich.js'

import Header2 from '../../components/Navbar/Header2.jsx';
import Footer2 from '../../components/Footer/Footer2.jsx';
import { images } from '../../assets/images/images.js';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!userName || !password) {
      setErrorMessage('Tên đăng nhập và mật khẩu không được để trống');
      return;
    }
  
    const isEmail = userName.includes('@');  // Giả sử có ký tự "@" thì là email
    const payload = isEmail ? { email: userName, password: password } : { userName: userName, password: password };
  
    try {
      const response = await axios.post('http://localhost:8080/User/log-in', payload, { withCredentials: true });
      
      if (response.data.status) {
        navigate('/');
      } else {
        setErrorMessage(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setErrorMessage('Đã xảy ra lỗi khi đăng nhập');
      console.error('Error during login:', error);
    }
  };
  
  

  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-10 mx-auto">
              <form className="custom-form ticket-form mb-5 mb-lg-0" onSubmit={handleLogin}>
                <h2 className="text-center mb-4">Đăng nhập</h2>
                {errorMessage && (
                  <div className="alert alert-danger text-center" role="alert">
                    {errorMessage}
                  </div>
                )}
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
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)}  // Cập nhật giá trị username
                        required 
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
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}  // Cập nhật giá trị password
                        required 
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
                        <a href="#"> <img src={images.google} alt="icon-google" width="65px" height="65px" /></a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 80 }}>
                    <span className="text-center">Bạn chưa có tài khoản? <a href="#"><b>Đăng kí ngay.</b></a></span>
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
