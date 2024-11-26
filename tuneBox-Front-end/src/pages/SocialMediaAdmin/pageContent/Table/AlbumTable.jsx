import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ManagerCustomerDetail.css";
const AlbumTable = ({ userAlbums }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số album hiển thị mỗi trang

  // Tính toán dữ liệu hiển thị
  const totalPages = Math.ceil(userAlbums.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlbums = userAlbums.slice(startIndex, endIndex);

  // Xử lý chuyển trang
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="album-container">
      <h4>All Albums</h4>
      {Array.isArray(userAlbums) && userAlbums.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Tracks</th>
                <th>Create Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAlbums.map((album, index) => (
                <tr key={album.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>
                    <div className="album-thumbnail">
                      <img
                        src={album.albumImage}
                        alt="album img"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </div>
                  </td>
                  <td>{album.title || "No Title Available"}</td>
                  <td>{album.tracks?.length || 0}</td>
                  <td>{album.createDate.split("T")[0]}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        navigate(`/socialadmin/AlbumDetail/${album.id}`)
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
          <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
        </>
      ) : (
        <p>No Albums available</p>
      )}
    </div>
  );
};

export default AlbumTable;
