import React from 'react'
import './css/bootstrap.min.css';
import './css/bootstrap-icons.css';
// import './css/style.css';
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
const GioiThieu = () => {
  return (
    <div>
    <Header2 />
<div>
  <section className="hero-section" id="section_1">
    <div className="section-overlay" />
    <div className="container d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="col-lg-6 col-12 mb-4 mb-lg-0 d-flex align-items-center">
          <div className="services-info">
            <h2 className="text-white mb-4">Khám phá thế giới âm nhạc không giới hạn</h2>
            <p className="text-white fontchu">Tại TuneBox, bạn có thể chia sẻ, khám phá và thưởng thức những bản nhạc yêu thích, cũng như tạo nên những playlist cá nhân theo sở thích.</p>
            <p className="text-white">   <a className="btn custom-btn smoothscroll" href="/signup">Bắt đầu</a></p>
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <div className="about-text-wrap">
            <img src={images.casi}className="about-image img-fluid" style={{width: 500, marginTop: 150}} alt='casi' />
          </div>
        </div>
      </div>
    </div>
    <div className="video-wrap">
      <video autoPlay loop muted className="custom-video" poster={images.backg}>
        {/* Nội dung trong video không nên chứa thẻ <img> */}
        Your browser does not support the video tag.
      </video>
    </div>
  </section>
  <section className="about-section section-padding" id="section_2">
    <div className="container">
      <div className="row">
        <div className="col-12 text-center" style={{marginTop: 30}}>
          <h2 className=" mb-4 fontchu">Sáng tạo và chia sẽ âm nhạc</h2>
          <p className="fontchu ">Với cộng đồng đa dạng và tính năng tương tác phong phú, TuneBox mang đến cho bạn một trải nghiệm âm nhạc tuyệt vời và không gian để thể hiện cá tính âm nhạc của riêng bạn.</p>
        </div>
      </div>
      <div className="row">
        <img src={images.nen4} alt='nen4' className style={{width: '100%'}} />
      </div>
    </div>
  </section>
  <section className="schedule-section section-padding" id="section_4">
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <h2 className="text-white mb-4">Âm nhạc đến với mọi người</h2>
          <div className="table-responsive">
            <img src={images.nen3} alt='nen3' className="about-image img-fluid" style={{width: '100%'}} />
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
<Footer2/>
    </div>
  )
}

export default GioiThieu