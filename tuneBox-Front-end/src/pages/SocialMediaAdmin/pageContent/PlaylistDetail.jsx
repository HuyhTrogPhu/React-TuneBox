import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import { LoadPlayListById } from "../../../service/SocialMediaAdminService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const PlaylistDetail = () => {
  const { id } = useParams();
  const [PlayList, setPlayList] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const usersPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      // Gọi API của PlayList
      const responsePlayList = await LoadPlayListById(id);
      if (responsePlayList.status) {
        setPlayList(responsePlayList.data);
      }
    };

    fetchData();
  }, [id]);

  //count cho table all user
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  //loc danh sach all user
  console.log(PlayList);
  const filteredUsers = PlayList.tracks
    ? PlayList.tracks.filter((user) =>
        user.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  //lay ra user da tim kiem
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      <div className="container-fluid">
        {/* Detail playlist */}
        <div className="row mt-4 ">
          {/* Information playlist */}
          <div className="col-lg-4 col-md-4" style={{ marginTop: 100 }}>
            <div className="card position-relative text-center">
              {/* Playlist Image */}
              <div
                className="position-absolute top-0 start-50 translate-middle"
                style={{ zIndex: 1 }}
              >
                <img
                  src={PlayList.image}
                  alt="playlist Image"
                  className="img-thumbnail border border-3 border-white"
                  style={{ width: 200, height: 200, objectFit: "cover" }}
                />
              </div>
              {/* Card Body */}
              <div className="card-body pt-5 mt-5 text-center">
                <h5>{PlayList.title}</h5>

                <a href="#" className="btn btn-danger mt-3">
                  Ban/Unban
                </a>
              </div>
            </div>
          </div>
          {/* Tracks of playlist */}
          <div className="col-lg-8 col-md-8" style={{ marginTop: 100 }}>
            <div className="card mb-4">
              <div className="card-header bg-dark text-white">
                <h5>All Tracks</h5>
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
                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: 10 }}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Create Date</th>
                        <th>Total Likes</th>
                        <th>userNickname</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {console.log(PlayList)}
                      {
                        // Kiểm tra PlayList.tracks trước khi map
                        PlayList.tracks && PlayList.tracks.length > 0 ? (
                          currentUsers.map((user) => (
                            <tr key={user.id}>
                              <td>{user.title}</td>
                              <td>{user.createDate}</td>
                              <td>{user.likeCount}</td> 
                              <td>{user.userNickname}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    navigate(
                                      `/socialadmin/TrackDetail/${user.id}`
                                    )
                                  }
                                >
                                  Views
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">No tracks available</td>
                          </tr>
                        )
                      }
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
          {/* Playlist if user */}
          <div className="col-lg-12 col-md-12" style={{ marginTop: 100 }}></div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
