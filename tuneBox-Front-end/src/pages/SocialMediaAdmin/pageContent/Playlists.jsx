import React from "react";
import { images } from "../../../assets/images/images";

const Playlists = () => {
  return (
    <div>
          <div className="container-fluid">
              {/* Total Playlits */}
              <div className="row">
                <div className="col-lg-3 mt-4 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Total Playlists</h5>
                      <p className="card-text">1000</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* New Playlists */}
                <div className="col-lg-6 col-md-6 mt-4">
                  <h5>New Playlists</h5>
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
                          {/* Playlists */}
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
                {/* Trending Playlits */}
                <div className="col-lg-6 col-md-6 mt-4">
                  <h5>Trending Playlists</h5>
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
                          {/* Playlists */}
                          <div className="d-flex align-items-center">
                            <img
                              src={images.karinaImage}
                              alt="Playlit Image"
                              className="rounded me-3"
                              style={{ width: 50 }}
                            />
                            <div>
                              <h5 className="mb-1">Playlists Name</h5>
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
                {/* Playlits report */}
                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-header bg-danger text-white">
                      <h5>Playlists Report</h5>
                    </div>
                    <div className="card-body">
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
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Reporter</th>
                            <th>Reported Person</th>
                            <th>Reason</th>
                            <th>Date Reported</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>Karina</td>
                            <td>Trong Phu</td>
                            <td>WOW</td>
                            <td>07/09/2024</td>
                            <td>
                              <a href="#" className="btn btn-danger btn-sm">
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
                {/* All playlist */}
                <div className="col-lg-12  mt-4">
                  <div className="card shadow-sm">
                    <div className="card-header bg-success text-white">
                      <h5>All Playlists</h5>
                    </div>
                    <div className="card-body">
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
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <td />
                            <th>Name playlit</th>
                            <th>Tyle</th>
                            <th>Total track</th>
                            <th>Released date</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>
                              <img
                                src={images.karinaImage}
                                alt="Album Image"
                                className="rounded me-3"
                                style={{ width: 50 }}
                              />
                            </td>
                            <td>Karina</td>
                            <td>Private</td>
                            <td>10</td>
                            <td>08/09/2024</td>
                            <td>Love</td>
                            <td>
                              <a href="#" className="btn btn-danger btn-sm">
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

export default Playlists;
