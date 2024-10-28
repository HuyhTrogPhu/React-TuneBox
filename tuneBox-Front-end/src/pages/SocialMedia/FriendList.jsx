import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = useParams();

    useEffect(() => {
        console.log("User ID:", userId); // Kiểm tra userId
        if (!userId) {
            console.error("User ID not found in cookies");
            return;
        }
    
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/friends/list/${userId.userId}`);
                console.log(response.data); // Kiểm tra dữ liệu trả về từ API
    
                if (Array.isArray(response.data)) {
                    // console.log(response.data)
                    setFriends(response.data);
                } else {
                    console.warn("Invalid data structure, setting friends to empty array");
                    setFriends([]); // Nếu API trả về giá trị không mong đợi, thiết lập thành mảng rỗng
                }
            } catch (error) {
                console.error("Error fetching friend list", error);
                setFriends([]); // Nếu lỗi, thiết lập danh sách bạn bè là rỗng
            } finally {
                setLoading(false);
            }
        };
    
        fetchFriends();
    }, [userId]);
    
    
    if (!userId) {
        return <div className="text-center mt-5">User ID not found. Please login.</div>;
    }

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (friends.length === 0) {
        return <div className="text-center mt-5">No friends found.</div>;
    }

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">Friend List</h3>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {friends.map(friend => (
                    <div className="col" key={friend.id}>
                        <div className="card h-100 shadow-sm">
                            <img src={friend.userInformation.avatar} className="card-img-top" alt={`${friend.userName}'s avatar`} />
                            <div className="card-body text-center">
                                <h5 className="card-title">{friend.userInformation.name}</h5>
                                <p className="card-text">userName: {friend.userName}</p>
                                <button className="btn btn-outline-primary">View Profile</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendList;
