import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkSignup } from "./js/sothich.js";
import Header2 from "../../components/Navbar/Header2.jsx";
import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";

const SignUp = ({ updateFormData }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State để lưu thông báo lỗi

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage(""); // Clear previous error message

    const formData = {
      userDto: {
        userName,
        email,
        password,
      },
    };

    try {
      // Gửi dữ liệu đến API để kiểm tra email và username
      await checkSignup(formData);

      // Nếu không có lỗi, cập nhật form và chuyển hướng
      updateFormData({ userName, email, password });
      navigate("/createUsername"); // Chuyển trang nếu không có lỗi
    } catch (error) {
      // Xử lý lỗi khi email hoặc username đã tồn tại
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data|| "email hoặc username đã tồn tại");
      } else {
        setErrorMessage("Không thể kết nối đến server.");
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
              <form className="custom-form ticket-form mb-5 mb-lg-0" onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">Tạo tài khoản</h2>
                <div className="ticket-form-body">
                  <div className="row">
                    <h6>Tên tài khoản</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        placeholder="Nhập tên"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: -30 }}>
                    <h6>Email</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Nhập địa chỉ email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        title="Vui lòng nhập một địa chỉ email hợp lệ"
                        required
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
                        value={password}
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Hiển thị thông báo lỗi */}
                  {errorMessage && (
                    <div className="alert alert-danger" style={{ marginTop: 20 }}>
                      {errorMessage}
                    </div>
                  )}

                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">Đăng kí</button>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto" style={{ marginTop: 20, paddingLeft: 20 }}>
                    <span className="text-center">Hoặc tiếp tục với</span>
                  </div>
                  <div className="row d-flex justify-content-center" style={{ marginTop: 20 }}>
                    <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center image-container">
                      <div>
                        <img src={images.google} alt="google" width="65px" height="65px" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 20 }}>
                    <span className="text-center">
                      Bằng cách tiếp tục tạo tài khoản bạn đã đồng ý với các điều khoản của TuneBox.
                    </span>
                  </div>
                  <div className="col-lg-8 text-center mx-auto" style={{ marginTop: 80 }}>
                    <span className="text-center">
                      Bạn đã có tài khoản?{" "}
                      <a href="/login"><b>Đăng nhập ngay.</b></a>
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

export default SignUp;