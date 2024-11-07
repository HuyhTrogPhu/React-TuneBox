import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import { useNavigate } from "react-router-dom";
import {
  LoadAlbum,
  LoadAlbumReport,
  DeniedRPTrack,
  ApproveRPTrack,
  LoadTrackReportDetail
} from "../../../service/SocialMediaAdminService";
const Albums = () => {
  const [AllUser, setAllUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [NewUser, setNewUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [Report, setReport] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const usersPerPage = 5;
  const navigate = useNavigate();
  const fetchData = async () => {
    // Gọi API load all playlist
    const responseLoadAllUser = await LoadAlbum();
    console.log("All album:", responseLoadAllUser);
    if (responseLoadAllUser.status) {
      setAllUser(responseLoadAllUser.data);
      console.log(AllUser);
    }

    // Gọi API load all Album RP
    const responseLoadAllReport = await LoadAlbumReport();
    console.log("All Report:", responseLoadAllReport);
    if (responseLoadAllReport.status) {
      setReport(responseLoadAllReport.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const lastFiveUsers = AllUser.slice(-5);
    setNewUser(lastFiveUsers);
  }, [AllUser]);

  //count cho table all user
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  //loc danh sach all user
  // Lọc danh sách all user
  const filteredUsers = AllUser.filter(
    (user) =>
      user.title && user.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //lay ra user da tim kiem
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  
  const handleShowModal = async (id) => {
    try {
      // Lấy dữ liệu từ API theo id
      const response = await LoadTrackReportDetail(id);
      setModalData(response.data); // Lưu dữ liệu vào state
      setShowModal(true); // Hiển thị modal
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleDenied =(id) =>{
    const Denied = DeniedRPTrack(id);
    if (Denied.status){
      setShowModal(false);
      fetchData(); 
    }
  }
  const handleApprove =(id) =>{
    const Approve = ApproveRPTrack(id);
    if (Approve.status){
      setShowModal(false);
      fetchData(); 
    }
  }
  return (
    <div className="container mt-4">
      <div className="row">
        {/* New Users */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">New Album</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title </th>
                    <th>Create Date</th>
                    <th>Total tracks</th>
                  </tr>
                </thead>
                <tbody>
                  {NewUser.map((user) => (
                    <tr key={user.id}>
                      <td>{user.title}</td>
                      <td>{user.createDate}</td>
                      <td>{user.tracks.length}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            navigate(`/socialadmin/AlbumDetail/${user.id}`)
                          }
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

        {/* Featured Users */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">All Album</h5>
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-secondary" style={{ marginTop: 10 }}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title </th>

                      <th>Create Date</th>
                      <th>Total tracks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NewUser.map((user) => (
                      <tr key={user.id}>
                        <td>{user.title}</td>

                        <td>{user.createDate}</td>
                        <td>{user.tracks.length}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              navigate(`/socialadmin/AlbumDetail/${user.id}`)
                            }
                          >
                            Views
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav>
                  <ul className="pagination">
                    {pageNumbers.map((page) => (
                      <li
                        key={page}
                        className={`page-item ${
                          page === currentPage ? "active" : ""
                        }`}
                      >
                        <button
                          onClick={() => setCurrentPage(page)}
                          className="page-link"
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">Report</h5>
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
                  {Report.map((rp) => (
                    <tr key={rp.id}>
                      <td>{rp.name}</td>
                      <td>{rp.createDate}</td>
                      <td>{rp.status}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleShowModal(rp.id)}
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
                            <p>Reson: {modalData.reason}</p>
                            
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
                          Closing
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
