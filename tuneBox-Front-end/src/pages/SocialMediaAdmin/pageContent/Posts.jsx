import React from "react";
import { images } from "../../../assets/images/images";

const Posts = () => {
  return (
    <div>
       <div className="container-fluid p-5">
              {/* Total Post */}
              <div className="row">
                <div className="col-lg-3 mt-4 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Total Post</h5>
                      <p className="card-text">1000</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* New Post */}
                <div className="col-lg-6 col-md-6 mt-3">
                  <h5>New Post</h5>
                  <div className="row">
                    <div className="col-lg-6">
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
                    </div>
                    <div className="col-lg-6">
                      <form action className="mb-4">
                        <div className="input-group">
                          <select className="form-select">
                            <option hidden selected>
                              Sort by type
                            </option>
                            <option value="post">Post</option>
                            <option value="track">Track</option>
                          </select>
                        </div>
                      </form>
                    </div>
                  </div>
                  <table className="table border">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Post by</th>
                        <th scope="col">Type Post</th>
                        <th scope="col">Create at</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Karina</td>
                        <td>Post/Track</td>
                        <td>10/09/2024</td>
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
                {/* Trending Post */}
                <div className="col-lg-6 col-md-6 mt-3">
                  <h5>Trending Post</h5>
                  <div className="row">
                    <div className="col-lg-6">
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
                    </div>
                    <div className="col-lg-6">
                      <form action className="mb-4">
                        <div className="input-group">
                          <select className="form-select">
                            <option hidden selected>
                              Sort by type
                            </option>
                            <option value="post">Post</option>
                            <option value="track">Track</option>
                          </select>
                        </div>
                      </form>
                    </div>
                  </div>
                  <table className="table border">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Post by</th>
                        <th scope="col">Type Post</th>
                        <th scope="col">Create at</th>
                        <th scope="col">Total Likes</th>
                        <th scope="col">Total Comments</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Karina</td>
                        <td>Post/Track</td>
                        <td>10/09/2024</td>
                        <td>10000</td>
                        <td>100</td>
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
              {/* Post report */}
              <div className="col-lg-6">
                <div className="card shadow-sm">
                  <div className="card-header bg-danger text-white">
                    <h5>Post Reports</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6">
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
                      </div>
                      <div className="col-lg-6">
                        <form action className="mb-4">
                          <div className="input-group">
                            <select className="form-select">
                              <option hidden selected>
                                Sort by type
                              </option>
                              <option value="post">Post</option>
                              <option value="track">Track</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
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
              {/* All Post*/}
              <div className="col-lg-12  mt-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-success text-white">
                    <h5>All Post</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6">
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
                      </div>
                      <div className="col-lg-6">
                        <form action className="mb-4">
                          <div className="input-group">
                            <select className="form-select">
                              <option hidden selected>
                                Sort by type
                              </option>
                              <option value="post">Post</option>
                              <option value="track">Track</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Post by</th>
                          <th>Type post</th>
                          <th>Create at</th>
                          <th>Total Likes</th>
                          <th>Total Comments</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>Karina</td>
                          <td>Track/Post</td>
                          <td>08/09/2024</td>
                          <td>100000</td>
                          <td>100</td>
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
  );
};

export default Posts;
