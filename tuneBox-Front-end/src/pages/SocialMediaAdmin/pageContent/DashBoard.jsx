import React from 'react'

const DashBoard = () => {
  return (
    <div>
      {/* Statistical */}
              <div className="row p-5 text-white">
                {/* Total Users */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="p-3 bg-primary rounded shadow-sm">
                    <h5>Total Users</h5>
                    <h4>10,000</h4>
                    <p>
                      +1.20% <span>than last week</span>
                    </p>
                  </div>
                </div>
                {/* Total Likes */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="p-3 bg-success rounded shadow-sm">
                    <h5>Total Likes</h5>
                    <h4>10,000</h4>
                    <p>
                      -1.20% <span>than last week</span>
                    </p>
                  </div>
                </div>
                {/* Total Comments */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="p-3 bg-warning rounded shadow-sm">
                    <h5>Total Comments</h5>
                    <h4>10,000</h4>
                    <p>
                      +1.20% <span>than last week</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="row mb-5">
                {/* Chart */}
                <div className="col-lg-6 mb-4">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <div className="d-flex justify-content-between">
                      <h5>Total/Unique visitors</h5>
                      <h5>
                        <strong>5,000/10,000</strong>
                      </h5>
                    </div>
                    <div className="chart">
                      {/* Chart content */}
                      <table className="charts-css area hide-data">
                        <caption> Front End Developer Salary </caption>
                        <tbody>
                          <tr>
                            <td style={{ marginLeft: "20%", height: "40%" }}>
                              {" "}
                              <span className="data"> $40K </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ marginLeft: "40%", height: "80%" }}>
                              {" "}
                              <span className="data"> $80K </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ marginLeft: "80%", height: "60%" }}>
                              {" "}
                              <span className="data"> $60K </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ marginLeft: "60%", height: "100%" }}>
                              {" "}
                              <span className="data"> $100K </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ marginLeft: "100%", height: "30%" }}>
                              {" "}
                              <span className="data"> $30K </span>{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Report */}
                <div className="col-lg-6 mb-4">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <h5>Report of user</h5>
                    <form action className="mb-4" />
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
                    <table className="table table-danger table-striped mt-3">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Report date</th>
                          <th>Report type</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>Karina</td>
                          <td>07/09/2024</td>
                          <td>Post</td>
                          <td>
                            <a href="#" className="btn btn-danger btn-sm">
                              View
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="row mb-5">
                {/* New register */}
                <div className="col-lg-6 mb-4">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <h5>New Registrations</h5>
                    <form action className="mb-4" />
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
                    <table className="table table-info table-striped mt-3">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name user</th>
                          <th>Date of Joining</th>
                          <th>Total post</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>Karian</td>
                          <td>07/09/2024</td>
                          <td>2</td>
                          <td>
                            <a href="#" className="btn btn-danger btn-sm">
                              View
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Trending user */}
                <div className="col-lg-6 mb-4">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <h5>Trending User</h5>
                    <form action className="mb-4" />
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
                    <table className="table table-success table-striped mt-3">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name user</th>
                          <th>Date of Joining</th>
                          <th>Follower</th>
                          <th>Total post</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>Karian</td>
                          <td>07/09/2024</td>
                          <td>10.000</td>
                          <td>1000</td>
                          <td>
                            <a href="#" className="btn btn-danger btn-sm">
                              View
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
    </div>
  )
}

export default DashBoard
{/* Statistical */}
              <div className="row p-5 text-white">
                {/* Total Users */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="p-3 bg-primary rounded shadow-sm">
                    <h5>Total Users</h5>
                    <h4>10,000</h4>
                    <p>
                      +1.20% <span>than last week</span>
                    </p>
                  </div>
                </div>
                {/* Total Likes */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="p-3 bg-success rounded shadow-sm">
                    <h5>Total Likes</h5>
                    <h4>10,000</h4>
                    <p>
                      -1.20% <span>than last week</span>
                    </p>
                  </div>
                </div>
                {/* Total Comments */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="p-3 bg-warning rounded shadow-sm">
                    <h5>Total Comments</h5>
                    <h4>10,000</h4>
                    <p>
                      +1.20% <span>than last week</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="row mb-5">
                {/* Chart */}
                <div className="col-lg-6 mb-4">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <div className="d-flex justify-content-between">
                      <h5>Total/Unique visitors</h5>
                      <h5>
                        <strong>5,000/10,000</strong>
                      </h5>
                    </div>
                    <div className="chart">
                      {/* Chart content */}
                      <table className="charts-css area hide-data">
                        <caption> Front End Developer Salary </caption>
                        <tbody>
                          <tr>
                            <td style={{ marginLeft: "20%", height: "40%" }}>
                              {" "}
                              <span className="data"> $40K </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ marginLeft: "40%", height: "80%" }}>
                              {" "}
                              <span className="data"> $80K </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ marginLeft: "80%", height: "60%" }}>
                              {" "}
                              <span className="data"> $60K </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ marginLeft: "60%", height: "100%" }}>
                              {" "}
                              <span className="data"> $100K </span>{" "}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ marginLeft: "100%", height: "30%" }}>
                              {" "}
                              <span className="data"> $30K </span>{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Report */}
                <div className="col-lg-6 mb-4">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <h5>Report of user</h5>
                    <form action className="mb-4" />
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
                    <table className="table table-danger table-striped mt-3">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Report date</th>
                          <th>Report type</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>Karina</td>
                          <td>07/09/2024</td>
                          <td>Post</td>
                          <td>
                            <a href="#" className="btn btn-danger btn-sm">
                              View
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="row mb-5">
                {/* New register */}
                <div className="col-lg-6 mb-4">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <h5>New Registrations</h5>
                    <form action className="mb-4" />
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
                    <table className="table table-info table-striped mt-3">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name user</th>
                          <th>Date of Joining</th>
                          <th>Total post</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>Karian</td>
                          <td>07/09/2024</td>
                          <td>2</td>
                          <td>
                            <a href="#" className="btn btn-danger btn-sm">
                              View
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Trending user */}
                <div className="col-lg-6 mb-4">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <h5>Trending User</h5>
                    <form action className="mb-4" />
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
                    <table className="table table-success table-striped mt-3">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name user</th>
                          <th>Date of Joining</th>
                          <th>Follower</th>
                          <th>Total post</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>1</th>
                          <td>Karian</td>
                          <td>07/09/2024</td>
                          <td>10.000</td>
                          <td>1000</td>
                          <td>
                            <a href="#" className="btn btn-danger btn-sm">
                              View
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>