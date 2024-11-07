import React from "react";
import { images } from "../../../assets/images/images";

const AlbumDetail = () => {
  return (
    <div>
       <div className="container-fluid my-4">
              {/* Total content */}
              <div className="row text-center mb-4">
                {/* Total track */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">Total Tracks</h5>
                      <p className="card-text display-4">100</p>
                    </div>
                  </div>
                </div>
                {/* Total albums */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">Total Albums</h5>
                      <p className="card-text display-4">100</p>
                    </div>
                  </div>
                </div>
                {/* Total comments */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">Total Comments</h5>
                      <p className="card-text display-4">100</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Album */}
              <div className="row align-items-center mb-4">
                <div className="col-lg-4 col-md-6 mb-4">
                  <img
                    src={karinaImage}
                    alt="Album Image"
                    className="img-fluid rounded shadow-sm"
                  />
                </div>
                <div className="col-lg-8 col-md-6 mb-4">
                  <h4 className="mb-2">Album Name</h4>
                  <img
                    src={karinaImage}
                    alt="User Image"
                    className="rounded-circle shadow-sm me-2"
                    style={{ width: 50, height: 50 }}
                  />
                  <p className="d-inline-block mb-1">
                    <strong>User Name</strong>
                  </p>
                  <p>Released Aug 25</p>
                  <p>Genre: Lo-fi</p>
                  <a href="#" className="btn btn-danger">
                    Ban/Unban
                  </a>
                </div>
              </div>
              {/* Tracks of album */}
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
                              src={images.karinaImage}
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
              {/* About Artist */}
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <h5>About artist</h5>
                  <div className="card shadow-sm h-100">
                    <div className="row g-0 align-items-center">
                      <div className="col-md-4 text-center p-3">
                        {/* Image user */}
                        <img
                          src={karinaImage}
                          alt="User Image"
                          className="rounded-circle img-fluid border border-3 border-white"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">User Name</h5>
                          <p className="card-text">About user</p>
                          <a href="#" className="btn btn-info">
                            Get Information
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Albums of user */}
                <div className="col-lg-8 col-md-8">
                  <h5>Albums of user</h5>
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
                  <table className="table border">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col" />
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>
                          {/* Albums */}
                          <div className="d-flex align-items-center">
                            <img
                              src={images.karinaImage}
                              alt="Playlist Image"
                              className="rounded me-3"
                              style={{ width: 50 }}
                            />
                            <div>
                              <h5 className="mb-1">Albums Name</h5>
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
  );
};

export default AlbumDetail;
