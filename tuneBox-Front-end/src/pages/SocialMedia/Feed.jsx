import React, { useEffect, useState, useRef } from "react";
import { images } from "../../assets/images/images";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/mxh/style.css";
import "./css/mxh/post.css";
import "./css/mxh/modal-create-post.css";
import "./css/profile.css";
import "./css/mxh/comment.css";
import "./css/mxh/button.css";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Picker from "@emoji-mart/react";
import { getAllTracks, listGenre } from "../../service/TrackServiceCus";
import WaveFormFeed from "../SocialMedia/Profile/Profile_nav/WaveFormFeed";
import {
  
  addLike,
  checkUserLikeTrack,
  removeLike,
  getLikesCountByTrackId,
} from "../../service/likeTrackServiceCus";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersToFollow from './Profile/UsersToFollow';
import {
  getPlaylistByUserId,
  getPlaylistById,
  updatePlaylist,
} from "../../service/PlaylistServiceCus";
import { getUserInfo } from "../../service/UserService";



const HomeFeed = () => {
  const navigate = useNavigate();
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
  const [reportType, setReportType] = useState('');
  const [reportMessage, setReportMessage] = useState("");
  const [postHiddenStates, setPostHiddenStates] = useState({});

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const commentSectionRef = useRef(null);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts.find((post) => post.id === selectedPostId);

  const [isUploading, setIsUploading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const tokenjwt = localStorage.getItem('jwtToken');

  //get avatar
  const [userData, setUserData] = useState({});

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
          console.log(
            "userId:",
            currentUserId,
            "trackId:",
            track.id,
            "- likeStatus: ",
            liked
          );
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
      console.log("Cập nhật trạng thái likedTracks: ", updatedLikedTracks);
      console.log("Cập nhật trạng thái likedTracks: ", updatedCountTracks);
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

  const handleAvatarClick = (post) => {
    console.log("Current User ID:", currentUserId);
    console.log("Post User ID:", post.userId);

    if (String(post.userId) === String(currentUserId)) {
      console.log("Navigating to ProfileUser");
      navigate("/profileUser");
    } else {
      console.log("Navigating to OtherUserProfile");
      navigate(`/profile/${post.userId}`);
    }
  };

  // Hàm để lấy các bài viết
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/all`, {
        params: { currentUserId }, // Truyền currentUserId vào request
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

      if (likes[postId]) {
        // Nếu đã like, thực hiện unlike
        await fetch(
          `http://localhost:8080/api/likes/remove?userId=${currentUserId}&postId=${postId}`,
          {
            method: "DELETE",
          }
        );
        setLikes((prevLikes) => ({ ...prevLikes, [postId]: false })); // Cập nhật trạng thái like

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
          body: JSON.stringify(likeDto),
        });

        if (!response.ok) {
          throw new Error("Failed to like the post");
        }

        setLikes((prevLikes) => ({ ...prevLikes, [postId]: true })); // Cập nhật trạng thái like

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
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        console.error("No JWT token found");
        toast.error("You need to be logged in to toggle post visibility.");
        return; // No token, do not call API
    }

    try {
        await axios.put(`http://localhost:8080/api/posts/${postId}/toggle-visibility`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        // Update the visibility state of the post
        setPostHiddenStates(prevStates => ({
            ...prevStates,
            [postId]: !prevStates[postId] // Toggle the visibility state
        }));
        fetchPosts();
    } catch (error) {
        console.error("Error toggling post visibility:", error);
        toast.error("Failed to toggle post visibility. Please try again."); // Notify user of error
    }
};
    return (
    <div>
            <ToastContainer />
      <div className="container-fluid">
        <ToastContainer />
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-3 sidebar bg-light p-4">
            <ul className="list-unstyled">
              <li className="left mb-4">
                <a
                  href="/#"
                  className="d-flex align-items-center "
                  style={{ textAlign: "center" }}
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
                <a href="/#" className="d-flex align-items-center">
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
                <Link to={"/likepost"} className="d-flex align-items-center">
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
                <Link to={"/likeAlbums"} className="d-flex align-items-center">
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
                  className="d-flex align-items-center"
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
                  className="d-flex align-items-center"
                >
                  <span className="fw-bold">Danh sách lời mời kết bạn</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Main Content */}
          <div className="col-6 content p-4">
            {/* Nút tạo bài */}
            <div className="container mt-2 mb-5">
              <div className="row align-items-center">
                <div className="col-auto post-header">
                  <img src={userData.avatar || "/src/UserImages/Avatar/default-avt.jpg"}
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
                  >
                    What are you thinking about?
                  </button>
                </div>
              </div>
            </div>

            {/* Phần hiển thị track */}
            <div className="container mt-2 mb-5">
              {tracks.map((track) => {
                const createdAt = track.createDate ? new Date(track.createDate) : null;
                return (
                  <div className="post border" key={track.id}>
                    {/* Tiêu đề */}
                    <div className="post-header position-relative">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleAvatarClick(track)}
                        aria-label="Avatar"
                      >
                        <img
                          src={track.avatar}
                          className="avatar_small"
                          alt="Avatar"
                        />
                      </button>
                      <div>
                        <div className="name">
                          {track.userNickname || "Unknown User"}
                        </div>
                        <div className="time">
                          {createdAt && !isNaN(createdAt.getTime())
                            ? format(createdAt, "hh:mm a, dd MMM yyyy")
                            : "Invalid date"}
                        </div>
                      </div>
                      {/* Dropdown cho bài viết */}
                      {String(track.userId) === String(currentUserId) ? (
                        <div className="dropdown position-absolute top-0 end-0">
                          <button
                            className="btn btn-options dropdown-toggle"
                            type="button"
                            id={`dropdownMenuButton-${track.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            ...
                          </button>
                          <ul className="dropdown-menu"
                            aria-labelledby={`dropdownMenuButton-${track.id}`}>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => addToPlaylist(track.id)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>{" "}
                                  Add to playlist
                                </button>
                              </li>
                              <li>
                              <button className="dropdown-item" onClick={() => handleEditClick(track)}>
                                <i className='fa-solid fa-pen-to-square'></i>Edit
                              </button>
                              </li>
                              <li>
                              <button className="dropdown-item" onClick={() => deleteTrack(track.id)}>
                                <i className='fa-solid fa-trash '></i>Delete
                              </button>
                              </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="dropdown position-absolute top-0 end-0">
                          <ul>
                            <li>
                            <button className="fa-regular fa-flag btn-report border border-0" onClick={() => handleReport(track.id, 'track')}></button>
                            </li>
                            <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => addToPlaylist(track.id)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>{" "}
                                  Add to playlist
                                </button>
                              </li>
                          </ul>
                        </div>

                      )}
                    </div>

                    <div className="post-content description">
                      {track.description || "Unknown description"}
                    </div>
                    {/* Nội dung */}
                    <div className="track-content audio">
                      <WaveFormFeed
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
                          {countLikedTracks[track.id]?.data || 0} {/* Hiển thị số lượng like */}
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

                        {/* share track*/}
                        <div className="col-2 mt-2 text-center">
                          <div className="d-flex justify-content-center align-items-center">
                            <i
                              type="button"
                              style={{ fontSize: "20px", color: "black" }}
                              className="fa-solid fa-share"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
            {/* Phần hiển thị bài viết */}
            <div className="container mt-2 mb-5">
              {posts.map((post) => {
                const createdAt = post.createdAt
                  ? new Date(post.createdAt)
                  : null;
                const showAll = showAllComments[post.id];

                return (
                  <div key={post.id} className="post border">
                    {/* Modal hiển thị comment  */}
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
                                {(showAllComments[selectedPost.id]
                                  ? selectedPost.comments
                                  : selectedPost.comments.slice(0, 3)
                                ).map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="comment mt-2"
                                  >
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
                                              {format(
                                                new Date(comment.creationDate),
                                                "hh:mm a, dd MMM yyyy"
                                              )}
                                              {comment.edited && (
                                                <span className="edited-notice">
                                                  {" "}
                                                  (Edited)
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
                                                    setEditingCommentContent(
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                <button
                                                  className="btn btn-primary mt-2"
                                                  onClick={() =>
                                                    handleUpdateComment(
                                                      comment.id,
                                                      selectedPost.id
                                                    )
                                                  }
                                                >
                                                  Save
                                                </button>
                                                <button
                                                  className="btn btn-secondary mt-2 ms-2"
                                                  onClick={() => {
                                                    setEditingCommentId(null);
                                                    setEditingCommentContent(
                                                      ""
                                                    );
                                                  }}
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            ) : (
                                              <p>{comment.content}</p>
                                            )}
                                          </div>
                                          {(String(comment.userId) ===
                                            String(currentUserId) ||
                                            String(selectedPost.userId) ===
                                              String(currentUserId)) && (
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
                                                      setEditingCommentId(
                                                        comment.id
                                                      );
                                                      setEditingCommentContent(
                                                        comment.content
                                                      );
                                                    }}
                                                  >
                                                    Edit
                                                  </button>
                                                </li>
                                                {/* Chỉ cho phép xóa nếu là chủ bài viết hoặc chủ bình luận */}
                                                <li>
                                                  <button
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                      handleDeleteComment(
                                                        comment.id,
                                                        selectedPost.id
                                                      )
                                                    }
                                                  >
                                                    Delete
                                                  </button>
                                                </li>
                                              </ul>
                                            </div>
                                          )}

                                          {/* Nút trả lời cho bình luận bậc 2 */}
                                          <button
                                            className="btn btn-link mt-2"
                                            onClick={() =>
                                              handleReplyClick(comment)
                                            }
                                          >
                                            Reply
                                          </button>

                                          {/* Input trả lời cho bình luận bậc 2 */}
                                          {replyingTo[comment.id] && (
                                            <div className="d-flex reply-input-container">
                                              <textarea
                                                className="reply-input mt-2 form-control"
                                                rows={1}
                                                placeholder={`Reply to ${comment.userNickname}`}
                                                value={
                                                  replyContent[comment.id] || ""
                                                }
                                                onChange={(e) =>
                                                  handleReplyChange(
                                                    comment.id,
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              <i
                                                type="button"
                                                className="fa-regular fa-paper-plane ms-3 mt-2"
                                                style={{ fontSize: "20px" }}
                                                onClick={() =>
                                                  handleAddCommentReply(
                                                    comment.id,
                                                    selectedPost.id
                                                  )
                                                }
                                              ></i>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      {/* Hiển thị danh sách trả lời bậc 2 */}
                                      <div className="row justify-content-center">
                                        {comment.replies &&
                                          comment.replies.length > 0 && (
                                            <div className="replies-list mt-2">
                                              {showAllReplies[comment.id] ? (
                                                <>
                                                  {comment.replies.map(
                                                    (reply) => (
                                                      <div
                                                        key={`reply-${reply.id}`}
                                                        className="reply"
                                                      >
                                                        <div
                                                          className="reply-content"
                                                          style={{
                                                            marginLeft: "20px",
                                                          }}
                                                        >
                                                          <img
                                                            src="/src/UserImages/Avatar/avt.jpg"
                                                            className="avatar_small"
                                                            alt="Avatar"
                                                          />
                                                          <div>
                                                            <div className="d-flex align-items-center">
                                                              <span className="comment-author pe-3">
                                                                {
                                                                  reply.userNickname
                                                                }
                                                              </span>
                                                              <span className="reply-time">
                                                                {format(
                                                                  new Date(
                                                                    reply.creationDate
                                                                  ),
                                                                  "hh:mm a, dd MMM yyyy"
                                                                ) ||
                                                                  "Invalid date"}
                                                              </span>
                                                            </div>
                                                            {editingReplyId ===
                                                            reply.id ? (
                                                              <div>
                                                                <textarea
                                                                  className="form-control"
                                                                  rows={2}
                                                                  value={
                                                                    editingReplyContent
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    setEditingReplyContent(
                                                                      e.target
                                                                        .value
                                                                    )
                                                                  }
                                                                />
                                                                <button
                                                                  className="btn btn-primary mt-2"
                                                                  onClick={() =>
                                                                    handleUpdateReply(
                                                                      reply.id
                                                                    )
                                                                  }
                                                                >
                                                                  Save
                                                                </button>
                                                                <button
                                                                  className="btn btn-secondary mt-2 ms-2"
                                                                  onClick={() => {
                                                                    setEditingReplyId(
                                                                      null
                                                                    );
                                                                    setEditingReplyContent(
                                                                      ""
                                                                    );
                                                                  }}
                                                                >
                                                                  Cancel
                                                                </button>
                                                              </div>
                                                            ) : (
                                                              <p>
                                                                <strong>
                                                                  {
                                                                    reply.repliedToNickname
                                                                  }
                                                                  :
                                                                </strong>{" "}
                                                                {reply.content}
                                                              </p>
                                                            )}

                                                            {/* Nút trả lời cho reply bậc 2 */}
                                                            <button
                                                              className="btn btn-link"
                                                              onClick={() =>
                                                                handleReplyClick(
                                                                  reply
                                                                )
                                                              }
                                                            >
                                                              Reply
                                                            </button>
                                                            {/* Dropdown cho reply bậc 2 */}
                                                            {String(
                                                              reply.userId
                                                            ) ===
                                                              String(
                                                                currentUserId
                                                              ) && (
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
                                                                <ul
                                                                  className="dropdown-menu"
                                                                  aria-labelledby={`dropdownMenuButton-${reply.id}`}
                                                                >
                                                                  <li>
                                                                    <button
                                                                      className="dropdown-item"
                                                                      onClick={() => {
                                                                        setEditingReplyId(
                                                                          reply.id
                                                                        );
                                                                        setEditingReplyContent(
                                                                          reply.content
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
                                                                        handleDeleteReply(
                                                                          reply.id
                                                                        )
                                                                      }
                                                                    >
                                                                      Delete
                                                                    </button>
                                                                  </li>
                                                                </ul>
                                                              </div>
                                                            )}

                                                            {/* Input trả lời cho reply bậc 2 */}
                                                            {replyingTo[
                                                              reply.id
                                                            ] && (
                                                              <div className="d-flex reply-input-container">
                                                                <textarea
                                                                  className="reply-input mt-2 form-control"
                                                                  rows={1}
                                                                  placeholder="Write a reply..."
                                                                  value={
                                                                    replyContent[
                                                                      reply.id
                                                                    ] || ""
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    handleReplyChange(
                                                                      reply.id,
                                                                      e.target
                                                                        .value
                                                                    )
                                                                  }
                                                                />
                                                                <i
                                                                  type="button"
                                                                  className="fa-regular fa-paper-plane ms-3 mt-2"
                                                                  onClick={() =>
                                                                    handleAddReplyToReply(
                                                                      reply.id,
                                                                      comment.id
                                                                    )
                                                                  }
                                                                />
                                                              </div>
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                  {/* Nút để ẩn các phản hồi */}
                                                  <button
                                                    className="btn btn-link"
                                                    onClick={() =>
                                                      handleToggleReplies(
                                                        comment.id
                                                      )
                                                    }
                                                  >
                                                    Hide replies
                                                  </button>
                                                </>
                                              ) : (
                                                <button
                                                  className="btn btn-link"
                                                  onClick={() =>
                                                    handleToggleReplies(
                                                      comment.id
                                                    )
                                                  }
                                                >
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
                                  <button
                                    className="btn btn-link"
                                    onClick={() =>
                                      handleToggleComments(selectedPost.id)
                                    }
                                  >
                                    {showAllComments[selectedPost.id]
                                      ? "View less comments"
                                      : "View all comments"}
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
                                value={commentContent[selectedPostId] || ""}
                                onChange={(e) => handleCommentChange(selectedPost.id, e.target.value)}
                              />
                              <button
                                onClick={() =>
                                  setShowEmojiPicker(!showEmojiPicker)
                                }
                                className="btn btn-sm"
                              >
                                😀
                              </button>

                              {showEmojiPicker && (
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "100%",
                                    left: "0",
                                    zIndex: 10,
                                  }}
                                >
                                  <Picker
                                    onEmojiSelect={(emoji) => {
                                      addEmoji(selectedPost.id, emoji);
                                      // Không đóng bảng emoji ở đây
                                    }}
                                  />
                                  {/* Nút để đóng bảng emoji */}
                                  <button
                                    onClick={() => setShowEmojiPicker(false)}
                                    className="btn btn-link"
                                  >
                                    Close
                                  </button>
                                </div>
                              )}
                              <div className="button-comment">
                                <i
                                  type="button"
                                  className="fa-regular fa-paper-plane mt-2"
                                  style={{ fontSize: "20px" }}
                                  onClick={() => {
                                    handleAddComment(selectedPost.id);
                                    setShowEmojiPicker(false);
                                  }}
                                ></i>
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
                        <button
                          className="fa-regular fa-flag btn-report position-absolute top-0 end-0 border border-0"
                          onClick={() => handleReport(post.id, 'post')}
                          ></button>
                      )}
                    </div>
                    {/* Nội dung bài viết */}
                    <div className="post-content">{post.content}</div>
                    {/* Hiển thị hình ảnh dưới dạng carousel */}
                    {post.images && post.images.length > 0 && (
                      <div
                        id={`carousel-${post.id}`}
                        className="carousel slide post-images"
                        data-bs-ride="carousel"
                      >
                        <div className="carousel-inner">
                          {post.images.map((image, index) => (
                            <div
                              className={`carousel-item ${
                                index === 0 ? "active" : ""
                              }`}
                              key={index}
                            >
                              <img
                                src={image.postImage}
                                className="d-block w-100"
                                alt={`Post image ${index + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target={`#carousel-${post.id}`}
                          data-bs-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target={`#carousel-${post.id}`}
                          data-bs-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </div>
                    )}
                    {/* Interact post */}
                    <div className="row d-flex justify-content-start align-items-center">
                      {/* like post */}
                      <div className="col-2 mt-2 text-center">
                        <div className="like-count">
                          {post.likeCount || 0}
                          <i
                            className={`fa-solid fa-heart text-danger ${
                              likes[post.id] ? "like" : "noLike"
                            }`}
                            onClick={() => handleLike(post.id)}
                          >
                            {likes[post.id]}
                          </i>
                        </div>
                      </div>
                      {/* comment post */}
                      <div className="col-2 mt-2 text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          {post.comments.length}
                          <i
                            type="button"
                            style={{ fontSize: "25px" }}
                            className="fa-regular fa-comment"
                            onClick={() => handleOpenModal(post.id)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="col-3 sidebar bg-light p-4">
            <ul className="list-unstyled">
              <li className=" mb-4">
                <UsersToFollow userId={currentUserId} token={tokenjwt} />
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
      {/* Modal để tạo bài viết */}
      <div
        id="post-modal"
        className="modal-overlay"
        style={{ display: "none" }}
      >
        <div className="modal-content">
          <div>
            <div className="post-header">
            <img src={userData.avatar || "/src/UserImages/Avatar/default-avt.jpg"}/>
              <div>
                <div className="name">{userData.name}</div>
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
                    onClick={handleSubmitPost}
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

      {/* Modal for editing track */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editTrackModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editTrackModalLabel">
                Edit Track
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={() => handleSave()}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row">
                {/* Track Name */}
                <div className="mb-3">
                  <label className="form-label">Track Name: </label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedTrack ? selectedTrack.name : ""}
                    onChange={(e) =>
                      setSelectedTrack({
                        ...selectedTrack,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Image Track */}
                <div className="mt-3">
                  <label className="form-label">Image Track: </label>
                  {selectedTrack && (
                    <div>
                      <img
                        src={selectedTrack.imageTrack}
                        alt="Current Track"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                      <div className="custom-file mt-2">
                        <input
                          type="file"
                          id="fileInput"
                          className="custom-file-input"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSelectedTrack({
                                ...selectedTrack,
                                trackImage: e.target.files[0],
                              });
                            }
                          }}
                          style={{ display: "none" }}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="fileInput"
                        >
                          Choose new file
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* File Track */}
                <div className="mt-3">
                  <label className="form-label">Current File Track: </label>
                  <label className="custom-file-label" htmlFor="fileInput">
                    Choose file
                  </label>
                  {selectedTrack && (
                    <div>
                      <p>
                        Current file:{" "}
                        {selectedTrack.trackFileName || selectedTrack.name}
                      </p>
                      <div className="custom-file mt-2">
                        <input
                          type="file"
                          id="fileInput"
                          className="custom-file-input"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSelectedTrack({
                                ...selectedTrack,
                                trackFile: e.target.files[0],
                              });
                            }
                          }}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Select Genre */}
                <div className="mt-3">
                  <label className="form-label">Genre</label>
                  <select
                    className="form-select"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    {genres.map((genre) => (
                      <option
                        key={genre.id}
                        value={genre.id}
                        // Set selected cho genre hiện tại
                        selected={selectedTrack?.genre?.id === genre.id}
                      >
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="mt-3">
                  <label className="form-label">Description</label>
                  <textarea
                    cols="50"
                    rows="5"
                    className="form-control"
                    value={selectedTrack ? selectedTrack.description : ""}
                    onChange={(e) =>
                      setSelectedTrack({
                        ...selectedTrack,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const editModal = document.getElementById("editModal");
                  editModal.classList.remove("show");
                  editModal.style.display = "none";
                  document.body.classList.remove("modal-open");
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Track
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end modal edit */}

      {/* Modal để chọn playlist */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chọn Playlist</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <ul className="list-group">
                {playlists.map(
                  (playlist) =>
                    !playlist.status && (
                      <div key={playlist.id} className="post-header-track m-5">
                        <img
                          src={playlist.imagePlaylist}
                          className="avatar_small"
                          alt="playlist"
                        />
                        <div className="info">
                          <div className="name">{playlist.title}</div>
                        </div>
                        <div className="btn-group" style={{ marginLeft: 25 }}>
                          <button
                            type="button"
                            className="btn-new rounded-5"
                            onClick={() =>
                              handleAddTrackToPlaylist(playlist.id)
                            }
                          >
                            add
                          </button>
                        </div>
                      </div>
                    )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Modal để chọn playlist */}
    </div>
  );
};

export default HomeFeed;
