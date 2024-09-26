import React from 'react'
import { images } from '../../assets/images/images'

const Footer2 = () => {
  return (
    <div>
<footer className="site-footer" id="section_7">
  <div className="site-footer-top">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-12">
          <img src={images.logoMautrang} alt='tunebox' width="200px" />
        </div>
      </div>
    </div>
  </div>
  <div className="container">
    <div className="row">
      <div className="col-lg-6 col-12 mb-4 pb-2">
        <ul className="site-footer-links">
          <li className="site-footer-link-item">
            <a href="/index.html" className="site-footer-link fontchu text-white">Trang chủ</a>
          </li>
          <li className="site-footer-link-item">
            <a href className="site-footer-link fontchu text-white">Dịch vụ</a>
          </li>
          <li className="site-footer-link-item">
            <a href className="site-footer-link fontchu text-white">Tài nguyên</a>
          </li>
          <li className="site-footer-link-item">
            <a href className="site-footer-link fontchu text-white">Góp ý</a>
          </li>
          <li className="site-footer-link-item">
            <a href className="site-footer-link fontchu text-white">Giới thiệu</a>
          </li>
        </ul>
      </div>
      <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0" id="lienhe">
        <h5 className="site-footer-title mb-3 text-white">Liên hệ với chúng tôi</h5>
        <p className="text-white d-flex mb-1">
          <a href="tel: 090-080-0760" className="site-footer-link text-white">
            Thông qua Email:
          </a>
        </p>
        <p className="text-white d-flex">
          <a href="mailto:hello@company.com" className="site-footer-link text-white">
            bachdangsu@gmail.com
          </a>
        </p>
      </div>
    </div>
  </div>
</footer>

    </div>
  )
}

export default Footer2