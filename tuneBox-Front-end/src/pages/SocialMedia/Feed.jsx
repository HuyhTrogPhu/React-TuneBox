
import React, { useEffect, useState } from 'react';
import { images } from "../../assets/images/images";
import axios from 'axios';
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./css/mxh/style.css"
import "./css/mxh/post.css"
import "./css/mxh/modal-create-post.css"
import "./css/profile.css"
import "./css/mxh/comment.css"
import "./css/mxh/button.css"
import { useParams, useNavigate } from 'react-router-dom';


const HomeFeed = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = Cookies.get("UserID");
  const [postContent, setPostContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [postImageUrls, setPostImageUrls] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState(null);
  const [username, setuserName] = useState({});
  const [commentContent, setCommentContent] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [replyContent, setReplyContent] = useState({}); // State để lưu nội dung reply
  const [replyingTo, setReplyingTo] = useState({}); // State để xác định bình luận nào đang được trả lời
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [showAllReplies, setShowAllReplies] = useState({});
  

  const handleAvatarClick = (post) => {
    console.log("Current User ID:", currentUserId);
    console.log("Post User ID:", post.userId);
  
    if (String(post.userId) === String(currentUserId)) {
      console.log("Navigating to ProfileUser");
      navigate('/profileUser');
    } else {
      console.log("Navigating to OtherUserProfile");
      navigate(`/profile/${post.userId}`);
    }
  };
  const fetchBlockedUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/blocks/blocked-users?blockerId=${currentUserId}`, {
        withCredentials: true,
      });
      return response.data.map(user => user.blockedId); // Giả sử response.data chứa danh sách blockedId
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      return [];
    }
  };
  
    // Hàm để lấy các bài viết
    const fetchPosts = async () => {
      try {
        // Bước 1: Lấy danh sách người dùng bị chặn
        const blockedUsers = await fetchBlockedUsers();
        
        // Bước 2: Lấy tất cả bài viết
        const response = await axios.get('http://localhost:8080/api/posts', {
          withCredentials: true,
        });
        
        console.log('Response data:', response.data);
    
        // Bước 3: Lọc các bài viết
        const filteredPosts = response.data.filter(post => !blockedUsers.includes(post.userId)); // Giả sử post.userId chứa ID người dùng đã tạo bài viết
    
        // Sắp xếp các bài viết theo thời gian tạo (mới nhất lên đầu)
        const sortedPosts = filteredPosts.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
    
        setPosts(sortedPosts); // Lưu các bài viết đã lọc và sắp xếp
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
    
    // Gọi hàm fetchPosts khi component được mount
    useEffect(() => {
      fetchPosts();
    }, []);
    
    const handleSubmitPost = async () => {
      const formData = new FormData();
      formData.append("content", postContent || "");
      formData.append("userId", currentUserId);
  
      postImages.forEach((image) => {
        formData.append("images", image);
      });
  
      try {
        if (postId) {
          await axios.put(`http://localhost:8080/api/posts/${postId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
        } else {
          await axios.post("http://localhost:8080/api/posts", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
        }
  
        document.getElementById("post-modal").style.display = "none";
        resetForm();
        fetchPosts();
      } catch (error) {
        console.error(
          "Error creating/updating post:",
          error.response?.data || error.message
        );
      }
    };
    const handleDeletePost = async (postId) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return;
  
      try {
        await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
          withCredentials: true,
        });
        fetchPosts();
      } catch (error) {
        console.error(
          "Error deleting post:",
          error.response?.data || error.message
        );
      }
    };
    const handleUpdateComment = async (commentId, postId) => {
      if (!editingCommentContent.trim()) return;

      try {
        await axios.put(`http://localhost:8080/api/comments/${commentId}`, {
          content: editingCommentContent,
          edited: true,
        });

        const updateComments = (comments) => 
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                content: editingCommentContent,
                edited: true,
              };
            }
            return comment;
          });
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: updateComments(post.comments),
              };
            }
            return post;
          })
        );

        setEditingCommentId(null);
        setEditingCommentContent("");
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    };

    const handleEditPost = (post) => {
      setPostContent(post.content);
      setPostImages(post.images);
      setPostId(post.id);
      document.getElementById("post-modal").style.display = "flex";
    };
    const handleAddComment = async (postId) => {
      const content = commentContent[postId] || ""; // Lấy nội dung comment từ state
      if (!content.trim()) return;
  
      try {
        const response = await axios.post(
          `http://localhost:8080/api/comments/post/${postId}/user/${currentUserId}`,
          {
            content: content,
          }
        );
  
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return { ...post, comments: [...post.comments, response.data] };
            }
            return post;
          })
        );
  
        // Reset comment content for that post after successful submission
        setCommentContent((prev) => ({ ...prev, [postId]: "" }));
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };
    const handleCommentChange = (postId, value) => {
      setCommentContent((prev) => ({ ...prev, [postId]: value })); // Cập nhật commentContent cho postId cụ thể
    };
    const handleDeleteComment = async (commentId, postId) => {
      try {
        await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              };
            }
            return post;
          })
        );
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    };
    // Hàm để hiển thị tất cả comment hoặc chỉ một số lượng nhất định
    const handleToggleComments = (postId) => {
      setShowAllComments((prevState) => ({
        ...prevState,
        [postId]: !prevState[postId], // Chuyển đổi trạng thái hiển thị bình luận
      }));
    };
    const handleReplyChange = (commentId, value) => {
      setReplyContent((prev) => ({ ...prev, [commentId]: value })); // Cập nhật nội dung reply
    };
  
    const handleReplyClick = (commentId) => {
      setReplyingTo((prev) => ({ ...prev, [commentId]: !prev[commentId] })); // Chuyển đổi trạng thái hiển thị input reply
    };
  
    const handleAddReply = async (commentId, postId) => {
      const content = replyContent[commentId] || ""; // Lấy nội dung reply từ state
      if (!content.trim()) return;
  
      try {
        const response = await axios.post(
          `http://localhost:8080/api/replies/comment/${commentId}/user/${currentUserId}`,
          {
            content: content,
          },
          { withCredentials: true } // Ensure this is included
        );
  
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: post.comments.map((comment) => {
                  if (comment.id === commentId) {
                    return {
                      ...comment,
                      replies: [...(comment.replies || []), response.data],
                    };
                  }
                  return comment;
                }),
              };
            }
            return post;
          })
        );
  
        // Reset nội dung reply cho commentId cụ thể sau khi gửi thành công
        setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
        setReplyingTo((prev) => ({ ...prev, [commentId]: false })); // Đóng input reply
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    };
    const handleToggleReplies = (commentId) => {
      setShowAllReplies((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
    };
  // end js hiện post model
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-3 sidebar bg-light p-4">
            <ul className="list-unstyled">
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center " style={{ textAlign: 'center' }}>
                  <img src={images.web_content} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>Bản tin</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.followers} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>Đang theo dõi</span>
                </a>
              </li>

              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.feedback} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>Bài viết đã thích</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.music} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>Albums đã thích</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.playlist} alt='icon' width={20} className="me-2 " />
                  <span className='fw-bold'>Playlist đã thích</span>
                </a>
              </li>
            </ul>
          </div>
          {/* Main Content */}
          <div className="col-6 content p-4">
            {/* Post  */}
            <div>
      {/* Nút tạo bài */}
      <div className="container mt-2 mb-5">
        <div className="row align-items-center">
          <div className="col-auto post-header">
            <img src={images.ava} className="avatar_small" alt="avatar" />
          </div>
          <div className="col">
            <button
              id="create-post-btn"
              type="button"
              className="btn text-start"
              style={{
                backgroundColor: "rgba(64, 102, 128, 0.078)",
                width: "85%",
                height: 50,
              }}
            >
              Bạn đang nghĩ gì vậy?
            </button>
          </div>
        </div>
      </div>
        
        <div id="post-modal"
        className="modal-overlay"
        style={{ display: "none" }}
      >
        <div className="modal-content">
          <div>
            <div className="post-header">
              <img src={images.ava} className="avatar_small" alt="Avatar" />
              <div>
                <div className="name">Phạm Xuân Trường</div>
                <div className="time">Posting to Feed</div>
              </div>
              <button
                id="close-modal"
                type="button"
                className="btn btn-close"
              ></button>
            </div>
            <div className="col">
              <textarea
                id="post-textarea"
                className="form-control"
                rows={3}
                placeholder="Write your post here..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <div className="row mt-3">
                <div className="col text-start">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setPostImages(Array.from(e.target.files))}
                  />
                </div>
                <div className="col text-end">
                  <button
                    id="submit-post"
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleSubmitPost}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần hiển thị bài viết */}
      <div className="container mt-2 mb-5">
        {posts.map((post) => {
          const createdAt = post.createdAt
            ? new Date(post.createdAt) // Nếu backend gửi một chuỗi định dạng ISO, sử dụng trực tiếp
            : null;
          const showAll = showAllComments[post.id];
          return (
            <div key={post.id} className="post">
              <div className="post-header position-relative">
              <button
                type="button"
                className="btn"
                onClick={() => handleAvatarClick(post)}
                aria-label="Avatar"
              >
                <img
                  src="/src/UserImages/Avatar/avt.jpg"
                  className="avatar_small"
                  alt="Avatar"
                />
              </button>
                <div>
                  <div className="name">
                    {post.userNickname || "Unknown User"}
                  </div>
                  <div className="time">
                    {createdAt && !isNaN(createdAt.getTime())
                      ? format(createdAt, "hh:mm a, dd MMM yyyy")
                      : "Invalid date"}
                  </div>
                </div>
                <div className="dropdown position-absolute top-0 end-0">
                  <button
                    className="btn btn-options dropdown-toggle"
                    type="button"
                    id={`dropdownMenuButton-${post.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    ...
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby={`dropdownMenuButton-${post.id}`}
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleEditPost(post)}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="post-content">{post.content}</div>

              {post.images && post.images.length > 0 && (
                <div className="post-images">
                  {post.images.map((image) => (
                    <img
                      key={image.id} // Assuming each image has a unique id
                      src={`data:image/jpeg;base64,${image.postImage}`}
                      alt="Post"
                    />
                  ))}

                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>

          </div>
          {/* Right Sidebar */}
          <div className="col-3 sidebar bg-light p-4">
            <ul className="list-unstyled">
              <h6>Gợi ý theo dõi</h6>
              <li className=" mb-4">
                <a href="/#" className style={{ marginLeft: 30 }}>
                  <div className="d-flex align-items-center post-header " style={{ marginLeft: 25 }}>
                    <img src={images.ava} className alt="Avatar" />
                    <div>
                      <div className="name">Phạm Xuân Trường</div>
                      <div className="title">Posting to Feed</div>
                    </div>
                    <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '10%', height: '10%' }} />
                  </div>
                </a>
              </li>
              <li className=" mb-4">
                <a href="/#" className style={{ marginLeft: 30 }}>
                  <div className="d-flex align-items-center post-header " style={{ marginLeft: 25 }}>
                    <img src={images.ava} className alt="Avatar" />
                    <div>
                      <div className="name">Phạm Xuân Trường</div>
                      <div className="title">Posting to Feed</div>
                    </div>
                    <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '10%', height: '10%' }} />
                  </div>
                </a>
              </li>
              <li className=" mb-4">
                <a href="/#" className style={{ marginLeft: 30 }}>
                  <div className="d-flex align-items-center post-header " style={{ marginLeft: 25 }}>
                    <img src={images.ava} className alt="Avatar" />
                    <div>
                      <div className="name">Phạm Xuân Trường</div>
                      <div className="title">Posting to Feed</div>
                    </div>
                    <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '10%', height: '10%' }} />
                  </div>
                </a>
              </li>
              <li className=" mb-4">
                <a href="/#" className style={{ marginLeft: 30 }}>
                  <div className="d-flex align-items-center post-header " style={{ marginLeft: 25 }}>
                    <img src={images.ava} className alt="Avatar" />
                    <div>
                      <div className="name">Phạm Xuân Trường</div>
                      <div className="title">Posting to Feed</div>
                    </div>
                    <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '10%', height: '10%' }} />
                  </div>
                </a>
              </li>
            </ul>
            <div className="advertisement mt-5">
              <a href>  <img src={images.bannerpre} alt="Banner quảng cáo" className="img-fluid" width="80%" style={{ marginLeft: 30 }} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default HomeFeed
