import React from "react";
import { images } from "../../../assets/images/images";
const UserDetail = () => {
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="sidebar col-lg-2 col-md-3 vh-100">
            {/* Logo */}
            <div className="logo p-3">
              <a href="#">
                <img src={images.adminImage} alt width="100%" />
              </a>
            </div>
            {/* Menu */}
            <div className="menu">
              <ul className="list-unstyled">
                <li className="p-3">
                  <i className="fa-solid fa-house" />
                  <a href="#" className="text-white">
                    Dashboard
                  </a>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-user" />
                  <a href="#" className="text-white">
                    Users
                  </a>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-music" />
                  <a href="#" className="text-white">
                    Tracks
                  </a>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-headphones" />
                  <a href="#" className="text-white">
                    Playlists
                  </a>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-circle-play" />
                  <a href="#" className="text-white">
                    Albums
                  </a>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-newspaper" />
                  <a href="#" className="text-white">
                    Post
                  </a>
                </li>
                <li className="p-3">
                  <i className="fa-solid fa-chart-simple" />
                  <a href="#" className="text-white">
                    Statistical
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-10 col-md-9 p-0">
            {/* Topbar */}
            <div className="topbar d-flex justify-content-end align-items-center p-3 bg-light border-bottom">
              <div className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  User name
                  <img
                    src={images.karinaImage}
                    className="rounded-pill ms-2"
                    alt="User Image"
                    style={{ width: 30, height: 30 }}
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Log Out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="container my-4">
              <div className="row">
                {/* User Information */}
                <div className="col-lg-4" style={{ marginTop: 200 }}>
                  <div className="card position-relative text-center">
                    {/* User Image */}
                    <div
                      className="position-absolute top-0 start-50 translate-middle"
                      style={{ zIndex: 1 }}
                    >
                      <img
                        src={karinaImage}
                        alt="User Image"
                        className="rounded-circle border border-3 border-white"
                        style={{ width: 150, height: 150, objectFit: "cover" }}
                      />
                    </div>
                    {/* Card Body */}
                    <div className="card-body pt-5 mt-5">
                      <div className="row">
                        {/* First Column */}
                        <div className="col-6 text-start">
                          <h6 className="card-title">User Name</h6>
                          <p className="card-text">Email: user@example.com</p>
                          <p className="card-text">Birth Date: 07/09/2024</p>
                        </div>
                        {/* Second Column */}
                        <div className="col-6 text-end">
                          <p className="card-text">Gender: Female</p>
                          <p className="card-text">Phone: +123456789</p>
                          <p className="card-text">Join Date: 2024-01-01</p>
                        </div>
                        {/* About Section */}
                        <div className="col-12 mt-3">
                          <p className="card-text">About: ???</p>
                        </div>
                      </div>
                      <a href="#" className="btn btn-danger mt-3">
                        Ban/Unban
                      </a>
                    </div>
                  </div>
                </div>
                {/* User Activities */}
                <div className="col-lg-8">
                  <div className="row mb-4">
                    {/* Total Posts */}
                    <div className="col-lg-4 mb-3">
                      <div className="card text-center bg-warning">
                        <div className="card-body">
                          <h5 className="card-title">Total Posts</h5>
                          <p className="card-text display-6">100</p>
                        </div>
                      </div>
                    </div>
                    {/* Total Likes */}
                    <div className="col-lg-4 mb-3">
                      <div className="card text-center bg-success">
                        <div className="card-body">
                          <h5 className="card-title">Total Likes</h5>
                          <p className="card-text display-6">100</p>
                        </div>
                      </div>
                    </div>
                    {/* Total Comments */}
                    <div className="col-lg-4 mb-3">
                      <div className="card text-center bg-info">
                        <div className="card-body">
                          <h5 className="card-title">Total Comments</h5>
                          <p className="card-text display-6">100</p>
                        </div>
                      </div>
                    </div>
                    {/* Total Followers */}
                    <div className="col-lg-4 mb-3">
                      <div className="card text-center bg-primary">
                        <div className="card-body">
                          <h5 className="card-title">Total Followers</h5>
                          <p className="card-text display-6">100</p>
                        </div>
                      </div>
                    </div>
                    {/* Total Followings */}
                    <div className="col-lg-4 mb-3">
                      <div className="card text-center bg-secondary">
                        <div className="card-body">
                          <h5 className="card-title">Total Followings</h5>
                          <p className="card-text display-6">100</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* User's Tracks */}
                  <div className="card mb-4">
                    <div className="card-body">
                      <h3 className="card-title">Tracks</h3>
                      <form action className="mb-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            aria-describedby="button-addon2"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                          >
                            <i className="fa-solid fa-magnifying-glass" />
                          </button>
                        </div>
                      </form>
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Track</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">1</th>
                            <td>
                              {/* Track */}
                              <div className="d-flex align-items-center">
                                <img
                                  src={images.karinaImage}
                                  alt="Track Image"
                                  className="rounded me-3"
                                  style={{ width: 50 }}
                                />
                                <div>
                                  <h5 className="mb-1">Track Name</h5>
                                  <small>by User Name</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <a href="#" className="btn btn-warning">
                                View
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Pagination */}
                  <nav className="mb-4">
                    <ul className="pagination justify-content-center">
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Previous
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                  {/* User Albums */}
                  <div className="card mb-4">
                    <div className="card-body">
                      <h3 className="card-title">Albums</h3>
                      <form action className="mb-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            aria-describedby="button-addon2"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                          >
                            <i className="fa-solid fa-magnifying-glass" />
                          </button>
                        </div>
                      </form>
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Album</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">1</th>
                            <td>
                              {/* Album */}
                              <div className="d-flex align-items-center">
                                <img
                                  src={images.karinaImage}
                                  alt="Album Image"
                                  className="rounded me-3"
                                  style={{ width: 50 }}
                                />
                                <div>
                                  <h5 className="mb-1">Album Name</h5>
                                  <small>by User Name</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <a href="#" className="btn btn-warning">
                                View
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Pagination */}
                  <nav className="mb-4">
                    <ul className="pagination justify-content-center">
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Previous
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                  {/* All Playlists */}
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Playlists</h3>
                      <form action className="mb-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            aria-describedby="button-addon2"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                          >
                            <i className="fa-solid fa-magnifying-glass" />
                          </button>
                        </div>
                      </form>
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Playlist</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">1</th>
                            <td>
                              {/* Playlist */}
                              <div className="d-flex align-items-center">
                                <img
                                  src={images.karinaImage}
                                  alt="Playlist Image"
                                  className="rounded me-3"
                                  style={{ width: 50 }}
                                />
                                <div>
                                  <h5 className="mb-1">Playlist Name</h5>
                                  <small>by User Name</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <a href="#" className="btn btn-warning">
                                View
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Pagination */}
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Previous
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            {/* End of Main Content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
