import React from 'react'
import { images } from '../../assets/images/images'
import { Link } from 'react-router-dom'

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
            <Link to={'/'} className='site-footer-link fontchu text-white'>Home</Link>
          </li>
          <li className="site-footer-link-item">
            <Link to={'/shop'} className='site-footer-link fontchu text-white'>Shop</Link>
          </li>
          
        </ul>
      </div>
      <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0" id="lienhe">
        <h5 className="site-footer-title mb-3 text-white">Liên hệ với chúng tôi</h5>
        <p className="text-white d-flex mb-1">
          <Link to={'email'} className="site-footer-link text-white">Email:</Link>
        </p>
        <p className="text-white d-flex">
          <Link to={'/bachdangsu.site'} className="site-footer-link text-white">bachdangsu@gmail.com</Link>
        </p>
      </div>
    </div>
  </div>
</footer>

    </div>
  )
}

export default Footer2