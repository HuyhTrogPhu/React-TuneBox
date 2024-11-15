import React, { useEffect,useState } from 'react';
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

const Login = () => {
  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!userNameOrEmail) {
      setError('Please enter account name or email.');
      return;
    }
  
    if (!password) {
      setError('Please enter your password.');
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
      const userId = response.userId;

      if (userId) {
        const expires = new Date();
        expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = `userId=${userId}; expires=${expires.toUTCString()}; path=/`;
        setTimeout(() => {
          setLoading(false);
          navigate('/'); 
        }, 1000);
      } else {
        setLoading(false);
        setError('User ID không hợp lệ.');
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        setError('Thông tin đăng nhập không chính xác.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };

  useEffect(() => {
    /* Khởi tạo Google Sign-In */
    window.google.accounts.id.initialize({
      client_id: '28392767205-kjh3koov94lcf8d2dhh83o15siro23m7.apps.googleusercontent.com', // Client ID từ Google API Console
      callback: handleGoogleLogin,
    });

    /* Render button */
    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" }  // Tùy chỉnh giao diện nút
    );
  }, []);

  /* Hàm xử lý sau khi nhận token từ Google */
const handleGoogleLogin = async (response) => {
    const { credential } = response;  // Lấy token Google
    const user = jwtDecode(credential);  // Giải mã token để lấy thông tin người dùng

    const userName = user.email.split('@')[0];  // Tạo userName từ phần đầu của email

    try {
        const res = await axios.post('http://localhost:8080/api/auth/google', { idToken: credential });
        const token = res.data.token;  // Lấy token từ backend
        const userId = res.data.userId;  // Lấy userId từ backend
        const userExists = res.data.userExists;  // Kiểm tra xem người dùng đã tồn tại trong hệ thống chưa

        console.log("JWT from backend:", token);
        
        if (token && userId) {
            localStorage.setItem('jwtToken', token);  // Lưu token vào localStorage

            // Thiết lập cookie userId với thời gian hết hạn là 24 giờ
            const expires = new Date();
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);  // 24 giờ
            document.cookie = `userId=${userId}; expires=${expires.toUTCString()}; path=/`;

            // Nếu người dùng đã có tài khoản, chuyển hướng đến trang chủ '/'
            if (userExists) {
                navigate('/');  // Điều hướng về trang chủ
            } else {
                // Nếu tài khoản chưa có, chuyển đến trang đăng ký /userInfor
                navigate('/userInfor', {
                    state: { 
                        userName,
                        email: user.email,
                        password: null,
                        name: user.name,
                        avatar: user.picture || null,
                        inspiredBys: [],
                        talents: [],
                        genres: []
                    }
                });
            }
        } else {
            setError('User ID không hợp lệ.');  // Nếu không có userId hoặc token, hiển thị thông báo lỗi
        }
    } catch (error) {
        console.error('Login failed', error);
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
    }
};


const handleGoogleFailure = () => {
  setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
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
                <h2 className="text-center mb-4">Đăng nhập</h2>
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
                        type="password"
                        className="form-control"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">Log in</button>
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
      <Footer2 />
    </div>
  );
};

export default Login;