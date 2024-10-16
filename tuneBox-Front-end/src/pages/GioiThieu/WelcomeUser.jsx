import React from 'react';
import './css/bootstrap.min.css';
import './css/bootstrap-icons.css';
import './css/header.css';
import './css/profile.css';

import Footer2 from '../../components/Footer/Footer2.jsx';
import { images } from '../../assets/images/images.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { register } from '../../service/LoginService.js';

const WelcomeUser = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state || {};
  console.log("Form data from genre:", formData);

  const handleRegister = async () => {
    const { userName, name, avatar, email, password, talents, genres, inspiredBys } = formData;

    // Tạo FormData để gửi nhiều loại dữ liệu
    const formDataToSend = new FormData();
  
    // Thêm các trường của userDto vào FormData
    formDataToSend.append("userName", userName);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    
    // Thêm các danh sách talents, genres, inspiredBys (nếu là array)
    talents.forEach(talent => formDataToSend.append("talent", talent));
    genres.forEach(genre => formDataToSend.append("genre", genre));
    inspiredBys.forEach(inspiredBy => formDataToSend.append("inspiredBy", inspiredBy));
  
    // Thêm các trường của userInformationDto vào FormData
    formDataToSend.append("name", name);
    
    // Tải hình ảnh từ URL và thêm vào FormData
    const response = await fetch(avatar);
    const blob = await response.blob();
    formDataToSend.append("image", blob, "avatar.png");
  
    try {
      await register(formDataToSend); 
      alert('Đăng ký thành công!');
      navigate('/login'); 
    } catch (error) {
      console.log("Error during registration", error);
      alert('Đăng ký không thành công!');
    }
  };
  
  

  return (
    <div>
      <div>
        <div className='sticky-wrapper'>
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <Link to={'/welcome'} className='fontLogo'>
                <img src={images.logoTuneBox} alt='logo' width="100px" />
              </Link>

              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
            </div>
          </nav>
        </div>
      </div>
      <div>
        <section className="hero-section" id="section_1">
          <div className="section-overlay" />
          <div className="container d-flex justify-content-center align-items-center">
            <div className="row">
              <div className="col-lg-6 col-12 mb-4 mb-lg-0 d-flex align-items-center">
                <div className="services-info">
                  <h2 className="text-white mb-4">Welcome {formData.name}</h2>
                  <p className="text-white fontchu">Start exploring unique musical ideas curated just for you. Connect with others through TuneBox. Join us in enjoying an amazing music space made just for you.</p>
                  <p className="text-white">
                    {/* Gọi handleRegister khi nhấn nút */}
                    <button className='btn custom-btn smoothscroll' onClick={handleRegister}>Get started now!</button>
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="about-text-wrap">
                  <img src={images.casi} className="about-image img-fluid" style={{ width: 500, marginTop: 150 }} alt='casi' />
                </div>
              </div>
            </div>
          </div>
          <div className="video-wrap">
            <video autoPlay loop muted className="custom-video" poster={images.backg}>
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      </div>
      <Footer2 />
    </div>
  );
};

export default WelcomeUser;
