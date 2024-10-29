import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import { useNavigate } from "react-router-dom";
import { LoadTrack } from "../../../service/SocialMediaAdminService";
const Track = () => {
  const [AllUser, setAllUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [NewUser, setNewUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [postCount, setPostCount] = useState(0);
  const usersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Gọi API load all user
      const responseLoadAllUser = await LoadTrack();
      console.log("All Track:", responseLoadAllUser);
      if (responseLoadAllUser.status) {
        setAllUser(responseLoadAllUser.data);
        console.log(AllUser);
      }
    };
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
  const filteredUsers = AllUser.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //lay ra user da tim kiem
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* New Users */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5>New Track</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>createDate</th>
                    <th>Total Likes</th>
                    <th>Total Comments</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {NewUser.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.createDate}</td>
                      <td>{user.likes.length}</td>
                      <td>{user.comments.length}</td>
                      <td>{user.description}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            navigate(`/socialadmin/TrackDetail/${user.id}`)
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
              <h5>Trending Track</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Total Posts</th>
                    <th>Total Likes</th>
                    <th>Total Comments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Karina</td>
                    <td>1000</td>
                    <td>1000</td>
                    <td>1000</td>
                    <td>
                      <button className="btn btn-danger">Views</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* All Users */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5>All Track</h5>
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
                    <th>Name</th>
                    <th>createDate</th>
                    <th>Total Likes</th>
                    <th>Total Comments</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.createDate}</td>
                      <td>{user.likes.length}</td>
                      <td>{user.comments.length}</td>
                      <td>{user.description}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            navigate(`/socialadmin/TrackDetail/${user.id}`)
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

        {/* Report */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5>Report</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Report Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Karina</td>
                    <td>05/09/2023</td>
                    <td>
                      <button className="btn btn-danger">Views</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
