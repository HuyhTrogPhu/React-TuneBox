import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Track = () => {
  const [tracks, setTracks] = useState([]); // State luu track
  const [userName, setUserName] = useState(""); // State cho username
  const [selectedTrack, setSelectedTrack] = useState(null); // State cho track duoc chon
  const userId = Cookies.get("UserID"); // Lay userId tu cookies

  // Ham lay danh sach track
  const fetchTrack = async () => {
    try {
      if (!userId) throw new Error("User ID not found."); // Kiem tra userId
      const response = await axios.get(
        `http://localhost:8080/customer/tracks/user/${userId}`,
        {
          withCredentials: true,
        }
      );
      const sortedTrack = response.data.sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      ); // Sap xep track
      setTracks(sortedTrack); // Luu track vao state
      console.log(response.data);
      
    } catch (error) {
      console.error(
        "Error fetching Track:",
        error.response?.data || error.message
      ); // Log loi neu co
    }
  };

  // Ham xoa track
  const deleteTrack = async (trackId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Track?"
    ); // Xac nhan xoa
    if (!confirmDelete) return; // Khong xoa neu nguoi dung khong dong y
    try {
      await axios.delete(`http://localhost:8080/customer/tracks/${trackId}`, {
        withCredentials: true,
      });
      fetchTrack(); // Cap nhat danh sach track sau khi xoa
    } catch (error) {
      console.error(
        "Error deleting track:",
        error.response?.data || error.message
      ); // Log loi neu co
    }
  };

  // Goi ham fetchTrack khi component duoc mount
  useEffect(() => {
    fetchTrack();
  }, []);

  // Ham lay ten nguoi dung
  const fetchUserName = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/current`, {
        params: { userId },
        withCredentials: true,
      });
      return response.data.userName; // Tra ve ten nguoi dung
    } catch (error) {
      console.error("Error fetching track data:", error); // Log loi neu co
      throw error;
    }
  };

  // Goi fetchUserName khi component duoc mount
  useEffect(() => {
    const getUserName = async () => {
      try {
        const name = await fetchUserName(); // Lay ten nguoi dung
        setUserName(name); // Luu ten vao state
      } catch (error) {
        console.error("Error fetching track name:", error); // Log loi neu co
      }
    };
    getUserName();
  }, []);

  // Xu ly click edit
  const handleEditClick = (track) => {
    setSelectedTrack(track); // Luu track duoc chon
    const editModal = document.getElementById("editModal");
    editModal.classList.add("show"); // Hien modal
    editModal.style.display = "block"; // Dat display thanh block
    document.body.classList.add("modal-open"); // Them class modal-open
  };

  // Xu ly luu track
  const handleSave = async () => {
    if (!selectedTrack) return; // Khong lam gi neu khong co track

    const formData = new FormData(); // Tao formData
    formData.append("name", selectedTrack.name); // Them ten track
    formData.append("description", selectedTrack.description); // Them mo ta track
    formData.append("status", selectedTrack.status); // Them trang thai track
    formData.append("report", selectedTrack.report); // Them bao cao track
    formData.append("userId", userId); // Them userId
    if (selectedTrack.trackFile) {
      formData.append("trackFile", selectedTrack.trackFile); // Them file track neu co
    }

    try {
      await axios.put(
        `http://localhost:8080/customer/tracks/${selectedTrack.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      fetchTrack(); // Cap nhat danh sach track
      setSelectedTrack(null); // Reset selectedTrack
      const editModal = document.getElementById("editModal");
      editModal.classList.remove("show"); // An modal
      editModal.style.display = "none"; // Dat display thanh none
      document.body.classList.remove("modal-open"); // Xoa class modal-open
    } catch (error) {
      console.error(
        "Error updating track:",
        error.response?.data || error.message
      ); // Log loi neu co
    }
  };

  return (
    <div>
      {tracks.map(
        (track) =>
          !track.status && (
            <div key={track.id} className="post-header-track">
              <img
                src={track.trackImage || "/src/UserImages/Avatar/avt.jpg"}
                className="avatar_small"
                alt="Avatar"
              />

              <div className="info">
                <Link to={{
                  pathname: `/track/${track.id}`,
                  state: {track}
                }}>
                  <div className="name">{track.name || "Unknown Track"}</div>
                </Link>
                <div className="author">{userName || "Unknown userName"}</div>
              </div>

              <div className="btn-group" style={{ marginLeft: 25 }}>
                <button
                  className="btn dropdown-toggle no-border"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu dropdown-menu-lg-end">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => handleEditClick(track)}
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => deleteTrack(track.id)}
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )
      )}

      {/* start modal edit */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editTrackModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editTrackModalLabel">
                Edit Track
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={() => handleSave()}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <form className="row">
                  <div className="mb-3">
                    <label className="form-label">Track Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedTrack ? selectedTrack.name : ""}
                      onChange={(e) =>
                        setSelectedTrack({
                          ...selectedTrack,
                          name: e.target.value,
                        })
                      } // Cap nhat ten track
                    />
                    <div className="invalid-feedback"></div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Image Track</label>
                    <input
                      type="file"
                      className={`form-control`}
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedTrack({
                          ...selectedTrack,
                          trackImage: e.target.files[0],
                        })
                      } // Cap nhat hinh track
                    />
                    <div className="invalid-feedback"></div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">File Track</label>
                    <input
                      type="file"
                      className={`form-control`}
                      accept=".mp3"
                      onChange={(e) =>
                        setSelectedTrack({
                          ...selectedTrack,
                          trackFile: e.target.files[0],
                        })
                      } // Cap nhat file track
                    />
                    <div className="invalid-feedback"></div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Genre</label>
                    <select
                      className="form-control"
                      value={selectedTrack ? selectedTrack.genreId : ""}
                      onChange={(e) =>
                        setSelectedTrack({
                          ...selectedTrack,
                          genreId: e.target.value,
                        })
                      } // Cap nhat the loai
                    >
                      <option value="" disabled>
                        Select genre
                      </option>
                      {/* Map genres vao day neu co */}
                    </select>
                    <div className="invalid-feedback"></div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Description</label>
                    <textarea
                      cols="50"
                      rows="5"
                      className="form-control"
                      value={selectedTrack ? selectedTrack.description : ""}
                      onChange={(e) =>
                        setSelectedTrack({
                          ...selectedTrack,
                          description: e.target.value,
                        })
                      } // Cap nhat mo ta
                    ></textarea>
                    <div className="invalid-feedback"></div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    const editModal = document.getElementById("editModal");
                    editModal.classList.remove("show"); // An modal
                    editModal.style.display = "none"; // Dat display thanh none
                    document.body.classList.remove("modal-open"); // Xoa class modal-open
                  }}
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
      {/* end modal edit */}
    </div>
  );
};

export default Track;
