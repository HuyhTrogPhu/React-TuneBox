import React from "react";
import "./css/bootstrap.min.css";
import "./css/bootstrap-icons.css";
// import './css/style.css';
import "./css/header.css";
import "./css/profile.css";

import "./js/jquery.min.js";
import "./js/bootstrap.min.js";
import "./js/jquery.sticky.js";
import "./js/click-scroll.js";
import "./js/custom.js";
import "./js/sothich.js";

import Header2 from "../../components/Navbar/Header2.jsx";
import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-country-flag";

const GioiThieu = () => {
  const { t, i18n } = useTranslation(); 

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };  return (
    <div>
      <Header2 />
      <div>
        <div className="language-switcher">
          <button onClick={() => changeLanguage("en")}>
            <ReactCountryFlag countryCode="US" svg />
          </button>
          <button onClick={() => changeLanguage("vi")}>
            <ReactCountryFlag countryCode="VN" svg />
          </button>
        </div>
        <section className="hero-section" id="section_1">
          <div className="section-overlay" />
          <div className="container d-flex justify-content-center align-items-center">
            <div className="row">
              <div className="col-lg-6 col-12 mb-4 mb-lg-0 d-flex align-items-center">
                <div className="services-info">
                  <h2 className="text-white mb-4">{t("hero_title")}</h2>
                  <p className="text-white fontchu">{t("hero_description")}</p>
                  <p className="text-white">
                    <a className="btn custom-btn smoothscroll" href="/signup">{t("hero_button")}</a>
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="about-text-wrap">
                  <img src={images.casi} className="about-image img-fluid" style={{width: 500, marginTop: 150}} alt="casi" />
                </div>
              </div>
            </div>
          </div>
          <div className="video-wrap">
            <video autoPlay loop muted className="custom-video" poster={images.backg}>
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
        <section className="about-section section-padding" id="section_2">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center" style={{marginTop: 30}}>
                <h2 className=" mb-4 fontchu">{t("about_title")}</h2>
                <p className="fontchu ">{t("about_description")}</p>
              </div>
            </div>
            <div className="row">
              <img src={images.nen4} alt="nen4" className="about-image img-fluid" style={{width: "100%"}} />
            </div>
          </div>
        </section>
        <section className="schedule-section section-padding" id="section_4">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h2 className="text-white mb-4">{t("music_for_all")}</h2>
                <img src={images.nen3} alt="nen3" className="about-image img-fluid" style={{width: "100%"}} />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer2 />
    </div>
  );
};

export default GioiThieu;
