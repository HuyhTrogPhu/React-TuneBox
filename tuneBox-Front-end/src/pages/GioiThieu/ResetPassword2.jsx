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

import i18n from "../../i18n/i18n.js";

import ReactCountryFlag from "react-country-flag";

import { useTranslation } from "react-i18next"; // Import hook dịch

const ResetPassword2 = () => {

  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Hàm thay đổi ngôn ngữ
  };

  const [newPassword, setNewPassword] = useState(''); // Password state
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password state
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage(t('reset_password_mismatch'));
      return;
    }

    try {
      // Send request to reset password
      await axios.post('http://localhost:8080/User/reset-password', {
        token,
        newPassword,
      });

      setMessage(t('reset_password_success'));
      
    } catch (error) {
      setMessage(t('reset_password_error'));
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

      <div className="language-switcher">
        <button onClick={() => changeLanguage("en")}>
          <ReactCountryFlag countryCode="US" svg />
        </button>
        <button onClick={() => changeLanguage("vi")}>
          <ReactCountryFlag countryCode="VN" svg />
        </button>
      </div>

      <section className="ticket-section section-padding">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-center align-items-center user">
              <div className="profile-setup-card text-center p-4 rounded-3">
              <h5 className="mb-4">{t('reset_password_title')}</h5>
                <p className="text-muted mb-3 fontchu">
                  {t('reset_password_description')}
                </p>
                
                <div className="mb-3">
                  <input 
                    type="password" 
                    className="form-control l1" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder={t('reset_password_new_placeholder')}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <input 
                    type="password" 
                    className="form-control l1" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder={t('reset_password_confirm_placeholder')}
                    required
                  />
                </div>
                
                <button className="btn btn-dark w-100" onClick={handleSubmit}>
                {t('reset_password_button')}
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
