import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import { useParams } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [post, setPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  console.log("Post ID:", id); // Kiểm tra ID

  // Hàm lấy chi tiết bài đăng
  const fetchPostDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/admin/posts/${id}`
      );
      console.log("Post data:", response.data);
      setPost(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bài đăng:", error);
      setErrorMessage("Không thể lấy thông tin bài đăng.");
    }
  };

  useEffect(() => {
    console.log("Post ID từ useParams:", id); // Log ID từ useParams
    if (id) {
      fetchPostDetail();
    } else {
      console.error("Post ID is not valid.");
    }
  }, [id]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

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
            <div className="card shadow">
              <div className="card-body p-4">
                {/* Tiêu đề với font lớn và đậm */}
                <h2
                  className="fw-bold text-dark mb-4"
                  style={{ fontSize: "2rem" }}
                >
                  {post.title}
                </h2>
                {/* Thêm tiêu đề cho nội dung */}
                <h3 className="fw-bold mb-3">NỘI DUNG</h3>{" "}
                {/* Thêm tiêu đề "NỘI DUNG" */}
                {/* Nội dung bài viết với font size lớn hơn và màu đậm hơn */}
                <p
                  className="lead mb-4"
                  style={{ fontSize: "1.1rem", color: "#333" }}
                >
                  {post.content}
                </p>
                {post.images && post.images.length > 0 && (
                  <div className="mt-3">
                    <h3 className="fw-bold mb-3">Hình Ảnh</h3>
                    <div className="d-flex flex-wrap">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={`data:image/jpeg;base64,${image.postImage}`} // Chuyển đổi thành data URL
                          alt={`Image ${index + 1}`}
                          className="img-thumbnail me-2 mb-2"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* Thông tin về người đăng và thời gian */}
                <div className="border-top pt-3">
                  <p className="mb-2">
                    <span className="fw-bold text-secondary">Đăng bởi: </span>
                    <span className="fw-semibold text-primary">
                      {post.userName}
                    </span>
                  </p>

                  <p className="mb-0">
                    <span className="fw-bold text-secondary">
                      Thời gian đăng:{" "}
                    </span>
                    <span className="fw-semibold">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
