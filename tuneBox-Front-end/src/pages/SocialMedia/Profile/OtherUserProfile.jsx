import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link, Routes, Route, Navigate, useParams,useNavigate } from "react-router-dom";
import Activity from "./Profile_nav/Activity";
import Track from "./Profile_nav/Track";
import Albums from "./Profile_nav/Albums";
import Playlists from "./Profile_nav/Playlists";
import axios from "axios";
import Cookies from "js-cookie";
import { FollowContext } from "./FollowContext";
import ConfirmBlockModal from "./Profile_nav/ConfirmBlockModal";
import { getFriendCount } from "../../../service/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/profile.css";

const OtherUserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Cookies.get("userId");
  const currentUserId = Cookies.get("userId");
  const { followCounts, updateFollowerCount } = useContext(FollowContext);

  // State management
  const [userData, setUserData] = useState(null);
  const [friendStatus, setFriendStatus] = useState("Add Friend");
  const [friendCount, setFriendCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [followCountsLocal, setFollowCountsLocal] = useState({
    followersCount: 0,
    followingCount: 0,
  });
  const [requestId, setRequestId] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);

  //report usestate

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [ReportId, setReportId] = useState(null);
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  // Moves block confirmation into modal
  const handleBlockConfirmation = async () => {
    setShowBlockModal(false); // Close the modal
    await toggleBlock(); // Proceed with blocking/unblocking
  };

  // Opens the modal only when trying to block, not unblock
  const handleBlockClick = () => {
    if (!isBlocked) {
      setShowBlockModal(true); // Show modal only for blocking
    } else {
      toggleBlock(); // Directly unblock if already blocked
    }
  };

  //fetch count friends
  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          // Lấy số lượng bạn bè
          const count = await getFriendCount(id);
          console.log("Fetched friend count:", count); // Log giá trị friend count
          setFriendCount(count); // Cập nhật số lượng bạn bè
          console.log("Updated friend count state:", count); // Log trạng thái bạn bè
        } catch (error) {
          console.error("Error fetching user", error);
        }
      }
    };

    fetchUser();
  }, [id]);

  // Fetch user data and check friend status
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/${id}/profile`
        );
        setUserData(response.data);

        // Check if the user is blocked
        const isBlockedResponse = await axios.get(
          `http://localhost:8080/api/blocks/is-blocked`,
          {
            params: { blockerId: userId, blockedId: id },
          }
        );
        setIsBlocked(isBlockedResponse.data);

        // Check friend status and save requestId
        const friendStatusResponse = await axios.get(
          `http://localhost:8080/api/friends/check`,
          {
            params: { userId, friendId: id },
          }
        );
        console.log("Friend Status from API:", friendStatusResponse.data); // Log trạng thái trả về từ API

        // Lưu `friendStatus` và `requestId` từ API
        setFriendStatus(friendStatusResponse.data.status);
        setRequestId(friendStatusResponse.data.requestId);
      } catch (error) {
        console.error(
          "Error fetching user data or checking friend status:",
          error
        );
      }
    };

    fetchUserData();
  }, [id, userId,friendStatus]);

  // Check friend status
  const checkFriendStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/friends/check`,
        {
          params: { userId, friendId: id },
        }
      );
      console.log("Friend Status:", response.data); // Kiểm tra trạng thái trả về từ API
      setFriendStatus(response.data);
    } catch (error) {
      console.error("Error checking friend status:", error);
    }
  };

  // Fetch follow counts
  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/follow/${id}/followCounts`
        );
        setFollowCountsLocal(response.data);
      } catch (error) {
        console.error("Error fetching follow counts:", error);
      }
    };

    if (id) {
      fetchFollowCounts();
    }
  }, [id]);


  // Check if following
  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/follow/is-following`,
          {
            params: { followerId: userId, followedId: id },
          }
        );
        setIsFollowing(response.data);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowingStatus();
  }, [id, userId]);

  // Toggle follow
  const toggleFollow = async () => {
    if (isUpdatingFollow) return;
    setIsUpdatingFollow(true);

    try {
      let newFollowerCount = followCountsLocal.followersCount;

      if (isFollowing) {
        await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
          params: { followerId: userId, followedId: id },
        });
        newFollowerCount = Math.max(newFollowerCount - 1, 0);
        setIsFollowing(false);
      } else {
        await axios.post(`http://localhost:8080/api/follow/follow`, null, {
          params: { followerId: userId, followedId: id },
        });
        newFollowerCount += 1;
        setIsFollowing(true);
      }

      updateFollowerCount(id, newFollowerCount);
      setFollowCountsLocal((prev) => ({
        ...prev,
        followersCount: newFollowerCount,
      }));
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  // Modify toggleBlock to remove window.confirm and handle blocking directly
  const toggleBlock = async () => {
    if (!isBlocked) {
      // Calls unfriend and unfollow actions before blocking
      await unfriend();
      if (isFollowing) {
        await toggleFollow(); // Unfollow if currently following
      }
    }

    try {
      const endpoint = isBlocked
        ? `http://localhost:8080/api/blocks/unblock?blockerId=${userId}&blockedId=${id}`
        : `http://localhost:8080/api/blocks/block?blockerId=${userId}&blockedId=${id}`;
      await axios({ method: isBlocked ? "delete" : "post", url: endpoint });
      setIsBlocked(!isBlocked); // Toggle the blocked state
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };
  // Toggle friend status

  const toggleFriend = async () => {
    try {
      if (friendStatus === "ACCEPTED") {
        // Optimistically update UI to "Add Friend" right away
        setFriendStatus("Add Friend");

        await axios.delete(`http://localhost:8080/api/friends/${userId}/${id}`);
      } else {
        // Optimistically update UI to "PENDING_SENT" right away
        setFriendStatus("PENDING_SENT");

        const response = await axios.post(
          `http://localhost:8080/api/friends/${userId}/${id}`
        );
        // Optional: Use response data to set requestId or other info
        setRequestId(response.data.requestId);
      }
    } catch (error) {
      console.error("Error toggling friend status:", error);
      // Revert to previous state if there's an error
      setFriendStatus(friendStatus === "ACCEPTED" ? "ACCEPTED" : "Add Friend");
    }
  };

  const cancelFriendRequest = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/friends/cancel-request/${userId}/${id}`
      );
      setFriendStatus("Add Friend");
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const unfriend = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/friends/${userId}/${id}`);
      setFriendStatus("Add Friend");
      await friendStatus();
    } catch (error) {
      console.error("Error unfriending:", error);
    }
  };
  const acceptFriendRequest = async (requestId) => {
    console.log("Accepting friend request with ID:", requestId); // Kiểm tra requestId
    try {
      await axios.post(`http://localhost:8080/api/friends/accept/${requestId}`);
      setFriendStatus("ACCEPTED");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineFriendRequest = async (requestId) => {
    console.log("Declining friend request with ID:", requestId); // Kiểm tra requestId
    try {
      await axios.post(
        `http://localhost:8080/api/friends/decline/${requestId}`
      );
      setFriendStatus("PENDING_SENT");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };


  //report

  const handleReport = (id, type) => {
    console.log("ID to report:", id); // Kiểm tra giá trị ID
    console.log("Type to report:", type); // Kiểm tra giá trị type
    setReportId(id);
    setReportType(type);
    setShowReportModal(true);
  };

  const submitReport = async (userId, reportId, reportType, reason) => {
    try {
      const token = localStorage.getItem("jwtToken"); // Hoặc từ nơi bạn lưu trữ JWT token
      console.warn();
 
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
          reportedId: reportType === "user" ? reportId : null,
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

  if (!userData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div
      className="row container p-0"
      style={{ marginTop: "100px", backgroundColor: "#fff" }}
    >
      {/* background */}
      <div
        className="background container"
        style={{
          backgroundImage: `url(${
            userData.background || "/src/UserImages/Background/default-bg.jpg"
          })`,
        }}
      ></div>
      <aside className="col-3 container">
        <div>
          <img
            src={userData.avatar || "/src/UserImages/Avatar/avt.jpg"}
            className="avatar"
            alt="avatar"
          />
          <div className="fs-4 text-small mt-3">
            <b>{userData.name}</b>
          </div>
          <div>#{userData.userName}</div>
        </div>
        <div className="row mt-4">
          <div className="col-3 text-start">
            <button
              className="btn btn-primary"
              id="followButton"
              onClick={toggleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="col-3 text-center">
            <button className="btn btn-danger" onClick={handleBlockClick}>
              {isBlocked ? "Unblock" : "Block"}
            </button>
            <ConfirmBlockModal
              show={showBlockModal}
              onConfirm={handleBlockConfirmation}
              onCancel={() => setShowBlockModal(false)}
            />
          </div>

          <div className="col-3 text-end">
            <button
              className="btn btn-danger"
              onClick={() => handleReport(id, "user")}
            >
              Report
            </button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col text-center">
            <Link to={`/Follower/${id}`}>
              <span>
                {isNaN(followCountsLocal.followersCount)
                  ? 0
                  : followCountsLocal.followersCount}
              </span>{" "}
              <br />
              <span>Follower</span>
            </Link>
          </div>
          <div className="col text-center">
            <Link to={`/Following/${id}`}>
              <span>
                {isNaN(followCountsLocal.followingCount)
                  ? 0
                  : followCountsLocal.followingCount}
              </span>{" "}
              <br />
              <span>Following</span>
            </Link>
          </div>
          <div className="col text-center">
            <Link to={`/FriendList/${id}`}>
              <span>{friendCount}</span> <br />
              <span>Friends</span>
            </Link>
          </div>
        </div>
        {/* Friend add */}
        <div className="col text-center">
          {userId === id ? null : friendStatus === "PENDING_SENT" &&
            requestId ? (
            <button
              className="btn btn-warning"
              id="cancelRequestButton"
              onClick={() => cancelFriendRequest(requestId)}
            >
              Cancel Request
            </button>
          ) : friendStatus === "PENDING_RECEIVED" && requestId ? (
            <div>
              <button
                className="btn btn-success"
                onClick={() => acceptFriendRequest(requestId)}
              >
                Accept
              </button>
              <button
                className="btn btn-danger"
                onClick={() => declineFriendRequest(requestId)}
              >
                Decline
              </button>
            </div>
          ) : friendStatus === "ACCEPTED" ? (
            <button
              className="btn btn-danger"
              onClick={() => unfriend(requestId)}
            >
              Unfriend
            </button>
          ) : (
            <button className="btn btn-success" onClick={() => toggleFriend()}>
              Add Friend
            </button>
          )}
        </div>
        <div style={{ paddingTop: 30 }}>
          <label>InspiredBy</label> <br />
          {userData.inspiredBy && userData.inspiredBy.length > 0 ? (
            userData.inspiredBy.map((name, index) => (
              <span
                key={index}
                className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
              >
                {name}
              </span>
            ))
          ) : (
            <p>No favorite artists.</p>
          )}
          <br />
          <label>Talent</label> <br />
          {userData.talent && userData.talent.length > 0 ? (
            userData.talent.map((name, index) => (
              <span
                key={index}
                className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
              >
                {name}
              </span>
            ))
          ) : (
            <p>No talents selected.</p>
          )}
          <br />
          <label>Genre</label> <br />
          {userData.genre && userData.genre.length > 0 ? (
            userData.genre.map((name, index) => (
              <span
                key={index}
                className="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill m-1"
              >
                {name}
              </span>
            ))
          ) : (
            <p>No favorite genres.</p>
          )}
        </div>
      </aside>
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
                    "Tên không phù hợp",
                    "Vi phạm quy định",
                    "Lừa đảo",
                    "Giả danh",
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
      <div className="col-sm-9 d-flex flex-column">
        <nav className="nav d-flex align-items-center justify-content-center mt-3">
          <Link to="activity" className="nav-link">
            Activity
          </Link>
          <Link to="track" className="nav-link">
            Track
          </Link>
          <Link to="albums" className="nav-link">
            Albums
          </Link>
          <Link to="playlists" className="nav-link">
            Playlists
          </Link>
          <hr style={{ width: "100%" }} />
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="activity" />} />
            <Route path="activity" element={<Activity />} />
            <Route path="track" element={<Track />} />
            <Route path="albums" element={<Albums />} />
            <Route path="playlists" element={<Playlists />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;