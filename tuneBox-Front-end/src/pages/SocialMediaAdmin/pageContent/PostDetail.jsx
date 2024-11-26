import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Music, Users, ShoppingBag, Disc, Radio } from "lucide-react";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/admin/posts/search-info/${id}`
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setErrorMessage("Cannot fetch user information.");
    }
  };

  const fetchPostDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/admin/posts/${id}`
      );
      setPost({
        ...response.data,
        images: response.data.images.map((img) => ({
          ...img,
          postImage: img.postImage,
        })),
      });
    } catch (error) {
      console.error("Error fetching post detail:", error);
      setErrorMessage("Cannot fetch post details.");
    }
  };

  useEffect(() => {
    if (id) {
      Promise.all([fetchPostDetail(), fetchUserInfo()]).catch((error) => {
        console.error("Error calling APIs:", error);
        setErrorMessage("Cannot fetch data.");
      });
    }
  }, [id]);

  if (errorMessage) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {errorMessage}
      </div>
    );
  }

  if (!post || !userInfo) {
    return (
      <div className="d-flex justify-content-center m-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* User Profile Card */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow-lg">
            <div className="card-body text-center position-relative">
              <div className="position-absolute top-0 start-50 translate-middle">
                <img
                  src={userInfo.avatar}
                  alt="User Avatar"
                  className="rounded-circle border border-4 border-white shadow"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="pt-5 mt-5">
                <h4 className="fw-bold mb-1">{userInfo.userName}</h4>
                <p className="text-muted mb-3">{userInfo.email}</p>

                {/* Stats Grid */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="p-3 border rounded bg-light">
                      <Users className="mb-2" />
                      <h6 className="mb-1">Followers</h6>
                      <h5 className="mb-0">{userInfo.followedUsers}</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 border rounded bg-light">
                      <Users className="mb-2" />
                      <h6 className="mb-1">Following</h6>
                      <h5 className="mb-0">{userInfo.followingUsers}</h5>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 border rounded bg-light">
                      <ShoppingBag className="mb-2" />
                      <h6 className="mb-1">Orders</h6>
                      <h5 className="mb-0">{userInfo.orderCount}</h5>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 border rounded bg-light">
                      <Disc className="mb-2" />
                      <h6 className="mb-1">Albums</h6>
                      <h5 className="mb-0">{userInfo.albums}</h5>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 border rounded bg-light">
                      <Radio className="mb-2" />
                      <h6 className="mb-1">Tracks</h6>
                      <h5 className="mb-0">{userInfo.tracks}</h5>
                    </div>
                  </div>
                </div>

                {/* User Interests */}
                <div className="text-start mb-4">
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Inspired By</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {userInfo.inspiredBy.map((item, index) => (
                        <span key={index} className="badge bg-primary">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Talents</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {userInfo.talent.map((item, index) => (
                        <span key={index} className="badge bg-success">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Genres</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {userInfo.genre.map((item, index) => (
                        <span key={index} className="badge bg-info">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-muted mb-3">
                  Joined:{" "}
                  {new Date(userInfo.joinDate).toLocaleDateString("vi-VN")}
                </p>

                <button className="btn btn-danger">Ban/Unban User</button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="col-lg-7">
          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card bg-warning bg-gradient shadow">
                <div className="card-body text-center">
                  <h5 className="card-title text-white mb-2">Total Likes</h5>
                  <h2 className="display-4 text-white mb-0">
                    {post.likeCount}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-success bg-gradient shadow">
                <div className="card-body text-center">
                  <h5 className="card-title text-white mb-2">Total Comments</h5>
                  <h2 className="display-4 text-white mb-0">
                    {post.commentCount}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content Card */}
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="fw-bold text-dark mb-4">Content</h2>
              <div className="mb-4">
                <h5 className="fw-bold text-secondary mb-3">Status</h5>
                <p className="lead text-primary">{post.content}</p>
              </div>

              {post.images && post.images.length > 0 && (
                <div className="mb-4">
                  <h5 className="fw-bold text-secondary mb-3">Images</h5>
                  <div className="row g-3">
                    {post.images.map((image, index) => (
                      <div key={index} className="col-md-4 col-sm-6">
                        <img
                          src={image.postImage} // Chỉnh sửa tại đây, sử dụng URL trực tiếp
                          alt={`Post image ${index + 1}`}
                          className="img-fluid rounded shadow-sm"
                          style={{
                            objectFit: "cover",
                            height: "200px",
                            width: "100%",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-top pt-3">
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <span className="text-secondary">Posted by: </span>
                      <span className="fw-bold text-primary">
                        {post.userNickname}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <p className="mb-1">
                      <span className="text-secondary">Posted on: </span>
                      <span className="fw-bold">
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
    </div>
  );
};

export default PostDetail;
