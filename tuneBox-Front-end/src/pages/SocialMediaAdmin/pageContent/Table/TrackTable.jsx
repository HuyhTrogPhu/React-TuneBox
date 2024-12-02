import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ManagerCustomerDetail.css";
const TrackTable = ({ userTrack }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số track hiển thị mỗi trang

  // Tính toán dữ liệu hiển thị
  const totalPages = Math.ceil(userTrack.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTracks = userTrack.slice(startIndex, endIndex);

  // Xử lý chuyển trang
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="track-container">
 
      <h4>All Tracks</h4>
      {Array.isArray(userTrack) && userTrack.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Track Name</th>
                <th>Like Count</th>
                <th>Genre</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTracks.map((track, index) => (
                <tr key={track.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{track.name}</td>
                  <td>{track.likeCount || "0"}</td>
                  <td>{track.genreName}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        navigate(`/socialadmin/TrackDetail/${track.id}`)
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
          <div className="pagination-controls d-flex justify-content-between mt-3">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No tracks available</p>
      )}
    </div>
  );
};

export default TrackTable;
