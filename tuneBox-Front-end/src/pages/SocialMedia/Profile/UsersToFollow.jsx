import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "../Profile/css/UsersToFollow.css";

function UsersToFollow({ userId }) {
    const [users, setUsers] = useState([]);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

    useEffect(() => {
        const fetchUsersToFollow = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/not-followed/${userId}`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users to follow:", error);
            }
        };

        fetchUsersToFollow();
    }, [userId]);

    // Toggle follow
    const toggleFollow = async (followedId) => {
        if (isUpdatingFollow) return;
        setIsUpdatingFollow(true);

        try {
            const token = localStorage.getItem('jwtToken'); // Lấy token từ local storage hoặc từ nơi bạn lưu trữ
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const isFollowing = users.some(user => user.userId === followedId && user.isFollowing);

            if (isFollowing) {
                await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
                    params: { followerId: userId, followedId: followedId },
                    headers: headers, // Thêm headers vào yêu cầu
                });
                // Cập nhật trạng thái trong state
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.userId === followedId ? { ...user, isFollowing: false } : user
                    )
                );
            } else {
                await axios.post(`http://localhost:8080/api/follow/follow`, null, {
                    params: { followerId: userId, followedId: followedId },
                    headers: headers, // Thêm headers vào yêu cầu
                });
                // Cập nhật trạng thái trong state
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.userId === followedId ? { ...user, isFollowing: true } : user
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling follow status:", error);
        } finally {
            setIsUpdatingFollow(false);
        }
    };

    // Xử lý loại bỏ người dùng khỏi danh sách
    const handleFollowUser = (userId) => {
        setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
    }

    return (
        <div className="users-to-follow-container">
            <h2>Gợi ý theo dõi</h2>
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user.userName} className="user-card d-flex align-items-center justify-content-between">
                        {/* Information user */}
                        <div className='d-flex align-items-center'>
                            <img src={user.avatar || 'default-avatar.png'} alt={user.name} className="Avatar me-3" />
                            <div className="user-info">
                                <div className="name">{user.name}</div>
                                <div className="title">@{user.userName}</div>
                            </div>
                        </div>
                        {/* Button follow */}
                        <button
                            className="btn fa-solid fa-user-plus"
                            style={{ Color: '#E94F37'}}
                            id="followButton"
                            onClick={() => {
                                toggleFollow(user.userId); // Gọi toggleFollow với id của người dùng
                                handleFollowUser(user.userId); // Loại bỏ người dùng khỏi danh sách ngay lập tức
                            }}
                        >
                        </button>
                    </div>

                ))
            ) : (
                <p>Ayyyyo ông bạn thật sự đã follow tất cả mọi người trên cái nền tảng này </p>
            )}
        </div>
    );
}

export default UsersToFollow;
