import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/bootstrap.min.css";
import "./css/bootstrap-icons.css";
import "./css/style.css";
import "./css/header.css";
import "./css/profile.css";
import "./css/Genre.css";
import "./js/jquery.min.js";
import "./js/bootstrap.min.js";
import "./js/jquery.sticky.js";
import "./js/click-scroll.js";
import "./js/custom.js";
import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
import { listGenres } from "../../service/LoginService.js";

const Genre = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [genre, setGenre] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchGenre = async () => {
    try {
      const response = await listGenres();
      console.log("Fetched genres:", response.data); // Kiểm tra dữ liệu
      setGenre(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching genre", error);
    }
  };


  useEffect(() => {
    fetchGenre();
  }, []);

  // Xử lý tìm kiếm thể loại
  const filteredGenres = genre.filter((g) =>
    g.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleGenreClick = (id) => {
    setSelectedGenre((prev) => {
      if (prev.includes(id)) {
        return prev.filter((genreId) => genreId !== id); // Xóa ID nếu đã được chọn
      } else {
        return [...prev, id]; // Thêm ID nếu chưa được chọn
      }
    });
  };

  const handleNext = () => {

    if (selectedGenre.length === 0) {
      setError("Please select at least one genre.");
      return;
    }

    setError("");


    const formData = location.state || {};
    formData.genres = selectedGenre; // Cập nhật genres
    navigate('/welcome', { state: formData }); // Chuyển đến trang welcome với formData
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
                  <h3>What genre of music do you love?</h3>
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
                    {filteredGenres.map((g) => (
                      <div className="col-4" key={g.id}>
                        <button
                          className={`genre-button ${selectedGenre.includes(g.id) ? 'selected' : ''}`}
                          onClick={() => handleGenreClick(g.id)}
                        >
                          {g.name}
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

export default Genre;
