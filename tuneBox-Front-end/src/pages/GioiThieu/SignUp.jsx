import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header2 from "../../components/Navbar/Header2.jsx";
import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!userName.trim()) {
      return "Không được để trống tên người dùng";
    }

    if (!email.trim()) {
      return "Không được để trống email";
    }

    if (!password.trim()) {
      return "Không được để trống mật khẩu";
    }

    if (!emailPattern.test(email)) {
      return "Email không hợp lệ!";
    }
    if (password.length < 4) {
      return "Mật khẩu phải có ít nhất 4 ký tự!";
    }
    return "";
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = {
      userName: userName,
      email: email,
      password: password,
      name: null,
      avatar: null,
      inspiredBys: [],
      talents: [],
      genres: [],
    };

    navigate("/userInfor", { state: formData });
  };

  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-10 mx-auto">
              <form
                className="custom-form ticket-form mb-5 mb-lg-0"
                onSubmit={handleSignUp}
              >
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
                        placeholder="Nhập tên đăng nhập"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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

                  {/* Hiển thị thông báo lỗi */}
                  {error && (
                    <div
                      className="row"
                      style={{
                        marginTop: 10,
                        marginBottom: 10,
                        color: "red",
                        textAlign: "center",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">
                      Đăng kí
                    </button>
                  </div>
                  <div
                    className="col-lg-4 col-md-10 col-8 mx-auto"
                    style={{ marginTop: 20, paddingLeft: 20 }}
                  >
                    <span className="text-center">Hoặc tiếp tục với</span>
                  </div>
                  <div
                    className="row d-flex justify-content-center"
                    style={{ marginTop: 20 }}
                  >
                    <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center image-container">
                      <div>
                        <img
                          src={images.google}
                          alt="google"
                          width="65px"
                          height="65px"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-8 text-center mx-auto"
                    style={{ marginTop: 20 }}
                  >
                    <span className="text-center">
                      Bằng cách tiếp tục tạo tài khoản bạn đã đồng ý với các
                      điều khoản của TuneBox.
                    </span>
                  </div>
                  <div
                    className="col-lg-8 text-center mx-auto"
                    style={{ marginTop: 80 }}
                  >
                    <span className="text-center">
                      Bạn đã có tài khoản?
                      <Link to={"/login"}>
                        <b>Đăng nhập ngay.</b>
                      </Link>
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