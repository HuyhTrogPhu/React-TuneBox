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

const Report = () => {
  const [ReportTrack, setReportTrack] = useState([]);
  const [ReportPost, setReportPost] = useState([]);
  const [ReportAlbum, setReportAlbum] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    //rp post
    const responseLoadAllPostReport = await LoadPostReport();
    if (responseLoadAllPostReport.status) {
      setReportPost(responseLoadAllPostReport.data);
    }
    //rp Album
    const responseLoadAllAlbumReport = await LoadAlbumReport();
    if (responseLoadAllAlbumReport.status) {
      setReportAlbum(responseLoadAllAlbumReport.data);
    }

    //rp Track
    const responseLoadAllTrackReport = await LoadTrackReport();
    if (responseLoadAllTrackReport.status) {
      setReportTrack(responseLoadAllTrackReport.data);
    }
  };
  // goi Api
  useEffect(() => {
    fetchData();
  }, []);


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
  const handleCloseModal = () => setShowModal(false);
  const handleDenied = async (id) => {
    const Denied = await DeniedRP(id);
    if (Denied.status) {
      setShowModal(false);
      fetchData();
    }
  };
  const handleApprove = async (id) => {
    const Approve = await ApproveRP(id);
    if (Approve.status) {
      setShowModal(false);
      fetchData();
    }
  };
  return (
    <div>
      <div className="row">
        {/* All Users */}

        {/* Report */}
        {console.log(Report)}
        <div className="col-md-6">
          <div className="card mb-4">
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
            </div>
          </div>
        </div>
      </div>



{/* modal */}
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
                            <p>Track Name: {modalData.track.name}</p>
                            <p>Status: {modalData.status}</p>
                            <p>Report created day: {modalData.createDate}</p>
                            <p>reason: {modalData.reason}</p>
                            
                          </>
                        ) : (
                          <p>In loading process...</p>
                        )}
                      </div>
                      <div className="modal-footer">
                      <button
                            className="btn btn-info"
                            onClick={() =>
                              navigate(`/socialadmin/TrackDetail/${modalData.track.id}`)
                            }
                          >
                            Views Track Detail
                          </button>
                      <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>handleApprove(modalData.id)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>handleDenied(modalData.id)}
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
