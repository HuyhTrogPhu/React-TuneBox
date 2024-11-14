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
                    {t('home')}
                  </Link>
                </li>
                <li className="site-footer-link-item">
                  <Link to={'/shop'} className='site-footer-link fontchu text-white'>
                    {t('services')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0" id="lienhe">
              <h5 className="site-footer-title mb-3 text-white">{t('contact_us')}</h5>
              <p className="text-white d-flex mb-1">
                <Link to={'email'} className="site-footer-link text-white">{t('via_email')}</Link>
              </p>
              <p className="text-white d-flex">
                <Link to={'/bachdangsu.site'} className="site-footer-link text-white">
                  {t('email_address')}
                </Link>
              </p>
            </div>
          </div>
          {/* Ngôn ngữ */}
          <div className="language-switcher mt-4">
            <button onClick={() => handleLanguageChange('en')} disabled={language === 'en'}>
              English
            </button>
            <button onClick={() => handleLanguageChange('vi')} disabled={language === 'vi'}>
              Tiếng Việt
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer2;
