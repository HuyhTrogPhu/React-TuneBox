import React, { useEffect, useState, useRef } from 'react';
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
import { Link } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import { getAllTracks } from "../../service/TrackServiceCus";
import Waveform from "../SocialMedia/Profile/Profile_nav/Waveform";
import {
  addLike,
  checkUserLikeTrack,
  removeLike,
} from "../../service/likeTrackServiceCus";


const HomeFeed = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = Cookies.get("userId");
  console.log('currentUserId: ', currentUserId)
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
  const [likes, setLikes] = useState({}); // Trạng thái lưu trữ like cho mỗi bài viết
  const [likesCount, setLikesCount] = useState({});
  const [replyToUser, setReplyToUser] = useState("");
  const currentUserNickname = Cookies.get('userNickname');
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportPostId, setReportPostId] = useState(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentSectionRef = useRef(null);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts.find((post) => post.id === selectedPostId);

  const [isUploading, setIsUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // track
  const [tracks, setTracks] = useState([]);
  const [likedTracks, setLikedTracks] = useState({});

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await getAllTracks();
        setTracks(response);
        console.log("get all track: ", response);

        // ktra trạng thái like cho mỗi track
        const likedStatus = await Promise.all(
          response.map(async (track) => {
            const liked = await checkUserLikeTrack(track.id, currentUserId);
            console.log(
              "userId:",
              currentUserId,
              "trackId:",
              track.id,
              "- likeStatus: ",
              liked
            );
            return { id: track.id, liked }; // Trả về id và trạng thái liked
          })
        );

        // cap nhat likedTracks
        const updatedLikedTracks = {};
        likedStatus.forEach(({ id, liked }) => {
          updatedLikedTracks[id] = liked; // Gán trạng thái liked cho từng track
        });
        setLikedTracks(updatedLikedTracks); // Cập nhật trạng thái likedTracks

        console.log("Cập nhật trạng thái likedTracks: ", updatedLikedTracks);
      } catch (error) {
        console.error("Error fetching all track:", error);
      }
    };
    fetchTracks();
  }, []);

  const handleLikeTrack = async (trackId) => {
    try {
      if (likedTracks[trackId]?.data) {
        // nếu đã thích, gọi hàm xóa like
        await removeLike(currentUserId, trackId);
        setLikedTracks((prev) => ({
          ...prev,
          [trackId]: { data: false }, // cập nhật trạng thái liked thành false
        }));
        console.error("Đã xóa like:", trackId);
      } else {
        // nếu chưa thích, gọi hàm thêm like
        await addLike(currentUserId, trackId, null);
        setLikedTracks((prev) => ({
          ...prev,
          [trackId]: { data: true }, // cập nhật trạng thái liked thành true
        }));
        console.error("Đã like:", trackId);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý like:", error);
    }
  };

  // end track

  const handleAvatarClick = (post) => {
    console.log("Current User ID:", currentUserId);
    console.log("Post User ID:", post.userId);

    // Cấu hình interceptor cho Axios để thêm Authorization header vào mỗi yêu cầu
    // axios.interceptors.request.use(
    //   (config) => {
    //     const token = localStorage.getItem('token').trim(); // Lấy token từ localStorage
    //       if (token) {
    //           config.headers['Authorization'] = token; 
    //       }
    //       return config;
    //   },
    //   (error) => {
    //       return Promise.reject(error);
    //   }
    // );


    if (String(post.userId) === String(currentUserId)) {
      console.log("Navigating to ProfileUser");
      navigate('/profileUser');
    } else {
      console.log("Navigating to OtherUserProfile");
      navigate(`/profile/${post.userId}`);
    }
  };



  // Hàm để lấy các bài viết
  const fetchPosts = async () => {

    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/all`,
        {
          params: { currentUserId }, // Truyền currentUserId vào request
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
      const postsWithCommentsAndLikes = await Promise.all(
        sortedPosts.map(async (post) => {
          const commentsResponse = await axios.get(
            `http://localhost:8080/api/comments/post/${post.id}`
          );
          console.log('post Id:', post.id);
          const commentsWithReplies = await Promise.all(
            commentsResponse.data.map(async (comment) => {
              const repliesResponse = await axios.get(
                `http://localhost:8080/api/replies/comment/${comment.id}`
              );
              return { ...comment, replies: repliesResponse.data }; // Kết hợp replies vào comment
            })
          );

          // Lấy số lượng likes cho từng bài viết
          const likeCountResponse = await axios.get(
            `http://localhost:8080/api/likes/post/${post.id}/count`
          );

          // Kiểm tra xem user đã like bài viết này chưa
          const userLikeResponse = await axios.get(
            `http://localhost:8080/api/likes/post/${post.id}/user/${currentUserId}`
          );

          const liked = userLikeResponse.data; // true nếu user đã like, false nếu chưa

          return {
            ...post,
            comments: commentsWithReplies,
            likeCount: likeCountResponse.data, // Thêm số lượng likes vào bài viết
            liked: liked // Thêm trạng thái like
          }; // Kết hợp comments và likeCount vào post
        })
      );

      setPosts(postsWithCommentsAndLikes); // Cập nhật state với danh sách bài viết
      // Cập nhật trạng thái likes cho từng bài viết
      const updatedLikes = {};
      postsWithCommentsAndLikes.forEach(post => {
        updatedLikes[post.id] = post.liked; // Cập nhật trạng thái like cho post
      });
      setLikes(updatedLikes); // Cập nhật trạng thái likes
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
    fetchPosts(); // Gọi hàm để lấy bài viết khi component được mount
  }, [currentUserId]); // Theo dõi currentUserId để gọi lại khi thay đổi


  // like post
  const handleLike = async (postId) => {
    try {
      const likeDto = {
        userId: currentUserId,
        postId: postId,
      };

      if (likes[postId]) {
        // Nếu đã like, thực hiện unlike
        await fetch(`http://localhost:8080/api/likes/remove?userId=${currentUserId}&postId=${postId}`, {
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

  // reply comment 
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
    document.getElementById("file-input").value = "";
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPostImages(files); // Cập nhật tệp ảnh
  };
  const handleSubmitPost = async () => {
    const formData = new FormData();
    formData.append("content", postContent || "");
    formData.append("userId", currentUserId);

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
  // delete post
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

  // edit post
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
        `http://localhost:8080/api/comments/post/${postId}/user/${currentUserId}`,
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
      await axios.delete(`http://localhost:8080/api/replies/reply/${replyId}/user/${currentUserId}`);

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
      const response = await axios.put(`http://localhost:8080/api/replies/reply/${replyId}/user/${currentUserId}`, {
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

  // add reply comment
  const handleAddCommentReply = async (commentId, postId) => {
    const content = replyContent[commentId] || "";
    if (!content.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/replies/comment/${commentId}/user/${currentUserId}`,
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

  // reply to reply comment
  const handleAddReplyToReply = async (parentReplyId, commentId) => {
    const replyDto = {
      content: replyContent[parentReplyId] || "",
      commentId: commentId
    };

    if (!replyDto.content.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/replies/reply/${parentReplyId}/user/${currentUserId}`,
        replyDto
      );

      console.log("Reply added:", response.data);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === post.id) {
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

  // report post 
  const handleReportPost = (postId) => {
    setReportPostId(postId);
    setShowReportModal(true); // Hiện modal
  };

  const submitReport = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Đảm bảo gửi cookie cùng với request
        body: JSON.stringify({
          postId: reportPostId,
          reason: reportReason,
        }),
      });

      if (response.ok) {
        console.log('thành công');
        setShowReportModal(false);
        setReportReason("");
      } else {
        console.error('Có lỗi xảy ra khi gửi báo cáo.');
      }
    } catch (error) {
      console.error('Lỗi mạng:', error);
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

  const handleClickOutside = (event) => {
    if (commentSectionRef.current && !commentSectionRef.current.contains(event.target)) {
      setShowEmojiPicker(false); // Đóng bảng emoji nếu nhấp bên ngoài
    }
  };

  const handleOpenModal = (postId) => {
    setSelectedPostId(postId);
    console.log('PostId', postId)
    const modal = new bootstrap.Modal(document.getElementById("modalComent"));
    modal.show(); // Mở modal
  };


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
                  <span className='fw-bold'>
                    <Link to={'/'}>Bản tin</Link>
                  </span>
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
            {/* Phần hiển thị bài viết */}
            <div className="container mt-2 mb-5">
              {posts.map((post) => {
                const createdAt = post.createdAt ? new Date(post.createdAt) : null;
                const showAll = showAllComments[post.id];

                return (
                  <div key={post.id} className="post border">
                    {/* Modeal hiển thị comment  */}
                    <div class="modal fade" id="modalComent" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="false">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Comments</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
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
                                          {(String(comment.userId) === String(currentUserId) || String(selectedPost.userId) === String(currentUserId)) && (
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
                                                        {String(reply.userId) === String(currentUserId) && (
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
                    <div className="post-header position-relative">
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
                        <div className="name">{post.userNickname || "Unknown User"}</div>
                        <div className="time">
                          {createdAt && !isNaN(createdAt.getTime())
                            ? format(createdAt, "hh:mm a, dd MMM yyyy")
                            : "Invalid date"}
                          {post.edited && <span className="edited-notice"> (Edited)</span>}
                        </div>
                      </div>
                      {/* Dropdown cho bài viết */}
                      {String(post.userId) === String(currentUserId) ? (
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
                          <ul className="dropdown-menu"
                            aria-labelledby={`dropdownMenuButton-${post.id}`}>
                            <li>
                              <button className="dropdown-item" onClick={() => handleEditPost(post)}>
                                <i className='fa-solid fa-pen-to-square'></i>Edit
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => handleDeletePost(post.id)}>
                                <i className='fa-solid fa-trash '></i>Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <button className="fa-regular fa-flag btn-report position-absolute top-0 end-0" onClick={() => handleReportPost(post.id)}>
                        </button>
                      )}
                    </div>
                    {/* Nội dung bài viết */}
                    <div className="post-content">{post.content}</div>
                    {/* Hiển thị hình ảnh */}
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

            {/* Phần hiển thị track */}
            <div className="container mt-2 mb-5">
              {tracks.map((track) => (
                <div className="post border" key={track.id}>
                  {/* Tiêu đề */}
                  <div className="post-header position-relative">
                    <button type="button" className="btn" aria-label="Avatar">
                      <img
                        src={track.userId.avatar} //lỗi
                        className="avatar_small"
                        alt="Avatar"
                      />
                    </button>
                    <div>
                      <div className="name">
                        {track.userName || "Unknown User"}
                      </div>
                      <div className="time">
                        {new Date(track.createDate).toLocaleString()}
                      </div>
                    </div>
                    {/* Dropdown cho bài viết */}
                    <div className="dropdown position-absolute top-0 end-0">
                      <button
                        className="btn btn-options dropdown-toggle"
                        type="button"
                        id={`dropdownMenuButton-${track.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby={`dropdownMenuButton-${track.id}`}
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleEdit(track.id)}
                          >
                            <i className="fa-solid fa-pen-to-square"></i> Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleDelete(track.id)}
                          >
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                    <button className="fa-regular fa-flag btn-report position-absolute top-0 end-0"></button>
                  </div>

                  <div className="post-content description">
                    {track.description || "Unknown description"}
                  </div>
                  {/* Nội dung */}
                  <div className="post-content audio">
                    <Waveform
                      audioUrl={track.trackFile}
                      track={track}
                      className="track-waveform "
                    />
                  </div>

                  {/* Like/Comment */}
                  <div className="row d-flex justify-content-start align-items-center">
                    {/* Like track*/}
                    <div className="col-2 mt-2 text-center">
                      <div className="like-count">
                        {track.likeCount || 0} {/* Hiển thị số lượng like */}
                        <i
                          className={`fa-solid fa-heart ${likedTracks[track.id]?.data
                              ? "text-danger"
                              : "text-muted"
                            }`}
                          onClick={() => handleLikeTrack(track.id)}
                          style={{ cursor: "pointer", fontSize: "25px" }} // Thêm style để biểu tượng có thể nhấn
                        ></i>
                      </div>
                    </div>

                    {/* Comment track*/}
                    <div className="col-2 mt-2 text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        {track.commentCount || 0}
                        <i
                          type="button"
                          style={{ fontSize: "25px" }}
                          className="fa-regular fa-comment"
                          data-bs-toggle="modal"
                          data-bs-target="#modalComment"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

      {/* Các modal */}
      {/* Modal báo cáo */}
      {showReportModal && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Báo cáo bài viết</h5>
                <button type="button" className="btn-close" onClick={() => setShowReportModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder="Nhập lý do báo cáo"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)} // Cập nhật lý do báo cáo
                  style={{ resize: 'none' }} // Không cho phép thay đổi kích thước
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={submitReport}>Gửi báo cáo</button>
                <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                    style={{ backgroundColor: '#E94F37' }}
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
    </div>

  )
}

export default HomeFeed