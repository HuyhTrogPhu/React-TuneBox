import React, { useEffect, useState } from "react";
import {
  getAlbumsByUserId,
  deleteAlbum,
} from "../../../../service/AlbumsServiceCus";
import Cookies from "js-cookie";
import "./css/albums.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import '../../../../i18n/i18n'
import Swal from 'sweetalert2';

const Albums = () => {
  const userId = Cookies.get("userId");
  const { id } = useParams(); // Lấy ID từ URL
  console.log("cookie: ", userId);
  const [albums, setAlbums] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [ReportId, setReportId] = useState(null);
  const [reportType, setReportType] = useState('');
  const [reportMessage, setReportMessage] = useState("");
  const { t } = useTranslation();

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

      setAlbums(albumsResponse || []);

      // Đếm số lượng album có status là false
      const inactiveAlbumsCount = albumsResponse.filter(
        (album) => album.status === false
      ).length;
      console.log(
        "Number of inactive albums (status = false):",
        inactiveAlbumsCount
      );
    } catch (error) {
      console.error("Error fetching Albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // delete album
  const handDeleteAlbum = async (albumId) => {

    // Sử dụng Swal để hiển thị hộp thoại xác nhận
    const confirmDelete = await Swal.fire({
      title: t("confirmDeleteTitle"), // Lấy thông báo đa ngôn ngữ từ i18n
      text: t("confirmDeleteText"),  // Lấy thông báo đa ngôn ngữ từ i18n
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("confirmButton"), // Lấy thông báo đa ngôn ngữ từ i18n
      cancelButtonText: t("cancelButton") // Lấy thông báo đa ngôn ngữ từ i18n
    });
  
    if (!confirmDelete.isConfirmed) {
      return;
    }
  
    setIsLoading(true);
    try {
      const albumsResponse = await deleteAlbum(albumId);
      console.log("Album deleted successfully:", albumsResponse);
      fetchListAlbum();
      Swal.fire({
        icon: "success",
        title: t("albumDeletedSuccess"), // Thông báo xóa thành công
      });
    } catch (error) {
      console.error("Error deleting album:", error);
      Swal.fire({
        icon: "error",
        title: t("albumDeletedError"), // Thông báo lỗi khi xóa không thành công
        text: t("albumDeletedErrorText"), // Mô tả lỗi nếu có
      });
    } finally {
      setIsLoading(false);
    }
  };

    // report post 
    const handleReport = (id, type) => {
      console.log('ID to report:', id); // Kiểm tra giá trị ID
      console.log('Type to report:', type); // Kiểm tra giá trị type
      setReportId(id);
      setReportType(type);
      setShowReportModal(true);
    };
    const handleSubmit = () => {
      console.log('Report Type before submit:', reportType); // Kiểm tra giá trị type
  
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
  
        const reportExists = await checkReportExists(userId, reportId, reportType);
        if (reportExists) {
          setReportMessage("Bạn đã báo cáo nội dung này rồi.");
          toast.warn("Bạn đã báo cáo nội dung này rồi."); // Hiển thị toast cảnh báo
        } else {
          const reportData = {
            userId: userId,
            postId: reportType === 'post' ? reportId : null,
            trackId: reportType === 'track' ? reportId : null,
            albumId: reportType === 'album' ? reportId : null,
            type: reportType,
            reason: reason
          };
  
          const response = await axios.post('http://localhost:8080/api/reports', reportData, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}` // Thêm JWT token vào header
            }
          });
  
          console.log('Report submitted successfully:', response.data);
          setReportMessage("Báo cáo đã được gửi thành công.");
          toast.success("Báo cáo đã được gửi thành công."); // Hiển thị toast thông báo thành công
          setShowReportModal(false);
        }
      } catch (error) {
        console.error("Lỗi khi tạo báo cáo:", error);
        if (error.response && error.response.status === 401) {
          navigate('/login?error=true');
        } else {
          setReportMessage("Đã có lỗi xảy ra khi gửi báo cáo.");
          toast.error("Đã có lỗi xảy ra khi gửi báo cáo."); // Hiển thị toast thông báo lỗi
        }
      }
    };
    const checkReportExists = async (userId, reportId, reportType) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/reports/check`, {
          params: {
            userId: userId,
            postId: reportType === 'post' ? reportId : null,
            trackId: reportType === 'track' ? reportId : null,
            albumId: reportType === 'album' ? reportId : null,
            type: reportType,
          },
          withCredentials: true,
        });
        console.log('Check report response:', response.data);
        return response.data.exists; // Giả sử API trả về trạng thái tồn tại của báo cáo
      } catch (error) {
        console.error('Error checking report:', error);
        return false;
      }
    };
    const reasons = [
      t('offensiveContent'),
      t('copyrightViolation'),
      t('spamOrScam'),
      t('other')
    ];
  
  
 return (
    <div className="albums">
      <div className="btn-container">
        {/* link album new */}
        <Link
          to={{
            pathname: `/albums/create-newAlbum`,
            // state: { userId: userId },
          }}
        >
          <button type="button" className="btn-new">
          {t('a28')}
          </button>
        </Link>

        <div className="search-container">
          <input type="text" placeholder= {t('a30')} className="search-input" />
          <button type="button" className="btn-search">
          {t('a29')}
          </button>
        </div>
      </div>

      {/* Albums List */}
      <div className="post-header-albums position-relative">
        {
          albums && albums.length > 0 ? (
            albums.map((album) => {
              console.log("albums.creator: ",album.creatorId)

              return(
              
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
                      <span className="tracks">Tracks: 0</span>
                      <span className="likes">Likes: 0</span>
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
                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${album.id}`}>
                      <li>
                        <Link to={`/albums/album-Edit/${album.id}`} >
                          <button className="dropdown-item"> {t('a8')}</button>
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handDeleteAlbum(album.id)} >
                           {t('a9')}
                        </button>
                      </li>
                    </ul>
                  </div>
                    ) : (
                      <button
                        className="fa-regular fa-flag btn-report position-absolute top-8 end-0 me-4 border-0"
                        onClick={() => handleReport(album.id, 'album')}
                      ></button>
                    )}
                </div>
              )
            }
            )
          ) : (<div className="no-albums"> {t('a32')}</div>)
        }
      </div>
            {/* Modal báo cáo */}
            <ToastContainer />
      {showReportModal && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> {t('a33')}</h5>
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
                {reportMessage && <div className="alert alert-danger">{reportMessage}</div>} {/* Thông báo lỗi hoặc thành công */}
                <h6> {t('a34')}</h6>
                <div className="mb-3">
                  {reasons.map((reason, index) => (
                    <label className="d-block" key={index}>
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        onChange={(e) => setReportReason(e.target.value)}
                        style={{ marginRight: '10px' }}
                      /> {reason}
                    </label>
                  ))}
                </div>
                <textarea
                  className="form-control mt-2"
                  placeholder="Enter the reason for the report"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => submitReport(userId, ReportId, reportType, reportReason)}
                  className="btn btn-primary"
                >
                   {t('a6')}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason(""); // Reset lý do báo cáo
                    setReportMessage(""); // Reset thông báo
                  }}
                >
                   {t('a16')}
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