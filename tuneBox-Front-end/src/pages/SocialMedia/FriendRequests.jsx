import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState(null);
  const userId = Cookies.get("userId");

  useEffect(() => {
    reloadFriendRequests();
  }, [userId]);

  const reloadFriendRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/friends/requests/${userId}`);
      setFriendRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error reloading friend requests:", error);
      setError("Không thể tải lời mời kết bạn.");
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/friends/accept/${requestId}`);
      alert("Bạn đã chấp nhận lời mời kết bạn."); // Thông báo
      reloadFriendRequests(); // Cập nhật lại danh sách
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Có lỗi xảy ra khi chấp nhận lời mời kết bạn.");
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/friends/decline/${requestId}`);
      alert("Bạn đã từ chối lời mời kết bạn."); // Thông báo
      reloadFriendRequests(); // Cập nhật lại danh sách
    } catch (error) {
      console.error("Error declining friend request:", error);
      alert("Có lỗi xảy ra khi từ chối lời mời kết bạn.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!friendRequests || friendRequests.length === 0) {
    return <div>Không có lời mời kết bạn nào.</div>;
  }

  return (
    <div className="container " style={{ marginTop: "100px" }}>
      <h2>Lời mời kết bạn</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Người gửi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {friendRequests
            .filter((request) => request.status === "PENDING_SENT")
            .map((request) => (
              <tr key={request.requestId}>
                <td>
                  <Link to={`/profile/${request.senderId}`}>
                    <img
                      src={request.senderAvatar}
                      alt="avatar"
                      style={{ width: "50px", borderRadius: "50%" }}
                    />
                  </Link>
                  {request.senderName}
                </td>
                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => acceptFriendRequest(request.requestId)}
                  >
                    Chấp nhận
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => declineFriendRequest(request.requestId)}
                  >
                    Từ chối
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default FriendRequests;
