// Footer2.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { images } from '../../assets/images/images';
import { Link } from 'react-router-dom';

const Footer2 = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en'); // Ngôn ngữ mặc định là tiếng Việt

  // Hàm thay đổi ngôn ngữ
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

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
                  <Link to={'/'} className='site-footer-link fontchu text-white'>
                    {t('Home')}
                  </Link>
                </li>
                <li className="site-footer-link-item">
                  <Link to={'/shop'} className='site-footer-link fontchu text-white'>
                    {t('Shop')}
                  </Link>
                </li>
                <li className="site-footer-link-item">
                  <Link to={'/profileUser/*'} className='site-footer-link fontchu text-white'>
                    {t('Profile')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0" id="lienhe">
              <h5 className="site-footer-title mb-3 text-white">{t('Contact us')}</h5>
              <p className="text-white d-flex mb-1">
                <Link to="mailto:tuneboxvietnam@gmail.com" className="site-footer-link text-white">
                  {t('Email: tuneboxvietnam@gmail.com')} 
                </Link>
              </p>
              <p className="text-white d-flex mb-1 mt-4">
                <Link to="mailto:tuneboxvietnam@gmail.com" style={{fontSize:'15px'}} className="site-footer-link text-white">
                  {t('Address: QTSC 9 Building, Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam')}
                </Link>
              </p>
            </div>

          </div>
          {/* Ngôn ngữ */}
          <div className="language-switcher mt-5">
            <button onClick={() => handleLanguageChange('en')} disabled={language === 'en'}>
              <p style={{ color: 'white' }}>English</p>
            </button>
            <button onClick={() => handleLanguageChange('vi')} disabled={language === 'vi'}>
              <p style={{ color: 'white' }}>Tiếng Việt</p>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer2;
