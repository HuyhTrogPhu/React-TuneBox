import React from 'react'
import './css/bootstrap.min.css';
import './css/bootstrap-icons.css';
import './css/style.css';
import './css/header.css';
import './css/profile.css';

import './js/jquery.min.js';
import './js/bootstrap.min.js';
import './js/jquery.sticky.js';
import './js/click-scroll.js';
import './js/custom.js';
import './js/sothich.js'



import Header2 from '../../components/Navbar/Header2.jsx';
import Footer2 from '../../components/Footer/Footer2.jsx';
import { images } from '../../assets/images/images.js';
const Login = () => {
  return (
    <div>
      <Header2 />
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-10 mx-auto">
              <form className="custom-form ticket-form mb-5 mb-lg-0" action="#" method="post" role="form">
                <h2 className="text-center mb-4">Đăng nhập</h2>
                <div className="ticket-form-body">
                  <div className="row">
                    <h6>Tên đăng nhập hoặc email</h6>
                    <div className="col-lg-12 " style={{ marginTop: -30 }}>
                      <input type="text" name="name" id="name" className="form-control" placeholder="Nhập tên đăng nhập hoặc email" required />
                    </div>
                  </div>
                  <div className="row " style={{ marginTop: -30 }}>
                    <h6>Mật khẩu</h6>
                    <div className="col-lg-12" style={{ marginTop: -30 }}>
                      <input type="password" className="form-control" name="password" placeholder="Nhập mật khẩu" required />
                    </div>
                  </div>


                  <div className="col-lg-4 col-md-10 col-8 mx-auto">
                    <button type="submit" className="form-control">Đăng nhập</button>
                  </div>
                  <div className="col-lg-4 col-md-10 col-8 mx-auto" style={{ marginTop: 20, paddingLeft: 20 }}>
                    <span className="text-center">Hoặc tiếp tục với</span>
                  </div>
                  <style dangerouslySetInnerHTML={{ __html: "\n                                            .image-container {\n                                                display: flex;\n                                                justify-content: center;\n                                            }\n                                            .image-container img {\n                                                margin: 0 40px; /* Thay đổi giá trị 10px thành khoảng cách bạn muốn */\n                                            }\n                                        " }} />
                  <div className="row d-flex justify-content-center" style={{ marginTop: 20 }}>
                    <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center image-container">
                      <div>
                        <a href> <img src={images.google} alt='icon-google' width="65px" height="65px" /></a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 text-center  mx-auto" style={{ marginTop: 80 }}>
                    <span className="text-center">Bạn chưa có tài khoản? <a href><b>Đăng kí ngay.</b></a></span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div></section>
      <Footer2 />
    </div>
  )
}

export default Login