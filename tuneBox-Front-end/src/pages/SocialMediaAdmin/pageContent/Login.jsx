import React from "react";
import { images } from "../../../assets/images/images";

const LoginS_ADMIN = () => {
  return (
    <div>
      <section className="d-flex align-items-center vh-100">
        <div className="container">
          <div className="row justify-content-center">
            {/* content left */}
            <div className="col-lg-6 d-none d-lg-block h-100">
              <img
                src={images.adminImage}
                className="img-fluid h-100 w-100"
                style={{ objectFit: "cover" }}
                alt="Login Image"
              />
            </div>
            {/* content right */}
            <div className="col-lg-6 col-md-8">
              <div className="text-center mb-4">
                <img
                  src={images.adminImage}
                  alt="Logo"
                  className="img-fluid mb-3"
                  width={250}
                />
              </div>
              {/* Form */}
              <div className="p-4 shadow-lg rounded bg-white">
                <form action>
                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="d-flex justify-content-end mb-4">
                    <a href="#" className="text-decoration-none">
                      Forgot password?
                    </a>
                  </div>
                  <button
                    className="btn btn-primary w-100 mb-3"
                    type="submit"
                    style={{ backgroundColor: "#e94f37" }}
                  >
                    <strong>LOGIN</strong>
                  </button>
                  <div className="text-center mb-3">
                    <hr />
                    <span>OR</span>
                  </div>
                  <div className="d-flex justify-content-center gap-2">
                    <a
                      href="#"
                      className="btn btn-primary rounded-circle"
                      style={{
                        backgroundColor: "#425892",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <i className="fab fa-facebook-f" />
                    </a>
                    <a
                      href="#"
                      className="btn btn-danger rounded-circle "
                      style={{
                        backgroundColor: "#dd4e40",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <i className="fab fa-google" />
                    </a>
                  </div>
                </form>
              </div>
              <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <a href="#" className="text-decoration-none">
                    Register
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginS_ADMIN;
