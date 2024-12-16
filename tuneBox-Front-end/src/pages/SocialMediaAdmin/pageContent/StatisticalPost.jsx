import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, Image, FileImage, Clock, BarChart2,
  Activity, ThumbsUp, MessageSquare, Share2, Users,
  Calendar, PieChart as PieChartIcon
} from 'lucide-react';
import axios from 'axios';

const StatisticalPost = () => {
  const [statistics, setStatistics] = useState(null);
  const [engagementData, setEngagementData] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [statsRes, engagementRes, dailyRes, categoryRes] = await Promise.all([
          axios.get('http://localhost:8082/admin/posts/statistics'),
          axios.get('http://localhost:8082/admin/posts/engagement'),
          axios.get('http://localhost:8082/admin/posts/daily')
        ]);
        
        setStatistics(statsRes.data);
        setEngagementData(engagementRes.data);
        setDailyStats(dailyRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchAllData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Thống Kê Bài Viết</h1>
        </div>
      </div>

      {/* Thẻ Tổng Quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: "Tổng Bài Viết", value: statistics?.totalPosts },
            { name: "Bài Viết Có Ảnh", value: statistics?.postsWithImages },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        {/* Tỷ Lệ Tương Tác */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "Lượt Thích", value: statistics?.totalLikes },
                { name: "Bình Luận", value: statistics?.totalComments },
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {[
                { name: "Lượt Thích", value: statistics?.totalLikes },
                { name: "Bình Luận", value: statistics?.totalComments },
              ].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu Đồ Chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thống Kê Theo Ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="postCount" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="likeCount" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="commentCount" stackId="3" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Xu Hướng Tương Tác</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="createdAt" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="likeCount" stroke="#8884d8" />
                <Line type="monotone" dataKey="commentCount" stroke="#82ca9d" />
                <Line type="monotone" dataKey="shareCount" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân Tích Tương Tác</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={engagementData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="userName" />
                <PolarRadiusAxis />
                <Radar name="Likes" dataKey="likeCount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Comments" dataKey="commentCount" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Radar name="Shares" dataKey="shareCount" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bảng Chi Tiết */}
      <Card>
        <CardHeader>
          <CardTitle>Chi Tiết Tương Tác Theo Người Dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Người Dùng</th>
                  <th className="text-center p-2">Bài Viết</th>
                  <th className="text-center p-2">Lượt Thích</th>
                  <th className="text-center p-2">Bình Luận</th>
                  <th className="text-center p-2">Tỷ Lệ Tương Tác</th>
                </tr>
              </thead>
              <tbody>
                {engagementData.slice(0, 5).map((item) => (
                  <tr key={item.postId} className="border-b">
                    <td className="p-2">{item.userName}</td>
                    <td className="text-center p-2">{item.postCount}</td>
                    <td className="text-center p-2">{item.likeCount}</td>
                    <td className="text-center p-2">{item.commentCount}</td>
                    <td className="text-center p-2">{item.engagementRate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Chi Tiết Tương Tác Theo Người Dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="userName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likeCount" fill="#8884d8" name="Lượt Thích" />
              <Bar dataKey="commentCount" fill="#82ca9d" name="Bình Luận" />
              <Bar dataKey="shareCount" fill="#ffc658" name="Chia Sẻ" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticalPost;