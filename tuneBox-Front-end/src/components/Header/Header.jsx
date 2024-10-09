import React from 'react'
import './Header.css'
import { images } from '../../assets/images/images';

import i18n from "../../i18n/i18n.js";

import ReactCountryFlag from "react-country-flag";

import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Hàm thay đổi ngôn ngữ
  };
  return (
    <div className="topbar d-flex justify-content-end align-items-center p-3 bg-light border-bottom">
      <div className="dropdown">
        <a
          href="#"
          className="dropdown-toggle"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {t('user_name')}
          <img
            src={images.avt}
            className="rounded-pill ms-2"
            alt="User Image"
            style={{ width: 30, height: 30 }}
          />
        </a>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="userDropdown"
        >
          <li>
            <a className="dropdown-item" href="#">
            {t('profile')}
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
            {t('log_out')}
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header
