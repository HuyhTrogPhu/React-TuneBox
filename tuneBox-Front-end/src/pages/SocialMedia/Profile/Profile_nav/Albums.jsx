import React, { useEffect, useState } from "react";
import {
  getAlbumsByUserId,
  deleteAlbum,
} from "../../../../service/AlbumsServiceCus";
import { getLikesCountByAlbumsId } from "../../../../service/likeTrackServiceCus";
import { LoadAlbumReport } from "../../../../service/SocialMediaAdminService";
import Cookies from "js-cookie";
import "./css/albums.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getTrackById } from "../../../../service/TrackServiceCus";
import axios from "axios";

const Albums = () => {
  const userId = Cookies.get("userId");
  const { id } = useParams(); // Lấy ID từ URL
  console.log("cookie: ", userId);
  console.log("ID từ URL: ", id);
  const [albums, setAlbums] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [ReportId, setReportId] = useState(null);
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  const [likesCount, setLikesCount] = useState();
  const [countTrack, setCountTrack] = useState({});

  // Fetch initial data
  useEffect(() => {
    fetchListAlbum();
  }, [userId]);

  // fetch list album
  const fetchListAlbum = async () => {
    const targetUserId = id || userId;
    console.log("Target User ID:", targetUserId);
    setIsLoading(true);
    try {
      const albumsResponse = await getAlbumsByUserId(targetUserId);
      const responseRp = await LoadAlbumReport();
      const dataRP = responseRp.data;
      console.log(dataRP);
      const filteredAlbums = albumsResponse.filter((album) => {
        const report = dataRP.find(rp => rp.albumId === album.id); // Tìm báo cáo tương ứng với track
        return !report || report.status !== "RESOLVED";
      });


      setAlbums(filteredAlbums || []);
      console.log("albumsResponse: ", filteredAlbums);

      // Đếm số lượng album có status là false
      const inactiveAlbumsCount = albumsResponse.filter(
        (album) => album.status === false
      ).length;
      console.log(
        "Number of inactive albums (status = false):",
        inactiveAlbumsCount
      );

      const likesCountsMap = {};
      const tempInactiveTracksCountMap = {};

      await Promise.all(
        albumsResponse.map(async (item) => {
          try {
            const trackDetails = await fetchTrackDetails(item.tracks);

            const countTrackFalse = trackDetails.filter(
              (track) => !track.status
            ).length;
            tempInactiveTracksCountMap[item.id] = countTrackFalse;

            console.log(
              `Album ID: ${item.id} - count Track còn tồn tại:`,
              countTrackFalse
            );

            if (item.id) {
              const response = await getLikesCountByAlbumsId(item.id);
              likesCountsMap[item.id] = response.data; // Store the like count for each listalbum
            }
          } catch (itemError) {
            console.error(
              `Error fetching likes count for album ${item.id}:`,
              itemError
            );
          }
        })
      );

      setLikesCount(likesCountsMap);
      setCountTrack(tempInactiveTracksCountMap);
      console.log("Likes count map: ", likesCountsMap);
    } catch (error) {
      console.error("Error fetching Albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // delete album
  const handDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this album?")) {
      return;
    }

    setIsLoading(true);
    try {
      const albumsResponse = await deleteAlbum(albumId);
      console.log("Album deleted successfully:", albumsResponse);
      fetchListAlbum();
      toast.success("Album deleted successfully!");
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // report post
  const handleReport = (id, type) => {
    console.log("ID to report:", id); // Kiểm tra giá trị ID
    console.log("Type to report:", type); // Kiểm tra giá trị type
    setReportId(id);
    setReportType(type);
    setShowReportModal(true);
  };
  const handleSubmit = () => {
    console.log("Report Type before submit:", reportType); // Kiểm tra giá trị type

    if (!ReportId || !reportType) {
      setReportMessage("ID hoặc loại báo cáo không hợp lệ.");
      return;
    }

    // Gọi hàm submitReport với các giá trị đúng
    submitReport(currentUserId, ReportId, reportType, reportReason);
  };
  const submitReport = async (userId, reportId, reportType, reason) => {
    try {
      const token = localStorage.getItem("jwtToken"); // Hoặc từ nơi bạn lưu trữ JWT token

      const reportExists = await checkReportExists(
        userId,
        reportId,
        reportType
      );
      if (reportExists) {
        setReportMessage("Bạn đã báo cáo nội dung này rồi.");
        toast.warn("Bạn đã báo cáo nội dung này rồi."); // Hiển thị toast cảnh báo
      } else {
        const reportData = {
          userId: userId,
          postId: reportType === "post" ? reportId : null,
          trackId: reportType === "track" ? reportId : null,
          albumId: reportType === "album" ? reportId : null,
          type: reportType,
          reason: reason,
        };

        const response = await axios.post(
          "http://localhost:8080/api/reports",
          reportData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Thêm JWT token vào header
            },
          }
        );

        console.log("Report submitted successfully:", response.data);
        setReportMessage("Báo cáo đã được gửi thành công.");
        toast.success("Báo cáo đã được gửi thành công."); // Hiển thị toast thông báo thành công
        setShowReportModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login?error=true");
      } else {
        setReportMessage("Đã có lỗi xảy ra khi gửi báo cáo.");
        toast.error("Đã có lỗi xảy ra khi gửi báo cáo."); // Hiển thị toast thông báo lỗi
      }
    }
  };
  const checkReportExists = async (userId, reportId, reportType) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reports/check`,
        {
          params: {
            userId: userId,
            postId: reportType === "post" ? reportId : null,
            trackId: reportType === "track" ? reportId : null,
            albumId: reportType === "album" ? reportId : null,
            type: reportType,
          },
          withCredentials: true,
        }
      );
      console.log("Check report response:", response.data);
      return response.data.exists; // Giả sử API trả về trạng thái tồn tại của báo cáo
    } catch (error) {
      console.error("Error checking report:", error);
      return false;
    }
  };

  const fetchTrackDetails = async (trackIds) => {
    if (!trackIds || trackIds.length === 0) return [];
    try {
      const trackPromises = trackIds.map((id) => getTrackById(id));
      const trackResults = await Promise.all(trackPromises);
      return trackResults.map((result) => result.data);
    } catch (error) {
      console.error("Error fetching track details:", error);
      toast.error("Failed to fetch track details");
      return [];
    }
  };

  return (
    <div className="albums">
      <ToastContainer />
      {!id || String(id) === String(userId) ? (
        <div className="btn-container">
          {/* Link to create a new album */}
          <Link to="/albums/create-newAlbum">
            <button type="button" className="btn-new">
              New
            </button>
          </Link>

          {/* Search container */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button type="button" className="btn-search">
              Search
            </button>
          </div>
        </div>
      ) : null}

      {/* Albums List */}
      <div className="post-header-albums position-relative">
        {albums && albums.length > 0 ? (
          albums.map((album) => {
            console.log("albums.creator: ", album.creatorId);

            if (album.status === false) {
              return (
                <div key={album.id} className="album-item">
                  <img
                    src={album.albumImage}
                    className="avatar_small"
                    alt="Avatar"
                  />
                  <div className="info">
                    {/* link album detail */}
                    <Link
                      to={{
                        pathname: `/album/${album.id}`,
                        state: { album },
                      }}
                    >
                      <div className="title">{album.title}</div>
                    </Link>

                    <div className="style">{album.description}</div>

                    <div className="album-details">
                      <span className="tracks">
                        Tracks: {countTrack[album.id] || 0}
                      </span>
                      <span className="likes">
                        Likes:{" "}
                        {likesCount && likesCount[album.id]
                          ? likesCount[album.id]
                          : 0}
                      </span>
                    </div>
                  </div>
                  {String(album.creatorId) === String(userId) ? (
                    <div className="dropdown position-absolute top-8 end-0 me-4 ">
                      <button
                        className="btn dropdown-toggle no-border"
                        type="button"
                        id={`dropdownMenuButton-${album.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                      <ul
                        className="dropdown-menu"
                        aria-labelledby={`dropdownMenuButton-${album.id}`}
                      >
                        <li>
                          <Link to={`/albums/album-Edit/${album.id}`}>
                            <button className="dropdown-item">Edit</button>
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handDeleteAlbum(album.id)}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <button
                      className="fa-regular fa-flag btn-report position-absolute top-8 end-0 me-4 border-0"
                      onClick={() => handleReport(album.id, "album")}
                    ></button>
                  )}
                </div>
              );
            }
          })
        ) : (
          <div className="no-albums">No albums found</div>
        )}
      </div>
      {/* Modal báo cáo */}
      <ToastContainer />
      {showReportModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Báo cáo nội dung</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    // Reset dữ liệu khi đóng modal
                    setShowReportModal(false);
                    setReportReason(""); // Reset lý do báo cáo
                    setReportMessage(""); // Reset thông báo
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {reportMessage && (
                  <div className="alert alert-danger">{reportMessage}</div>
                )}{" "}
                {/* Thông báo lỗi hoặc thành công */}
                <h6>Chọn lý do báo cáo:</h6>
                <div className="mb-3">
                  {[
                    "Nội dung phản cảm",
                    "Vi phạm bản quyền",
                    "Spam hoặc lừa đảo",
                    "Khác",
                  ].map((reason) => (
                    <label className="d-block" key={reason}>
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        onChange={(e) => setReportReason(e.target.value)}
                      />{" "}
                      {reason}
                    </label>
                  ))}
                </div>
                <textarea
                  className="form-control mt-2"
                  placeholder="Nhập lý do báo cáo"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={() =>
                    submitReport(userId, ReportId, reportType, reportReason)
                  }
                  className="btn btn-primary"
                >
                  Báo cáo
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason(""); // Reset lý do báo cáo
                    setReportMessage(""); // Reset thông báo
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Albums;