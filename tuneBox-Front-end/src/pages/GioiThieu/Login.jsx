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
import axios from 'axios';

const Login = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [forgotEmailOrUsername, setForgotEmailOrUsername] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');
  
    const isEmail = userName.includes('@');
  
    const loginData = {
      [isEmail ? 'email' : 'userName']: userName,
      password: password
    };
  
    try {
      const response = await axios.post('http://localhost:8080/User/log-in', loginData);
  
      if (response.data && response.data.status) {
        console.log('Đăng nhập thành công:', response.data);
  
        const user = response.data.data; // Giả sử thông tin người dùng nằm trong `data.data`
        const role = user.roleNames[0];  // Lấy role đầu tiên của người dùng
  
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('user', JSON.stringify(user));
  
        // Điều hướng dựa trên role
        if (role === 'Customer') {
          navigate('/'); // Chuyển hướng đến trang Customer
        } else if (role === 'EcomAdmin') {
          navigate('/ecomadmin'); // Chuyển hướng đến trang EcomAdmin
        } else if (role === 'SocialAdmin') {
          navigate('/socialadmin'); // Chuyển hướng đến trang SocialAdmin
        } else {
          setErrorMessage('Role không hợp lệ');
        }
      } else {
        console.error('Đăng nhập thất bại:', response.data.message || 'Lỗi không xác định');
        setErrorMessage(response.data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Lỗi server. Vui lòng thử lại sau.');
      } else if (error.request) {
        setErrorMessage('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng của bạn.');
      } else {
        setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    }
  };
  
  
  const handleLoginWithGoogle = () => {
    console.log("Đang cố gắng đăng nhập với Google...");
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/User/login/oauth2/success', {
          withCredentials: true // Nếu cần thiết
        });
        // Giả sử bạn muốn lưu dữ liệu người dùng vào localStorage
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate('/'); // Chuyển hướng đến trang chính
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        navigate('/login'); // Chuyển hướng về trang đăng nhập nếu có lỗi
      }
    };
  
    fetchUserData();
  }, [navigate]);

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
                        required
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
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
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">Đăng nhập</button>
                  </div>
                  <div className='text-danger'>{errorMessage}</div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto" style={{ marginTop: 20, paddingLeft: 20 }}>
                    <span className="text-center">Hoặc tiếp tục với</span>
                  </div>
                  <div className="row d-flex justify-content-center" style={{ marginTop: 20 }}>
                    <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center image-container">
                      <button type="button" onClick={handleLoginWithGoogle}>
                        Đăng nhập với Google
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 80 }}>
                    <span className="text-center">Bạn chưa có tài khoản? <a href="#"><b>Đăng kí ngay.</b></a></span>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 20 }}>
                    <Link to="/forgot-password2" className="text-primary">
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
