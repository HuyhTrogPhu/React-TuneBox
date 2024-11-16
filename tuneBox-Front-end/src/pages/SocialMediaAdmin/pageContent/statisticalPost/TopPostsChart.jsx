import React from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const TopPostsChart = ({
  data,
  primaryColor,
  secondaryColor,
  CustomTooltip,
}) => {
  const transformedData =
    data?.map((post) => ({
      id: post.id,
      name: post.userName,
      likes: post.likeCount,
      comments: post.commentCount,
      content: post.content.substring(0, 20) + "...", // Rút gọn nội dung
    })) || [];

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={CustomTooltip} />
          <Legend />
          <Bar dataKey="likes" fill={primaryColor} name="Likes" />
          <Bar dataKey="comments" fill={secondaryColor} name="Comments" />
        </BarChart>
      </ResponsiveContainer>

<br />
<br />
      {/* Bảng Bootstrap dưới biểu đồ */}
    <h2>Top Posts Table</h2>
      <table className="table table-bordered table-striped mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transformedData.map((post, index) => (
            <tr key={index}>
              <td>{post.id}</td>
              <td>{post.name}</td>
              <td>{post.likes}</td>
              <td>{post.comments}</td>
              <td>{post.content}</td>
              <td>
                <Link
                  to={`/socialadmin/postdetail/${post.id}`}
                  className="btn btn-warning btn-sm"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopPostsChart;
