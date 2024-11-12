import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import { useParams } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [post, setPost] = useState(null);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  console.log("Post ID:", id); // Kiểm tra ID

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/admin/posts/search-info/${id}`
      );
      console.log("User data:", response.data);
      // Backend trả về UserInfoDto nên không cần map vào mảng
      setUsers([{
        userid: response.data.id,
        userName: response.data.userName,
        email: response.data.email, 
        avatar: response.data.avatar,
        joinDate: response.data.joinDate
      }]); // Wrap trong array vì component đang map qua users
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      setErrorMessage("Không thể lấy thông tin người dùng.");
    }
  };
  
  // Hàm lấy chi tiết bài đăng
  const fetchPostDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/admin/posts/${id}`
      );
      console.log("Post data:", response.data);
      // Backend trả về PostDto nên set trực tiếp
      setPost({
        ...response.data,
        images: response.data.images.map(img => ({
          ...img,
          postImage: img.postImage // Không cần base64 vì backend đã trả về URL
        }))
      });
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bài đăng:", error);
      setErrorMessage("Không thể lấy thông tin bài đăng.");
    }
  };
  

  useEffect(() => {
    console.log("Post ID từ useParams:", id); // Log ID từ useParams
    if (id) {
      // Gọi song song hai API
      Promise.all([fetchPostDetail(), fetchUserInfo()])
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
          setErrorMessage("Không thể lấy dữ liệu.");
        });
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
        {users.map((user) => (
            <div key={user.userid} className="col-lg-4 mb-4">
              <div className="card position-relative text-center">
                {/* User Image */}
                <div
                  className="position-absolute top-0 start-50 translate-middle"
                  style={{ zIndex: 1 }}
                >
                  <img
                    src={user.avatar} // Avatar từ API
                    alt="User Avatar"
                    className="rounded-circle border border-3 border-white"
                    style={{ width: 150, height: 150, objectFit: "cover" }}
                  />
                </div>
                {/* Card Body */}
                <div className="card-body pt-5 mt-5">
                  <div className="row">
                    {/* User Info */}
                    <div className="col-12 text-start">
                      <h6 className="card-title">{user.userName}</h6> {/* User name */}
                      <p className="card-text">Email: {user.email}</p> {/* Email */}
                    </div>
                    {/* Join Date */}
                    <div className="col-12 mt-3">
                      <p className="card-text">
                        Join Date: {new Date(user.joinDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <a href="#" className="btn btn-danger mt-3">
                    Ban/Unban
                  </a>
                </div>
              </div>
            </div>
          ))}


          <div className="col-lg-8 col-md-8">
            {/* Statistical */}
            <div className="row mb-4" style={{ marginTop: 100 }}>
              {/* Total Likes */}
              <div className="col-lg-4 mb-3">
                <div className="card text-center bg-warning">
                  <div className="card-body">
                    <h5 className="card-title">Total Likes</h5>
                    <p className="card-text display-6 " style={{ color: "blue" }}>{post.likeCount}</p> {/* Lượt thích */}
                  </div>
                </div>
              </div>
              {/* Total Comments */}
              <div className="col-lg-4 mb-3">
                <div className="card text-center bg-success">
                  <div className="card-body">
                    <h5 className="card-title">Total Comments</h5>
                    <p className="card-text display-6" style={{ color: "blue" }}>{post.commentCount}</p> {/* Lượt bình luận */}
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
                  {post.content} {/* Nội dung bài viết */}
                </h2>
                {/* Thêm tiêu đề cho nội dung */}
                <h3 className="fw-bold mb-3">NỘI DUNG</h3> {/* Tiêu đề nội dung */}
                {/* Nội dung bài viết với font size lớn hơn và màu đậm hơn */}
                <p
                  className="lead mb-4"
                  style={{ fontSize: "1.1rem", color: "#333" }}
                >
                  {post.content} {/* Nội dung bài viết */}
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
                      {post.userNickname} {/* Tên người đăng */}
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
                      })} {/* Thời gian đăng */}
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
