import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
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
            <h1 className="text-center mb-4">Following</h1>
            <div className="">
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
                        {following.length > 0 ? (
                            following.map((followed, index) => (
                                <tr key={followed.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{followed.userName}</td>
                                    <td>{followed.email}</td>
                                    <td>
                                        <a href={`/profile/${followed.id}`} className="btn btn-primary btn-sm">View Profile</a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No following found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FollowingPage;
