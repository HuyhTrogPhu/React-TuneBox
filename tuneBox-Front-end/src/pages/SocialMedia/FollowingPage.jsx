import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

const FollowingPage = () => {
    const [following, setFollowing] = useState([]);
    const userId = useParams();

    // Cấu hình interceptor cho Axios để thêm Authorization header vào mỗi yêu cầu
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            if (token) {
                config.headers['Authorization'] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );  

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/follow/${userId.userId}/following`);
                setFollowing(response.data);
            } catch (error) {
                console.error('Error fetching following:', error);
            }
        };

        fetchFollowing();
    }, [userId]);

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">Following</h3>
            <div className="row d-flex justify-content-center">
                {following.length > 0 ? (
                    following.map((followed, index) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={followed.id}>
                            <div className="card h-100 shadow-sm border-0">
                            <img 
                                src={followed.avatar} 
                                className="card-img-top rounded-circle mx-auto mt-3" 
                                alt={`${followed.userName}'s avatar`} 
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                                <div className="card-body text-center">
                                    <h5 className="card-title mb-2">{followed.userName}</h5>
                                    <p className="card-text text-muted mb-2">{followed.email}</p>
                                    <a href={`/profile/${followed.id}`} className="btn btn-primary btn-sm">View Profile</a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No following found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowingPage;
