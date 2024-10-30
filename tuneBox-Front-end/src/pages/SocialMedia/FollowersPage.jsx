import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

const FollowersPage = () => {
    const [followers, setFollowers] = useState([]);
    const userId = useParams();

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/follow/${userId.userId}/followers`);
                if (!response.ok) throw new Error('Failed to fetch followers');
                const followersData = await response.json();
                setFollowers(followersData);
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        };

        if (userId) {
            fetchFollowers();
        }
    }, [userId]);

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">Followers</h3>
            <div className="row d-flex justify-content-center">
                {followers.length > 0 ? (
                    followers.map((follower, index) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={follower.id}>
                            <div className="card h-100 shadow-sm border-0">
                            <img 
                                src={follower.avatar} 
                                className="card-img-top rounded-circle mx-auto mt-3" 
                                alt={`${follower.userName}'s avatar`} 
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                                <div className="card-body text-center">
                                    <h5 className="card-title mb-2">{follower.userName}</h5>
                                    <p className="card-text text-muted mb-2">{follower.email}</p>
                                    <a href={`/profile/${follower.id}`} className="btn btn-primary btn-sm">View Profile</a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No followers found.</p>
                    </div>      
                )}
            </div>
        </div>
    );
};

export default FollowersPage;
