import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer2 from "../../components/Footer/Footer2.jsx";
import { images } from "../../assets/images/images.js";
import { Link } from "react-router-dom";

const UserInformation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const [avatar, setAvatar] = useState(images.logoTuneBox);
  const [name, setName] = useState('');

  const formData = location.state || {}; // Lấy dữ liệu từ trang trước

  // console.log("Data register:", formData);

  // Hàm xử lý khi thay đổi ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result); // Cập nhật ảnh logo
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm mở hộp thoại chọn ảnh
  const handleLogoClick = () => {
    document.getElementById("logoInput").click();
  };

  const handleNext = () => {
    // Kiểm tra nếu ảnh đại diện không được chọn
    if (avatar === images.logoTuneBox || !avatar) {
      setError("Please select an avatar.");
      return;
    }

    // Kiểm tra nếu tên người dùng không được nhập
    if (!name.trim()) {
      setError("Please enter your username.");
      return;
    }

    // Xóa lỗi nếu có
    setError(null);
    // Cập nhật thêm thông tin người dùng
    formData.name = name;
    formData.avatar = avatar;
    navigate('/inspiredBy', { state: formData });
  };

  return (
    <div>
      <div>
        <section className="ticket-section section-padding">
          <div className="section-overlay" />
          <div className="container">
            <div className="row">
              <div className=''>
                <div className="d-flex justify-content-center align-items-center user">
                  <div className="overlay" />
                  <div className="profile-setup-card text-center p-4 rounded-3">
                    <div className="text-center">
                      {error && (
                        <div style={{ marginTop: 10, color: 'red', textAlign: 'center' }}>
                          {error}
                        </div>
                      )}
                    </div>
                    <h5 className="mb-4">Set username</h5>
                    <p className="text-muted mb-3 fontchu">
                      Set a username so friends and people can easily find you on TuneBox.
                    </p>

                    {/* Logo */}
                    <img
                      src={avatar}
                      alt="avartar"
                      className="profile-icon border border-danger rounded-circle d-flex justify-content-center align-items-center mb-3"
                      onClick={handleLogoClick}
                      style={{ width: '100px', height: '100px' }}
                    />

                    {/* Input ẩn để chọn ảnh */}
                    <input
                      type="file"
                      id="logoInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <form className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </form>

                    <button
                      className="btn btn-dark w-100"
                      style={{backgroundColor: '#E94F37'}}
                      onClick={handleNext}
                    >
                      Continue
                    </button>
                  </div>
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

export default UserInformation;
