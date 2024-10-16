import React from 'react'
import { images } from '../../assets/images/images'

import '../../pages/GioiThieu/css/style.css';
import { Link } from 'react-router-dom';

const Header2 = () => {
  return (
    <div>
      <div className='sticky-wrapper'>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link to={'/introduce'} className="fontlogo">
              <img src={images.logoTuneBox} alt='logo' width="100px" />
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav align-items-lg-center ms-auto me-lg-5">
                <li className="nav-item">
                  <Link to={'/login'} className="nav-link  text-white">Đăng nhập</Link>
                </li>
              </ul>
              <Link to={'/register'} className="btn custom-btn d-lg-block d-none">Đăng ký</Link>
            </div>
          </div>
        </nav>

      </div>

    </div>
  )
}

export default Header2