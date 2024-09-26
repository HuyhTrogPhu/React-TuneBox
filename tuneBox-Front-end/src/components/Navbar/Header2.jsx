import React from 'react'
import { images } from '../../assets/images/images'

import '../../pages/GioiThieu/css/style.css';

const Header2 = () => {
  return (
    <div> 
      <div className='sticky-wrapper'>
      <nav className="navbar navbar-expand-lg">
  <div className="container">
    <a className="fontlogo" href="/gioithieu">
      <img src={images.logoTuneBox} alt width="100px" />
    </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav align-items-lg-center ms-auto me-lg-5">
        <li className="nav-item">
          <a className="nav-link  text-white" href="/login">Đăng nhập</a>
        </li>
      </ul>
      <a href="/signup" className="btn custom-btn d-lg-block d-none">Đăng kí</a>
    </div>
  </div>
</nav>

      </div>

    </div>
  )
}

export default Header2