import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng
import Swal from 'sweetalert2'; // Nhập SweetAlert2
import Footer2 from '../../components/Footer/Footer2';
import Header2 from '../../components/Navbar/Header2';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Lấy token từ URL
  const navigate = useNavigate(); // Khai báo useNavigate

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form
  
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: "Invalid token",
      });
      return;
    }
  
    if (!newPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: "New password cannot be blank.",
      });
      return;
    }
  
    try {
  
      const response = await axios.post(`http://localhost:8080/user/reset-password?token=${token}&newPassword=${newPassword}`);

      // Kiểm tra phản hồi từ server
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: "Password has been changed successfully! Please log in.",
        }).then(() => {
          navigate('/login'); // Điều hướng về trang đăng nhập
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "An error occurred while changing the password.",
        });
      }
    } catch (error) {
      if (error.response) {
        console.log("Error response:", error.response); // Log chi tiết
        console.log("Error data:", error.response.data); // Log dữ liệu lỗi
        const errorMessage = error.response.data.message || "An unknown error has occurred.";
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
    }
  };
  

  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-10 mx-auto">
              <form className="custom-form ticket-form mb-5 mb-lg-0" onSubmit={handleResetPassword}>
                <h2 className="text-center mb-4">Reset Password</h2>
                <div className="ticket-form-body">
                  <div className="row">
                    <h6>Enter a new password</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-control"
                        placeholder="New Password"
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

export default ResetPassword;
