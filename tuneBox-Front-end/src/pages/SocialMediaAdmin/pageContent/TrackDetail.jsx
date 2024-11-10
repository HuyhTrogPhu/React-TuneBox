import React, { useEffect, useState } from "react";
import "../css/ManagerCustomerDetail.css";
import { useParams,useNavigate } from "react-router-dom";

import {
  LoadTrackById,
  LoadCommentByTrackID,
} from "../../../service/SocialMediaAdminService";
import Waveform from "./Waveform";
import { images } from "../../../assets/images/images";
import { format } from "date-fns";
const TrackDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trackDetails, setTrackDetails] = useState([]);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({}); 
  
  console.log(id);
  useEffect(() => {
    const fetchTrackDetails = async () => {
      //call API
      //Track by ID
      const response = await LoadTrackById(id);
      setTrackDetails(response.data);

    };

    fetchTrackDetails();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await LoadCommentByTrackID(id);
        setComments(response.data); // Cập nhật danh sách bình luận
        console.log("list bình luận:", response.data);
        // Duyệt qua từng bình luận để lấy replies
        for (const comment of response) {
          await fetchReplies(comment.id); // Gọi hàm fetchReplies cho từng comment
          console.log(`Reply cho comment ${comment.id}:`, replies);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };

    fetchComments();
  }, [id]);

  // lấy reply
  const fetchReplies = async (commentId) => {
    try {
      const replies = await getRepliesByComment(commentId);

      // In ra iduser của từng reply
      replies.forEach((reply) => {
        console.log(
          `userNickname của reply ${reply.userNickname} trong comment ${commentId}:`,
          reply.userNickname
        );
      });

      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: replies, 
      }));
    } catch (error) {
      console.error(error.message);
    }
  };


  return (
    <div className="container mt-5">
      {/* Thông tin bài hát */}
      <div className="card mb-4">
        <Waveform audioUrl={trackDetails.trackFile} track={trackDetails} />
      </div>

      {/* Nút hành động */}
      <div className="row mb-4">
        <div className="col-md-2">
          <button className="btn btn-danger w-100">Ban/UnBan</button>
        </div>
        <div className="col-md-2"></div>
      </div>

      {/* Thống kê */}
      <div className="row mb-4 text-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Total Plays</h6>
              <h4>{trackDetails.totalPlays}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Total Likes</h6>
              <h4>{trackDetails.likes}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Total Comments</h6>
              <h4>{trackDetails.comments}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Tracks và Comments */}
      <div className="row">
        {/* Phần Comments */}
        <div className="col-md-6">
          <h5>Comments</h5>
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
                            {comment.userNickname}
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
                                <p>
                                  @{comment.userNickname} {reply.content}
                                </p>
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
                                            reply.userId,
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
                                            comment.id,
                                            userId
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
          </div>
        </div>
      </div>
    
  );
};

export default TrackDetail;
