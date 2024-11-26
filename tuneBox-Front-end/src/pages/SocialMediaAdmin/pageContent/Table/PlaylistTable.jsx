import React, { useState } from "react";
import "../../css/ManagerCustomerDetail.css";
import { useNavigate } from "react-router-dom";
const PlaylistTable = ({ userPlayLists }) => {
    const navigate = useNavigate();
  // State quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tính toán dữ liệu hiển thị
  const totalPages = Math.ceil(userPlayLists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = userPlayLists.slice(startIndex, startIndex + itemsPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="playlist-container">
    <h4>All Playlists</h4>
        {currentItems.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Tracks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((playlist, index) => (
                  <tr key={index}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <img
                        src={playlist.imagePlaylist}
                        alt="playlist img"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>{playlist.title || "No Title Available"}</td>
                    <td>{playlist.tracks?.length || 0}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          navigate(`/socialadmin/PlaylistDetail/${playlist.id}`)
                        }
                      >
                        Views
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang */}
            <nav>
              <ul className="pagination">
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
          <p>No Playlists available</p>
        )}
  </div>
  );
};

export default PlaylistTable;
