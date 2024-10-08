import { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { createTrack, listGenre, getTrackByUserId } from "../../service/TrackServiceCus";
import Cookies from 'js-cookie';

const Navbar = () => {
  const [newTrackName, setTrackName] = useState("");
  const [newTrackImage, setTrackImage] = useState(null);
  const [newTrackFile, setTrackFile] = useState(null);
  const [newTrackGenre, setTrackGenre] = useState("");
  const [newTrackDescription, setTrackDescription] = useState("");
  
  const [errors, setErrors] = useState({});
  const [genres, setGenre] = useState([]);
 

  const userId = Cookies.get("UserID");

  const getAllGenre = () => {
    listGenre()
      .then((response) => {
        setGenre(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Genre", error);
      });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newTrackName) newErrors.name = "Track name is required.";
    if (!newTrackImage) newErrors.image = "Track image is required.";
    if (!newTrackFile) newErrors.file = "Track file is required.";
    if (!newTrackGenre) newErrors.genre = "Track genre is required.";
    if (!newTrackDescription) newErrors.description = "Description is required.";
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
      
      getTrackByUserId();
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

  return (
    <header className="row" style={{ alignItems: "center" }}>
      <div className="col" style={{ alignItems: "center", display: "flex" }}>
        <button className="btn">
          <Link to={"/"}>
            <img alt="tunebox" src={images.logoTuneBox} style={{ marginLeft: "50px", marginRight: "50px" }} width="150" />
          </Link>
        </button>
        <button className="btn">
          <Link className="text-decoration-none text-black" to={"/"}>
            <span style={{ marginRight: "30px" }}>
              <img alt="icon-home" src={images.home} style={{ marginBottom: "15px", marginRight: "15px" }} />
              <b>Feed</b>
            </span>
          </Link>
        </button>
        <button className="btn">
          <Link className="text-decoration-none text-black" to={"/HomeEcommerce"}>
            <span>
              <img alt="icon-loa" src={images.speaker} style={{ marginBottom: "15px", marginRight: "15px" }} width="35px" />
              <b>Shops</b>
            </span>
          </Link>
        </button>
      </div>
      <div className="col text-end" style={{ alignItems: "center" }}>
        <span>
          <img alt="icon-chuong" src={images.notification} style={{ marginBottom: "15px", marginRight: "30px" }} />
        </span>
        <span>
          <img alt="icon-chat" src={images.conversstion} style={{ marginBottom: "15px", marginRight: "30px" }} />
        </span>
        <button className="btn btn-warning" style={{ marginBottom: "15px", marginRight: "20px" }} type="button">
          <span><b>Get</b></span>
          <img alt="icon-crow" height="32px" src={images.crown} style={{ marginLeft: "10px" }} width="32px" />
        </button>
        <button className="btn">
          <Link to={"/profileUser"}>
            <img alt="Avatar" className="avatar_small" src={images.avt} style={{ height: "50px", marginBottom: "15px", width: "50px", borderRadius: "50%" }} />
          </Link>
        </button>
        <button className="btn">
          <Link to={"/Cart"}>
            <span>
              <img alt="icon-giohang" src={images.shopping_bag} style={{ marginBottom: "15px", marginRight: "30px" }} />
            </span>
          </Link>
        </button>
        <button data-bs-toggle="modal" data-bs-target="#addTrackModal" className="btn btn-danger" style={{ marginBottom: "15px", marginRight: "10px" }} type="button">
          <img alt="icon-plus" height="20px" src={images.plus_white} style={{ marginBottom: "3px", marginRight: "10px" }} width="20px" />
          <b>Create</b>
        </button>
      </div>
      <hr />

      {/* start modal add */}
      <div className="modal fade" id="addTrackModal" tabIndex="-1" aria-labelledby="addTrackModalLabel" aria-hidden="true" data-bs-backdrop="false">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addTrackModalLabel">Add Track</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModal"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <form action="" className="row">
                  <div className="mb-3">
                    <label className="form-label">Track Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={newTrackName}
                      onChange={(e) => setTrackName(e.target.value)}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Image Track</label>
                    <input
                      type="file"
                      className={`form-control`}
                      accept="image/*" // Chỉ cho phép hình ảnh
                      onChange={(e) => setTrackImage(e.target.files[0])}
                    />
                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">File Track</label>
                    <input
                      type="file"
                      className={`form-control`}
                      accept=".mp3" // Chỉ cho phép tải lên file MP3
                      onChange={(e) => setTrackFile(e.target.files[0])}
                    />
                    {errors.file && <div className="invalid-feedback">{errors.file}</div>}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Genre</label>
                    <select
                      className={`form-select ${errors.genre ? "is-invalid" : ""}`}
                      value={newTrackGenre}
                      onChange={(e) => setTrackGenre(e.target.value)}
                    >
                      <option value="" disabled>Select genre</option>
                      {genres && genres.length > 0 ? (
                        genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))
                      ) : (
                        <option disabled>No genres available</option>
                      )}
                    </select>
                    {errors.genre && <div className="invalid-feedback">{errors.genre}</div>}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Description</label>
                    <textarea
                      cols="50"
                      rows="5"
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      value={newTrackDescription}
                      onChange={(e) => setTrackDescription(e.target.value)}
                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
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
