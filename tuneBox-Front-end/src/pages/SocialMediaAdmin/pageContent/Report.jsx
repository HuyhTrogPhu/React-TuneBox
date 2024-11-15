import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoadTrackReport,
  LoadPostReport,
  LoadAlbumReport,
  DeniedRP,
  ApproveRP,
  LoadReportDetail,
} from "../../../service/SocialMediaAdminService";
import "../css/card.css";
const Report = () => {
  const [ReportTrack, setReportTrack] = useState([]);
  const [ReportPost, setReportPost] = useState([]);
  const [ReportAlbum, setReportAlbum] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalAlbum, setShowModalAlbum] = useState(false);
 
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Trạng thái trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Kích thước trang
  const [totalPagesReport, setTotalPagesReport] = useState(0); 
  const [totalPagesAlbum, setTotalPagesAlbumt] = useState(0);
  const navigate = useNavigate();
  const fetchData = async () => {
    //rp post
    const responseLoadAllPostReport = await LoadPostReport(
      currentPage,
      pageSize
    );
    if (responseLoadAllPostReport.status) {
      setReportPost(responseLoadAllPostReport.data);
      setTotalPagesReport(responseLoadAllPostReport.totalPages);
    }
    //rp Album
    const responseLoadAllAlbumReport = await LoadAlbumReport(
      currentPage,
      pageSize
    );
    if (responseLoadAllAlbumReport.status) {
      setReportAlbum(responseLoadAllAlbumReport.data);
      setTotalPagesAlbumt(responseLoadAllPostReport.totalPages);
    }

    //rp Track
    const responseLoadAllTrackReport = await LoadTrackReport(
      currentPage,
      pageSize
    );
    if (responseLoadAllTrackReport.status) {
      setReportTrack(responseLoadAllTrackReport.data);
    }
  };
  // goi Api
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowModalTrack = async (id) => {
    try {
      // Lấy dữ liệu từ API theo id
      const response = await LoadReportDetail(id);
      setModalData(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  const handleShowModalAlbum = async (id) => {
    try {
      // Lấy dữ liệu từ API theo id
      const response = await LoadReportDetail(id);
      setModalData(response.data);
      setShowModalAlbum(true);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  const handleCloseModal = () => {setShowModal(false);setShowModalAlbum(false);}
  const handleDenied = async (id) => {
    const Denied = await DeniedRP(id);
    if (Denied.status) {
      setShowModal(false);
      setShowModalAlbum(false);
      fetchData();
    }
  };
  const handleApprove = async (id) => {
    const Approve = await ApproveRP(id);
    if (Approve.status) {
      setShowModal(false);
      setShowModalAlbum(false);
      fetchData();
    }
  };
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <div className=" mb-4 no-hover" >
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">Report Track</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Report Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ReportTrack.map((rp) => (
                    <tr key={rp.id}>
                      <td>{rp.trackName}</td>
                      <td>{rp.createDate}</td>
                      <td>{rp.status}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleShowModalTrack(rp.id)}
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
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
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
                      className={`page-item ${
                        currentPage === number + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        onClick={() => paginate(number + 1)}
                        className="page-link"
                      >
                        {number + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPagesReport ? "disabled" : ""
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
          <div className=" mb-4 no-hover" >
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">Report Album</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Report Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ReportAlbum.map((rp) => (
                    <tr key={rp.id}>
                      <td>{rp.albumName}</td>
                      <td>{rp.createDate}</td>
                      <td>{rp.status}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleShowModalAlbum(rp.id)}
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
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
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
                      className={`page-item ${
                        currentPage === number + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        onClick={() => paginate(number + 1)}
                        className="page-link"
                      >
                        {number + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPagesReport ? "disabled" : ""
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Chi tiết Report
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {modalData ? (
                  <>
                    <p>Track Name: {modalData.trackName}</p>
                    <p>Status: {modalData.status}</p>
                    <p>Report created day: {modalData.createDate}</p>
                    <p>Reason: {modalData.reason}</p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-info"
                  onClick={() =>
                    navigate(`/socialadmin/TrackDetail/${modalData.trackId}`)
                  }
                >
                  View Track Detail
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleApprove(modalData.id)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleDenied(modalData.id)}
                >
                  Denied
                </button>
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Chi tiết Report
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {modalData ? (
                  <>
                    <p>Album Name: {modalData.albumName }</p>
                    <p>Status: {modalData.status}</p>
                    <p>Report created day: {modalData.createDate}</p>
                    <p>Reason: {modalData.reason}</p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-info"
                  onClick={() =>
                    navigate(`/socialadmin/AlbumDetail/${modalData.albumId}`)
                  }
                >
                  View Album Detail
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleApprove(modalData.id)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleDenied(modalData.id)}
                >
                  Denied
                </button>
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
    </div>
  );
};

export default Report;
