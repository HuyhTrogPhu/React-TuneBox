import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoadTrackReport,
  LoadPostReport,
  LoadAlbumReport,
  LoadUserReport,
  DeniedRP,
  ApproveRP,
  DeniedRPTrack,
  ApproveRPTrack,
  DeniedRPAlbum,
  ApproveRPAlbum,
  LoadReportDetail,
  LoadTrackById,
  LoadAlbumsById,
  LoadReportByTrackId,
  LoadReportByAlbumId,
  LoadUser,
  LoadReportByReportedId,
} from "../../../service/SocialMediaAdminService";
import "../css/card.css";
const Report = () => {
  const [ReportType, setReportType] = useState([]);
  const [ReportTrack, setReportTrack] = useState([]);
  const [ReportTrackDetail, setReportTrackDetail] = useState([]);
  const [ReportPost, setReportPost] = useState([]);
  const [ReportPostDetail, setReportPostDetail] = useState([]);
  const [ReportAlbum, setReportAlbum] = useState([]);
  const [ReportAlbumDetail, setReportAlbumDetail] = useState([]);
  const [ReportUser, setReportUser] = useState([]);
  const [ReportUserDetail, setReportUserDetail] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModalAlbum, setShowModalAlbum] = useState(false);
  const [showModalUser, setShowModalUser] = useState(false);

  const [modalData, setModalData] = useState(null);
  const [modalDataAlbum, setModalDataAlbum] = useState(null);
  const [modalDataUser, setModalDataUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [currentTrackPage, setCurrentTrackPage] = useState(0);
  const [currentAlbumPage, setCurrentAlbumPage] = useState(0);
  const [currentUserPage, setCurrentUserPage] = useState(0);

  const [pageSize, setPageSize] = useState(5); // Kích thước trang
  const [totalPagesReport, setTotalPagesReport] = useState(0);
  const [totalPagesAlbum, setTotalPagesAlbumt] = useState(0);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const navigate = useNavigate();
  const fetchData = async () => {
    //rp Album
    const responseLoadAllAlbumReport = await LoadAlbumReport(
      currentAlbumPage,
      pageSize
    );
    if (responseLoadAllAlbumReport.status) {
      setReportAlbum(responseLoadAllAlbumReport.data);
      setTotalPagesAlbumt(responseLoadAllAlbumReport.totalPages);
    }

    //rp user
    const responseLoadAllUserReport = await LoadUserReport(
      currentAlbumPage,
      pageSize
    );
    if (responseLoadAllUserReport.status) {
      setReportUser(responseLoadAllUserReport.data);
      setTotalPagesUser(responseLoadAllUserReport.totalPages);
    }

    //rp Track
    const responseLoadAllTrackReport = await LoadTrackReport(
      currentTrackPage,
      pageSize
    );
    if (responseLoadAllTrackReport.status) {
      setReportTrack(responseLoadAllTrackReport.data);
      setTotalPagesReport(responseLoadAllTrackReport.totalPages);
    }
  };
  // goi Api
  useEffect(() => {
    fetchData();
  }, [currentTrackPage, currentAlbumPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowModalTrack = async (id) => {
    try {
      // Lấy dữ liệu từ API theo id
      const response = await LoadTrackById(id);
      setModalData(response.data);
      const responseDetail = await LoadReportByTrackId(id);
      setReportTrackDetail(responseDetail.data);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  const handleShowModalAlbum = async (id) => {
    try {
      console.warn(id);
      // Lấy dữ liệu từ API theo id
      const response = await LoadAlbumsById(id);
      setModalDataAlbum(response.dataAlbums);
      const responseDetail = await LoadReportByAlbumId(id);
      setReportAlbumDetail(responseDetail.data);
      setShowModalAlbum(true);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  //modal REPORTED
  const handleShowModalUser = async (id) => {
    try {
      console.warn(id);
      // Lấy dữ liệu từ API theo id
      const response = await LoadUser(id);
      setModalDataUser(response.data);
      const responseDetail = await LoadReportByReportedId(id);
      setReportUserDetail(responseDetail.data);
      setShowModalUser(true);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowModalAlbum(false);
    setShowModalUser(false);
  };

  const handleDenied = async (id, type) => {
    switch (type) {
      case "track":
        const Track = await DeniedRPTrack(id);
        console.warn(Track);
        break;
      case "album":
        const Album = await DeniedRPAlbum(id);
        console.warn(Album);
        break;
      case "user":
        const user = await DeniedRP(id);
        console.warn(user);
        break;
    }
    handleCloseModal();
    fetchData();
  };

  const handleApprove = async (id, type) => {
    switch (type) {
      case "track":
        const Track = await ApproveRPTrack(id);
        console.warn(Track);
        break;
      case "album":
        const Album = await ApproveRPAlbum(id);
        console.warn(Album);
        break;
      case "user":
        const user = await ApproveRP(id);
        console.warn(user);
        break;
    }
    handleCloseModal();
    fetchData();
  };

  const countReportsByTrack = (reportData) => {
    return reportData.reduce((acc, report) => {
      const { trackId } = report;
      if (!acc[trackId]) {
        acc[trackId] = 0;
      }
      acc[trackId]++;
      return acc;
    }, {});
  };
  const countReportsByAlbum = (reportData) => {
    return reportData.reduce((acc, report) => {
      const { albumId } = report;
      if (!acc[albumId]) {
        acc[albumId] = 0;
      }
      acc[albumId]++;
      return acc;
    }, {});
  };

  const countReportsByUser = (reportData) => {
    return reportData.reduce((acc, report) => {
      const { userReportedId } = report;
      if (!acc[userReportedId]) {
        acc[userReportedId] = 0;
      }
      acc[userReportedId]++;
      return acc;
    }, {});
  };
  const trackReportCounts = countReportsByTrack(ReportTrack);
  const albumReportCounts = countReportsByAlbum(ReportAlbum);
  const userReportCounts = countReportsByUser(ReportUser);
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 no-hover">
            <div className="card-header bg-dark text-white">
              {console.warn(ReportTrack)}
              <h5 className="text-light">Report Track</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Report Number</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ReportTrack.reduce((acc, report) => {
                    if (!acc.some((item) => item.trackId === report.trackId)) {
                      acc.push(report);
                    }
                    return acc;
                  }, []).map((track) => (
                    <tr key={track.trackId}>
                      <td>{track.trackName}</td>
                      <td>{trackReportCounts[track.trackId]}</td>

                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleShowModalTrack(track.trackId)}
                        >
                          Views
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center text-center">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">«</span>
                    </button>
                  </li>
                  {[...Array(totalPagesReport).keys()].map((number) => (
                    <li
                      key={number + 1}
                      className={`page-item ${currentPage === number + 1 ? "active" : ""
                        }`}
                    >
                      <button
                        onClick={() => handlePageChange(number + 1)}
                        className="page-link"
                      >
                        {number + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${currentPage === totalPagesReport ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">»</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4 no-hover">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">Report Album</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Report Number</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ReportAlbum.reduce((acc, report) => {
                    if (!acc.some((item) => item.albumId === report.albumId)) {
                      acc.push(report);
                    }
                    return acc;
                  }, []).map((album) => (
                    <tr key={album.albumId}>
                      <td>{album.albumName}</td>
                      <td>{albumReportCounts[album.albumId]}</td>

                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleShowModalAlbum(album.albumId)}
                        >
                          Views
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center text-center">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">«</span>
                    </button>
                  </li>
                  {[...Array(totalPagesAlbum).keys()].map((number) => (
                    <li
                      key={number + 1}
                      className={`page-item ${currentPage === number + 1 ? "active" : ""
                        }`}
                    >
                      <button
                        onClick={() => handlePageChange(number + 1)}
                        className="page-link"
                      >
                        {number + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${currentPage === totalPagesReport ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">»</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4 no-hover">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">Report User</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Report Number</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ReportUser.reduce((acc, report) => {
                    if (
                      !acc.some(
                        (item) => item.userReportedId === report.userReportedId
                      )
                    ) {
                      acc.push(report);
                    }
                    return acc;
                  }, []).map((album) => (
                    <tr key={album.userReportedId}>
                      <td>{album.userReportedName}</td>
                      <td>{userReportCounts[album.userReportedId]}</td>

                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleShowModalUser(album.userReportedId)
                          }
                        >
                          Views
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center text-center">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">«</span>
                    </button>
                  </li>
                  {[...Array(totalPagesAlbum).keys()].map((number) => (
                    <li
                      key={number + 1}
                      className={`page-item ${currentPage === number + 1 ? "active" : ""
                        }`}
                    >
                      <button
                        onClick={() => handlePageChange(number + 1)}
                        className="page-link"
                      >
                        {number + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${currentPage === totalPagesReport ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">»</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Track reported detail
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {console.log(modalData)}
                {modalData ? (
                  <>
                    <p>Track Name: {modalData.name}</p>
                    <p>
                      Track created day: {modalData.createDate
                        ? new Date(modalData.createDate).toLocaleDateString('vi')
                        : "N/A"}
                    </p>

                    <p>User Name: {modalData.userName}</p>
                    <p>Genre Name: {modalData.genreName}</p>
                    <p>
                      Status:{" "}
                      {ReportTrackDetail.some(
                        (track) => track.status === "RESOLVED"
                      )
                        ? "RESOLVED"
                        : "DISMISSED"}
                    </p>
                    {/* table */}
                    {console.table(ReportTrackDetail)}

                    <table className="table">
                      <thead>
                        <tr>
                          <th>createDate</th>
                          <th>reason</th>
                          <th>Reporter</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ReportTrackDetail.map((track) => (
                          <tr key={track.id}>
                            <td>{new Date(track.createDate).toLocaleDateString('vi')}</td>

                            <td>{track.reason}</td>
                            <td>{track.userName}</td>
                            <td>{/* Flexbox to align buttons in one row */}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                {console.warn(modalData.id)
                }
                <button
                  className="btn btn-info"
                  onClick={() =>
                    navigate(`/socialadmin/TrackDetail/${modalData.id}`)
                  }
                >
                  View Track Detail
                </button>
                <div className="d-flex justify-content-between gap-1">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleApprove(modalData.id, "track")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleDenied(modalData.id, "track")}
                  >
                    Denied
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-"
                  onClick={handleCloseModal}
                ></button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalAlbum && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Album reported detail
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {console.log(modalDataAlbum)}
                {modalDataAlbum ? (
                  <>
                    <p>Album Name: {modalDataAlbum.title}</p>
                    <p>
                      Report created day:{" "}
                      {modalDataAlbum.createDate.split("T")[0]}
                    </p>
                    <p>User Name: {modalDataAlbum.creator}</p>

                    <p>
                      Status:{" "}
                      {ReportAlbumDetail.some(
                        (track) => track.status === "RESOLVED"
                      )
                        ? "RESOLVED"
                        : "DISMISSED"}
                    </p>
                    {/* table */}
                    {console.table(ReportAlbumDetail)}

                    <table className="table">
                      <thead>
                        <tr>
                          <th>createDate</th>
                          <th>reason</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ReportAlbumDetail.map((track) => (
                          <tr key={track.id}>
                            <td>{track.createDate}</td>
                            <td>{track.reason}</td>
                            <td>{track.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-info"
                  onClick={() =>
                    navigate(`/socialadmin/AlbumDetail/${modalDataAlbum.id}`)
                  }
                >
                  View Album Detail
                </button>

                {/* Flexbox to align buttons in one row */}
                <div className="d-flex justify-content-between gap-1">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleApprove(modalDataAlbum.id, "album")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleDenied(modalDataAlbum.id, "album")}
                  >
                    Denied
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalUser && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  User reported detail
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {console.log(modalDataUser)}
                {modalDataUser ? (
                  <>
                    <p>User reported Name: {modalDataUser.userName}</p>
                    <p>
                      User created day: {modalDataUser.createDate.split("T")[0]}
                    </p>
                    <p>
                      User Reported Approve Count: {modalDataUser.reportCount}
                    </p>

                    {/* table */}
                    {console.table(ReportUserDetail)}

                    <table className="table">
                      <thead>
                        <tr>
                          <th>createDate</th>
                          <th>reason</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ReportUserDetail.map((track) => (
                          <tr key={track.id}>
                            <td>{track.createDate}</td>
                            <td>{track.reason}</td>
                            <td>{track.status}</td>
                            <td>
                              <div className="d-flex justify-content-between gap-1">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() =>
                                    handleApprove(track.id, "user")
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => handleDenied(track.id, "user")}
                                >
                                  Denied
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-info"
                  onClick={() =>
                    navigate(`/socialadmin/detailUser/${modalDataUser.id}`)
                  }
                >
                  View User Detail
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                {/* Flexbox to align buttons in one row */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
