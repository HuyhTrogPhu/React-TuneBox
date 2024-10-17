import React, { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { getAvatarUser } from "../../service/UserService";
import { logout } from "../../service/LoginService";
import { Link } from "react-router-dom";
import { createTrack, listGenre, getTrackByUserId } from "../../service/TrackServiceCus";

const Navbar = () => {
  const [newTrackName, setTrackName] = useState("");
  const [newTrackImage, setTrackImage] = useState(null);
  const [newTrackFile, setTrackFile] = useState(null);
  const [newTrackGenre, setTrackGenre] = useState("");
  const [newTrackDescription, setTrackDescription] = useState("");

  const [errors, setErrors] = useState({});
  const [genres, setGenre] = useState([]);

  const userId = Cookies.get("userId");
  if (!userId) {
    console.error("UserID không tồn tại trong cookies");
  }

  const getAllGenre = () => {
    listGenre()
      .then((response) => {
        setGenre(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Genre", error);
      });
  };

  const getALlTrack = () => {
    if (!userId) {
      console.error("UserID không được tìm thấy");
      return;
    }

    getTrackByUserId(userId) // Truyền userId vào đây
      .then((response) => {
        setGenre(response.data);
      })
      .catch((error) => {
        console.error("Error fetching track", error);
      });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newTrackName) newErrors.name = "Track name is required.";
    if (!newTrackImage) newErrors.image = "Track image is required.";
    if (!newTrackFile) newErrors.file = "Track file is required.";
    if (!newTrackGenre) newErrors.genre = "Track genre is required.";
    if (!newTrackDescription)
      newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const newTrack = new FormData();
    newTrack.append("name", newTrackName);
    newTrack.append("trackImage", newTrackImage);
    newTrack.append("trackFile", newTrackFile);
    newTrack.append("genre", newTrackGenre); // Hoặc newTrackGenre.id nếu cần
    newTrack.append("description", newTrackDescription);
    newTrack.append("status", false);
    newTrack.append("report", false);
    newTrack.append("user", userId);

    try {
      const response = await createTrack(newTrack);
      console.log("Track created:", response.data);
      document.getElementById("closeModal").click();

      getALlTrack();
      resetForm();
    } catch (error) {
      console.error("Error creating track:", error);
    }
  };

  useEffect(() => {
    getAllGenre();
  }, []);

  const resetForm = () => {
    setTrackName("");
    setTrackImage(null);
    setTrackFile(null);
    setTrackGenre("");
    setTrackDescription("");
    setErrors({});
  };

  const [cartCount, setCartCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(images.logoTuneBox); // Set avatar mặc định
  const [dropdownVisible, setDropdownVisible] = useState(false); // Trạng thái cho dropdown
  const navigate = useNavigate();

  // Lấy userId từ cookie và fetch avatar
  useEffect(() => {
    const userIdCookie = Cookies.get('userId');
    if (userIdCookie) {
      const fetchAvatar = async () => {
        try {
          const response = await getAvatarUser(userIdCookie);
          console.log("avatar:", response); // Kiểm tra đường dẫn avatar
          setAvatarUrl(response); // Set đường dẫn avatar
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      };
      fetchAvatar();
    }
  }, []);

  // Lấy số lượng sản phẩm trong giỏ hàng từ localStorage
  useEffect(() => {
    const fetchCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
    };

    fetchCartCount();
  }, []);

  // Hàm xử lý khi nhấn Logout
  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove('userId'); // Xóa cookie userId phía client
      setAvatarUrl(images.logoTuneBox);
      navigate('/introduce');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Điều hướng đến trang profile khi nhấn vào avatar
  const handleAvatarClick = () => {
    const userIdCookie = Cookies.get('userId');
    if (userIdCookie) {
      navigate('/profileUser');
    } else {
      navigate('/login');
    }
  };

  // Điều khiển hiển thị dropdown khi hover
  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };

  // Điều hướng giỏ hàng chỉ khi có userId
  const handleCartClick = () => {
    const userIdCookie = Cookies.get('userId');
    if (userIdCookie) {
      navigate('/Cart');
    } else {
      navigate('/login');
    }
  };

  return (
    <header
      className="row"
      style={{
        alignItems: "center",
      }}
    >
      {/* navbar left */}
      <div
        className="col"
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <button className="btn" onClick={() => navigate('/')}>
          <img
            alt="tunebox"
            src={images.logoTuneBox}
            style={{
              marginLeft: "50px",
              marginRight: "50px",
            }}
            width="150"
          />
        </button>
        {/* Trang feed */}
        <button className="btn" onClick={() => navigate('/')}>
          <span
            className="text-decoration-none"
            style={{
              marginRight: "30px",
            }}
          >
            <img
              alt="icon-home"
              src={images.home}
              style={{
                marginBottom: "15px",
                marginRight: "15px",
              }}
            />
            <b>Feed</b>
          </span>
        </button>
        {/* Trang bán hàng */}
        <button className="btn" onClick={() => navigate('/HomeEcommerce')}>
          <span>
            <img
              alt="icon-loa"
              src={images.speaker}
              style={{
                marginBottom: "15px",
                marginRight: "15px",
              }}
              width="35px"
            />
            <b>Shops</b>
          </span>
        </button>
      </div>

      {/* navbar right */}
      <div className="col d-flex text-end" style={{ alignItems: "center", }}>
        <span>
          <img
            alt="icon-chuong"
            src={images.notification}
            style={{ marginBottom: "15px", marginRight: "30px" }}
          />
        </span>
        <span>
          <img
            alt="icon-chat"
            src={images.conversstion}
            style={{ marginBottom: "15px", marginRight: "30px" }}
          />
        </span>
        <button
          className="btn btn-warning"
          style={{ marginBottom: "15px", marginRight: "20px" }}
          type="button"
        >
          <span>
            <b>Get</b>
          </span>
          <img
            alt="icon-crow"
            height="32px"
            src={images.crown}
            style={{ marginLeft: "10px" }}
            width="32px"
          />
        </button>
        {/* Trang cá nhân */}
        {/* Avatar */}
        {avatarUrl && (
          <div
            className="dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              alt="Avatar"
              className="avatar_small"
              src={avatarUrl}
              style={{ height: "50px", width: "50px", borderRadius: "50%", cursor: "pointer" }}
              onClick={handleAvatarClick} // Gọi hàm điều hướng khi nhấn vào avatar
            />
            {dropdownVisible && (
              <ul className="dropdown-menu show">
                <li>
                  <button onClick={handleLogout} className="dropdown-item">
                    Log-out
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}

        {/* Trang giỏ hàng */}
        <button className="btn position-relative" onClick={handleCartClick}>
          <span>
            <img
              alt="icon-giohang"
              src={images.shopping_bag}
              style={{
                marginBottom: "15px",
                marginRight: "10px",
              }}
            />
          </span>
          {/* Hiển thị badge nếu có sản phẩm trong giỏ hàng */}
          {cartCount > 0 && (
            <span className="badge text-bg-secondary">
              {cartCount}
            </span>
          )}
        </button>

        {/* Trang tạo track */}
        <button
          data-bs-toggle="modal"
          data-bs-target="#addTrackModal"
          className="btn btn-danger"
          style={{ marginBottom: "15px", marginRight: "10px" }}
          type="button"
        >
          <img
            alt="icon-plus"
            height="20px"
            src={images.plus_white}
            style={{ marginBottom: "3px", marginRight: "10px" }}
            width="20px"
          />
          <b>Create</b>
        </button>
      </div>
      <hr />

      {/* start modal add */}
      <div
        className="modal fade"
        id="addTrackModal"
        tabIndex="-1"
        aria-labelledby="addTrackModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addTrackModalLabel">
                Add Track
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <form action="" className="row">
                  <div className="mb-3">
                    <label className="form-label">Track Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""
                        }`}
                      value={newTrackName}
                      onChange={(e) => setTrackName(e.target.value)}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Image Track</label>
                    <input
                      type="file"
                      className={`form-control`}
                      accept="image/*" // Chỉ cho phép hình ảnh
                      onChange={(e) => setTrackImage(e.target.files[0])}
                    />
                    {errors.image && (
                      <div className="invalid-feedback">{errors.image}</div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">File Track</label>
                    <input
                      type="file"
                      className={`form-control`}
                      accept=".mp3" // Chỉ cho phép tải lên file MP3
                      onChange={(e) => setTrackFile(e.target.files[0])}
                    />
                    {errors.file && (
                      <div className="invalid-feedback">{errors.file}</div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Genre</label>
                    <select
                      className={`form-select ${errors.genre ? "is-invalid" : ""
                        }`}
                      value={newTrackGenre}
                      onChange={(e) => setTrackGenre(e.target.value)}
                    >
                      <option value="" disabled>
                        Select genre
                      </option>
                      {genres && genres.length > 0 ? (
                        genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No genres available</option>
                      )}
                    </select>
                    {errors.genre && (
                      <div className="invalid-feedback">{errors.genre}</div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Description</label>
                    <textarea
                      cols="50"
                      rows="5"
                      className={`form-control ${errors.description ? "is-invalid" : ""
                        }`}
                      value={newTrackDescription}
                      onChange={(e) => setTrackDescription(e.target.value)}
                    ></textarea>
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >
                  Save Track
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end modal add */}
    </header>
  );
};

export default Navbar;
