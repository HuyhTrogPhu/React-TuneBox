import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = useParams();

    useEffect(() => {
        if (!userId) {
            console.error("User ID not found");
            return;
        }
    
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/friends/list/${userId.userId}`);
                setFriends(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching friend list", error);
                setFriends([]);
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
            <div className="row d-flex justify-content-center">
                {friends.map(friend => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={friend.id}>
                        <div className="card h-100 shadow-sm border-0">
                            <img 
                                src={friend.avatar} 
                                className="card-img-top rounded-circle mx-auto mt-3" 
                                alt={`${friend.userName}'s avatar`} 
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title mb-1">{friend.name}</h5>
                                <p className="card-text text-muted">@{friend.userName}</p>
                                <button className="btn btn-primary btn-sm">View Profile</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendList;
