import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PostsWithImagesChart = () => {
    const [postsData, setPostsData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8082/admin/posts/with-images", { withCredentials: true })
            .then(response => {
                const data = response.data.map(post => ({
                    id: post.id,
                    content: post.content,
                    userName: post.userName,
                    likeCount: post.likeCount,
                    commentCount: post.commentCount,
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
                <XAxis dataKey="userName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likeCount" fill="#8884d8" name="Likes" />
                <Bar dataKey="commentCount" fill="#82ca9d" name="Comments" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default PostsWithImagesChart;
