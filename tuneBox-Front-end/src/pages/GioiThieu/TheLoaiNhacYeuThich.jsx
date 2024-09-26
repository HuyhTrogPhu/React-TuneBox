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
import Footer2 from '../../components/Footer/Footer2.jsx';
import { images } from '../../assets/images/images.js';
const TheLoaiNhacYeuThich = () => {
    return (
        <div>
    <div>
        <div className='sticky-wrapper'>
        <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="fontlogo" href="index.html">
            <img src={images.logoTuneBox} alt='logo' width="100px" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </nav>
        </div>
    
      <section className="ticket-section section-padding">
        <div className="section-overlay" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-10 mx-auto">
              <div className="form-container fontchu">
                <h3>Bạn yêu thích thể loại nhạc nào?</h3>
                <p>Cho dù bạn là nhạc sĩ hay người hâm mộ, chúng tôi đều muốn nghe ý kiến của bạn. Giới thiệu bản thân và giúp chúng tôi cải thiện trải nghiệm TuneBox của bạn.</p>
                <input 
                type="text" 
                placeholder="Tìm kiếm thể loại nhạc" 
                className="search-bar"
              />
                <div className="row text-center">
                  <div className="col-4">
                    <button className="btn-category">Rock</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Drummer</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Vocalist</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Songwriter</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Producer</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">DJ</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Keyboardist</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Drummer</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Vocalist</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Songwriter</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Producer</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">DJ</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Keyboardist</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Drummer</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Vocalist</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Songwriter</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">Producer</button>
                  </div>
                  <div className="col-4">
                    <button className="btn-category">DJ</button>
                  </div>
                  
    
    
                </div>
                <button>Tiếp tục</button>
              </div>
            </div>
          </div>
        </div></section>
    </div>
    <Footer2 />
        </div>
      )
}

export default TheLoaiNhacYeuThich