import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/bootstrap.min.css";
import "./css/bootstrap-icons.css";
import "./css/style.css";
import "./css/header.css";
import "./css/profile.css";
import './css/InspiredBy.css';

import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
import { listInspiredBys } from "../../service/LoginService.js";
import { Link } from "react-router-dom";

const InspiredBy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const [inspiredBy, setInspiredBy] = useState([]);
  const [selectInspiredBy, setSelectInspiredBy] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy formData từ state
  const formData = location.state || {};
  console.log("Form data from UserInformation:", formData);

  const fetchInspiredBy = async () => {
    try {
      const response = await listInspiredBys();
      setInspiredBy(response.data);
    } catch (error) {
      console.log("Error fetching inspiredBy", error);
    }
  };

  // Xử lý tìm kiếm inspiredBy theo tên
  const filteredInspiredBy = inspiredBy.filter((ins) =>
    ins.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInspiredByClick = (id) => {
    setSelectInspiredBy((prev) => {
      if (prev.includes(id)) {
        return prev.filter((inspiredId) => inspiredId !== id); // Xóa ID nếu đã được chọn
      } else {
        return [...prev, id]; // Thêm ID nếu chưa được chọn
      }
    });
  };

  useEffect(() => {
    fetchInspiredBy();
  }, []);

  // Cập nhật formData khi selectInspiredBy thay đổi
  const handleNext = () => {

    if (selectInspiredBy.length === 0) {
      setError("Please select at least one inspireBy")
      return;
    }

    setError("");

    formData.inspiredBys = selectInspiredBy; // Cập nhật inspiredBys
    navigate('/talent', { state: formData }); // Chuyển đến trang talent với formData
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
                  <h3>Who is your favorite artist?</h3>
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
                    onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
                  />
                  <div className="row text-center">
                    {filteredInspiredBy.map((ins) => (
                      <div className="col-4" key={ins.id}>
                        <button
                          className={`inspired-by-button ${selectInspiredBy.includes(ins.id)
                            ? "selected"
                            : ""
                            }`}
                          onClick={() => handleInspiredByClick(ins.id)} // Chọn/bỏ chọn inspiredBy
                        >
                          {ins.name}
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

export default InspiredBy;

