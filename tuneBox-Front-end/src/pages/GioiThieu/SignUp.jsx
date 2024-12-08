import React, { useEffect,useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header2 from "../../components/Navbar/Header2.jsx";
import Footer2 from "../../components/Footer/Footer2.jsx";
import Swal from "sweetalert2";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userName.trim()) return "Username cannot be left blank";
    if (!email.trim()) return "Email cannot be left blank";
    if (!password.trim()) return "Password cannot be left blank";
    if (!emailPattern.test(email)) return "Invalid email!";
    if (password.length < 4) return "Password must have at least 4 characters!";
    return "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      //kiểm tra đăng ký
      const response = await axios.get('http://localhost:8080/user/check-signUp', {
        params: { userName, email, password }
      });

      if (response.status === 200) {
        const formData = { userName, email, password, name: null, avatar: null, inspiredBys: [], talents: [], genres: [],status: "ACTIVE" };
        navigate('/userInfor', { state: formData });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);  // Hiển thị lỗi từ server
      } else {
        setError("An error occurred while registering. Please try again later.");
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
    const { credential } = response;
    console.log("Credential from Google: ", credential);

    const user = jwtDecode(credential);
    const userName = user.email.split('@')[0];

    try { 
        const res = await axios.post('http://localhost:8080/api/auth/google', { idToken: credential });
        const { token, userExists } = res.data;

        localStorage.setItem('jwtToken', token);

        if (res.status === 200) {
            const formData = { 
                userName, 
                email: user.email, 
                password: null,
                name: user.name, 
                avatar: user.picture || null, 
                inspiredBys: [], 
                talents: [], 
                genres: [],
                status: "ACTIVE"
            };

            if (userExists) {
                navigate('/');  // Điều hướng người dùng hiện có tới trang chính
            } else {
                navigate('/userInfor', { state: formData });  // Điều hướng người dùng mới tới trang cập nhật thông tin
            }
        }
    } catch (error) {
        console.error('Login failed', error);
    }
};
  const handleGoogleFailure = () => {
    setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
  };


  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-10 mx-auto">
              <form className="custom-form ticket-form mb-5" onSubmit={handleSignUp}>
                <h3 className="text-center mb-4">REGISTER</h3>
                <div className="text-center">
                  {error && (
                    <div style={{ marginTop: 10, color: 'red', textAlign: 'center' }}>
                      {error}
                    </div>
                  )}
                </div>
                <div className="ticket-form-body">
                  <div className="row">
                    <h6>Username</h6>
                    <div className="col-lg-12">
                      <input type="text" className="form-control" placeholder="Enter your username"
                        value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: -30 }}>
                    <h6>Email</h6>
                    <div className="col-lg-12">
                      <input type="email" className="form-control" placeholder="Enter your email"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: -30 }}>
                    <h6>Password</h6>
                    <div className="col-lg-12">
                      <input type="password" className="form-control" placeholder="Enter your password"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">Register</button>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto" style={{ marginTop: 20, paddingLeft: 20 }}>
                    <span className="text-center">Or continue with</span>
                  </div>
                  <div className="row d-flex justify-content-center" style={{ marginTop: 20 }}>
                    <div className="col-lg-6 d-flex justify-content-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onFailure={handleGoogleFailure}
                      style={{ width: '100%' }}
                    />
                    </div>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 20 }}>
                    <span>By continuing to create an account you agree to TuneBox's terms.</span>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 80 }}>
                    <span>Already have an account? <Link to={'/login'}><b>Sign in now.</b></Link></span>
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

export default SignUp;
