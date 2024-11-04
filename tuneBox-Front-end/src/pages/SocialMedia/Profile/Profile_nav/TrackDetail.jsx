import React, { useEffect, useState } from "react";
import "./css/Trackdetail.css";
import { useParams, useLocation } from "react-router-dom";
import { getTrackById } from "../../../../service/TrackServiceCus";
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
import { images } from "../../../../assets/images/images";
import Waveform from "../Profile_nav/Waveform";
import Cookies from "js-cookie";
import { format } from "date-fns"; // Nhập format từ date-fns

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

  const [editingCommentId, setEditingCommentId] = useState(null); // ID của bình luận đang chỉnh sửa

  const [replies, setReplies] = useState({}); // State quản lý replies của các comment
  const [replyContent, setReplyContent] = useState({}); // State để lưu nội dung phản hồi
  const [editingReply, setEditingReply] = useState(null); // Trạng thái theo dõi reply đang chỉnh sửa
  const [editContentReply, setEditContentReply] = useState(""); // Nội dung đang chỉnh sửa

  const userId = Cookies.get("userId"); // Lấy userId từ cookies

  // Gọi service lấy track
  useEffect(() => {
    const fetchDetailTrack = async () => {
      try {
        const response = await getTrackById(id);
        setTrack(response.data);
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

  // Lấy danh sách comment của track
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentsByTrack(id);
        setComments(response); // Cập nhật danh sách bình luận

        // Duyệt qua từng bình luận để lấy replies
        for (const comment of response) {
          await fetchReplies(comment.id); // Gọi hàm fetchReplies cho từng comment
        }
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };

    fetchComments();
  }, [id]);

  // Thêm comment mới
  const handleAddComment = async () => {
    if (editingCommentId) {
      await handleUpdateComment(editingCommentId, newComment);
      setEditingCommentId(null);
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
      } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
      }
    }
  };

  // Xóa comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentTrack(commentId);
      const updatedComments = await getCommentsByTrack(id);
      setComments(updatedComments);
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
    } catch (error) {
      console.error(error.message); // Hiển thị thông báo lỗi nếu có
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
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error.message);
    }
  };

  // xóa replly
  const handleDeleteReply = async (replyId, commentId) => {
    try {
      await deleteReply(replyId);
      fetchReplies(commentId); // Cập nhật lại danh sách reply sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa reply:", error);
    }
  };

  // Hàm kích hoạt chỉnh sửa
  const handleEditReply = (replyId, currentContent) => {
    console.log("Editing reply:", replyId, currentContent);
    setEditContentReply(currentContent); // Đặt nội dung hiện tại vào input
    setEditingReply({ replyId }); // Đặt trạng thái chỉnh sửa với replyId
  };

  // Hiển thị thông báo đang tải hoặc lỗi
  if (loading) return <p>Đang tải track...</p>;
  if (error) return <p>{error}</p>;

  // Nếu không có track, hiển thị thông báo không tìm thấy
  if (!track) return <p>Track không tồn tại hoặc không thể tìm thấy.</p>;

  return (
    <div className="container">
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
              <img src={images.conversstion} className="btn-icon" alt="share" />
              {/* Hiển thị số lượng comments */}
            </button>
          </div>
          <div className="track-player-actions-column">
            <div className="btn-group" style={{ marginLeft: 25 }}>
              <button
                className="btn dropdown-toggle no-border"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul className="dropdown-menu dropdown-menu-lg-end">
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => handleEditClick(track)}
                  >
                    Edit
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => deleteTrack(track.id)}
                  >
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-2 mt-3">
        <div className=" col-md-7 border rounded-3 ms-4">
          <div>
            {/* form comment */}
            <div className="comment-content row m-4">
              <div className="col-11">
                <textarea
                  className="form-control"
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)} // Cập nhật nội dung bình luận
                  placeholder="Viết một bình luận..."
                />
              </div>
              <div className="col-1">
                <button
                  className="fa-regular fa-paper-plane rounded p-2"
                  onClick={handleAddComment}
                >
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
                            src={images.avt}
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
                          <div className="btn-group" style={{ marginLeft: 25 }}>
                            <button
                              className="btn dropdown-toggle no-border"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            ></button>
                            <ul className="dropdown-menu dropdown-menu-lg-end">
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={() => handleEditComment(comment)}
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
                        </div>
                        {/* Nút trả lời */}
                        <button
                          className="btn btn-link mt-2"
                          onClick={() => {
                            setReplyContent((prevState) => ({
                              ...prevState,
                              [comment.id]: prevState[comment.id] ? "" : "", // Toggle khung nhập
                            }));
                          }}
                        >
                          Reply
                        </button>
                        {/* Khung nhập trả lời */}
                        {replyContent[comment.id] !== undefined && (
                          <div className="reply-input-container d-flex align-items-start">
                            <textarea
                              className="reply-input mt-2 form-control me-2"
                              rows={1}
                              placeholder="Write a reply..."
                              value={
                                editingReply
                                  ? editContentReply
                                  : replyContent[comment.id] || "" // Hiển thị nội dung đang chỉnh sửa hoặc nội dung mới
                              }
                              onChange={(e) => {
                                if (editingReply?.replyId === comment.id) {
                                  setEditContentReply(e.target.value); // Cập nhật nội dung khi chỉnh sửa
                                } else {
                                  setReplyContent((prevState) => ({
                                    ...prevState,
                                    [comment.id]: e.target.value, // Cập nhật nội dung khi thêm mới
                                  }));
                                }
                              }}
                            />
                            <button
                              className="btn-primary rounded mt-2 p-1"
                              onClick={() => handleAddReply(comment.id)}
                            >
                              {editingReply ? "Update" : "Reply"}{" "}
                              {/* Thay đổi nút theo trạng thái */}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hiển thị reply */}
                    <div className="row justify-content-center">
                      <div className="replies-list mt-2">
                        {replies[comment.id] &&
                          replies[comment.id].map((reply) => (
                            <div
                              className="reply d-flex align-items-start"
                              key={reply.id}
                            >
                              <img
                                src="/src/UserImages/Avatar/avt.jpg"
                                className="avatar_small"
                                alt="Avatar"
                              />
                              <div className="reply-content">
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
                              <div>
                                {/* Dropdown chỉnh sửa/xóa bình luận */}
                                <div className="dropdown top-0 end-0">
                                  <div
                                    className="btn-group"
                                    style={{ marginLeft: 25 }}
                                  >
                                    <button
                                      className="btn dropdown-toggle no-border"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    ></button>
                                    <ul className="dropdown-menu dropdown-menu-lg-end">
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleEditReply(
                                              reply.id,
                                              reply.content
                                            )
                                          }
                                        >
                                          Edit
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleDeleteReply(
                                              reply.id,
                                              comment.id
                                            )
                                          }
                                        >
                                          Delete
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
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

        {/* Form thong tin */}
        <div className="track-infor col-md-4 border rounded-3 ms-5 p-3 ">
          <div className="d-flex align-items-start">
            <img
              src={images.avt}
              alt=""
              width={50}
              height={50}
              className="avatar_small"
            />
            <div className="infor ms-3">
              <div className="info-author">{track.userName}</div>
              <div className="info-genre">{track.genreName}</div>
              <p>{track.description}</p>
            </div>
          </div>
          <hr></hr>
        </div>
      </div>
    </div>
  );
}

export default Trackdetail;