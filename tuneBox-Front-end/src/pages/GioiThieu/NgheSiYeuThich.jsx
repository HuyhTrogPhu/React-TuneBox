import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { fetchDataNgheSi } from "./js/sothich.js";
import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
const NgheSiYeuThich = ({ updateFormData }) => {
  const navigate = useNavigate();
  const [talentData, setTalentData] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]); 

  useEffect(() => {
    const fetchDataAndRender = async () => {
      const response = await fetchDataNgheSi(); // Fetch từ API
      console.log("Data fetched from API:", response);
      if (response && response.data) {
        setTalentData(response.data); // Chỉ cập nhật mảng `data`
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

  const handleSubmit = () => {
    updateFormData({ listInspiredBy: selectedArtists }); 
    navigate("/categorymusic"); 
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

        <section className="ticket-section section-padding">
          <div className="section-overlay" />
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-10 mx-auto">
                <div className="form-container fontchu">
                  <h3>Nghệ sĩ mà bạn yêu thích là ai?</h3>
                  <p>
                    Cho dù bạn là nhạc sĩ hay người hâm mộ, chúng tôi đều muốn
                    nghe ý kiến của bạn. Giới thiệu bản thân và giúp chúng tôi
                    cải thiện trải nghiệm TuneBox của bạn.
                  </p>
                  <input
                    type="text"
                    placeholder="Tìm kiếm nghệ sĩ..."
                    className="search-bar"
                  />
                  <div className="row text-center">
                    {talentData.map((talent) => (
                      <div className="col-4" key={talent.id}>
                        <button
                          className={`btn-category ${
                             selectedArtists.includes(talent.name) ? 'btn-primary text-light' : 'btn-light text-dark'
                          }`}
                          onClick={() => handleArtistSelect(talent.name)}
                        >
                          {talent.name}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSubmit}>Tiếp tục</button>
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

export default NgheSiYeuThich;
