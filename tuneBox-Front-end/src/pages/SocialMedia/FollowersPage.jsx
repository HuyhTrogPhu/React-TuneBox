import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

const FollowersPage = () => {
    const [followers, setFollowers] = useState([]);
    const userId = useParams();
    console.warn(userId)

    useEffect(() => {
        const fetchFollowers = async (userId) => {
            try {
                const response = await fetch(`http://localhost:8080/api/follow/${userId.userId}/followers`);
                if (!response.ok) {
                    throw new Error('Failed to fetch followers');
                }
                const followersData = await response.json();
                setFollowers(followersData); // Save fetched followers to state
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        };

        if (userId) {
            fetchFollowers(userId);
        }
    }, [userId]);

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">Followers</h3>
                <table className="table">
                    <thead className="">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {followers.length > 0 ? (
                            followers.map((follower, index) => (
                                <tr key={follower.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{follower.userName}</td>
                                    <td>{follower.email}</td>
                                    <td>
                                        <a href={`/profile/${follower.id}`} className="btn btn-primary btn-sm">View Profile</a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No followers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
    );
};

export default FollowersPage;
