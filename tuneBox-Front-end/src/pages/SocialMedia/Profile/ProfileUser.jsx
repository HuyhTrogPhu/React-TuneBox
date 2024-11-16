import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import LikePost from "./Profile_nav/LikePost";
import { getUserInfo, getFriendCount, updateBackground } from "../../../service/UserService";
import "./css/profile.css";
import "./css/post.css";
import "./css/button.css";
import "./css/comment.css";
import "./css/modal-create-post.css";
import { images } from "../../../assets/images/images";
import { FollowContext } from "./FollowContext";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer2 from "../../../components/Footer/Footer2";
import { useTranslation } from "react-i18next";
import '../../../i18n/i18n'

const ProfileUser = () => {
  const userIdCookie = Cookies.get("userId");
  const { followCounts } = useContext(FollowContext);
  const [userData, setUserData] = useState({});
  const [followCount, setFollowCount] = useState({
    followerCount: 0,
    followingCount: 0,
  });
  const { t } = useTranslation();

  const [friendCount, setFriendCount] = useState(0);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState("");
  const [imageFile, setImageFile] = useState(null); // Added state to hold the selected image file


  useEffect(() => {
    const fetchUser = async () => {
      if (userIdCookie) {
        try {
          const userData = await getUserInfo(userIdCookie);
          setUserData(userData);
          const count = await getFriendCount(userIdCookie);
          setFriendCount(count);
        } catch (error) {
          console.error("Error fetching user", error);
        }
      }
    };

    fetchUser();
  }, [userIdCookie]);

  useEffect(() => {
    const counts = followCounts[userIdCookie] || {
      followerCount: 0,
      followingCount: 0,
    };
    setFollowCount(counts);
  }, [followCounts, userIdCookie]);

  const handleBackgroundChange = () => {
    setShowModal(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedBackground(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file); // Store the file to send to backend
    }
  };

  const confirmChange = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      console.log(...formData); // Kiểm tra nội dung của formData
      try {
        await updateBackground(userIdCookie, formData);
        toast.success("Background updated successfully");
        setShowModal(false);
        // Các mã tiếp theo   
      } catch (error) {
        console.error("Error updating background", error);
        setError("Có lỗi xảy ra khi thay đổi hình nền.");
      }
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <ToastContainer />
        <div
          className="background border container"
          style={{
            backgroundImage: `url(${userData.background || "/src/UserImages/Background/default-bg.jpg"})`,
          }}
        >
          <div className="text-end" style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
            <button className="btn" style={{ backgroundColor: '#E94F37' }} onClick={handleBackgroundChange}>
              {t('p1')}
            </button>
          </div>
        </div>

        <div className="row container">
          <aside className="col-sm-3">
            <div>
              <img
                src={userData.avatar || "/src/UserImages/Avatar/default-avt.jpg"}
                className="avatar"
                alt="avatar"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
            <div className="row mt-4">
              <div className="col">
                <div className="fs-4 text-small">
                  <b>{userData.name}</b>
                </div>
                <div className="">#{userData.userName}</div>
              </div>
              <div className="col text-end">
                <Link to="/ProfileSetting">
                  <button type="button" className="btn btn-secondary">
                    <img
                      src={images.pen}
                      width="20px"
                      height="20px"
                      alt="setting-btn"
                    />
                  </button>
                </Link>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col text-center">
                <Link to={`/Follower/${userIdCookie}`}>
                  <span>{followCount.followerCount}</span> <br />
                  <span>{t('p2')}</span>
                </Link>
              </div>
              <div className="col text-center">
                <Link to={`/Following/${userIdCookie}`}>
                  <span>{followCount.followingCount}</span> <br />
                  <span>{t('p3')}</span>
                </Link>
              </div>
              <div className="col text-center">
                <Link to={`/FriendList/${userIdCookie}`}>
                  <span>{friendCount}</span> <br />
                  <span>{t('p4')}</span>
                </Link>
              </div>
            </div>
            <div style={{ paddingTop: 30 }}>
              <label>{t('p5')}</label> <br />
              {userData.inspiredBy && userData.inspiredBy.length > 0 ? (
                userData.inspiredBy.map((name, index) => (
                  <span
                    key={index}
                    className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <p>{t('p17')}</p>
              )}
              <br />
              <label>{t('p6')}</label> <br />
              {userData.talent && userData.talent.length > 0 ? (
                userData.talent.map((name, index) => (
                  <span
                    key={index}
                    className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <p>{t('18')}</p>
              )}
              <br />
              <label>{t('p7')}</label> <br />
              {userData.genre && userData.genre.length > 0 ? (
                userData.genre.map((name, index) => (
                  <span
                    key={index}
                    className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <p>{t('p19')}</p>
              )}
            </div>
          </aside>

          <div className="col-sm-9 d-flex flex-column">
            <nav className="nav flex-column flex-md-row p-5">
              <Link to="activity" className="nav-link">{t('p8')}</Link>
              <Link to="track" className="nav-link">Track</Link>
              <Link to="albums" className="nav-link">Albums</Link>
              <Link to="playlists" className="nav-link">Playlists</Link>
              <Link to={`likepost/${userIdCookie}`} className="nav-link"></Link>
            </nav>

            <div className="container">
              <Routes>
                <Route path="/" element={<Navigate to="activity" />} />
                <Route path="activity" element={<Activity />} />
                <Route path="track" element={<Track />} />
                <Route path="albums" element={<Albums />} />
                <Route path="playlists" element={<Playlists />} />
                <Route path="likepost/:userId" element={<LikePost />} />
              </Routes>
            </div>
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{t('p13')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>{t('p14')}</p>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {selectedBackground && (
                <div className="mt-2">
                  <img src={selectedBackground} alt="Selected Background" style={{ width: '100%', height: 'auto' }} />
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {t('p15')}
            </Button>
            <Button variant="primary" onClick={confirmChange}>
              {t('p16')}
            </Button>
          </Modal.Footer>
        </Modal>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
      <Footer2 />
    </div>


  );
};

export default ProfileUser;
