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
import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
import { listGenres } from "../../service/LoginService.js";
import { Link } from "react-router-dom";


const Genre = () => {
  const navigate = useNavigate();
  const [genre, setGenre] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);

  const fetchGenre = async () => {
    try {
      const response = await listGenres();
      setGenre(response.data);
    } catch (error) {
      console.log("Error fetching genre", error);
    }
  }

  useEffect(() => {
    fetchGenre();
  }, []);


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
                  <h3>Bạn yêu thích thể loại nhạc nào?</h3>
                  <p>
                    Cho dù bạn là nhạc sĩ hay người hâm mộ, chúng tôi đều muốn
                    nghe ý kiến của bạn. Giới thiệu bản thân và giúp chúng tôi
                    cải thiện trải nghiệm TuneBox của bạn.
                  </p>
                  <input
                    type="text"
                    placeholder="Tìm kiếm thể loại nhạc"
                    className="search-bar"
                  />
                  <div className="row text-center">
                    {genre.map((genre) => (
                      <div className="col-4" key={genre.id}>
                        <button
                          className=''
                        >
                          {genre.name}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button>
                    <Link to={'/welcome'}>Tiếp tục</Link>
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
