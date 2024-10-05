import React from "react";
import { images } from "../../../assets/images/images";

const PostDetail = () => {
  return (
    <div>
      <div className="container-fluid ps-5">
            <div className="row">
              {/* Infomation user */}
              <div className="col-lg-4" style={{ marginTop: 100 }}>
                <div className="card position-relative text-center">
                  {/* User Image */}
                  <div
                    className="position-absolute top-0 start-50 translate-middle"
                    style={{ zIndex: 1 }}
                  >
                    <img
                      src={images.karinaImage}
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
              <div className="col-lg-8 col-md-8">
                {/* Statistical */}
                <div className="row mb-4" style={{ marginTop: 100 }}>
                  {/* Total Likes */}
                  <div className="col-lg-4 mb-3">
                    <div className="card text-center bg-warning">
                      <div className="card-body">
                        <h5 className="card-title">Total Likes</h5>
                        <p className="card-text display-6">100</p>
                      </div>
                    </div>
                  </div>
                  {/* Total Comments */}
                  <div className="col-lg-4 mb-3">
                    <div className="card text-center bg-success">
                      <div className="card-body">
                        <h5 className="card-title">Total Comments</h5>
                        <p className="card-text display-6">100</p>
                      </div>
                    </div>
                  </div>
                  {/* Total Play */}
                  <div className="col-lg-4 mb-3">
                    <div className="card text-center bg-info">
                      <div className="card-body">
                        <h5 className="card-title">Total Play</h5>
                        <p className="card-text display-6">100</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Track/Post */}
                <div className="row mt-4">
                  {/* Description */}
                  <h5>Memory Song</h5>
                </div>
                {/* Comments */}
              </div>
            </div>
          </div>
    </div>
  );
};

export default PostDetail;
