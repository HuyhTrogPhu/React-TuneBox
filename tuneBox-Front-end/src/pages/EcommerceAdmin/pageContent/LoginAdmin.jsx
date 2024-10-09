import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
const LoginAdmin = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 
  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const loginData = {
      email: userName,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8082/e-comAdmin/account/log-in",
        loginData
      );
      if (response.data.status) {
        console.log(response.data.data);
        Cookies.set("TokenADMIN", response.data.data.id, { expires: 7 });
        navigate("/ecomadmin");
      } else {
        // Nếu API trả về status là false nhưng không có lỗi http
        setErrorMessage(response.data.message || "Đăng nhập không thành công");
      }
    } catch (error) {
      if (error.response) {
        // lỗi server (400, 500)
        setErrorMessage(error.response.data.message || "Đã xảy ra lỗi");
      } else if (error.request) {
        //hông có phản hồi
        setErrorMessage("Không thể kết nối đến server");
      } else {
        // Lỗi khác
        setErrorMessage("Đã xảy ra lỗi không xác định");
      }
    }
  };

  return (
    <div
      className="container-fluid vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#1E1E1E" }}
    >
      <div className="row w-100">
        <div className="col-md-6 d-none d-md-block">
          {/* Placeholder for image */}
          <div className="h-100 d-flex justify-content-center align-items-center">
            <div
              className="image-placeholder"
              style={{
                width: "80%",
                height: "auto",
                backgroundColor: "#333",
                borderRadius: "10px",
              }}
            >
              {/* Add your image here */}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            {/* Placeholder for logo */}
            <div className="text-center mb-4">
              <h2 className="text-danger">TuneBOX</h2>
            </div>

            <form
              className="custom-form ticket-form mb-5 mb-lg-0"
              onSubmit={handleLogin}
            >
              <div className="form-group mb-3">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-between">
                <a href="#" className="text-muted">
                  Forgot password?
                </a>
              </div>
              <button type="submit" className="btn btn-danger w-100 mt-3">
                Login
              </button>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
