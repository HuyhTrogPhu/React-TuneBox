import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./css/bootstrap.min.css";
import "./css/bootstrap-icons.css";
import "./css/style.css";
import "./css/header.css";
import "./css/profile.css";

import "./js/jquery.min.js";
import "./js/bootstrap.min.js";
import "./js/jquery.sticky.js";
import "./js/click-scroll.js";
import "./js/custom.js";
import "./js/sothich.js";

import { fetchDataSoThich } from "./js/sothich.js";
import { saveToLocalStorage } from "./js/sothich.js";
import { sendDataToAPI } from "./js/sothich.js";
import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";

import { useTranslation } from 'react-i18next';

import i18n from "../../i18n/i18n.js";

import ReactCountryFlag from "react-country-flag";

const SoThich = ({ updateFormData, formData }) => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const [talentData, setTalentData] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  useEffect(() => {
    const fetchDataAndRender = async () => {
      const response = await fetchDataSoThich();
      console.log("Data fetched from API:", response);
      if (response && response.data) {
        setTalentData(response.data);
      }
    };

    fetchDataAndRender();
  }, []);

  const handleArtistSelect = (artist) => {
    setSelectedArtists((prevSelectedArtists) => {
      if (prevSelectedArtists.includes(artist)) {
        return prevSelectedArtists.filter(item => item !== artist); 
      } else {
        return [...prevSelectedArtists, artist]; 
      }
    });
  };
  
  const handleSubmit = async () => {
    const updatedFormData = { ...formData, listTalent: selectedArtists };
    saveToLocalStorage(updatedFormData); 
    await sendDataToAPI(updatedFormData);
    navigate("/");
  };


  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Hàm thay đổi ngôn ngữ
  };

  return (
    <div>
      <div>
        <div className="sticky-wrapper">
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <a className="fontlogo" href="index.html">
                <img src={images.logoTuneBox} alt="logo" width="100px" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
            </div>
          </nav>
        </div>

        <div className="language-switcher">
          <button onClick={() => changeLanguage("en")}>
            <ReactCountryFlag countryCode="US" svg />
          </button>
          <button onClick={() => changeLanguage("vi")}>
            <ReactCountryFlag countryCode="VN" svg />
          </button>
        </div>

        <section className="ticket-section section-padding">
          <div className="section-overlay" />
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-10 mx-auto">
                <div className="form-container fontchu">
                <h3>{t("talent_title")}</h3>
                <p>{t("talent_description")}</p>
                  <input
                    type="text"
                    placeholder={t("search_talent_placeholder")}
                    className="search-bar"
                  />
                  <div className="row text-center">
                    {talentData.map((talent) => (
                      <div className="col-4" key={talent.id}>
                        <button
                          className={` ${
                            selectedArtists.includes(talent.name) ? 'btn-primary text-light' : 'btn-light text-dark'
                          }`}
                          onClick={() => handleArtistSelect(talent.name)}
                        >
                          {talent.name}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSubmit}>{t("continue")}</button>
                  </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer2 />
    </div>
  );
};

export default SoThich;
