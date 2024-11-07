import React from "react";
import { images } from "../../../assets/images/images";

const PlaylistDetail = () => {
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
                        src={karinaImage}
                        alt="playlist Image"
                        className="img-thumbnail border border-3 border-white"
                        style={{ width: 200, height: 200, objectFit: "cover" }}
                      />
                    </div>
                    {/* Card Body */}
                    <div className="card-body pt-5 mt-5 text-center">
                      <h5>Name playlist</h5>
                      <div className="d-flex align-items-center justify-content-center mt-3">
                        {/* Image user*/}
                        <img
                          src={karinaImage}
                          alt="User Image"
                          className="rounded-circle border border-3 border-white"
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                        {/* Username */}
                        <a href="#" className="ms-3">
                          User Name
                        </a>
                      </div>
                      <a href="#" className="btn btn-danger mt-3">
                        Ban/Unban
                      </a>
                    </div>
                  </div>
                </div>
                {/* Tracks of playlist */}
                <div className="col-lg-8 col-md-8" style={{ marginTop: 100 }}>
                  <div className="card shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="card-title mb-4">Tracks</h5>
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
                            <th>#</th>
                            <th>Track Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={karinaImage}
                                  alt="Track Image"
                                  className="rounded me-3"
                                  style={{ width: 50 }}
                                />
                                <div>
                                  <h6 className="mb-0">Track Name</h6>
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
                    </div>
                  </div>
                </div>
                {/* Playlist if user */}
                <div className="col-lg-12 col-md-12" style={{ marginTop: 100 }}>
                  <div className="card shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="card-title mb-4">Playlists of user</h5>
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
                            <th>#</th>
                            <th>Playlist Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={karinaImage}
                                  alt="Playlist Image"
                                  className="rounded me-3"
                                  style={{ width: 50 }}
                                />
                                <div>
                                  <h6 className="mb-0">Playlist Name</h6>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
};

export default PlaylistDetail;
