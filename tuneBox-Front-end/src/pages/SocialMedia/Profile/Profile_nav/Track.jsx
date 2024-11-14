import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { listGenre } from "../../../../service/TrackServiceCus";
import { useParams } from "react-router-dom"; // Import useParams để lấy userId từ URL
import { useTranslation } from "react-i18next";
import '../../../../i18n/i18n'
import Swal from 'sweetalert2';
import { Audio } from 'react-loader-spinner'
const Track = () => {
  const [tracks, setTracks] = useState([]); // State luu track
  const [selectedTrack, setSelectedTrack] = useState(null); // State cho track duoc chon
  const userId = Cookies.get("userId"); // Lay userId tu cookies
  const { id } = useParams(); // Lấy ID từ URL
  const { t } = useTranslation();
  const [genres, setGenres] = useState([]); // Store the list of genres
  const [selectedGenre, setSelectedGenre] = useState(""); // Store the selected genre
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchGenre(); // Fetch genres when the component mounts
  }, []);

  const fetchGenre = async () => {
    try {
      const genreResponse = await listGenre(); // Assuming listGenre is your API call
      console.log(genreResponse.data);
      setGenres(genreResponse.data); // Store the fetched genres in state
    } catch (error) {
      console.log("Error fetching genres:", error);
    }
  };

  // Ham lay danh sach track
  const fetchTrack = async () => {
    const targetUserId = id ? id : userId;
    console.log("Target User ID:", targetUserId);
    try {
      if (!userId) throw new Error("User ID not found."); // Kiem tra userId
      const response = await axios.get(
        `http://localhost:8080/customer/tracks/user/${targetUserId}`,
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

    const confirmDelete = await Swal.fire({
      title: t('a20x'),
      text: t('a21x'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('a22x'),
      cancelButtonText: t('a23x'),
    });

    if (!confirmDelete.isConfirmed) return; // Không xóa nếu người dùng hủy

    try {
      await axios.delete(`http://localhost:8080/customer/tracks/${trackId}`, {
        withCredentials: true,
      });
      fetchTrack(); // Cập nhật danh sách track sau khi xóa
      Swal.fire(t('a24x'), t('a25x'), 'success'); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error deleting track:", error.response?.data || error.message);
      Swal.fire(t('a26x'), t('a27x'), 'error'); // Hiển thị thông báo lỗi
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
  // useEffect(() => {
  //   const getUserName = async () => {
  //     try {
  //       const name = await fetchUserName(); // Lay ten nguoi dung
  //       setUserName(name); // Luu ten vao state
  //     } catch (error) {
  //       console.error("Error fetching track name:", error); // Log loi neu co
  //     }
  //   };
  //   getUserName();
  // }, []);

  const handleEditClick = (track) => {
    // Tạo một đối tượng track mới với đầy đủ thông tin
    const updatedTrack = {
      ...track,
      // Giữ nguyên URL của ảnh hiện tại thay vì tạo Blob mới
      imageTrack: track.imageTrack,
      // Giữ nguyên thông tin file nhạc hiện tại
      trackFile: {
        name: track.trackFileName || "Current track file", // Thêm tên file nếu có
      },
    };

    setSelectedTrack(updatedTrack);

    // Set genre ID từ track hiện tại
    if (track.genre) {
      setSelectedGenre(track.genre.id.toString());
    }

    const editModal = document.getElementById("editModal");
    editModal.classList.add("show");
    editModal.style.display = "block";
    document.body.classList.add("modal-open");
  };

  // Save track after editing
  const handleSave = async () => {
    if (!selectedTrack) return;

    // Hiển thị thông báo xác nhận khi bắt đầu lưu
    Swal.fire({
      title: t('p1x'), // 'Saving track...'
      text: t('p2x'), // 'Please wait while we save your track.',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Hiển thị loading spinner
      },
    });

    const formData = new FormData();
    formData.append("name", selectedTrack.name);
    formData.append("description", selectedTrack.description);
    formData.append("status", selectedTrack.status);
    formData.append("report", selectedTrack.report);
    formData.append("userId", userId);
    formData.append("genre", selectedGenre);

    // Chỉ gửi file mới nếu người dùng đã chọn file mới
    if (selectedTrack.trackFile instanceof File) {
      formData.append("trackFile", selectedTrack.trackFile);
    }

    // Chỉ gửi ảnh mới nếu người dùng đã chọn ảnh mới
    if (selectedTrack.trackImage instanceof File) {
      formData.append("trackImage", selectedTrack.trackImage);
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
      fetchTrack(); // Cập nhật danh sách track sau khi lưu
      setSelectedTrack(null); // Xóa thông tin track đã chọn

      // Đóng modal sau khi lưu thành công
      const editModal = document.getElementById("editModal");
      editModal.classList.remove("show");
      editModal.style.display = "none";
      document.body.classList.remove("modal-open");

      // Hiển thị thông báo thành công
      Swal.fire({
        title: t('p3x'), // 'Success!',
        text: t('p4x'), // 'Your track has been saved successfully.',
        icon: 'success',
        confirmButtonText: t('p5x'), // 'OK'
      });

    } catch (error) {
      console.error("Error updating track:", error.response?.data || error.message);

      // Hiển thị thông báo lỗi nếu có lỗi khi lưu
      Swal.fire({
        title: t('p6x'), // 'Error!',
        text: t('p7x'), // 'There was an error saving your track. Please try again.',
        icon: 'error',
        confirmButtonText: t('p5x'), // 'OK'
      });
    }
  };


  return (
    <div>
      {/* get all track */}
      {tracks.map(
        (track) =>
          !track.status && (
            <div key={track.id} className="post-header-track">
              <img
                src={track.imageTrack || "/src/UserImages/Avatar/avt.jpg"}
                className="avatar_small"
                alt="Avatar"
              />

              <div className="info">
                <Link
                  to={{
                    pathname: `/track/${track.id}`,
                    state: { track },
                  }}
                >
                  <div className="name">{track.name || "Unknown Track"}</div>
                </Link>
                <div className="author">
                  {track.userName || "Unknown userName"}
                </div>
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
                      style={{ cursor: 'pointer' }}
                      className="dropdown-item"
                      onClick={() => handleEditClick(track)}
                    >
                      {t('a8')}
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ cursor: 'pointer' }}
                      className="dropdown-item"
                      onClick={() => deleteTrack(track.id)}
                    >
                      {t('a9')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )
      )}

      {/* Modal for editing track */}
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
                {t('a20')}
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={() => handleSave()}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row">
                {/* Track Name */}
                <div className="mb-3">
                  <label className="form-label">  {t('a21')} </label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedTrack ? selectedTrack.name : ""}
                    onChange={(e) =>
                      setSelectedTrack({
                        ...selectedTrack,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Image Track */}
                <div className="mt-3">
                  <label className="form-label">{t('a22')} </label>
                  {selectedTrack && (
                    <div>
                      <img
                        src={selectedTrack.imageTrack}
                        alt="Current Track"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                      <div className="custom-file mt-2">
                        <input
                          type="file"
                          id="fileInput"
                          className="custom-file-input"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSelectedTrack({
                                ...selectedTrack,
                                trackImage: e.target.files[0],
                              });
                            }
                          }}
                          style={{ display: "none" }}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="fileInput"
                        >
                          {t('a23')}
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* File Track */}
                <div className="mt-3">
                  <label className="form-label">{t('')} </label>
                  <label className="custom-file-label" htmlFor="fileInput">
                    {t('a25')}
                  </label>
                  {selectedTrack && (
                    <div>
                      <p>
                        Current file:{" "}
                        {selectedTrack.trackFileName || selectedTrack.name}
                      </p>
                      <div className="custom-file mt-2">
                        <input
                          type="file"
                          id="fileInput"
                          className="custom-file-input"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSelectedTrack({
                                ...selectedTrack,
                                trackFile: e.target.files[0],
                              });
                            }
                          }}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Select Genre */}
                <div className="mt-3">
                  <label className="form-label">{t('a26')}</label>
                  <select
                    className="form-select"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    {genres.map((genre) => (
                      <option
                        key={genre.id}
                        value={genre.id}
                        // Set selected cho genre hiện tại
                        selected={selectedTrack?.genre?.id === genre.id}
                      >
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="mt-3">
                  <label className="form-label">{t('a27')}</label>
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
                    }
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const editModal = document.getElementById("editModal");
                  editModal.classList.remove("show");
                  editModal.style.display = "none";
                  document.body.classList.remove("modal-open");
                }}
              >
                {t('c33')}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                {/* Hiển thị loading spinner khi đang lưu */}
                {isLoading ? (
                   <Audio height="20" width="20" color="white" ariaLabel="loading" />
                ) : (
                  t('p16') // 'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end modal edit */}
    </div>
  );
};

export default Track;