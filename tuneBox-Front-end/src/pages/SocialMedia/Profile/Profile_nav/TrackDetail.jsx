import React, { useEffect, useState, useRef } from "react";
import "./css/Trackdetail.css";
import { useParams, useLocation } from "react-router-dom";
import { getTrackById } from "../../../../service/TrackServiceCus";
import { getAvatarUser } from "../../../../service/UserService";
import { getTrackByGenreId } from "../../../../service/TrackServiceCus";
import {
  addLike,
  removeLike,
  checkUserLikeTrack,
  getLikesByTrackId,
} from "../../../../service/likeTrackServiceCus";
import {
  getCommentsByTrack,
  addCommentTrack,
  deleteCommentTrack,
  updateCommentTrack,
  getRepliesByComment,
  addReply,
  deleteReply,
  updateReply,
} from "../../../../service/CommentTrackCus";
import { search } from "../../../../service/UserService";
import { images } from "../../../../assets/images/images";
import Waveform from "../Profile_nav/Waveform";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns"; // Nhập format từ date-fns
import ShareTrackModal from "../Profile_nav/ShareTrackModal"; // Adjust the import path as needed
import Picker from "@emoji-mart/react";

function Trackdetail() {
  const { id } = useParams();
  const location = useLocation();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const [cmtCount, setCmtCount] = useState(0);

  const [comments, setComments] = useState([]); // State lưu trữ comment
  const [newComment, setNewComment] = useState("");
  const [avataCmt, setAvataCmt] = useState("");
  const [avataTrackDetail, setAvataTrackDetail] = useState("");
  const [avatarReplies, setAvatarReplies] = useState({});

  const [editingCommentId, setEditingCommentId] = useState(null); // ID của bình luận đang chỉnh sửa

  const [replies, setReplies] = useState({}); // State quản lý replies của các comment
  const [replyContent, setReplyContent] = useState({}); // State để lưu nội dung phản hồi

  const [editingReply, setEditingReply] = useState(null); // Trạng thái theo dõi reply đang chỉnh sửa
  const [editContentReply, setEditContentReply] = useState(""); // Nội dung đang chỉnh sửa

  const [relatedTracks, setRelatedTracks] = useState([]); // State lưu danh sách các track cùng thể loại

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const userId = Cookies.get("userId"); // Lấy userId từ cookies

  const [showEmojiPicker, setShowEmojiPicker] = useState(false); //Comment
  const [showEmojiPickerReply, setShowEmojiPickerReply] = useState(false); //reply
  const emojiPickerRef = useRef(null); // Tạo ref cho bảng emoji picker

  // Đóng bảng emoji khi nhấn bên ngoài
  const handleClickOutside = (event) => {
    // Kiểm tra nếu bảng emoji đang mở và người dùng nhấn ngoài bảng emoji
    if (
      emojiPickerRef.current && // Kiểm tra nếu bảng emoji tồn tại
      !emojiPickerRef.current.contains(event.target) // Kiểm tra nếu click ngoài bảng emoji
    ) {
      setShowEmojiPickerReply(false); // Đóng bảng emoji
    }
  };

  // get track genreid
  useEffect(() => {
    const fetchRelatedTracks = async () => {
      if (track) {
        try {
          const response = await getTrackByGenreId(track.genreId);
          setRelatedTracks(response.data); // Cập nhật state với danh sách track
          console.log("danh sách track theo genre:", response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách track theo genre:", error);
        }
      }
    };
    fetchRelatedTracks();
  }, [track]);

  // Gọi service lấy track
  useEffect(() => {
    const fetchDetailTrack = async () => {
      try {
        const response = await getTrackById(id);
        setTrack(response.data);
        console.log("track detail: ", response.data);

        const avatar = await getAvatarUser(response.data.userId);
        console.log("avatar user track", avatar);
        setAvataTrackDetail(avatar);
      } catch (err) {
        setError("Không tìm thấy Track");
      } finally {
        setLoading(false);
      }
    };

    if (location.state && location.state.track) {
      setTrack(location.state.track);
      setLoading(false);
    } else {
      fetchDetailTrack(); // Gọi hàm API
    }
  }, [id, location.state]);

  // Kiểm tra số lượng likes của track
  useEffect(() => {
    const fetchLikesCount = async () => {
      if (track) {
        try {
          const response = await getLikesByTrackId(id); // Gọi API để lấy danh sách likes
          setLikeCount(response.data.length); // Cập nhật likeCount bằng chiều dài của mảng trong response.data
        } catch (error) {
          console.error("Lỗi khi lấy số lượng likes:", error);
        }
      }
    };

    fetchLikesCount();
  }, [track]);

  // Kiểm tra người dùng đã thích track chưa
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (track) {
        try {
          const response = await checkUserLikeTrack(id, userId); // Gọi API kiểm tra
          setLiked(response.data); // Thiết lập liked dựa trên response
        } catch (error) {
          console.error("Lỗi khi kiểm tra like trong track:", error);
        }
      }
    };

    checkLikeStatus();
  }, [track, userId]);

  useEffect(() => {
    fetchComments();
    fetchReplies();
    fetchTrackByUserId();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await getCommentsByTrack(id);
      console.log("bình luận:", response);

      let totalReplies = 0;

      // Lấy replies và chỉ thêm avatar cho comments chính
      const commentsWithAvatars = await Promise.all(
        response.map(async (comment) => {
          const replies = await fetchReplies(comment.id);
          const avatar = await getAvatarUser(comment.userId);

          totalReplies += replies.length;

          // Gắn replies và avatar vào comment
          return {
            ...comment,
            avatar, // Chỉ thêm avatar cho comment chính
            replies, // Thêm replies vào comment
          };
        })
      );

      // Cập nhật state với danh sách comment đầy đủ
      setComments(commentsWithAvatars);

      // total comments + total replies
      setCmtCount(response.length + totalReplies);
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    }
  };

  // Thêm comment mới
  const handleAddComment = async () => {
    // Kiểm tra dữ liệu rỗng
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận.");
      return;
    }
    if (editingCommentId) {
      await handleUpdateComment(editingCommentId, newComment);
      setEditingCommentId(null);
      setShowEmojiPicker(false);
    } else {
      // Thêm bình luận mới
      try {
        const commentDTO = {
          content: newComment,
          userId: userId,
          creationDate: new Date().toISOString(),
        };
        await addCommentTrack(id, userId, commentDTO);
        setNewComment(""); // Reset input bình luận
        const updatedComments = await getCommentsByTrack(id);
        setComments(updatedComments);
        setShowEmojiPicker(false);

        fetchComments();
        fetchReplies();
      } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
      }
    }

    fetchComments();
    fetchReplies();
  };
  const addEmoji = (emoji) => {
    setNewComment((prevComment) => prevComment + emoji.native);
    console.log("icon comment: ", emoji.native);
  };

  // Xóa comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentTrack(commentId);
      const updatedComments = await getCommentsByTrack(id);
      setComments(updatedComments);
      fetchComments();
      fetchReplies();
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  // Cập nhật comment
  const handleUpdateComment = async (commentId, updatedContent) => {
    try {
      const commentDTO = { content: updatedContent };
      await updateCommentTrack(commentId, commentDTO);
      const updatedComments = await getCommentsByTrack(id);
      setComments(updatedComments);
      setNewComment(""); // Reset input sau khi cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
    }
  };

  // Chỉnh sửa bình luận
  const handleEditComment = (comment) => {
    setNewComment(comment.content); // Đặt nội dung vào textarea
    setEditingCommentId(comment.id); // Đặt ID bình luận đang chỉnh sửa
  };

  // Like click
  const handleLikeClick = async () => {
    const newLiked = !liked;
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newLikeCount);

    try {
      if (liked) {
        await removeLike(userId, track.id); // Xóa like
        setLikeCount(likeCount - 1);
      } else {
        await addLike(userId, track.id, null); // Thêm like
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked); // Đảo trạng thái liked
    } catch (error) {
      console.error("Lỗi khi xử lý like:", error);
    }
  };

  // lấy reply
  const fetchReplies = async (commentId) => {
    try {
      const replies = await getRepliesByComment(commentId);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: replies, // Cập nhật danh sách replies cho bình luận cụ thể
      }));

      console.log("replies: ", replies);
      // Lấy avatar cho từng reply
      const avatarRepliesObj = {};
      for (const reply of replies) {
        const avatar = await getAvatarUser(reply.userId);
        avatarRepliesObj[reply.id] = avatar; // Lưu avatar cho từng reply
        console.log("avatar reply: ", avatar);
      }
      setAvatarReplies((prev) => ({ ...prev, [commentId]: avatarRepliesObj }));
      return replies || []; //Sử dụng || []toán tử để mặc định là một mảng trống nếu replieskhông xác định (để tính toán)
    } catch (error) {
      console.error(error.message);
      return []; // Luôn trả về một mảng (trống nếu không có phản hồi hoặc có lỗi)
    }
  };

  // new reply
  const handleAddReply = async (commentId) => {
    // Lấy nội dung reply từ state
    const content = replyContent[commentId];

    // Kiểm tra xem người dùng đã nhập nội dung hay chưa
    if (!content) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }

    // Tạo đối tượng replyData
    const replyData = {
      content: content,
    };

    try {
      if (editingReply) {
        // Nếu đang chỉnh sửa, gọi hàm update với đối tượng replyData
        const updatedReply = await updateReply(
          editingReply.replyId,
          userId,
          replyData
        ); // Truyền replyData

        // Cập nhật state replies sau khi cập nhật
        setReplies((prevReplies) => {
          const updatedReplies = { ...prevReplies };
          const repliesForComment = updatedReplies[commentId] || [];
          const index = repliesForComment.findIndex(
            (reply) => reply.id === editingReply.replyId
          );

          // Nếu tìm thấy phản hồi, cập nhật nó
          if (index !== -1) {
            repliesForComment[index] = updatedReply; // Cập nhật phản hồi
          }

          updatedReplies[commentId] = repliesForComment; // Cập nhật lại danh sách replies
          return updatedReplies;
        });

        setEditingReply(null); // Reset trạng thái chỉnh sửa sau khi cập nhật
        setEditContentReply(""); // Xóa nội dung chỉnh sửa
      } else {
        // Gọi API để thêm reply
        const newReply = await addReply(commentId, userId, replyData); // Gọi hàm addReply

        // Cập nhật state replies
        setReplies((prevReplies) => ({
          ...prevReplies,
          [commentId]: [...(prevReplies[commentId] || []), newReply],
        }));
      }

      // Xóa nội dung đã nhập sau khi thêm thành công
      setReplyContent((prevState) => ({
        ...prevState,
        [commentId]: "", // Xóa nội dung đã nhập
      }));
      fetchComments();
      fetchReplies();
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error.message);
    }
  };

  const addEmojiToReply = (emoji, commentId) => {
    setReplyContent((prevState) => ({
      ...prevState,
      [commentId]: (prevState[commentId] || "") + emoji.native, // Thêm emoji vào nội dung
    }));
  };

  // xóa replly
  const handleDeleteReply = async (replyId, userId) => {
    try {
      await deleteReply(replyId, userId);
      fetchReplies();
      fetchComments();
    } catch (error) {
      console.error("Lỗi khi xóa reply:", error);
    }
    fetchComments();
    fetchReplies();
  };

  const resetReplyContent = () => {
    setReplyContent({}); // Xóa toàn bộ nội dung reply
    setEditContentReply(""); // Xóa nội dung chỉnh sửa
    setEditingReply(null); // Reset trạng thái chỉnh sửa
  };

  // Hàm kích hoạt chỉnh sửa
  const handleEditReply = (replyId, currentContent) => {
    console.log("Editing reply:", replyId, currentContent);
    setEditContentReply(currentContent); // Đặt nội dung hiện tại vào input
    setEditingReply({ replyId }); // Đặt trạng thái chỉnh sửa với replyId
    console.log("setEditingReply:", editingReply);
    console.log("setEditContentReply:", editContentReply);
  };

  // Ham lay danh sach track by userid
  const [listTrackByUserId, setlistTrackByUserId] = useState([]); // State luu track
  const fetchTrackByUserId = async () => {
    try {
      if (!track.userId) throw new Error("User ID not found."); // Kiem tra userId
      const response = await axios.get(
        `http://localhost:8080/customer/tracks/user/${track.userId}`,
        {
          withCredentials: true,
        }
      );
      const sortedTrack = response.data.sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      ); // Sap xep track
      setlistTrackByUserId(sortedTrack); // Luu track vao state
      setFilteredTracks(sortedTrack); //ban đầu, filteredTracks bằng tất cả tracks
      console.log("List track", response.data);
    } catch (error) {
      console.error(
        "Error fetching Track:",
        error.response?.data || error.message
      ); // Log loi neu co
    }
  };

  // search
  const [keyword, setKeyword] = useState("");
  const [filteredTracks, setFilteredTracks] = useState([]);

  // Hàm xử lý tìm kiếm và lọc danh sách track
  const handleSearch = (e) => {
    const searchKeyword = e.target.value; //từ khóa tìm kiếm từ input
    setKeyword(searchKeyword); // update state từ khóa tìm kiếm

    // từ khóa trống, hiển thị tất cả track
    if (!searchKeyword.trim()) {
      setFilteredTracks(listTrackByUserId);
      return;
    }

    // lọc danh sách track theo từ khóa
    const filtered = listTrackByUserId.filter((track) =>
      track.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredTracks(filtered); // Cập nhật danh sách track đã lọc
  };
  // end search

  // Hiển thị thông báo đang tải hoặc lỗi
  if (loading) return <p>Đang tải track...</p>;
  if (error) return <p>{error}</p>;

  // Nếu không có track, hiển thị thông báo không tìm thấy
  if (!track) return <p>Track không tồn tại hoặc không thể tìm thấy.</p>;

  return (
    <div className="trackDetail">
      <div className="row">
        {/* tìm kiếm track của người dùng */}
        <div className="col-3 pt-5 p-5">
          <div className="orther">{track.userName}`s tracks</div>
          <div className="search-container mb-5">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={keyword}
              onChange={handleSearch} // Gọi handleSearch khi người dùng nhập
            />
            <button type="button" className="btn-search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {/* Hiển thị danh sách track đã lọc hoặc tất cả track */}
          {filteredTracks.length > 0 ? (
            filteredTracks.map(
              (track) =>
                !track.status && (
                  <div key={track.id} className="post-header-track">
                    <img
                      src={track.imageTrack || "/src/UserImages/Avatar/avt.jpg"}
                      className="avatar_small"
                      alt="Avatar"
                    />
                    <div className="info">
                      <Link
                        to={{
                          pathname: `/track/${track.id}`,
                          state: { track },
                        }}
                      >
                        <div className="name">
                          {track.name || "Unknown Track"}
                        </div>
                      </Link>
                      <div className="author">
                        {track.userName || "Unknown userName"}
                      </div>
                    </div>
                  </div>
                )
            )
          ) : (
            <div>No results</div>
          )}
        </div>

        {/* track detail */}
        <div className="col-6">
          <div className="container track-page-header p-0">
            <Waveform audioUrl={track.trackFile} track={track} />

            <div className="adaptive-content track-player-actions">
              <div className="track-player-actions-column">
                <button className="btn" onClick={handleLikeClick}>
                  <img
                    src={liked ? images.heartFilled : images.heart}
                    className="btn-icon"
                    alt="Like"
                  />
                  {likeCount} {/* Hiển thị số lượng like */}
                </button>
                <button className="btn">
                  <img
                    src={images.conversstion}
                    className="btn-icon"
                    alt="share"
                  />
                  {cmtCount}
                </button>
                <button
                  className="btn"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <img src={images.share} className="btn-icon" alt="share" />
                  Share
                </button>
                <ShareTrackModal
                  trackId={track.id}
                  isOpen={isShareModalOpen}
                  onClose={() => setIsShareModalOpen(false)}
                />
              </div>
            </div>

            {/* Form thong tin */}
            <div className="track-infor">
              <div className="d-flex align-items-start p-3">
                <img
                  src={avataTrackDetail}
                  alt=""
                  width={50}
                  height={50}
                  className="avatar_small"
                />
                <div className="infor ms-3">
                  <div className="info-author">@{track.userNickname}</div>
                  <div className="info-genre">Genre: {track.genreName}</div>
                  <p>{track.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div>
                {/* form comment */}
                <div
                  className="comment-content row"
                  style={{ position: "relative" }}
                >
                  <div className="d-flex mr-5">
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)} // Cập nhật nội dung bình luận
                      placeholder="Viết một bình luận..."
                    />
                    <button
                      onClick={() => {
                        console.log(
                          "Trạng thái trước khi click:",
                          showEmojiPicker
                        );
                        setShowEmojiPicker(!showEmojiPicker);
                      }}
                      className="btn btn-sm"
                    >
                      😀
                    </button>

                    {showEmojiPicker && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "100%",
                          right: "0",
                          zIndex: 10,
                        }}
                        // onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra ngoài
                      >
                        <Picker
                          onEmojiSelect={(emoji) => {
                            addEmoji(emoji);
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

                    <button className="btn-send " onClick={handleAddComment}>
                      Send
                    </button>
                  </div>
                </div>

                {/* list cmt */}
                <div className="comment-list mt-4">
                  {comments.map((comment) => (
                    <div className="comment mt-2" key={comment.id}>
                      <div className="container">
                        <div className="row justify-content-start">
                          {/* list comment */}

                          <div className="comment-content position-relative ">
                            <div className="d-flex align-items-start">
                              <img
                                src={comment.avatar}
                                alt=""
                                width={50}
                                height={50}
                                className="avatar-comment"
                              />
                              <div>
                                <div className="comment-author">
                                  @{comment.userNickname}
                                </div>
                                <div className="comment-time">
                                  {format(
                                    new Date(comment.creationDate),
                                    "dd/MM/yyyy"
                                  )}
                                </div>
                                <p>{comment.content}</p>
                              </div>
                            </div>
                            {/* Dropdown chỉnh sửa/xóa bình luận */}
                            <div className="dropdown position-absolute top-0 end-0">
                              <div className="dropdown position-absolute top-0 end-0">
                                {String(comment.userId) === userId && (
                                  <div
                                    className="btn-group"
                                    style={{ marginLeft: 25 }}
                                  >
                                    <button
                                      className="btn no-border"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{
                                        backgroundColor: "transparent",
                                      }}
                                    >
                                      ...
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-lg-end">
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleEditComment(comment)
                                          }
                                        >
                                          Edit
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleDeleteComment(comment.id)
                                          }
                                        >
                                          Delete
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Nút trả lời */}
                            <button
                              className="btn btn-link mt-2"
                              onClick={() => {
                                setReplyContent((prevState) => ({
                                  ...prevState,
                                  [comment.id]: prevState[comment.id]
                                    ? editContentReply
                                    : editContentReply, // Toggle khung nhập
                                }));
                              }}
                            >
                              Reply
                            </button>
                            {/* Khung nhập trả lời */}
                            {replyContent[comment.id] !== undefined && (
                              <div className="reply-input-container d-flex align-items-start">
                                <textarea
                                  className="reply-input mt-2 form-control "
                                  rows={1}
                                  placeholder="Write a reply..."
                                  value={
                                    editingReply &&
                                    editingReply.commentId === comment.id
                                      ? editContentReply // Hiển thị nội dung đang chỉnh sửa
                                      : replyContent[comment.id] // Hiển thị nội dung mới
                                  }
                                  onChange={(e) => {
                                    if (
                                      editingReply &&
                                      editingReply.commentId === comment.id
                                    ) {
                                      // Khi chỉnh sửa
                                      setEditContentReply(e.target.value);
                                    } else {
                                      setReplyContent((prevState) => ({
                                        ...prevState,
                                        [comment.id]: e.target.value, // Cập nhật nội dung mới
                                      }));
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    console.log(
                                      "Trạng thái trước khi click icon reply:",
                                      showEmojiPickerReply
                                    );
                                    setShowEmojiPickerReply(
                                      !showEmojiPickerReply
                                    );
                                  }}
                                  className="btn btn-sm d-flex align-items-center justify-content-center"
                                  style={{
                                    height: "50px",
                                  }}
                                >
                                  😀
                                </button>
                                {showEmojiPickerReply && (
                                  <div
                                    ref={emojiPickerRef}
                                    className="emoji-picker-container"
                                    style={{
                                      position: "absolute",
                                      bottom: "20%",
                                      right: "0",
                                      zIndex: 10,
                                    }}
                                  >
                                    <Picker
                                      onEmojiSelect={(emoji) => {
                                        addEmojiToReply(emoji, comment.id);
                                      }}
                                    />
                                    <button
                                      onClick={() =>
                                        setShowEmojiPickerReply(false)
                                      }
                                      className="btn btn-link"
                                    >
                                      Close
                                    </button>
                                  </div>
                                )}

                                <button
                                  className="btn-send rounded mt-2"
                                  onClick={() => {
                                    setShowEmojiPickerReply(false);
                                    handleAddReply(comment.id);
                                  }}
                                >
                                  {editingReply &&
                                  editingReply.commentId === comment.id
                                    ? "Update"
                                    : "Reply"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Hiển thị reply */}
                        <div className="row justify-content-center ">
                          <div className="replies-list mt-2">
                            {replies[comment.id] &&
                              replies[comment.id].map((reply) => (
                                <div
                                  className="reply d-flex align-items-start justify-content-between"
                                  key={reply.id}
                                >
                                  <div className="reply-content left-content d-flex align-items-start">
                                    <img
                                      src={
                                        avatarReplies[comment.id]?.[reply.id]
                                      }
                                      className="avatar_small"
                                      alt="Avatar"
                                    />
                                    <div>
                                      <div className="comment-author">
                                        @{reply.userNickname}
                                      </div>
                                      <div className="comment-time">
                                        {format(
                                          new Date(comment.creationDate),
                                          "dd/MM/yyyy"
                                        )}
                                      </div>
                                      <p>{reply.content}</p>
                                    </div>
                                  </div>

                                  {/* Dropdown chỉnh sửa/xóa bình luận */}
                                  <div className="dropdown top-0 right-actions ">
                                    {String(reply.userId) === userId && (
                                      <div
                                        className="btn-group"
                                        style={{ marginLeft: 25 }}
                                      >
                                        <button
                                          className="btn no-border"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                          style={{
                                            backgroundColor: "transparent",
                                          }}
                                        >
                                          ...
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-lg-end">
                                          <li>
                                            <a
                                              className="dropdown-item"
                                              onClick={() => {
                                                // Goi ham edit
                                                handleEditReply(
                                                  reply.id,
                                                  reply.content
                                                );

                                                // Mở khung trả lời
                                                setReplyContent(
                                                  (prevState) => ({
                                                    ...prevState,
                                                    [reply.commentId]:
                                                      reply.content, // Hiển thị nội dung hiện tại trong khung trả lời
                                                  })
                                                );

                                                setShowEmojiPickerReply(false);
                                              }}
                                            >
                                              Edit
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              className="dropdown-item"
                                              onClick={() => {
                                                setShowEmojiPickerReply(false);
                                                resetReplyContent(); // Reset khung nhập trả lời về rỗng
                                                handleDeleteReply(
                                                  reply.id,
                                                  userId
                                                );
                                              }}
                                            >
                                              Delete
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* end list cmt */}
                </div>

                {/*  */}
              </div>
            </div>
          </div>
        </div>

        {/* các track có cùng thể loại */}
        <div className="col-3 pt-5 p-2">
          <div className="orther">Tracks from the same genre</div>
          <div>
            {/* list track theo genre */}
            <div className="related-tracks">
              {relatedTracks.length === 0 ? (
                <p>No related tracks found.</p>
              ) : (
                <div className=" show-list p-3">
                  {relatedTracks.map(
                    (relatedTrack) =>
                      !relatedTrack.status && (
                        <div
                          key={relatedTrack.id}
                          className="post-header-track"
                        >
                          <img
                            src={
                              relatedTrack.imageTrack ||
                              "/src/UserImages/Avatar/avt.jpg"
                            }
                            className="avatar_small"
                            alt="Avatar"
                          />
                          <div className="info">
                            <Link
                              to={{
                                pathname: `/track/${relatedTrack.id}`,
                                state: { track: relatedTrack },
                              }}
                            >
                              <div className="name">
                                {relatedTrack.name || "Unknown Track"}
                              </div>
                            </Link>
                            <div className="author">
                              {relatedTrack.userName || "Unknown userName"}
                            </div>
                          </div>
                          <div className="btn-group" style={{ marginLeft: 25 }}>
                            <button
                              className="btn dropdown-toggle no-border"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            ></button>
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
            {/* end list track theo genre */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trackdetail;
