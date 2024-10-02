import React, { useState } from 'react';
import axios from 'axios';
import './css/bootstrap.min.css';
import './css/bootstrap-icons.css';
import './css/style.css';
import './css/header.css';
import './css/profile.css';

import Footer2 from '../../components/Footer/Footer2.jsx';
import { images } from '../../assets/images/images.js';

const ForgotPassword2 = () => {
  const [inputValue, setInputValue] = useState(''); // Thay đổi state để lưu cả userName và email
  const [message, setMessage] = useState('');

  const handleResetPassword = async (event) => {
    event.preventDefault();
    
    const isEmail = inputValue.includes('@');
  
    try {
      const response = await axios.post('http://localhost:8080/User/forgot-password', { 
        email: isEmail ? inputValue : null,
        userName: !isEmail ? inputValue : null
      });
  
      if (response.status === 200) {
        setMessage('Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
      } else {
        setMessage('Không tìm thấy tài khoản với tên đăng nhập hoặc email này.');
      }
    } catch (error) {
      console.error('Error response:', error.response);
      setMessage(error.response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <div>
      <div className='sticky-wrapper'>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="fontlogo" href="index.html">
              <img src={images.logoTuneBox} alt='logo' width="100px" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
          </div>
        </nav>
      </div>

      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-center align-items-center user">
              <div className="overlay" />
              <div className="profile-setup-card text-center p-4 rounded-3">
                <h2 className="mb-4"> Quên Mật Khẩu</h2>
                <p className="text-muted mb-3 fontchu">Nhập Tên Tài Khoản Hoặc Email</p>
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <input 
                      type="text" 
                      className="form-control l1" 
                      placeholder="Nhập tên đăng nhập hoặc email của bạn"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-danger w-100">Gửi Mail</button>
                  
                  <div className="text-success mt-2">{message}</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer2 />
    </div>
  );
};

export default ForgotPassword2;
