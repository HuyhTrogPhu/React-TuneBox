import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/style.css';
import Header2 from '../../components/Navbar/Header2.jsx';
import Footer2 from '../../components/Footer/Footer2.jsx';
import { login } from '../../service/LoginService.js';

const Login = () => {
  console.log('Cookie userId set:', document.cookie);  // In ra toàn bộ cookie  
  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Hàm validate email bằng regex
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const isEmail = (input) => {
    return validateEmail(input);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!userNameOrEmail) {
      setError('Vui lòng nhập tên tài khoản hoặc email.');
      return;
    }

    if (isEmail(userNameOrEmail) && !isEmail(userNameOrEmail)) {
      setError('Vui lòng nhập đúng định dạng email.');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    if (password.length < 4) {
      setError('Mật khẩu phải có ít nhất 4 ký tự!');
      return;
    }

    const userDto = {
      userName: userNameOrEmail.includes('@') ? null : userNameOrEmail,
      email: userNameOrEmail.includes('@') ? userNameOrEmail : null,
      password: password,
    };

    try {
      const response = await login(userDto);
      alert('Đăng nhập thành công!');

      // Lấy userId từ phản hồi của server
      console.log('Data trả về: ', response);

      const userId = response;

      if (userId !== undefined && userId !== null) {
        const expires = new Date();
        expires.setTime(expires.getTime() + 3 * 24 * 60 * 60 * 1000);  // Cookie tồn tại trong 3 ngày
        document.cookie = `userId=${userId}; expires=${expires.toUTCString()}; path=/`;
        console.log('Cookie userId set:', document.cookie);
      } else {
        console.error('userId is undefined or null');
      }



      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError(error.response.data);
      }
      //  else {
      //   setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      // }
    }
  };

  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="colcol-10-lg-6  mx-auto">
              <form className="custom-form ticket-form mb-5 mb-lg-0" onSubmit={handleLogin}>
                <h2 className="text-center mb-4">Đăng nhập</h2>
                <div className="ticket-form-body">
                  {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
                  {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
                  <div className="row">
                    <h6>Tên đăng nhập hoặc email</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input
                        type="text"
                        name="userNameOrEmail"
                        id="userNameOrEmail"
                        className="form-control"
                        placeholder="Nhập tên đăng nhập hoặc email"
                        value={userNameOrEmail}
                        onChange={(e) => setUserNameOrEmail(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">Đăng nhập</button>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 80 }}>
                    <span className="text-center">Bạn chưa có tài khoản?
                      <Link to={'/register'}><b>Đăng kí ngay.</b></Link>
                    </span>
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