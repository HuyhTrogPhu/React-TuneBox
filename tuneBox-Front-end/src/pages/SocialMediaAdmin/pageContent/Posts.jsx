import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Check,
  X,
  RefreshCw,
  EyeOff,
  Eye,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/Alert";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { Toast, ToastContainer } from "react-bootstrap";
import AdminHiddenPosts from "./ModalPost";
import ReportPost from "./ReportPost";

const Posts = () => {
  //xu ly phan thong bao cho dissmiss va resolve
  const [stompClient, setStompClient] = useState(null);

  const [newPosts, setNewPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [countPost, setCountPost] = useState(0);
  const [trendingPosts, setTrendingPost] = useState([]);

  // Separate date states for All Posts
  const [allPostsStartDate, setAllPostsStartDate] = useState("");
  const [allPostsEndDate, setAllPostsEndDate] = useState("");

  // Separate date states for Reported Posts
  const [reportedStartDate, setReportedStartDate] = useState("");
  const [reportedEndDate, setReportedEndDate] = useState("");

  // Thêm state mới cho specific date
  const [allPostsSpecificDate, setAllPostsSpecificDate] = useState("");
  const [reportedSpecificDate, setReportedSpecificDate] = useState("");

  // Search states
  const [searchNewPosts, setSearchNewPosts] = useState("");
  const [searchAllPosts, setSearchAllPosts] = useState("");
  const [searchReportedPosts, setSearchReportedPosts] = useState("");
  const [searchTrendingPosts, setSearchTrendingPosts] = useState("");

  // Report management states
  const [selectedReport, setSelectedReport] = useState(null);
  const [dismissReason, setDismissReason] = useState("");

  // Pagination states
  const [allPostsPage, setAllPostsPage] = useState(0);
  const [reportedPostsPage, setReportedPostsPage] = useState(0);
  const [reportedPostsTotalPages, setReportedPostsTotalPages] = useState(0);
  const [allPostsTotalPages, setAllPostsTotalPages] = useState(0);

  const [notification, setNotification] = useState(null);

  const [todayPostCount, setTodayPostCount] = useState(0);

  const api = axios.create({
    baseURL: "http://localhost:8082/admin/posts",
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const handleAllPostsDateFilter = () => {
    if (allPostsSpecificDate) {
      // Nếu có specific date, sử dụng nó
      fetchPosts(null, null, allPostsSpecificDate);
    } else if (allPostsStartDate && allPostsEndDate) {
      // Nếu không có specific date nhưng có start và end date
      fetchPosts(allPostsStartDate, allPostsEndDate, null);
    } else {
      setErrorMessage(
        "Please select either a specific date or both start and end dates for All Posts."
      );
    }
  };

  //fetch cac phan con lai
  const fetchData = async () => {
    try {
      const countResponse = await axios.get("http://localhost:8082/admin/posts/total");
      setCountPost(countResponse?.data || 0);
    } catch (error) {
      console.error("Error fetching count posts:", error);
    }
  
    try {
      const newResponse = await axios.get("http://localhost:8082/admin/posts/new");
      setNewPosts(newResponse?.data?.posts || []);
      setTodayPostCount(newResponse?.data?.count || 0);
    } catch (error) {
      console.error("Error fetching new posts:", error);
    }
  
    try {
      const trendingResponse = await axios.get(
        "http://localhost:8082/social-statistical/trending-posts"
      );
      setTrendingPost(trendingResponse?.data || []);
    } catch (error) {
      console.error("Error fetching trending posts:", error);
    }
  };
  
  //fetch all post
  const fetchPosts = async (page = 0) => {
    try {
      let url = `http://localhost:8082/admin/posts?page=${page}&size=10`;
      const params = new URLSearchParams();

      if (allPostsSpecificDate) {
        params.append("specificDate", allPostsSpecificDate);
      } else if (allPostsStartDate && allPostsEndDate) {
        params.append("startDate", allPostsStartDate);
        params.append("endDate", allPostsEndDate);
      }

      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      const response = await axios.get(url);
      setAllPosts(response.data.content);
      setAllPostsTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error fetching posts. Please try again.");
    }
  };

  //fetch all reports
  const fetchReports = async (page = 0) => {
    try {
      let url = `http://localhost:8082/admin/posts/pending?page=${page}&size=10`;
      const params = new URLSearchParams();

      if (reportedSpecificDate) {
        params.append("specificDate", reportedSpecificDate);
      } else if (reportedStartDate && reportedEndDate) {
        params.append("startDate", reportedStartDate);
        params.append("endDate", reportedEndDate);
      }

      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      const response = await axios.get(url);
      setReportedPosts(response.data.content);
      setReportedPostsTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Error fetching reports. Please try again.");
    }
  };

  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="mx-2">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );

  // Xu ly thong bao
  const displayNotification = (notification) => {
    switch (notification.type) {
      case "REPORT_RESOLVED":
        toast.success(notification.message, {
          position: "top-right",
          autoClose: 5000,
        });
        break;
      case "REPORT_DISMISSED":
        toast.info(notification.message, {
          position: "top-right",
          autoClose: 5000,
        });
        break;
      default:
        toast(notification.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPosts(allPostsPage);
  }, [allPostsPage, allPostsSpecificDate, allPostsStartDate, allPostsEndDate]);

  useEffect(() => {
    fetchReports(reportedPostsPage);
  }, [
    reportedPostsPage,
    reportedSpecificDate,
    reportedStartDate,
    reportedEndDate,
  ]);

  // Search handlers
  const handleSearchNewPosts = (e) => setSearchNewPosts(e.target.value);

  const handleSearchTrendingPosts = (e) =>
    setSearchTrendingPosts(e.target.value);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = () => {
      // Subscribe to personal notifications
      const username = localStorage.getItem("username"); // Assuming username is stored in localStorage
      if (username) {
        client.subscribe(`/user/${username}/queue/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          displayNotification(notification);
        });
      }
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  // Filtered data
  const filteredNewPosts = newPosts.filter((post) =>
    post.userNickname?.toLowerCase().includes(searchNewPosts.toLowerCase())
  );

  const filteredAllPosts = allPosts.filter((post) =>
    post.userNickname?.toLowerCase().includes(searchAllPosts.toLowerCase())
  );

  const filteredTrendingPosts = trendingPosts.filter((post) =>
    post.userName?.toLowerCase().includes(searchTrendingPosts.toLowerCase())
  );

  return (
    <div className="container-fluid p-5">
      {/* Total Posts Card */}
      <div className="row mb-4">
        <div className="col-lg-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Posts</h5>
              <p className="card-text">{countPost}</p>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <Alert
          className={`mb-4 ${
            notification.type === "error" ? "bg-red-100" : "bg-green-100"
          }`}
        >
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {/* New Posts Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>New Posts</h5>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Posts Today</h5>
                  <p className="card-text">{todayPostCount}</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* <input
                type="text"
                className="form-control mb-3"
                placeholder="Search new posts..."
                value={searchNewPosts}
                onChange={handleSearchNewPosts}
              /> */}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Posted by</th>
                      <th>Type</th>
                      <th>Created at</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNewPosts.map((post, index) => (
                      <tr key={post.id}>
                        <td>{index + 1}</td>
                        <td>{post.userNickname || `User ${post.userId}`}</td>
                        <td>
                          {post.images?.length > 0
                            ? "Post with images"
                            : "Text only"}
                        </td>
                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
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
            </div>
          </div>
        </div>
      </div>

      {/* All Posts Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5>All Posts</h5>
            </div>
            <div className="card-body">
              {/* All Posts Date Filters */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label">Specific Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={allPostsSpecificDate}
                    onChange={(e) => setAllPostsSpecificDate(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={allPostsStartDate}
                    onChange={(e) => setAllPostsStartDate(e.target.value)}
                    placeholder="Start Date"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={allPostsEndDate}
                    onChange={(e) => setAllPostsEndDate(e.target.value)}
                    placeholder="End Date"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">&nbsp;</label>
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleAllPostsDateFilter}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Posted by</th>
                      <th>Type</th>
                      <th>Created at</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAllPosts.map((post, index) => (
                      <tr key={post.id}>
                        <td>{index + 1}</td>
                        <td>{post.userNickname || `User ${post.userId}`}</td>
                        <td>
                          {post.images?.length > 0
                            ? "Post with images"
                            : "Text only"}
                        </td>
                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td>{post.likeCount || 0}</td>
                        <td>{post.commentCount || 0}</td>
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
              <PaginationControls
                currentPage={allPostsPage}
                totalPages={allPostsTotalPages}
                onPageChange={setAllPostsPage}
              />
            </div>
          </div>
        </div>
      </div>
      <ReportPost />
      {/* <AdminHiddenPosts/> */}
      {/* Trending Posts Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5>Trending Posts</h5>
            </div>
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search trending posts by username..."
                value={searchTrendingPosts}
                onChange={handleSearchTrendingPosts}
              />
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Posted by</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Created at</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrendingPosts.map((post, index) => (
                      <tr key={post.id}>
                        <td>{index + 1}</td>
                        <td>{post.userName}</td>
                        <td>
                          <span className="badge bg-info">
                            {post.likeCount}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {post.commentCount}
                          </span>
                        </td>
                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
