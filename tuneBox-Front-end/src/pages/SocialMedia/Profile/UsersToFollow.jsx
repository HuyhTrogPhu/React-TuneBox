import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "../Profile/css/UsersToFollow.css";

function UsersToFollow({ userId }) {
    const [users, setUsers] = useState([]);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
    const [showAll, setShowAll] = useState(false);

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
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };
    
            const isFollowing = users.some(user => user.userId === followedId && user.isFollowing);
    
            if (isFollowing) {
                await axios.delete(`http://localhost:8080/api/follow/unfollow`, {
                    params: { followerId: userId, followedId: followedId },
                    headers: headers,
                });
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.userId === followedId ? { ...user, isFollowing: false } : user
                    )
                );
            } else {
                await axios.post(`http://localhost:8080/api/follow/follow`, null, {
                    params: { followerId: userId, followedId: followedId },
                    headers: headers,
                });
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
    
    const handleFollowUser = (userId) => {
        setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
    }

    // Hiển thị 6 người dùng đầu tiên hoặc toàn bộ danh sách nếu showAll = true
    const displayedUsers = showAll ? users : users.slice(0, 6);

    return (
        <div className="users-to-follow-container">
            <h2>Suggested follow-up</h2>
            {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                    <div key={user.userName} className="user-card">
                        <img src={user.avatar || 'default-avatar.png'} alt={user.name} className="Avatar" />
                        <div className="user-info">
                            <div className="name">{user.name}</div>
                            <div className="title">@{user.userName}</div>
                        </div>
                        <div className="col text-end">
                            <button 
                                className="btn btn-primary" 
                                id="followButton" 
                                onClick={() => {
                                    toggleFollow(user.userId);
                                    handleFollowUser(user.userId);
                                }}
                            >
                                {user.isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Ayyyyo man you really followed everyone on this platform.</p>
            )}

            {/* Nút xem thêm */}
            {users.length > 6 && !showAll && (
                <div className='d-flex align-item-center justify-content-center'>
                    <a onClick={() => setShowAll(true)} ><i class="fa-solid fa-caret-down"></i></a>
                </div>

                
            )}
        </div>
    );
}

export default UsersToFollow;
