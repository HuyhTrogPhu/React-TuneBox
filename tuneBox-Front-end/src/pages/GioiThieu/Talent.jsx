import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


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
import './css/Talent.css';

import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
import { listTalents } from "../../service/LoginService.js";

const Talent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const [talentData, setTalentData] = useState([]);
  const [selectedTalent, setSelectedTalent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const formData = location.state || {};
  console.log("Form data from inspireby:", formData);

  const fetchTalent = async () => {
    try {
      const response = await listTalents();
      setTalentData(response.data);
    } catch (error) {
      console.log("Error fetching talent data", error);
    }
  };

  useEffect(() => {
    fetchTalent();
  }, []);

  // Xử lý tìm kiếm Talent theo tên
  const filteredTalent = talentData.filter((ta) =>
    ta.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTalentClick = (id) => {
    setSelectedTalent((prev) => {
      if (prev.includes(id)) {
        return prev.filter((talentId) => talentId !== id); // Xóa ID nếu đã được chọn
      } else {
        return [...prev, id]; // Thêm ID nếu chưa được chọn
      }
    });
  };

  const handleNext = () => {

    if (selectedTalent.length === 0) {
      setError("Please select at least one talent");
      return;
    }

    formData.talents = selectedTalent; // Cập nhật talents
    navigate('/genre', { state: formData }); // Chuyển đến trang genre với formData
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
                  <div className="text-center">
                    {error && (
                      <div style={{ marginTop: 10, color: 'red', textAlign: 'center' }}>
                        {error}
                      </div>
                    )}
                  </div>
                  <h3>What is your forte?</h3>
                  <p>
                    Whether you're a musician or a fan, we want it all
                    hear your opinion. Introduce yourself and help us
                    Improve your TuneBox experience.
                  </p>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="row text-center">
                    {filteredTalent.map((talent) => (
                      <div className="col-4" key={talent.id}>
                        <button
                          className={`talent-by-button ${selectedTalent.includes(talent.id)
                            ? "selected"
                            : ""
                            }`}
                          onClick={() => handleTalentClick(talent.id)}
                        >
                          {talent.name}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="btn"
                    style={{ backgroundColor: '#E94F37' }}
                    onClick={handleNext}>
                    Continue
                  </button>
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

export default Talent;

