import React, { useState } from 'react'; 
import axios from 'axios';
import Swal from 'sweetalert2'; // Nhập SweetAlert2
import { Audio } from 'react-loader-spinner'; // Nhập Audio spinner
import './css/style.css';
import Footer2 from '../../components/Footer/Footer2';
import Header2 from '../../components/Navbar/Header2';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState(''); // State để lưu email người dùng
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading

  const handleForgotPassword = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form
    setLoading(true); // Bắt đầu loading

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: "Email cannot be blank.",
      });
      setLoading(false); // Dừng loading
      return;
    }

    try {
      // Gửi yêu cầu đến backend với email trong query string
      const response = await axios.post(`http://localhost:8080/user/forgot-password?email=${encodeURIComponent(email)}`);

      if (response.status === 200) {
        Swal.fire({
          icon: 'Info',
          title: 'Please check your Email inbox!',
          text: response.data,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "An error occurred while sending the request.",
        });
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data || "An unknown error has occurred.";
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "A network error has occurred. Please try again later.",
        });
      }
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
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
              <Audio
                height="80"
                width="80"
                radius="9"
                color="#e94f37"
                ariaLabel="three-dots-loading"
                wrapperStyle
                wrapperClass
              />
            </div>
          )}
          <div className="row">
            <div className="col-lg-6 col-10 mx-auto">
              <form className="custom-form ticket-form mb-5 mb-lg-0" onSubmit={handleForgotPassword}>
                <h2 className="text-center mb-4">Forgot Password</h2>
                <div className="ticket-form-body">
                  <div className="row">
                    <h6>Enter your email</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Cập nhật email trong state
                        required // Thêm thuộc tính required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">
                      Next
                    </button>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 80 }}>
                    <span className="text-center">
                      Did you remember your password?
                      <Link to={'/login'}><b> Sign in now.</b></Link>
                    </span>
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

export default ForgotPassword;
