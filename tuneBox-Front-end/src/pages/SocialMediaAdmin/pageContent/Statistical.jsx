import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { BarChart2, Star, Search ,Calendar} from "lucide-react";
import SearchChart from "./statisticalPost/SearchChart";
import { Link } from "react-router-dom";



const COLORS = ["#FF7F50", "#FFA07A", "#FF8C00", "#FFD700"];

const PRIMARY_COLOR = "#FF7F50";
const SECONDARY_COLOR = "#FFA07A";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-orange-200">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Statistical = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [statistics, setStatistics] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [contentTypeStats, setContentTypeStats] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    try {
      const [statsResponse, topPostsResponse, contentTypeResponse] =
        await Promise.all([
          fetch("http://localhost:8082/social-statistical/current-statistics"),
          fetch("http://localhost:8082/social-statistical/trending-posts"),
          fetch("http://localhost:8082/social-statistical/content-type-stats"),
        ]);

      if (
        !statsResponse.ok ||
        !topPostsResponse.ok ||
        !contentTypeResponse.ok
      ) {
        throw new Error("Failed to fetch one or more data sets");
      }

      const [stats, posts, contentType] = await Promise.all([
        statsResponse.json(),
        topPostsResponse.json(),
        contentTypeResponse.json(),
      ]);

      setStatistics(stats);
      setTopPosts(posts);
      
      setContentTypeStats(contentType);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DateRangeSelector = () => (
    <div className="d-flex align-items-center gap-3 mb-4">
      <div className="input-group">
        <span className="input-group-text" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
          <Calendar size={18} />
        </span>
        <input
          type="date"
          className="form-control"
          value={dateRange.startDate}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />
      </div>
      <span className="text-muted">to</span>
      <div className="input-group">
        <span className="input-group-text" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
          <Calendar size={18} />
        </span>
        <input
          type="date"
          className="form-control"
          value={dateRange.endDate}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />
      </div>
    </div>
  );

 const TabButton = ({ icon: Icon, label, tabKey }) => (
    <button
      className={`btn ${
        activeTab === tabKey
          ? "btn-primary"
          : "btn-outline-primary"
      } d-flex align-items-center gap-2`}
      onClick={() => setActiveTab(tabKey)}
      style={{
        backgroundColor: activeTab === tabKey ? PRIMARY_COLOR : 'white',
        borderColor: PRIMARY_COLOR,
        color: activeTab === tabKey ? 'white' : PRIMARY_COLOR
      }}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );


  const renderContent = () => (
    <div className="container-fluid p-0">
      <div className="row g-4">
        {/* Post Distribution Card */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-white border-bottom-0">
              <h5 className="card-title mb-0" style={{ color: PRIMARY_COLOR }}>Post Distribution</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "With Images", value: statistics?.postsWithImages || 0 },
                      { name: "Without Images", value: statistics?.postsWithoutImages || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Posts Performance */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-header bg-white border-bottom-0">
              <h5 className="card-title mb-0" style={{ color: PRIMARY_COLOR }}>Top Posts Performance</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPosts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="userName" />
                  <YAxis />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey="likeCount" fill={PRIMARY_COLOR} name="Likes" />
                  <Bar dataKey="commentCount" fill={SECONDARY_COLOR} name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Posts Table */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white border-bottom-0">
              <h5 className="card-title mb-0" style={{ color: PRIMARY_COLOR }}>Top Posts</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
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
                    {topPosts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.userName}</td>
                        <td>{post.likeCount}</td>
                        <td>{post.commentCount}</td>
                        <td>{post.content}</td>
                        <td>
                          <Link
                            to={`/socialadmin/postdetail/${post.id}`}
                            className="btn btn-sm"
                            style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Card>
          <CardHeader>
            <CardTitle>Search Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchChart />
          </CardContent>
        </Card>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0" style={{ color: PRIMARY_COLOR }}>Social Media Analytics</h1>
        <DateRangeSelector />
      </div>

      <div className="d-flex gap-3 mb-4">
        <TabButton icon={BarChart2} label="Analytics Dashboard" tabKey="overview" />
      </div>

      {renderContent()}
    </div>
  );
};

export default Statistical;
