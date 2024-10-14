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


const WelcomeUser = () => {
  return (
    <div>
      <div>
        <div className='sticky-wrapper'>
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <Link to={'/welcome'} className='fontLogo'>
                <img src={images.logoTuneBox} alt='logo' width="100px" />
              </Link>

              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>

            </div>
          </nav>

        </div>

      </div>
      <div>
        <section className="hero-section" id="section_1">
          <div className="section-overlay" />
          <div className="container d-flex justify-content-center align-items-center">
            <div className="row">
              <div className="col-lg-6 col-12 mb-4 mb-lg-0 d-flex align-items-center">
                <div className="services-info">
                  <h2 className="text-white mb-4">Welcome </h2>
                  <p className="text-white fontchu">Start exploring unique musical ideas curated just for you. Connect with others through TuneBox. Join us in enjoying an amazing music space made just for you.</p>
                  <p className="text-white">
                    <Link to={'/'} className='btn custom-btn smoothscroll'>Get started now!</Link>
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


      </div>
      <Footer2 />
    </div>
  )
}

export default WelcomeUser