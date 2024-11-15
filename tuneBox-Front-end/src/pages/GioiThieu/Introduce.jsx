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



import Header2 from '../../components/Navbar/Header2.jsx';
import Footer2 from '../../components/Footer/Footer2.jsx';
import { images } from '../../assets/images/images.js';

import { Link } from 'react-router-dom';

const Introduce = () => {
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
                  <h2 className="text-white mb-4">Explore the unlimited world of music</h2>
                  <p className="text-white fontchu">At TuneBox, you can share, discover and enjoy your favorite music, as well as create personal playlists according to your preferences.</p>
                  <p className="text-white">
                    <Link to={'/login'} className="btn custom-btn smoothscroll">Started</Link>
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="about-text-wrap">
                  <img src={images.casi} className="about-image img-fluid" style={{ width: 500, marginTop: 150 }} alt='casi' />
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
              <div className="col-12 text-center" style={{ marginTop: 30 }}>
                <h2 className=" mb-4 fontchu">Create and share music</h2>
                <p className="fontchu ">With a diverse community and rich interactive features, TuneBox gives you a great music experience and space to express your own musical personality.</p>
              </div>
            </div>
            <div className="row">
              <img src={images.nen4} alt='nen4' className='' style={{ width: '100%' }} />
            </div>
          </div>
        </section>
        <section className="schedule-section section-padding" id="section_4">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h2 className="text-white mb-4">Music comes to everyone</h2>
                <div className="table-responsive">
                  <img src={images.nen3} alt='nen3' className="about-image img-fluid" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer2 />
    </div>
  )
}

export default Introduce