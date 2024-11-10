import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const TrendingPostsChart = () => {
    const [postsData, setPostsData] = useState([]);

    useEffect(() => {
        // Gọi API để lấy dữ liệu các bài đăng
        axios.get("http://localhost:8082/admin/posts/trending", { withCredentials: true })
            .then(response => {
                // Chuyển dữ liệu về định dạng phù hợp cho biểu đồ
                const data = response.data.map(post => ({
                    id: post.id,
                    content: post.content,
                    userName: post.userName,
                    likeCount: post.likeCount,
                    commentCount: post.commentCount,
                    hidden: post.hidden,
                }));
                setPostsData(data);
            })
            .catch(error => {
                console.error("Error fetching post data:", error);
            });
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={postsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="userName" />;
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likeCount" fill="#8884d8" name="Likes" />
                <Bar dataKey="commentCount" fill="#82ca9d" name="Comments" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TrendingPostsChart;