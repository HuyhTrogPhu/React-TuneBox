import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/style.css';
import Header2 from '../../components/Navbar/Header2.jsx';
import Footer2 from '../../components/Footer/Footer2.jsx';
import { login } from '../../service/LoginService.js';
import { Audio } from 'react-loader-spinner';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReactModal from 'react-modal'; // Import React Modal

// Set the app element for React Modal
ReactModal.setAppElement('#root');

const Login = () => {
  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAccountBanned, setIsAccountBanned] = useState(false); // Để kiểm tra tài khoản bị ban
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsAccountBanned(false); // Reset trạng thái tài khoản bị cấm
  
    if (!userNameOrEmail || !password) {
      setError('Please enter account name, email, and password.');
      return;
    }
  
    const userDto = {
      userName: userNameOrEmail.includes('@') ? null : userNameOrEmail,
      email: userNameOrEmail.includes('@') ? userNameOrEmail : null,
      password,
    };
  
    try {
      setLoading(true);
      const response = await login(userDto);
      console.log('API Response:', response);
  
      if (response.userId) {
        if (response.status === 'BANNED') {
          console.log('Account is banned.'); // Debug
          setIsAccountBanned(true);
          setLoading(false);
          return;
        }
  
        const expires = new Date();
        expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = `userId=${response.userId}; expires=${expires.toUTCString()}; path=/`;
  
        const cartResponse = await axios.get(`http://localhost:8080/customer/cart/${response.userId}`);
        const cart = cartResponse.data.items || [];
        localStorage.setItem("cart", JSON.stringify(cart));
  
        setTimeout(() => {
          setLoading(false);
          navigate('/');
        }, 1000);
      } else {
        setError('User ID không hợp lệ.');
      }
    } catch (error) {
      setLoading(false);
      console.log('Error:', error.response?.data || error.message); // Debug lỗi API
      if (error.response?.data === 'ACCOUNT_BANNED') {
        console.log('Banned account detected.'); // Debug
        setIsAccountBanned(true);
        return;
      }
      setError('Incorrect login information.');
    }
  };
  
  const handleGoogleLogin = async (response) => {
    const { credential } = response;
    console.log("Credential from Google: ", credential);

    const user = jwtDecode(credential);
    const userName = user.email.split('@')[0];

    try {
        const res = await axios.post('http://localhost:8080/api/auth/google', { idToken: credential });
        const { token, userId, userExists } = res.data;

        // Lưu JWT token vào localStorage
        localStorage.setItem('jwtToken', token);

        if (res.status === 200) {
            // Lưu userId vào cookie
            const expires = new Date();
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 24 giờ
            document.cookie = `userId=${userId}; expires=${expires.toUTCString()}; path=/`;

            // Lấy thông tin giỏ hàng (nếu cần)
            const cartResponse = await axios.get(`http://localhost:8080/customer/cart/${userId}`);
            const cart = cartResponse.data.items || [];
            localStorage.setItem("cart", JSON.stringify(cart));

            // Điều hướng
            if (userExists) {
                navigate('/'); // Người dùng hiện có
            } else {
                const formData = {
                    userName,
                    email: user.email,
                    password: null,
                    name: user.name,
                    avatar: user.picture || null,
                    inspiredBys: [],
                    talents: [],
                    genres: []
                };
                navigate('/userInfor', { state: formData }); // Người dùng mới
            }
        }
    } catch (error) {
        console.error('Login failed', error);
        setError('Sign in with Google failed. Please try again.');
    }
};


  const handleGoogleFailure = () => {
    setError('Sign in with Google failed. Please try again.');
  };

  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <form className="custom-form ticket-form mb-5 mb-lg-0" onSubmit={handleLogin}>
                <h2 className="text-center mb-4">Log in</h2>
                <div className="ticket-form-body">
                  {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
                  {loading && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      zIndex: 9999,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Audio height="80" width="80" radius="9" color="#e94f37" ariaLabel="three-dots-loading" />
                    </div>
                  )}
                  <div className="row">
                    <h6>Please enter account name or email.</h6>
                    <div className="col-12">
                      <input
                      id='username'
                        type="text"
                        className="form-control"
                        placeholder="Please enter account name or email."
                        value={userNameOrEmail}
                        onChange={(e) => setUserNameOrEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: -30 }}>
                    <h6>Password</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input
                      id='password'
                        type="password"
                        className="form-control"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button id='loginbutton' type="submit" className="form-control">Log in</button>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 80 }}>
                    <span className="text-center">Don't have an account yet?
                      <Link to={'/register'}><b>Register now.</b></Link>
                    </span>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 20 }}>
                    <Link to="/forgot-password" className="text-primary">
                      <b>Forgot password?</b>
                    </Link>
                  </div>
                  <div className="col-lg-12 d-flex align-items-center justify-content-center" style={{ marginTop: 20 }}>
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onFailure={handleGoogleFailure}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modal thông báo tài khoản bị cấm */}
      <ReactModal
  isOpen={isAccountBanned}
  onRequestClose={() => setIsAccountBanned(false)}
  className="custom-modal-content"
  overlayClassName="custom-modal-overlay"
  contentLabel="Account Banned"
>
  <div>
    <h3 className="custom-modal-header">Tài khoản bị cấm</h3>
    <p className="custom-modal-body">Vui lòng liên hệ quản trị viên để được hỗ trợ.</p>
    <button className="custom-modal-button" onClick={() => setIsAccountBanned(false)}>
      Đóng
    </button>
  </div>
</ReactModal>


      <Footer2 />
    </div>
  );
};

export default Login;
  