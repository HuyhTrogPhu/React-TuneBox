import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const userId = Cookies.get("userId");

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/friends/requests/${userId}`);
        setFriendRequests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        setError("Không thể tải lời mời kết bạn.");
        setFriendRequests([]); // Đảm bảo rằng friendRequests luôn là mảng
      }
    };
    fetchFriendRequests();
  }, [userId]);
  
  if (error) {
    return <div>{error}</div>;
  }

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/friends/accept/${requestId}`);
      setFriendRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/friends/decline/${requestId}`);
      setFriendRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  if (!friendRequests || friendRequests.length === 0) {
    return <div>Không có lời mời kết bạn nào.</div>;
  }
  

  return (
    <div className="container mt-4">
      <h2>Lời mời kết bạn</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Người gửi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
    {friendRequests.map((request) => (
        <tr key={request.id}>
            <td>
                <Link to={`/profile/${request.requesterId}`}> {/* Thay đổi đường dẫn tùy theo cách bạn định nghĩa route cho trang người dùng */}
                    <img src={request.requesterAvatar} alt="avatar" style={{ width: "50px", borderRadius: "50%" }} />
                </Link>
                {request.requesterName}
            </td>
            <td>
                <button className="btn btn-success me-2" onClick={() => acceptFriendRequest(request.id)}>
                    Chấp nhận
                </button>
                <button className="btn btn-danger" onClick={() => declineFriendRequest(request.id)}>
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
