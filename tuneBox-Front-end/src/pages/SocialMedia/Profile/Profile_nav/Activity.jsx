import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; // Import useParams để lấy userId từ URL
import Cookies from "js-cookie";
import axios from "axios";
import { format } from 'date-fns';
import "./css/activity.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../Profile/css/button.css"
import "../../css/mxh/modal-create-post.css"
import "../../css/profile.css"
import "../../css/mxh/comment.css"
import { images } from "../../../../assets/images/images";
import Picker from '@emoji-mart/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Activity = () => {
  const [postContent, setPostContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [postImageUrls, setPostImageUrls] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState(null);
  const { id } = useParams(); // Lấy ID từ URL
  const userId = Cookies.get("userId"); // Lấy ID người dùng hiện tại  từ cookies
  const [commentContent, setCommentContent] = useState({});
  const [showAllComments, setShowAllComments] = useState({});
  const [replyContent, setReplyContent] = useState({});
  const [replyingTo, setReplyingTo] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [showAllReplies, setShowAllReplies] = useState({});
  const [likes, setLikes] = useState({}); // Trạng thái lưu trữ like cho mỗi bài viết
  const [replyToUser, setReplyToUser] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentSectionRef = useRef(null);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts.find((post) => post.id === selectedPostId);

  const [isUploading, setIsUploading] = useState(false);

  const [reportType, setReportType] = useState('');
  const [reportMessage, setReportMessage] = useState("");
  const [ReportId, setReportId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  

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

  useEffect(() => {
    const createPostBtn = document.getElementById("create-post-btn");
    const postModal = document.getElementById("post-modal");
    const closeModal = document.getElementById("close-modal");
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
    document.getElementById("file-input").value = "";
  };
  const fetchPosts = async () => {
    const targetUserId = id || userId;
    console.log("Target User ID:", targetUserId);

    // Lấy token từ localStorage hoặc nơi bạn lưu trữ
    const token = localStorage.getItem('jwtToken');
    console.log("Token:", token); // In ra token để kiểm tra

    if (!token) {
        console.error("Token not found - redirecting to login");
        // Xử lý chuyển hướng đến trang đăng nhập nếu cần
        return;
    }

    try {
        const response = await axios.get(
            `http://localhost:8080/api/posts/user/${targetUserId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        console.log("Response Data:", response.data); // Kiểm tra dữ liệu nhận được

        const sortedPosts = response.data.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // Sắp xếp từ mới đến cũ
        });

        const postsWithDetails = await Promise.all(
            sortedPosts.map(async (post) => {
                const commentsResponse = await axios.get(
                    `http://localhost:8080/api/comments/post/${post.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const commentsWithReplies = await Promise.all(
                    commentsResponse.data.map(async (comment) => {
                        const repliesResponse = await axios.get(
                            `http://localhost:8080/api/replies/comment/${comment.id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            }
                        );
                        return { ...comment, replies: repliesResponse.data };
                    })
                );

                const likeCountResponse = await axios.get(
                    `http://localhost:8080/api/likes/post/${post.id}/count`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const userLikeResponse = await axios.get(
                    `http://localhost:8080/api/likes/post/${post.id}/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const liked = userLikeResponse.data;

                return {
                    ...post,
                    comments: commentsWithReplies,
                    likeCount: likeCountResponse.data,
                    liked: liked,
                    is_hidden: post.hidden,
                };
            })
        );

        setPosts(postsWithDetails);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized access - redirecting to login");
            // Xử lý thêm nếu cần, ví dụ chuyển hướng về trang đăng nhập
        } else {
            console.error("Error fetching user posts:", error);
        }
    }
};

useEffect(() => {
    fetchPosts();
}, [userId, id]);

  const handleSubmitPost = async () => {
    const formData = new FormData();
    formData.append("content", postContent || "");
    formData.append("userId", userId);

    postImages.forEach((image) => {
      formData.append("images", image);
    });

    setIsUploading(true); // Bắt đầu quá trình tải lên

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

      // Đóng modal và reset form
      document.getElementById("post-modal").style.display = "none";
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error(
        "Error creating/updating post:",
        error.response?.data || error.message
      );
    } finally {
      setIsUploading(false); // Kết thúc quá trình tải lên
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

      setPosts((posts) =>
        posts.map((post) => {
          if (post.id === postId) {
            return { ...post, comments: [...post.comments, response.data] };
          }
          return post;
        })
      );

      // Đặt lại commentContent và ẩn emoji picker
      setCommentContent((prev) => ({ ...prev, [postId]: "" }));
      setShowEmojiPicker(false);  // Ẩn emoji picker sau khi bình luận
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const addEmoji = (postId, emoji) => {
    setCommentContent((prev) => ({
      ...prev,
      [postId]: (prev[postId] || "") + emoji.native,
    }));
  };
  const handleCommentChange = (postId, value) => {
    setCommentContent((prev) => ({
      ...prev,
      [postId]: value,
    }));
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
  // Hàm để bật/tắt emoji picker
  const toggleEmojiPicker = (id) => {
    setShowEmojiPicker((prev) => (prev === id ? null : id));
  };
  // Hàm thêm emoji vào nội dung reply
  const addEmojiToReply = (replyId, emoji) => {
    setReplyContent((prev) => ({
      ...prev,
      [replyId]: (prev[replyId] || "") + emoji.native,
    }));
    setShowEmojiPicker(null); // Ẩn emoji picker sau khi chọn emoji
  };

  const handleOpenModal = (postId) => {
    setSelectedPostId(postId);
    console.log('PostId', postId)
    const modal = new bootstrap.Modal(document.getElementById("modalComent"));
    modal.show(); // Mở modal
  };

  const handleClickOutside = (event) => {
    if (commentSectionRef.current && !commentSectionRef.current.contains(event.target)) {
      setShowEmojiPicker(false); // Đóng bảng emoji nếu nhấp bên ngoài
    }
  };
  

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    // report post 
    const handleReport = (id, type) => {
      console.log('ID to report:', id); // Kiểm tra giá trị ID
      console.log('Type to report:', type); // Kiểm tra giá trị type
      setReportId(id);
      setReportType(type);
      setShowReportModal(true);
    };
    const handleSubmit = () => {
      console.log('Report Type before submit:', reportType); // Kiểm tra giá trị type
  
      if (!ReportId || !reportType) {
        setReportMessage("ID hoặc loại báo cáo không hợp lệ.");
        return;
      }
  
      // Gọi hàm submitReport với các giá trị đúng
      submitReport(currentUserId, ReportId, reportType, reportReason);
    };
  
    const submitReport = async (userId, reportId, reportType, reason) => {
      try {
        const token = localStorage.getItem("jwtToken"); // Hoặc từ nơi bạn lưu trữ JWT token
  
        const reportExists = await checkReportExists(userId, reportId, reportType);
        if (reportExists) {
          setReportMessage("Bạn đã báo cáo nội dung này rồi.");
          toast.warn("Bạn đã báo cáo nội dung này rồi."); // Hiển thị toast cảnh báo
        } else {
          const reportData = {
            userId: userId,
            postId: reportType === 'post' ? reportId : null,
            trackId: reportType === 'track' ? reportId : null,
            albumId: reportType === 'album' ? reportId : null,
            type: reportType,
            reason: reason
          };
  
          const response = await axios.post('http://localhost:8080/api/reports', reportData, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}` // Thêm JWT token vào header
            }
          });
  
          console.log('Report submitted successfully:', response.data);
          setReportMessage("Báo cáo đã được gửi thành công.");
          toast.success("Báo cáo đã được gửi thành công."); // Hiển thị toast thông báo thành công
          setShowReportModal(false);
        }
      } catch (error) {
        console.error("Lỗi khi tạo báo cáo:", error);
        if (error.response && error.response.status === 401) {
          navigate('/login?error=true');
        } else {
          setReportMessage("Đã có lỗi xảy ra khi gửi báo cáo.");
          toast.error("Đã có lỗi xảy ra khi gửi báo cáo."); // Hiển thị toast thông báo lỗi
        }
      }
    };
    const checkReportExists = async (userId, reportId, reportType) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/reports/check`, {
          params: {
            userId: userId,
            postId: reportType === 'post' ? reportId : null,
            trackId: reportType === 'track' ? reportId : null,
            albumId: reportType === 'album' ? reportId : null,
            type: reportType,
          },
          withCredentials: true,
        });
        console.log('Check report response:', response.data);
        return response.data.exists; // Giả sử API trả về trạng thái tồn tại của báo cáo
      } catch (error) {
        console.error('Error checking report:', error);
        return false;
      }
    };
  

    // ẩn hiện post
    const toggleHiddenState = async (postId) => {
      const token = localStorage.getItem('jwtToken');
      
      if (!token) {
          console.error("No JWT token found");
          toast.error("You need to be logged in to toggle post visibility.");
          return;
      }
  
      try {
          const response = await axios.put(
              `http://localhost:8080/api/posts/${postId}/toggle-visibility`, 
              {}, 
              { headers: { Authorization: `Bearer ${token}` } }
          );
  
          if (response.status === 200) {
              const { isHidden } = response.data;
              toast.success("Post visibility toggled successfully!");
  
              // Cập nhật trạng thái is_hidden của bài viết trong state
              setPosts((prevPosts) =>
                prevPosts.map((post) =>
                  post.id === postId ? { ...post, is_hidden: isHidden } : post
                )
              );
          }
      } catch (error) {
          console.error("Error toggling post visibility:", error);
          toast.error("Failed to toggle post visibility. Please try again.");
      }
  };
  
  return (
    <div>
            <ToastContainer />

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
  id="file-input" // Thêm id này
  multiple
  onChange={(e) => {
    const files = Array.from(e.target.files);
    setPostImages(files);
    setPostImageUrls(files.map(file => URL.createObjectURL(file)));
  }}
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
                {/* Hiển thị ảnh đã chọn */}
                {postImageUrls.length > 0 && (
                  <div className="selected-images mt-3">
                    {postImageUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Selected ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '5px' }} />
                    ))}
                  </div>
                )}
                      {/* Hiển thị spinner nếu đang tải lên */}
      {isUploading && (
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Creating your post...</span>
        </div>
      )}
              </div>
            </div>
          </div>
        </div>
      </div>
            {/* Modal báo cáo */}
            <ToastContainer />
      {showReportModal && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Báo cáo nội dung</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    // Reset dữ liệu khi đóng modal
                    setShowReportModal(false);
                    setReportReason(""); // Reset lý do báo cáo
                    setReportMessage(""); // Reset thông báo
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {reportMessage && <div className="alert alert-danger">{reportMessage}</div>} {/* Thông báo lỗi hoặc thành công */}
                <h6>Chọn lý do báo cáo:</h6>
                <div className="mb-3">
                  {["Nội dung phản cảm", "Vi phạm bản quyền", "Spam hoặc lừa đảo", "Khác"].map((reason) => (
                    <label className="d-block" key={reason}>
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        onChange={(e) => setReportReason(e.target.value)}
                      /> {reason}
                    </label>
                  ))}
                </div>
                <textarea
                  className="form-control mt-2"
                  placeholder="Nhập lý do báo cáo"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => submitReport(currentUserId, ReportId, reportType, reportReason)}
                  className="btn btn-primary"
                >
                  Báo cáo
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason(""); // Reset lý do báo cáo
                    setReportMessage(""); // Reset thông báo
                  }}
                >
                  Đóng
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* Phần hiển thị bài viết */}
      <div className="container mt-2 mb-5">
        {posts.map((post) => {
          const createdAt = post.createdAt ? new Date(post.createdAt) : null;
          const showAll = showAllComments[post.id];

          return (
            <div key={post.id} className="post border">
              {/* Modeal hiển thị comment  */}
              <div className="modal fade" id="modalComent" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="false">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">Comments</h1>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      {/* Danh sách bình luận */}
                      {selectedPost ? (
                        <div className="mt-4">
                          {(showAllComments[selectedPost.id] ? selectedPost.comments : selectedPost.comments.slice(0, 3)).map((comment) => (
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
                                            onClick={() => handleUpdateComment(comment.id, selectedPost.id)}
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
                                    {(String(comment.userId) === String(userId) || String(selectedPost.userId) === String(userId)) && (
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
                                          {/* Chỉ cho phép xóa nếu là chủ bài viết hoặc chủ bình luận */}
                                          <li>
                                            <button
                                              className="dropdown-item"
                                              onClick={() => handleDeleteComment(comment.id, selectedPost.id)}
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
                                      <div className="d-flex reply-input-container">
                                        <textarea
                                          className="reply-input mt-2 form-control"
                                          rows={1}
                                          placeholder={`Reply to ${comment.userNickname}`}
                                          value={replyContent[comment.id] || ""}
                                          onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                        />
                                        <i
                                          type='button' className="fa-regular fa-paper-plane ms-3 mt-2"
                                          style={{ fontSize: "20px" }}
                                          onClick={() => handleAddCommentReply(comment.id, selectedPost.id)}
                                        >

                                        </i>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {/* Hiển thị danh sách trả lời bậc 2 */}
                                <div className="row justify-content-center">
                                  {comment.replies && comment.replies.length > 0 && (
                                    <div className="replies-list mt-2">
                                      {showAllReplies[comment.id] ? (
                                        <>
                                          {comment.replies.map((reply) => (
                                            <div key={`reply-${reply.id}`} className="reply">
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
                                                      <strong>{reply.repliedToNickname}:</strong> {reply.content}
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
                                                              setEditingReplyId(reply.id);
                                                              setEditingReplyContent(reply.content);
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
                                                    <div className="d-flex reply-input-container">
                                                      <textarea
                                                        className="reply-input mt-2 form-control"
                                                        rows={1}
                                                        placeholder="Write a reply..."
                                                        value={replyContent[reply.id] || ""}
                                                        onChange={(e) => handleReplyChange(reply.id, e.target.value)}
                                                      />
                                                      <i
                                                        type='button' className="fa-regular fa-paper-plane ms-3 mt-2"
                                                        onClick={() => handleAddReplyToReply(reply.id, comment.id)}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                          {/* Nút để ẩn các phản hồi */}
                                          <button className="btn btn-link" onClick={() => handleToggleReplies(comment.id)}>
                                            Hide replies
                                          </button>
                                        </>
                                      ) : (
                                        <button className="btn btn-link" onClick={() => handleToggleReplies(comment.id)}>
                                          View all replies
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Hiển thị nút xem thêm bình luận */}
                          {selectedPost.comments.length > 3 && (
                            <button className="btn btn-link" onClick={() => handleToggleComments(selectedPost.id)}>
                              {showAllComments[selectedPost.id] ? "View less comments" : "View all comments"}
                            </button>
                          )}
                        </div>
                      ) : (
                        <p>No comments available</p>
                      )}
                      {/* Phần bình luận */}
                      <div className="comment-section d-flex mt-4">
                        <textarea
                          className="comment-input"
                          style={{ resize: "none" }}
                          rows={1}
                          placeholder="Write a comment..."
                          value={commentContent[post.id] || ""}
                          onChange={(e) => handleCommentChange(selectedPost.id, e.target.value)}
                        />
                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="btn btn-sm">
                          😀
                        </button>

                        {showEmojiPicker && (
                          <div style={{ position: "absolute", bottom: "100%", left: "0", zIndex: 10 }}>
                            <Picker onEmojiSelect={(emoji) => {
                              addEmoji(selectedPost.id, emoji);
                              // Không đóng bảng emoji ở đây
                            }} />
                            {/* Nút để đóng bảng emoji */}
                            <button onClick={() => setShowEmojiPicker(false)} className="btn btn-link">
                              Close
                            </button>
                          </div>
                        )}
                        <div className="button-comment">
                          <i type='button' className="fa-regular fa-paper-plane mt-2"
                            style={{ fontSize: "20px" }}
                            onClick={() => {
                              handleAddComment(selectedPost.id);
                              setShowEmojiPicker(false);
                            }}
                          >
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Phần tiêu đề bài viết */}
              <div key={post.id} className="post-header position-relative">
          <button
            type="button"
            className="btn"
            onClick={() => handleAvatarClick(post)}
            aria-label="Avatar"
          >
            <img
              src={post.avatar}
              className="avatar_small"
              alt="Avatar"
            />
          </button>
          <div>
            <div className="name">
              {post.userNickname || "Unknown User"}
            </div>
            <div className="time">
              {post.createdAt && !isNaN(new Date(post.createdAt).getTime())
                ? format(new Date(post.createdAt), "hh:mm a, dd MMM yyyy")
                : "Invalid date"}
              {post.edited && <span className="edited-notice"> (Edited)</span>}
            </div>
            <div>
            {post.is_hidden ? <span className="hidden-notice"> (Bài viết đã được ẩn)</span> : ""}
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
                    <i className="fa-solid fa-pen-to-square"></i>Edit
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleDeletePost(post.id)}>
                    <i className="fa-solid fa-trash"></i>Delete
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => toggleHiddenState(post.id)}
                  >
                    <i className="fa-solid fa-eye-slash"></i>
                    {post.is_hidden ? " Hiện bài viết" : " Ẩn bài viết "}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <button
            className="fa-regular fa-flag btn-report position-absolute top-0 end-0 border-0"
            onClick={() => handleReport(post.id, 'post')}
          ></button>
          )}
        </div>
              {/* Nội dung bài viết */}
              <div className="post-content">{post.content}</div>
              {/* Hiển thị hình ảnh dưới dạng carousel */}
              {post.images && post.images.length > 0 && (
                <div id={`carousel-${post.id}`} className="carousel slide post-images" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {post.images.map((image, index) => (
                      <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                        <img
                          src={image.postImage}
                          className="d-block w-100"
                          alt={`Post image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${post.id}`} data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${post.id}`} data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              )}
              {/* Interact post */}
              <div className='row d-flex justify-content-start align-items-center'>
                {/* like post */}
                <div className="col-2 mt-2 text-center">
                  <div className="like-count">
                    {post.likeCount || 0}
                    <i
                      className={`fa-solid fa-heart text-danger ${likes[post.id] ? "like" : "noLike"}`}
                      onClick={() => handleLike(post.id)}
                    >
                      {likes[post.id]}
                    </i>
                  </div>
                </div>
                {/* comment post */}
                <div className="col-2 mt-2 text-center">
                  <div className='d-flex justify-content-center align-items-center'>
                    {post.comments.length}
                    <i
                      type="button"
                      style={{ fontSize: '25px' }}
                      className="fa-regular fa-comment"
                      onClick={() => handleOpenModal(post.id)}
                    >
                    </i>
                  </div>
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