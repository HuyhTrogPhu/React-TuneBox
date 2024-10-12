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

  const [comments, setComments] = useState([]); // State lưu trữ comment
  const [newComment, setNewComment] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null); // ID của bình luận đang chỉnh sửa

  const [replyContent, setReplyContent] = useState(""); // Nội dung câu trả lời
  const [replyingCommentId, setReplyingCommentId] = useState(null); // ID bình luận đang trả lời

  const userId = Cookies.get("UserID"); // Lấy userId từ cookies

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
    } else if (replyingCommentId) {
      // Thêm câu trả lời cho bình luận
      try {
        const replyDTO = {
          content: replyContent,
          userId: userId,
          creationDate: new Date().toISOString(),
          parentId: replyingCommentId, // Ghi lại ID bình luận cha
        };
        await addCommentTrack(id, userId, replyDTO); // Thêm câu trả lời
        setReplyContent(""); // Reset input câu trả lời
        setReplyingCommentId(null); // Reset ID bình luận đang trả lời
        const updatedComments = await getCommentsByTrack(id);
        setComments(updatedComments);
      } catch (error) {
        console.error("Lỗi khi thêm câu trả lời:", error);
      }
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

  // Hiển thị thông báo đang tải hoặc lỗi
  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;

  // Nếu không có track, hiển thị thông báo không tìm thấy
  if (!track) return <p>Sản phẩm không tồn tại hoặc không thể tìm thấy.</p>;

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
              Comment
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
        <div className="col-md-7 border rounded-3 ms-4">
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
                  className="btn-primary rounded mt-4 p-1"
                  onClick={handleAddComment}
                >
                  Gửi
                </button>
              </div>
            </div>

            {/* list cmt */}
            <div className="comment-list">
              {comments.map((comment) => (
                <div className="card-comment mb-2" key={comment.id}>
                  <div className="card-body rounded-4">
                    <div className="d-flex flex-start align-items-center">
                      <img
                        src="/src/UserImages/Avatar/avt.jpg"
                        width={40}
                        height={40}
                        className="rounded-circle me-2"
                      />
                      <div>
                        <h6 className="fw-bold text-primary mb-0">
                          {comment.userName} Name
                        </h6>
                        <p className="text-muted small mb-0">
                          {format(
                            new Date(comment.creationDate),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="m-2 mb-0">{comment.content}</p>

                    <div className="option-comment ms-auto">
                      <button
                        className=" option-item me-3 border-0"
                        onClick={() => handleEditComment(comment)}
                      >
                        edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className=" option-item me-3 border-0"
                      >
                        delete
                      </button>
                      <button
                        onClick={() => {
                          setReplyingCommentId(comment.id); // Lưu ID bình luận cha
                          setReplyContent(""); // Reset nội dung câu trả lời
                        }}
                        className=" option-item border-0"
                      >
                        reply
                      </button>
                    </div>

                    {/* Trường nhập liệu cho câu trả lời */}
                    {replyingCommentId === comment.id && (
                      <div className="mt-2">
                        <textarea
                          className="form-control"
                          rows="2"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Viết câu trả lời..."
                        />
                        <button
                          className="btn-primary rounded mt-1"
                          onClick={handleAddComment}
                        >
                          Gửi
                        </button>
                      </div>
                    )}
                    
                    {/* Hiển thị bình luận con */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 ms-4">
                        {comment.replies.map((reply) => (
                          <div className="card-comment mb-2" key={reply.id}>
                            <div className="card-body rounded-4">
                              <div className="d-flex flex-start align-items-center">
                                <img
                                  src="/src/UserImages/Avatar/avt.jpg"
                                  width={30}
                                  height={30}
                                  className="rounded-circle me-2"
                                />
                                <div>
                                  <h6 className="fw-bold text-primary mb-0">
                                    {reply.userName} Name
                                  </h6>
                                  <p className="text-muted small mb-0">
                                    {format(
                                      new Date(reply.creationDate),
                                      "dd/MM/yyyy HH:mm"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <p className="m-2 mb-0">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-4 border rounded-3 ms-5">
          <div className="row align-items-center">
            <div className="col-auto post-header">
              <img
                src="/src/UserImages/Avatar/avt.jpg"
                className="avatar_small"
                alt="avatar"
              />
              <span>{track.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trackdetail;
