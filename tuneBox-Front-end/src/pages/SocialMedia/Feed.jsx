import React, { useEffect, useState, useRef, useContext } from "react";
import { images } from "../../assets/images/images";
import axios from "axios";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/mxh/style.css";
import "./css/mxh/post.css";
import "./css/mxh/modal-create-post.css";
import "./css/profile.css";
import "./css/mxh/comment.css";
import "./css/mxh/button.css";
import "./css/mxh/feedUpdate.css";
import {
  useParams,
  useNavigate,
  Navigate,
  Router,
  useLocation,
  Outlet,
} from "react-router-dom";
import { Link, Routes, Route } from "react-router-dom";
import { getAllTracks, listGenre } from "../../service/TrackServiceCus";
import {
  addLike,
  checkUserLikeTrack,
  removeLike,
  getLikesCountByTrackId,
} from "../../service/likeTrackServiceCus";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsersToFollow from "./Profile/UsersToFollow";
import {
  getPlaylistByUserId,
  getPlaylistById,
  updatePlaylist,
} from "../../service/PlaylistServiceCus";
import { getUserInfo } from "../../service/UserService";
import FeedTrack from "./FeedTrack";
import FeedPost from "./FeedPost";
import { FollowContext } from "./Profile/FollowContext";


const HomeFeed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const currentUserId = Cookies.get("userId");
  console.log("currentUserId: ", currentUserId);
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
  const currentUserNickname = Cookies.get("userNickname");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [ReportId, setReportId] = useState(null);
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [postHiddenStates, setPostHiddenStates] = useState({});

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentSectionRef = useRef(null);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts.find((post) => post.id === selectedPostId);

  const [isUploading, setIsUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const tokenjwt = localStorage.getItem("jwtToken");
  const [activeComponent, setActiveComponent] = useState("track"); // State để quản lý component hiển thị track or post

  //get avatar
  const [userData, setUserData] = useState({});
  // tag name user
  const [showPostModal, setShowPostModal] = useState(false); // Modal tạo bài viết
  const [showTagModal, setShowTagModal] = useState(false); // Modal tag người dùng
  const [userSuggestions, setUserSuggestions] = useState([]); // Danh sách gợi ý tên người dùng

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUserId) {
        try {
          const userData = await getUserInfo(currentUserId);
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching user", error);
        }
      }
    };

    fetchUser();
  }, [currentUserId]);

  // track
  const [tracks, setTracks] = useState([]);
  const [likedTracks, setLikedTracks] = useState({});
  const [countLikedTracks, setCountLikedTracks] = useState({});
  const [selectedTrack, setSelectedTrack] = useState(null); // State cho track duoc chon
  const [selectedGenre, setSelectedGenre] = useState(""); // Store the selected genre
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    fetchGenre(); // Fetch genres when the component mounts
  }, []);

  const fetchGenre = async () => {
    try {
      const genreResponse = await listGenre(); // Assuming listGenre is your API call
      console.log(genreResponse.data);
      setGenres(genreResponse.data); // Store the fetched genres in state
    } catch (error) {
      console.log("Error fetching genres:", error);
    }
  };


  const fetchTracks = async () => {
    try {
      const response = await getAllTracks();
      setTracks(response);
      console.log("get all track: ", response);

      // ktra trạng thái like cho mỗi track
      const likedStatus = await Promise.all(
        response.map(async (track) => {
          const liked = await checkUserLikeTrack(track.id, currentUserId);
          const count = await getLikesCountByTrackId(track.id);
          // console.log(
          //   "userId:",
          //   currentUserId,
          //   "trackId:",
          //   track.id,
          //   "- likeStatus: ",
          //   liked
          // );
          return { id: track.id, liked, count }; // Trả về id và trạng thái liked
        })
      );

      // cap nhat likedTracks
      const updatedLikedTracks = {};
      const updatedCountTracks = {};
      likedStatus.forEach(({ id, liked, count }) => {
        updatedLikedTracks[id] = liked; // Gán trạng thái liked cho từng track
        updatedCountTracks[id] = count;
      });
      setLikedTracks(updatedLikedTracks); // Cập nhật trạng thái likedTracks
      setCountLikedTracks(updatedCountTracks);
      // console.log("Cập nhật trạng thái likedTracks: ", updatedLikedTracks);
      // console.log("Cập nhật trạng thái likedTracks: ", updatedCountTracks);
    } catch (error) {
      console.error("Error fetching all track:", error);
    }
  };
  const handleLikeTrack = async (trackId) => {
    try {
      if (likedTracks[trackId]?.data) {
        // nếu đã thích, gọi hàm xóa like
        await removeLike(currentUserId, trackId);
        setLikedTracks((prev) => ({
          ...prev,
          [trackId]: { data: false }, // cập nhật trạng thái liked thành false
        }));

        fetchTracks();
        console.error("Đã xóa like:", trackId);
      } else {
        // nếu chưa thích, gọi hàm thêm like
        await addLike(currentUserId, trackId, null);
        setLikedTracks((prev) => ({
          ...prev,
          [trackId]: { data: true }, // cập nhật trạng thái liked thành true
        }));
        fetchTracks();
        console.error("Đã like:", trackId);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý like:", error);
    }
  };

  // Ham xoa track
  const deleteTrack = async (trackId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Track?"
    ); // Xac nhan xoa
    if (!confirmDelete) return; // Khong xoa neu nguoi dung khong dong y
    try {
      await axios.delete(`http://localhost:8080/customer/tracks/${trackId}`, {
        withCredentials: true,
      });
      fetchTracks(); // Cap nhat danh sach track sau khi xoa
    } catch (error) {
      console.error(
        "Error deleting track:",
        error.response?.data || error.message
      ); // Log loi neu co
    }
  };

  const handleEditClick = (track) => {
    // Tạo một đối tượng track mới với đầy đủ thông tin
    const updatedTrack = {
      ...track,
      // Giữ nguyên URL của ảnh hiện tại thay vì tạo Blob mới
      imageTrack: track.imageTrack,
      // Giữ nguyên thông tin file nhạc hiện tại
      trackFile: {
        name: track.trackFileName || "Current track file", // Thêm tên file nếu có
      },
    };

    setSelectedTrack(updatedTrack);

    // Set genre ID từ track hiện tại
    if (track.genre) {
      setSelectedGenre(track.genre.id.toString());
    }

    const editModal = document.getElementById("editModal");
    editModal.classList.add("show");
    editModal.style.display = "block";
    document.body.classList.add("modal-open");
  };
  // Save track after editing
  const handleSave = async () => {
    if (!selectedTrack) return;

    const formData = new FormData();
    formData.append("name", selectedTrack.name);
    formData.append("description", selectedTrack.description);
    formData.append("status", selectedTrack.status);
    formData.append("report", selectedTrack.report);
    formData.append("userId", currentUserId);
    formData.append("genre", selectedGenre);

    // Chỉ gửi file mới nếu người dùng đã chọn file mới
    if (selectedTrack.trackFile instanceof File) {
      formData.append("trackFile", selectedTrack.trackFile);
    }

    // Chỉ gửi ảnh mới nếu người dùng đã chọn ảnh mới
    if (selectedTrack.trackImage instanceof File) {
      formData.append("trackImage", selectedTrack.trackImage);
    }

    try {
      await axios.put(
        `http://localhost:8080/customer/tracks/${selectedTrack.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      fetchTracks();
      setSelectedTrack(null);

      const editModal = document.getElementById("editModal");
      editModal.classList.remove("show");
      editModal.style.display = "none";
      document.body.classList.remove("modal-open");
    } catch (error) {
      console.error(
        "Error updating track:",
        error.response?.data || error.message
      );
    }
  };

  // end track

  // playlist
  // list
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [trackToAddPlayList, setTrackToAddPlayList] = useState(null);

  const fetchListPlaylist = async () => {
    try {
      const playlistResponse = await getPlaylistByUserId(currentUserId);
      setPlaylists(playlistResponse);
      console.log("playlist  ", playlistResponse);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };
  const addToPlaylist = (trackId) => {
    setShowModal(true); // Mở modal
    setTrackToAddPlayList(trackId);
  };

  useEffect(() => {
    fetchListPlaylist();
  }, [currentUserId]);

  const handleCloseModal = () => {
    setShowModal(false); // Đóng modal
  };
  const handleAddTrackToPlaylist = async (playlistId) => {
    try {
      // lấy thong tin htai cua lít
      const currentPlaylist = await getPlaylistById(playlistId);
      console.log("currentPlaylist: ", currentPlaylist.data);
      const formData = new FormData();
      // Kiểm tra xem track đã tồn tại trong playlist chưa
      const existingTracks = currentPlaylist.data.tracks; // Danh sách track hiện có trong playlist
      if (existingTracks.includes(trackToAddPlayList)) {
        toast.error("Track đã tồn tại trong playlist!");
        return; // Dừng thực hiện nếu track đã tồn tại
      }
      formData.append("trackIds", trackToAddPlayList);
      formData.append("title", currentPlaylist.data.title);
      formData.append("imagePlaylist", currentPlaylist.data.imagePlaylist); // thêm trường này
      formData.append("description", currentPlaylist.data.description);
      formData.append("status", false);
      formData.append("report", false);
      formData.append("type", currentPlaylist.data.type);
      formData.append("user", currentUserId);
      console.log("handleAddTrackToPlaylist: ", currentPlaylist.data.title);
      await updatePlaylist(playlistId, formData);
      toast.success(" Add Track to Playlist successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create add track to playlist:", error);
      const errorMessage =
        error.response?.data?.message || "Failed. Please try again.";
      toast.error(errorMessage);
    }
  };
  // end playlist

  // Hàm để lấy các bài viết
  const fetchPosts = async () => {
    try {
      // Gọi API kiểm tra trạng thái tài khoản
      const statusResponse = await axios.get(`http://localhost:8080/user/check-status/${currentUserId}`, {
        withCredentials: true,
      });

      // Kiểm tra nếu tài khoản bị khóa
      if (statusResponse.data.isBanned) {
        // Hiển thị modal và xử lý đăng xuất
        setIsAccountBanned(true); // Kích hoạt modal
        return; // Dừng xử lý tiếp
      }

      // Nếu tài khoản không bị khóa, tiếp tục xử lý bài viết
      const response = await axios.get(`http://localhost:8080/api/posts/all`, {
        params: { currentUserId },
        withCredentials: true,
      });

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
            liked: liked, // Thêm trạng thái like
          }; // Kết hợp comments và likeCount vào post
        })
      );

      setPosts(postsWithCommentsAndLikes); // Cập nhật state với danh sách bài viết
      // Cập nhật trạng thái likes cho từng bài viết
      const updatedLikes = {};
      postsWithCommentsAndLikes.forEach((post) => {
        updatedLikes[post.id] = post.liked; // Cập nhật trạng thái like cho post
      });
      setLikes(updatedLikes); // Cập nhật trạng thái likes
    } catch (error) {
      console.error("Error fetching user posts:", error); // Log lỗi nếu có
    }
  };


  useEffect(() => {
    const fetchLikesCounts = async () => {
      const counts = await Promise.all(
        posts.map((post) =>
          axios.get(`http://localhost:8080/api/likes/post/${post.id}/count`)
        )
      );

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

      if (likes[postId]?.data) {
        // Nếu đã like, thực hiện unlike
        await fetch(
          `http://localhost:8080/api/likes/remove?userId=${currentUserId}&postId=${postId}`,
          {
            method: "DELETE",
          }
        );

        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: { ...prevLikes[postId], data: false },
        })); // Cập nhật trạng thái like

        // Cập nhật số lượt like trên UI
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likeCount: post.likeCount - 1 }
              : post
          )
        );
      } else {
        // Nếu chưa like, thực hiện like
        const response = await fetch(`http://localhost:8080/api/likes/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(likeDto), // Gửi dữ liệu likeDto
        });

        if (!response.ok) {
          throw new Error("Failed to like the post");
        }

        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: { ...prevLikes[postId], data: true },
        })); // Cập nhật trạng thái like

        // Cập nhật số lượt like trên UI
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likeCount: post.likeCount + 1 }
              : post
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
      setShowEmojiPicker(false); // Ẩn emoji picker sau khi bình luận
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
      await axios.delete(
        `http://localhost:8080/api/replies/reply/${replyId}/user/${currentUserId}`
      );

      // Cập nhật lại danh sách reply trong state
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              return {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.id !== replyId
                ),
              };
            }),
          };
        })
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
      alert("Failed to delete reply");
    }
  };
  const handleUpdateReply = async (replyId) => {
    try {
      // Sử dụng biến đúng để cập nhật nội dung
      const response = await axios.put(
        `http://localhost:8080/api/replies/reply/${replyId}/user/${currentUserId}`,
        {
          content: editingReplyContent, // Sử dụng biến này để cập nhật nội dung
        }
      );

      // Cập nhật lại danh sách reply trong state
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? { ...reply, content: editingReplyContent }
                    : reply
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
      console.error("Error updating reply:", error);
      alert("Failed to update reply");
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
      commentId: commentId,
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
      console.error(
        "Error adding reply:",
        error.response?.data || error.message
      );
    }
  };
  // report post
  const handleReport = (id, type) => {
    console.log("ID to report:", id); // Kiểm tra giá trị ID
    console.log("Type to report:", type); // Kiểm tra giá trị type
    setReportId(id);
    setReportType(type);
    setShowReportModal(true);
  };
  const handleSubmit = () => {
    console.log("Report Type before submit:", reportType); // Kiểm tra giá trị type

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

      const reportExists = await checkReportExists(
        userId,
        reportId,
        reportType
      );
      if (reportExists) {
        setReportMessage("Bạn đã báo cáo nội dung này rồi.");
        toast.warn("Bạn đã báo cáo nội dung này rồi."); // Hiển thị toast cảnh báo
      } else {
        const reportData = {
          userId: userId,
          postId: reportType === "post" ? reportId : null,
          trackId: reportType === "track" ? reportId : null,
          albumId: reportType === "album" ? reportId : null,
          type: reportType,
          reason: reason,
        };

        const response = await axios.post(
          "http://localhost:8080/api/reports",
          reportData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Thêm JWT token vào header
            },
          }
        );

        console.log("Report submitted successfully:", response.data);
        setReportMessage("Báo cáo đã được gửi thành công.");
        toast.success("Báo cáo đã được gửi thành công."); // Hiển thị toast thông báo thành công
        setShowReportModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login?error=true");
      } else {
        setReportMessage("Đã có lỗi xảy ra khi gửi báo cáo.");
        toast.error("Đã có lỗi xảy ra khi gửi báo cáo."); // Hiển thị toast thông báo lỗi
      }
    }
  };
  const checkReportExists = async (userId, reportId, reportType) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reports/check`,
        {
          params: {
            userId: userId,
            postId: reportType === "post" ? reportId : null,
            trackId: reportType === "track" ? reportId : null,
            albumId: reportType === "album" ? reportId : null,
            type: reportType,
          },
          withCredentials: true,
        }
      );
      console.log("Check report response:", response.data);
      return response.data.exists; // Giả sử API trả về trạng thái tồn tại của báo cáo
    } catch (error) {
      console.error("Lỗi mạng:", error);
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
    if (
      commentSectionRef.current &&
      !commentSectionRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false); // Đóng bảng emoji nếu nhấp bên ngoài
    }
  };

  const handleOpenModal = (postId) => {
    setSelectedPostId(postId);
    console.log("PostId", postId);
    const modal = new bootstrap.Modal(document.getElementById("modalComent"));
    modal.show(); // Mở modal
  };

  // ẩn hiện post
  const toggleHiddenState = async (postId) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("No JWT token found");
      toast.error("You need to be logged in to toggle post visibility.");
      return; // No token, do not call API
    }

    try {
      await axios.put(
        `http://localhost:8080/api/posts/${postId}/toggle-visibility`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the visibility state of the post
      setPostHiddenStates((prevStates) => ({
        ...prevStates,
        [postId]: !prevStates[postId], // Toggle the visibility state
      }));
      fetchPosts();
    } catch (error) {
      console.error("Error toggling post visibility:", error);
      toast.error("Failed to toggle post visibility. Please try again."); // Notify user of error
    }
  };

  // get user information in feed

  // Lấy danh sách tên người dùng có thể tag
  useEffect(() => {
    const fetchUserTags = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/posts/tagName",
          {
            withCredentials: true,
          }
        );
        console.log("User tags fetched:", response.data);
        setUserSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching user tags:", error);
      }
    };
    fetchUserTags();
  }, []);

  // Hiển thị modal khi nhấn nút "What are you thinking about?"
  const handleCreatePostClick = () => {
    setShowPostModal(true);
  };

  // Đóng modal tạo bài viết
  const closePostModal = () => {
    setShowPostModal(false);
    setPostContent("");
    setPostImages([]);
    setPostImageUrls([]);
  };

  // Xử lý khi có thay đổi trong textarea
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setPostContent(value);

    // Kiểm tra nếu ký tự cuối là "@"
    if (value.slice(-1) === "@") {
      setShowTagModal(true);
    } else {
      setShowTagModal(false); // Đóng modal nếu không phải là "@"
    }
  };

  // Thêm tên người dùng vào postContent khi chọn
  const handleTagUser = (username) => {
    setPostContent((prevContent) => prevContent + username + " ");
    setShowTagModal(false); // Đóng modal sau khi chọn
  };
  const { followCounts } = useContext(FollowContext);

  const [followCount, setFollowCount] = useState({
    followerCount: 0,
    followingCount: 0,
  });
  useEffect(() => {
    const counts = followCounts[currentUserId] || {
      followerCount: 0,
      followingCount: 0,
    };
    setFollowCount(counts);
  }, [followCounts, currentUserId]);

  // share
  const [sharedData, setSharedData] = useState(null);
  useEffect(() => {
    if (location.state) {
      setActiveComponent(location.state.activeComponent || "track");
      setSharedData(location.state.sharedData || null);
    }
  }, [location.state]);

  const clearSharedData = () => {
    setSharedData(null);
    navigate("/feed", {
      state: {
        sharedData: null, // Xóa sharedData
        activeComponent: "post", // Xác định lại thành phần cần hiển thị
      },
    });
  };


  //Render
  return (
    <div>
      <div
        className="feed-container p-0"
        style={{
          width: "100%",
        }}
      >
        <ToastContainer />
        <div className="row feed-content">
          {/* Left Sidebar */}
          <div className="col-3 sidebar content-left bg-light">
            {/* Profile */}
            <div className="feed-profile mb-5">
              {/* avatar */}
              <div className="feed-avatar d-flex align-item-center justify-content-center">
                <img
                  src={
                    userData.avatar || "/src/UserImages/Avatar/default-avt.jpg"
                  }
                  alt="User avatar"
                />
              </div>
              {/* information */}
              <div className="feed-information text-center">
                <h5 className="feed-username">{userData.name}</h5>
                <h6 className="feed-name">
                  @<h7>{userData.userName}</h7>
                </h6>
                <h6 className="feed-following">Follower</h6>
                <span>{followCount.followerCount}</span>
                <h6 className="feed-follower">Following</h6>
                <span>{followCount.followingCount}</span>
              </div>
              {/* View profile */}
              <div className="view-profile text-center">
                <Link style={{ color: "#E94F37" }} to={"/profileUser"}>
                  View profile
                </Link>
              </div>
            </div>
            <ul className="list-unstyled">
              <li className="left mb-4">
                <a
                  href="/#"
                  className="d-flex align-items-center justify-content-center"
                  style={{ textAlign: "center", marginTop: "0px" }}
                >
                  <img
                    src={images.web_content}
                    alt="icon"
                    width={20}
                    className="me-2"
                  />
                  <span className="fw-bold">
                    <Link to={"/"}>Bản tin</Link>
                  </span>
                </a>
              </li>
              <li className="left mb-4">
                <a
                  href="/#"
                  className="d-flex align-items-center justify-content-center"
                >
                  <img
                    src={images.followers}
                    alt="icon"
                    width={20}
                    className="me-2"
                  />
                  <span className="fw-bold">Đang theo dõi</span>
                </a>
              </li>

              <li className="left mb-4">
                <Link
                  to={"/likepost"}
                  className="d-flex align-items-center justify-content-center"
                >
                  <img
                    src={images.feedback}
                    alt="icon"
                    width={20}
                    className="me-2"
                  />
                  <span className="fw-bold">Bài viết đã thích</span>
                </Link>
              </li>
              <li className="left mb-4">
                <Link
                  to={"/likeAlbums"}
                  className="d-flex align-items-center justify-content-center"
                >
                  <img
                    src={images.music}
                    alt="icon"
                    width={20}
                    className="me-2"
                  />
                  <span className="fw-bold">Albums đã thích</span>
                </Link>
              </li>
              <li className="left mb-4">
                <Link
                  to={"/likePlaylist"}
                  className="d-flex align-items-center justify-content-center"
                >
                  <img
                    src={images.playlist}
                    alt="icon"
                    width={20}
                    className="me-2 "
                  />
                  <span className="fw-bold">Playlist đã thích</span>
                </Link>
              </li>
              <li className="left mb-4">
                <Link
                  to={"/FriendRequests"}
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="fa-solid fa-user-group me-1"></i>
                  <span className="fw-bold">Lời mời kết bạn</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Main content */}
          <div className="col-6 content-feed">
            {/* Nav tab link */}
            <div className="row nav-link-feed mt-4">
              <ul className="d-flex justify-content-center">
                <li
                  className={`col-6 text-center feed-link ${
                    activeComponent === "track" ? "active" : ""
                  }`}
                  onClick={() => setActiveComponent("track")}
                >
                  <i className="fa-solid fa-music me-1"></i>
                  <span>Track</span>
                </li>
                <li
                  className={`col-6 text-center feed-link ${
                    activeComponent === "post" ? "active" : ""
                  }`}
                  onClick={() => setActiveComponent("post")}
                >
                  <i className="fa-solid fa-newspaper me-1"></i>
                  <span>Post</span>
                </li>
              </ul>
            </div>

            {/* Nút tạo bài */}
            <div className="create-post container">
              <div className="row align-items-center">
                <div className="col-auto post-header">
                  <img
                    src={
                      userData.avatar ||
                      "/src/UserImages/Avatar/default-avt.jpg"
                    }
                    alt="User avatar"
                  />
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
                    onClick={handleCreatePostClick}
                  >
                    What are you thinking about?
                  </button>
                </div>
              </div>
            </div>

            {/* Nội dung theo lựa chọn Track hoặc Post */}
            <div className="container">
              {activeComponent === "track" ? (
                <FeedTrack />
              ) : (
                <FeedPost
                  sharedData={sharedData}
                  clearSharedData={clearSharedData}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-3 sidebar content-right bg-light">
            <ul className="list-new-follow">
              <li className=" mb-4">
                <UsersToFollow userId={currentUserId} token={tokenjwt} />
              </li>
            </ul>
            <div className="advertisement mt-5"></div>
          </div>
        </div>
      </div>

      {/* Các modal */}
      {/* Modal báo cáo */}
      {showReportModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          role="dialog"
        >
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
                {reportMessage && (
                  <div className="alert alert-danger">{reportMessage}</div>
                )}{" "}
                {/* Thông báo lỗi hoặc thành công */}
                <h6>Chọn lý do báo cáo:</h6>
                <div className="mb-3">
                  {[
                    "Nội dung phản cảm",
                    "Vi phạm bản quyền",
                    "Spam hoặc lừa đảo",
                    "Khác",
                  ].map((reason) => (
                    <label className="d-block" key={reason}>
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        onChange={(e) => setReportReason(e.target.value)}
                      />{" "}
                      {reason}
                    </label>
                  ))}
                </div>
                <textarea
                  className="form-control mt-2"
                  placeholder="Nhập lý do báo cáo"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={() =>
                    submitReport(
                      currentUserId,
                      ReportId,
                      reportType,
                      reportReason
                    )
                  }
                  className="btn btn-primary"
                >
                  Report
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason(""); // Reset lý do báo cáo
                    setReportMessage(""); // Reset thông báo
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal để tạo bài viết */}
      {showPostModal && (
        <div
          id="post-modal"
          className="modal-overlay"
          style={{ display: "block" }}
        >
          <div className="modal-content">
            <div>
              <div className="post-header">
                <img
                  src={
                    userData.avatar || "/src/UserImages/Avatar/default-avt.jpg"
                  }
                />
                <div>
                  <div className="name">{userData.name}</div>
                  <div className="time">Posting to Feed</div>
                </div>
                <button
                  id="close-modal"
                  type="button"
                  className="btn btn-close"
                  onClick={closePostModal} // Đóng modal tạo bài viết
                ></button>
              </div>
              <div className="col">
                <textarea
                  id="post-textarea"
                  className="form-control"
                  rows={3}
                  placeholder="Write your post here..."
                  value={postContent}
                  onChange={handleTextareaChange}
                />
                {/* Hiển thị modal tag user khi gõ @ */}
                {showTagModal && (
                  <div className="tag-modal">
                    <ul>
                      {userSuggestions.map((user, index) => (
                        <li
                          key={index}
                          onClick={() => handleTagUser(user.tagName)}
                        >
                          <Link to={`/profile/${user.id}`} className="tag-link">
                            {user.tagName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="row mt-3">
                  <div className="col text-start">
                    <input
                      type="file"
                      id="file-input"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setPostImages(files);
                        setPostImageUrls(
                          files.map((file) => URL.createObjectURL(file))
                        );
                      }}
                    />
                  </div>
                  <div className="col text-end">
                    <button
                      id="submit-post"
                      type="button"
                      style={{ backgroundColor: "#E94F37" }}
                      className="btn btn-secondary"
                      onClick={handleSubmitPost} // Đóng modal tạo bài viết sau khi đăng bài
                    >
                      Post
                    </button>
                  </div>
                  {/* Hiển thị ảnh đã chọn */}
                  {postImageUrls.length > 0 && (
                    <div className="selected-images mt-3">
                      {postImageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Selected ${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginRight: "5px",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeFeed;
