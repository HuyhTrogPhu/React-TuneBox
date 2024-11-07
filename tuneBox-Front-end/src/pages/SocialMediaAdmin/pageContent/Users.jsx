import React from "react";
import { images } from "../../../assets/images/images";

const Users = () => {
  return (
    <div>
       <div className="container p-4">
              {/* New Users */}
              <div className="row mb-4">
                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                      <h5>New Users</h5>
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
                            <th>Name</th>
                            <th>Date of Joining</th>
                            <th>Following</th>
                            <th>Followers</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>Karina</td>
                            <td>07/09/2024</td>
                            <td>2</td>
                            <td>10</td>
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
                {/* User Report */}
                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-header bg-danger text-white">
                      <h5>User Reports</h5>
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
              </div>
              {/* All Users */}
              <div className="row mb-4">
                {/* Featured Users */}
                <div className="col-lg-12 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-header bg-warning text-white">
                      <h5>Featured Users</h5>
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
                            <th>Name</th>
                            <th>Date of Joining</th>
                            <th>Total Posts</th>
                            <th>Total Likes</th>
                            <th>Total Comments</th>
                            <th>Followers</th>
                            <th>Following</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>Karina</td>
                            <td>07/09/2024</td>
                            <td>100</td>
                            <td>100</td>
                            <td>100</td>
                            <td>1000</td>
                            <td>1000</td>
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
                <div className="col-lg-12">
                  <div className="card shadow-sm">
                    <div className="card-header bg-success text-white">
                      <h5>All Users</h5>
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
                            <th>Name</th>
                            <th>Date of Joining</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Total Posts</th>
                            <th>Total Likes</th>
                            <th>Total Comments</th>
                            <th>Followers</th>
                            <th>Following</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>1</th>
                            <td>Karina</td>
                            <td>07/09/2024</td>
                            <td>karina@gmail.com</td>
                            <td>0909090909</td>
                            <td>
                              10/A, Phan Van Hon Street, District 12, Ho Chi
                              Minh City, Vietnam
                            </td>
                            <td>100</td>
                            <td>100</td>
                            <td>100</td>
                            <td>1000</td>
                            <td>1000</td>
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

export default Users;
