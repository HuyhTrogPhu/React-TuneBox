import React, { useState } from 'react';
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
import './js/sothich.js';

import { useSearchParams } from 'react-router-dom';
import Footer2 from '../../components/Footer/Footer2.jsx';
import { images } from '../../assets/images/images.js';
import axios from 'axios';
import { error } from 'jquery';

const ResetPassword2 = () => {
  const [newPassword, setNewPassword] = useState(''); // Password state
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password state
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      // Send request to reset password
      await axios.post('http://localhost:8080/User/reset-password', {
        token,
        newPassword,
      });

      setMessage('Mật khẩu đã được đặt lại thành công.');
      
    } catch (error) {
      setMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
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
          </div>
        </nav>
      </div>

      <section className="ticket-section section-padding">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-center align-items-center user">
              <div className="profile-setup-card text-center p-4 rounded-3">
                <h5 className="mb-4">Đặt lại mật khẩu</h5>
                <p className="text-muted mb-3 fontchu">
                  Nhập mật khẩu mới của bạn để thiết lập lại tài khoản.
                </p>
                
                <div className="mb-3">
                  <input 
                    type="password" 
                    className="form-control l1" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Mật khẩu mới"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <input 
                    type="password" 
                    className="form-control l1" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Xác nhận mật khẩu"
                    required
                  />
                </div>
                
                <button className="btn btn-dark w-100" onClick={handleSubmit}>
                  Đặt lại mật khẩu
                </button>
                
                {/* Hiển thị thông báo */}
                {message && <div className="mt-3 text-success">{message}</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer2 />
    </div>
  );
};

export default ResetPassword2;
