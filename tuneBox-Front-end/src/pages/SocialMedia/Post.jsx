import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams để lấy userId từ URL
import Cookies from "js-cookie";
import axios from "axios";
import { format } from 'date-fns';
import "./Profile/Profile_nav/css/activity.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Profile/css/button.css"
import "./Profile/css/profile.css"
import "../SocialMedia/css/mxh/comment.css"
import { images } from "../../assets/images/images";


function Post() {

const [postContent, setPostContent] = useState("");
const [postImages, setPostImages] = useState([]);
const [postImageUrls, setPostImageUrls] = useState([]);
const [posts, setPosts] = useState([]);
const [postId, setPostId] = useState(null);
const { postIdurl } = useParams();  
console.log('postIdurl:', postIdurl);
const userId = Cookies.get("userId"); // Lấy ID người dùng hiện tại từ cookies
const [username, setuserName] = useState({});
const [commentContent, setCommentContent] = useState({});
const [showAllComments, setShowAllComments] = useState({});
const [replyContent, setReplyContent] = useState({});
const [replyingTo, setReplyingTo] = useState({});
const [editingCommentId, setEditingCommentId] = useState(null);
const [editingCommentContent, setEditingCommentContent] = useState("");
const [showAllReplies, setShowAllReplies] = useState({});
const [likes, setLikes] = useState({}); // Trạng thái lưu trữ like cho mỗi bài viết
const [likesCount, setLikesCount] = useState({});
const [replyToUser, setReplyToUser] = useState("");
const currentUserNickname = Cookies.get('userNickname');
const [editingReplyId, setEditingReplyId] = useState(null);
const [editingReplyContent, setEditingReplyContent] = useState("");

const handleReportPost = (postId) => {
    setReportPostId(postId);
    setShowReportModal(true); // Hiện modal
};

const handleLike = async (postId) => {
  try {
    const likeDto = {
      userId: userId,
      postId: postId,
      trackId: null // Nếu không sử dụng trackId, có thể để là null
    };

    if (likes[postId]) {
      // Nếu đã like, thực hiện unlike
      await fetch(`http://localhost:8080/api/likes/remove?userId=${userId}&postId=${postId}`, {
        method: "DELETE",
      });
      setLikes((prevLikes) => ({ ...prevLikes, [postId]: false })); // Cập nhật trạng thái like

      // Cập nhật số lượt like trên UI
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likeCount: post.likeCount - 1 } : post
        )
      );
    } else {
      // Nếu chưa like, thực hiện like
      const response = await fetch(`http://localhost:8080/api/likes/add`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(likeDto)
      });

      if (!response.ok) {
        throw new Error('Failed to like the post');
      }

      setLikes((prevLikes) => ({ ...prevLikes, [postId]: true })); // Cập nhật trạng thái like

      // Cập nhật số lượt like trên UI
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post
        )
      );
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

const handleToggleReplies = (commentId) => {
  setShowAllReplies((prev) => ({
    ...prev,
    [commentId]: !prev[commentId],
  }));
};
const fetchPosts = async () => {
    if (!postIdurl) {
        console.error("Post ID is undefined");
        return; // Ngừng thực hiện hàm nếu postIdurl không hợp lệ
    }

    try {
        const response = await axios.get(
            `http://localhost:8080/api/posts/post/${postIdurl}`,
            {
                withCredentials: true,
            }
        );

        console.log(response.data); // Kiểm tra dữ liệu nhận được

        const post = response.data; // Chỉ lấy bài viết đầu tiên, không cần mảng

        // Lấy comments cho bài viết
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

        // Lấy số lượng likes cho bài viết
        const likeCountResponse = await axios.get(
            `http://localhost:8080/api/likes/post/${post.id}/count`
        );

        // Kiểm tra xem user đã like bài viết này chưa
        const userLikeResponse = await axios.get(
            `http://localhost:8080/api/likes/post/${post.id}/user/${userId}`
        );

        const liked = userLikeResponse.data; // true nếu user đã like, false nếu chưa

        // Kết hợp tất cả dữ liệu vào bài viết
        const postWithCommentsAndLikes = {
            ...post,
            comments: commentsWithReplies,
            likeCount: likeCountResponse.data, // Thêm số lượng likes vào bài viết
            liked: liked // Thêm trạng thái like
        };

        setPosts([postWithCommentsAndLikes]); // Cập nhật state với bài viết duy nhất
        setLikes({ [post.id]: postWithCommentsAndLikes.liked }); // Cập nhật trạng thái likes

    } catch (error) {
        console.error("Error fetching user posts:", error); // Log lỗi nếu có
    }
};


  useEffect(() => {
    const fetchLikesCounts = async () => {
      const counts = await Promise.all(posts.map(post =>
        axios.get(`http://localhost:8080/api/likes/post/${post.id}/count`)
      ));

      const likesCountsMap = {};
      counts.forEach((response, index) => {
        likesCountsMap[posts[index].id] = response.data; // Gán số lượt like cho bài viết tương ứng
      });

      setLikesCount(likesCountsMap); // Cập nhật state số lượt like
    };

    fetchLikesCounts(); // Gọi hàm khi component mount
  }, [posts]); // Theo dõi thay đổi của posts

  useEffect(() => {
    console.log("Current postIdurl:", postIdurl); // Kiểm tra giá trị của postIdurl
    fetchPosts();
  }, [postIdurl]);
  

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
  const handleEditPost = (post) => {
    setPostContent(post.content);
    setPostImages(post.images);
    setPostId(post.id);
    document.getElementById("post-modal").style.display = "flex";
  };
  const handleUpdateComment = async (commentId, postId) => {
    if (!editingCommentContent.trim()) return;

    try {
      await axios.put(`http://localhost:8080/api/comments/${commentId}`, {
        content: editingCommentContent,
        edited: true,
      });

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
                    edited: true,
                  };
                }
                return comment;
              }),
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
  const handleAddComment = async (postId) => {
    const content = commentContent[postId] || "";
    if (!content.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/comments/post/${postId}/user/${userId}`,
        { content: content }
      );

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return { ...post, comments: [...post.comments, response.data] };
          }
          return post;
        })
      );

      setCommentContent((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const handleCommentChange = (postId, value) => {
    setCommentContent((prev) => ({ ...prev, [postId]: value }));
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
  const handleDeleteReply = async (replyId) => {
    try {
      // Gọi API để xóa reply
      await axios.delete(`http://localhost:8080/api/replies/reply/${replyId}/user/${userId}`);

      // Cập nhật lại danh sách reply trong state
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              return {
                ...comment,
                replies: comment.replies.filter((reply) => reply.id !== replyId),
              };
            }),
          };
        })
      );
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Failed to delete reply');
    }
  };
  const handleUpdateReply = async (replyId) => {
    try {
      // Sử dụng biến đúng để cập nhật nội dung
      const response = await axios.put(`http://localhost:8080/api/replies/reply/${replyId}/user/${userId}`, {
        content: editingReplyContent // Sử dụng biến này để cập nhật nội dung
      });
      // Cập nhật lại danh sách reply trong state
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId ? { ...reply, content: editingReplyContent } : reply
                ),
              };
            }),
          };
        })
      );

      // Reset trạng thái chỉnh sửa
      setEditingReplyId(null);
      setEditingReplyContent("");
    } catch (error) {
      console.error('Error updating reply:', error);
      alert('Failed to update reply');
    }
  };
  // Hàm để hiển thị tất cả comment hoặc chỉ một số lượng nhất định
  const handleToggleComments = (postId) => {
    setShowAllComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
  const handleReplyChange = (commentId, value) => {
    setReplyContent((prev) => ({ ...prev, [commentId]: value })); // Cập nhật nội dung reply
  };

  const handleReplyClick = (comment) => {
    console.log("Comment object:", comment); // Kiểm tra comment đã truyền vào
    setReplyToUser(comment.userNickname || comment.username); // Lấy tên người dùng từ comment
    setReplyingTo((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }));
  };
  const handleAddCommentReply = async (commentId, postId) => {
    const content = replyContent[commentId] || "";
    if (!content.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/replies/comment/${commentId}/user/${userId}`,
        { content: content, repliedTo: replyToUser }, // Gửi tên người dùng được reply
        { withCredentials: true }
      );

      console.log("Reply added:", response.data); // Log phản hồi từ server

      // Cập nhật posts với reply vừa thêm
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
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
      setReplyingTo((prev) => ({ ...prev, [commentId]: false }));
      setReplyToUser(""); // Reset tên người dùng đã reply
    } catch (error) {
      console.error("Error adding comment reply:", error);
    }
  };
  const handleAddReplyToReply = async (parentReplyId, commentId) => {
    const replyDto = {
      content: replyContent[parentReplyId] || "",
      commentId: commentId
    };

    if (!replyDto.content.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/replies/reply/${parentReplyId}/user/${userId}`,
        replyDto
      );

      console.log("Reply added:", response.data);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === post.id) { // Thay yourPostId bằng ID bài post thực tế
            return {
              ...post,
              comments: post.comments.map((comment) => {
                if (comment.id === commentId) {
                  const updatedReplies = comment.replies || [];
                  return {
                    ...comment,
                    replies: [...updatedReplies, response.data],
                  };
                }
                return comment;
              }),
            };
          }
          return post;
        })
      );

      setReplyContent((prev) => ({ ...prev, [parentReplyId]: "" }));
      setReplyingTo((prev) => ({ ...prev, [parentReplyId]: false }));
    } catch (error) {
      console.error("Error adding reply:", error.response?.data || error.message);
    }
  };
  return (
    <div className="container mt-2 mb-5">
    {posts.map((post) => {
      const createdAt = post.createdAt ? new Date(post.createdAt) : null;
      const showAll = showAllComments[post.id];

      return (
        <div key={post.id} className="post">
          {/* Phần tiêu đề bài viết */}
          <div className="post-header position-relative">
            <img
              src="/src/UserImages/Avatar/avt.jpg"
              className="avatar_small"
              alt="Avatar"
            />
            <div>
              <div className="name">{post.userNickname || "Unknown User"}</div>
              <div className="time">
                {createdAt && !isNaN(createdAt.getTime())
                  ? format(createdAt, "hh:mm a, dd MMM yyyy")
                  : "Invalid date"}
              </div>
            </div>
            {/* Dropdown cho bài viết */}
            {String(post.userId) === String(userId) ? (
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
        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${post.id}`}>
            <li>
                <button className="dropdown-item" onClick={() => handleEditPost(post)}>
                    Edit
                </button>
            </li>
            <li>
                <button className="dropdown-item" onClick={() => handleDeletePost(post.id)}>
                    Delete
                </button>
            </li>
        </ul>
    </div>
) : (
<button className="btn btn-danger btn-report position-absolute top-0 end-0" onClick={() => handleReportPost(post.id)}>
  Report
</button>
)}
          </div>

          <div className="post-content">{post.content}</div>

          {/* Hiển thị hình ảnh */}
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

          {/* Phần Like */}
          <div className="like-section mt-2">
            <div className="like-count">Likes: {post.likeCount || 0}</div>
            <button
              className={`btn ${likes[post.id] ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => handleLike(post.id)}
            >
              {likes[post.id] ? "Unlike" : "Like"}
            </button>
          </div>

          {/* Phần bình luận */}
          <div className="comment-section mt-4">
            <textarea
              className="comment-input"
              style={{ resize: "none" }}
              rows={3}
              placeholder="Write a comment..."
              value={commentContent[post.id] || ""}
              onChange={(e) => handleCommentChange(post.id, e.target.value)}
            />
            <div className="text-end">
              <button className="btn btn-primary mt-2" onClick={() => handleAddComment(post.id)}>
                Comment
              </button>
            </div>
          </div>

          {/* Hiển thị số lượng bình luận */}
          <div className="comment-count mt-2">
            <span>{post.comments.length} Comment(s)</span>
          </div>

          {/* Danh sách bình luận */}
          <div className="mt-4">
            {(showAll ? post.comments : post.comments.slice(0, 3)).map((comment) => (
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
                        <div className="comment-author">{comment.userNickname}</div>
                        <div className="comment-time">
                          {format(new Date(comment.creationDate), "hh:mm a, dd MMM yyyy")}
                          {comment.edited && <span className="edited-notice"> (Edited)</span>}
                        </div>
                        {editingCommentId === comment.id ? (
                          <div>
                            <textarea
                              className="form-control"
                              rows={2}
                              value={editingCommentContent}
                              onChange={(e) => setEditingCommentContent(e.target.value)}
                            />
                            <button
                              className="btn btn-primary mt-2"
                              onClick={() => handleUpdateComment(comment.id, post.id)}
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

                      {String(comment.userId) === String(userId) && (
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
                          <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${comment.id}`}>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentContent(comment.content);
                                }}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDeleteComment(comment.id, post.id)}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* Nút trả lời cho bình luận bậc 2 */}
                      <button className="btn btn-link mt-2" onClick={() => handleReplyClick(comment)}>
                        Reply
                      </button>

                      {/* Input trả lời cho bình luận bậc 2 */}
                      {replyingTo[comment.id] && (
                        <div className="reply-input-container">
                          <textarea
                            className="reply-input mt-2 form-control"
                            rows={1}
                            placeholder={`Reply to ${replyToUser || "User"}`}
                            value={replyContent[comment.id] || ""}
                            onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                          />
                          <button
                            className="btn btn-primary mt-2"
                            onClick={() => handleAddCommentReply(comment.id, post.id)}
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hiển thị danh sách trả lời bậc 2 */}
                  <div className="row justify-content-center">
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="replies-list mt-2">
                        {(showAllReplies[comment.id] ? comment.replies : comment.replies.slice(0, 2)).map((reply) => (
                          <div key={reply.id} className="reply" style={{ position: "relative" }}>
                            <div className="reply-content" style={{ marginLeft: "20px" }}>
                              <img src="/src/UserImages/Avatar/avt.jpg" className="avatar_small" alt="Avatar" />
                              <div>
                                <div className="d-flex align-items-center">
                                  <span className="comment-author pe-3">{reply.userNickname}</span>
                                  <span className="reply-time">
                                    {format(new Date(reply.creationDate), "hh:mm a, dd MMM yyyy") || "Invalid date"}
                                  </span>
                                </div>
                                {editingReplyId === reply.id ? (
                                  <div>
                                    <textarea
                                      className="form-control"
                                      rows={2}
                                      value={editingReplyContent}
                                      onChange={(e) => setEditingReplyContent(e.target.value)}
                                    />
                                    <button
                                      className="btn btn-primary mt-2"
                                      onClick={() => handleUpdateReply(reply.id)}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="btn btn-secondary mt-2 ms-2"
                                      onClick={() => {
                                        setEditingReplyId(null);
                                        setEditingReplyContent("");
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <p>
                                    <strong>{reply.userNickname}:</strong> {reply.content}
                                  </p>
                                )}
                                {/* Nút trả lời cho reply bậc 2 */}
                                <button className="btn btn-link" onClick={() => handleReplyClick(reply)}>
                                  Reply
                                </button>

                                {/* Dropdown cho reply bậc 2 */}
                                {String(reply.userId) === String(userId) && (
                                  <div className="dropdown position-absolute top-0 end-0">
                                    <button
                                      className="btn btn-options dropdown-toggle"
                                      type="button"
                                      id={`dropdownMenuButton-${reply.id}`}
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      ...
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${reply.id}`}>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() => {
                                            setEditingReplyId(reply.id); // Thiết lập ID của reply để chỉnh sửa
                                            setEditingReplyContent(reply.content); // Đảm bảo biến này được cập nhật với nội dung của reply
                                          }}
                                        >
                                          Edit
                                        </button>

                                      </li>
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          onClick={() => handleDeleteReply(reply.id)}
                                        >
                                          Delete
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {/* Input trả lời cho reply bậc 2 */}
                                {replyingTo[reply.id] && (
                                  <div className="reply-input-container">
                                    <textarea
                                      className="reply-input mt-2 form-control"
                                      rows={1}
                                      placeholder="Write a reply..."
                                      value={replyContent[reply.id] || ""}
                                      onChange={(e) => handleReplyChange(reply.id, e.target.value)}
                                    />
                                    <button
                                      className="btn btn-primary mt-2"
                                      onClick={() => handleAddReplyToReply(reply.id, comment.id)}
                                    >
                                      Reply
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Hiển thị nút xem thêm trả lời */}
                        {comment.replies.length > 2 && (
                          <button className="btn btn-link" onClick={() => handleToggleReplies(comment.id)}>
                            {showAllReplies[comment.id] ? "Hide replies" : "View all replies"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Hiển thị nút xem thêm bình luận */}
            {post.comments.length > 3 && (
              <button className="btn btn-link" onClick={() => handleToggleComments(post.id)}>
                {showAllComments[post.id] ? "View less comments" : "View all comments"}
              </button>
            )}
          </div>
        </div>
      );
    })}
  </div>
  )
}

export default Post
