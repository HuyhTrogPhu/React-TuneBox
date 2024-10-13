import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams để lấy userId từ URL
import Cookies from "js-cookie";
import axios from "axios";

import "./css/activity.css";
import { images } from "../../../../assets/images/images";

const Activity = () => {
  const [postContent, setPostContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [postImageUrls, setPostImageUrls] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState(null);
  const { id } = useParams(); // Lấy ID từ URL
  const userId = Cookies.get("UserID"); // Lấy ID người dùng hiện tại từ cookies
  const [username, setuserName] = useState({});
  const [commentContent, setCommentContent] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [replyContent, setReplyContent] = useState({});
  const [replyingTo, setReplyingTo] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [showAllReplies, setShowAllReplies] = useState({});

  const handleToggleReplies = (commentId) => {
    setShowAllReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  useEffect(() => {
    const createPostBtn = document.getElementById("create-post-btn");
    const postModal = document.getElementById("post-modal");
    const closeModal = document.getElementById("close-modal");
    setuserName(Cookies.get("userName"));
    const openModal = () => {
      resetForm();
      setPostId(null);
      postModal.style.display = "flex";
    };
    const closePostModal = () => {
      postModal.style.display = "none";
      resetForm();
    };

    if (createPostBtn && postModal && closeModal) {
      createPostBtn.addEventListener("click", openModal);
      closeModal.addEventListener("click", closePostModal);

      return () => {
        createPostBtn.removeEventListener("click", openModal);
        closeModal.removeEventListener("click", closePostModal);
      };
    } else {
      console.error("One or more elements not found");
    }
  }, []);
  const resetForm = () => {
    setPostContent("");
    setPostImages([]);
    setPostImageUrls([]);
    setPostId(null);
  };

  const fetchPosts = async () => {
    const targetUserId = id ? id : userId;// Nếu có ID từ URL thì sử dụng, nếu không thì sử dụng userId từ cookies
    console.log("Target User ID:", targetUserId);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/user/${targetUserId}`, // Sử dụng targetUserId
        {
          withCredentials: true,
        }
      );
  
      console.log(response.data); // Kiểm tra dữ liệu nhận được
  
      const sortedPosts = response.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // Sắp xếp từ mới đến cũ
      });
  
      // Lấy comments và replies cho từng post
      const postsWithCommentsAndReplies = await Promise.all(
        sortedPosts.map(async (post) => {
          const commentsResponse = await axios.get(
            `http://localhost:8080/api/comments/post/${post.id}`
          );
  
          const commentsWithReplies = await Promise.all(
            commentsResponse.data.map(async (comment) => {
              const repliesResponse = await axios.get(
                `http://localhost:8080/api/replies/comment/${comment.id}`
              );
              return { ...comment, replies: repliesResponse.data }; // Kết hợp replies vào comment
            })
          );
  
          return { ...post, comments: commentsWithReplies }; // Kết hợp comments vào post
        })
      );
  
      setPosts(postsWithCommentsAndReplies); // Cập nhật state với danh sách bài viết
    } catch (error) {
      console.error("Error fetching user posts:", error); // Log lỗi nếu có
    }
  };
  useEffect(() => {
    fetchPosts(); // Gọi hàm để lấy bài viết khi component được mount
  }, [id]); // Theo dõi currentUserId để gọi lại khi thay đổi
  
  const handleSubmitPost = async () => {
    const formData = new FormData();
    formData.append("content", postContent || "");
    formData.append("userId", userId);

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
        edited: true, // Đánh dấu comment là đã chỉnh sửa
      });

      // Cập nhật lại danh sách comment trong state
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    content: editingCommentContent,
                    edited: true, // Đánh dấu comment là đã chỉnh sửa
                  };
                }
                return comment;
              }),
            };
          }
          return post;
        })
      );

      // Reset state sau khi cập nhật
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
        `http://localhost:8080/api/comments/post/${postId}/user/${userId}`,
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
        `http://localhost:8080/api/replies/comment/${commentId}/user/${userId}`,
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
  return (
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

      {/* Modal để tạo bài viết */}
      <div
        id="post-modal"
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
                <img
                  src="/src/UserImages/Avatar/avt.jpg"
                  className="avatar_small"
                  alt="Avatar"
                />
                <div>
                  <div className="name">
                    {post.userNickname || "Unknown User"}
                  </div>
                  <div className="time">
                    {/* {createdAt && !isNaN(createdAt.getTime())
                      ? format(createdAt, "hh:mm a, dd MMM yyyy")
                      : "Invalid date"} */}
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
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${image.postImage}`}
                      alt="Post"
                    />
                  ))}
                </div>
              )}

              <div className="comment-section mt-4">
                {/* Comment input box */}
                <textarea
                  className="comment-input"
                  style={{ resize: "none" }}
                  rows={3}
                  placeholder="Write a comment..."
                  value={commentContent[post.id] || ""}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                />
                <div className="text-end">
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Comment
                  </button>
                </div>

                {/* Display comment count */}
                <div className="comment-count mt-2">
                  <span>{post.comments.length} Comment(s)</span>
                </div>

                {/* Comment list */}
                <div className=" mt-4">
                  {(showAll ? post.comments : post.comments.slice(0, 3)).map(
                    (comment) => (
                      <div key={comment.id} className="comment mt-2">
                        <div className="container">
                          <div className="row justify-content-start">
                            <div className="comment-content position-relative">
                              <img
                                src="/src/UserImages/Avatar/avt.jpg"
                                className="avatar_small"
                                alt="Avatar"
                              />
                              <div>
                                <div className="comment-author">
                                  {comment.userNickname}
                                </div>
                                <div className="comment-time">
                                  {/* {format(
                                    new Date(comment.creationDate),
                                    "hh:mm a, dd MMM yyyy"
                                  )} */}
                                  {comment.edited && (
                                    <span className="edited-notice">
                                      {" "}
                                      (Đã chỉnh sửa)
                                    </span>
                                  )}
                                </div>
                                {editingCommentId === comment.id ? (
                                  <div>
                                    <textarea
                                      className="form-control"
                                      rows={2}
                                      value={editingCommentContent}
                                      onChange={(e) =>
                                        setEditingCommentContent(e.target.value)
                                      }
                                    />
                                    <button
                                      className="btn btn-primary mt-2"
                                      onClick={() =>
                                        handleUpdateComment(comment.id, post.id)
                                      }
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="btn btn-secondary mt-2 ms-2"
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditingCommentContent("");
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <p>{comment.content}</p>
                                )}
                              </div>
                              <div className="dropdown position-absolute top-0 end-0">
                                <button
                                  className="btn btn-options dropdown-toggle"
                                  type="button"
                                  id={`dropdownMenuButton-${comment.id}`}
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  ...
                                </button>
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby={`dropdownMenuButton-${comment.id}`}
                                >
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditingCommentContent(
                                          comment.content
                                        );
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        handleDeleteComment(comment.id, post.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>

                              {/* Reply button */}
                              <button
                                className="btn btn-link mt-2"
                                onClick={() => handleReplyClick(comment.id)}
                              >
                                Reply
                              </button>

                              {/* Reply input box */}
                              {replyingTo[comment.id] && (
                                <div className="reply-input-container">
                                  <textarea
                                    className="reply-input mt-2 form-control"
                                    rows={1}
                                    placeholder="Write a reply..."
                                    value={replyContent[comment.id] || ""}
                                    onChange={(e) =>
                                      handleReplyChange(
                                        comment.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <button
                                    className="btn btn-primary mt-2"
                                    onClick={() =>
                                      handleAddReply(comment.id, post.id)
                                    }
                                  >
                                    Reply
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            {/* Display replies if exist */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="replies-list mt-2">
                                {(showAllReplies[comment.id]
                                  ? comment.replies
                                  : comment.replies.slice(0, 2)
                                ).map((reply) => (
                                  <div key={reply.id} className="reply">
                                    <img
                                      src="/src/UserImages/Avatar/avt.jpg"
                                      className="avatar_small"
                                      alt="Avatar"
                                    />
                                    <div className="reply-content">
                                      <div className="d-flex align-items-center">
                                        <span className="reply-author">
                                          {reply.userNickname}
                                        </span>
                                        <span className="reply-time">
                                          {/* {format(
                                            new Date(reply.creationDate),
                                            "hh:mm a, dd MMM yyyy"
                                          ) &&
                                          !isNaN(
                                            new Date(
                                              reply.creationDate
                                            ).getTime()
                                          )
                                            ? format(
                                                new Date(reply.creationDate),
                                                "hh:mm a, dd MMM yyyy"
                                              )
                                            : "Invalid date"} */}
                                        </span>
                                      </div>
                                      <p>{reply.content}</p>
                                    </div>
                                  </div>
                                ))}

                                {/* View all/Hide replies button */}
                                {comment.replies.length > 2 && (
                                  <button
                                    className="btn btn-link"
                                    onClick={() =>
                                      handleToggleReplies(comment.id)
                                    }
                                  >
                                    {showAllReplies[comment.id]
                                      ? "Hide replies"
                                      : "View all replies"}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  {/* View all/Hide comments button */}
                  {post.comments.length > 3 && (
                    <button
                      className="btn btn-link"
                      onClick={() => handleToggleComments(post.id)}
                    >
                      {showAll ? "Hide comments" : "View all comments"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Activity;
