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

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      // Adjust for timezone offset
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - timezoneOffset);
      return localDate.toISOString().split("T")[0];
    } catch (error) {
      console.error("Date formatting error:", error);
      return null;
    }
  };

  // Validation function for date ranges
  const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }

    return end >= start;
  };

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

  // Cập nhật hàm xử lý tìm kiếm cho Reported Posts
  const handleReportedDateFilter = () => {
    setErrorMessage(""); // Clear previous error messages

    try {
      if (reportedSpecificDate) {
        const formattedDate = formatDateForAPI(reportedSpecificDate);
        if (!formattedDate) {
          throw new Error("Please enter a valid specific date");
        }
        fetchReports(null, null, reportedSpecificDate);
      } else if (reportedStartDate && reportedEndDate) {
        if (!validateDateRange(reportedStartDate, reportedEndDate)) {
          throw new Error("End date must be after start date");
        }
        fetchReports(reportedStartDate, reportedEndDate, null);
      } else if (
        !reportedSpecificDate &&
        (!reportedStartDate || !reportedEndDate)
      ) {
        // If no dates are selected, fetch all reports
        fetchReports();
      } else {
        throw new Error(
          "Please select either a specific date or both start and end dates"
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  //fetch cac phan con lai
  const fetchData = async () => {
    try {
      const [
        countResponse,
        newResponse,
        // reportedResponse,
        trendingResponse,
      ] = await Promise.all([
        //fetch count total post
        axios.get("http://localhost:8082/admin/posts/total"),
        //fetch new post
        axios.get("http://localhost:8082/admin/posts/new"),
        // axios.get("http://localhost:8080/api/reports/pending"),

        //fetch trending post
        axios.get("http://localhost:8082/social-statistical/trending-posts"),
      ]);

      setCountPost(countResponse.data);
      setNewPosts(newResponse.data);
      // setReportedPosts(reportedResponse.data);
      setTrendingPost(trendingResponse.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error fetching posts. Please try again."
      );
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
    // fetchPosts();
    // fetchReports();
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

  // Report management handlers
  const handleResolve = async (reportId, hidePost) => {
    try {
      const response = await api.put(`/reports/${reportId}/resolve`, null, {
        params: { hidePost },
      });

      if (response.data) {
        // Cập nhật state local nếu cần
        setSelectedReport(null);

        // Hiển thị thông báo thành công
        toast.success(
          `Báo cáo đã được xử lý. Bài viết đã được ${
            hidePost ? "ẩn" : "giữ hiển thị"
          }.`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          }
        );

        // Refresh danh sách báo cáo
        await fetchReports();
      }
    } catch (error) {
      console.error("Error resolving report:", error);

      // Xử lý các loại lỗi khác nhau
      const errorMessage =
        error.response?.data?.message ||
        "Không thể xử lý báo cáo. Vui lòng thử lại.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const handleDismiss = async (report) => {
    try {
      if (!report) {
        toast.error("Không tìm thấy thông tin báo cáo");
        return;
      }

      const postId = report.post?.postId;
      if (!postId) {
        toast.error("Không tìm thấy ID bài viết trong báo cáo");
        return;
      }

      if (!dismissReason.trim()) {
        toast.error("Vui lòng nhập lý do từ chối báo cáo");
        return;
      }

      // Lấy token từ localStorage
      const token = localStorage.getItem("jwtToken");

      // Thêm token vào headers và chuyển reason thành query parameter
      const response = await api.put(
        `/reports/${postId}/dismiss?reason=${encodeURIComponent(
          dismissReason
        )}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setSelectedReport(null);
        setDismissReason("");
        toast.success("Báo cáo đã được bỏ qua thành công");
        await fetchReports();
      }
    } catch (error) {
      console.error("Lỗi khi bỏ qua báo cáo:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Không thể bỏ qua báo cáo. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const handleRestore = async (reportId) => {
    try {
      const response = await axios.put(`/api/reports/${reportId}/restore`);
      fetchData();
    } catch (err) {
      setErrorMessage("Failed to restore post. Please try again.");
    }
  };

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

  const filteredReportedPosts = reportedPosts.filter(
    (post) =>
      post.post?.postOwner
        ?.toString()
        .includes(searchReportedPosts.toLowerCase()) ||
      post.reporterId?.toString().includes(searchReportedPosts.toLowerCase())
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

      {/* New Posts Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>New Posts</h5>
            </div>
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search new posts..."
                value={searchNewPosts}
                onChange={handleSearchNewPosts}
              />
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

      {/* Reported Posts Table */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0 d-flex justify-content-between align-items-center">
                <span>Reported Posts</span>
                <span className="badge bg-light text-danger">
                  {filteredReportedPosts.length} Reports
                </span>
              </h5>
            </div>
            <div className="card-body">
              {/* Reported Posts Date Filters */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label">Specific Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={reportedSpecificDate}
                    onChange={(e) => setReportedSpecificDate(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={reportedStartDate}
                    onChange={(e) => setReportedStartDate(e.target.value)}
                    placeholder="Start Date"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={reportedEndDate}
                    onChange={(e) => setReportedEndDate(e.target.value)}
                    placeholder="End Date"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">&nbsp;</label>
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleReportedDateFilter}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Post ID</th>
                      <th>Reporter</th>
                      <th>Post Owner</th>
                      <th>Reason</th>
                      <th>Date</th>
                      <th>Report Count</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReportedPosts.map((report, index) => (
                      <tr key={report.id}>
                        <td>{index + 1}</td>
                        <td>{report.post.postId}</td>
                        <td>{report.reporterId}</td>
                        <td>{report.post.postOwner}</td>
                        <td>{report.reason || "No reason provided"}</td>
                        <td>
                          {new Date(report.createDate).toLocaleDateString()}
                        </td>

                        <td>
                          <span className="badge bg-info">
                            {report.reportDetails?.length || 0}{" "}
                            {/* Hiển thị số lượng report */}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              report.status === "PENDING"
                                ? "bg-warning"
                                : report.status === "RESOLVED"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td>
                          {report.status === "PENDING" ? (
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="btn btn-warning btn-sm"
                            >
                              Review
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(report.id)}
                              className="btn btn-success btn-sm"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                currentPage={reportedPostsPage}
                totalPages={reportedPostsTotalPages}
                onPageChange={setReportedPostsPage}
              />
            </div>
          </div>
        </div>
      </div>

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

      {/* Report Review Modal */}
      {selectedReport && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  Review Report #{selectedReport.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedReport(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  {/* Post Information */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Post Information</h6>
                      </div>
                      <div className="card-body">
                        <p>
                          <strong>Post ID:</strong> {selectedReport.post.postId}
                        </p>
                        <p>
                          <strong>Post Owner:</strong>{" "}
                          {selectedReport.post.postOwner}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            className={`badge ${
                              selectedReport.post.hidden
                                ? "bg-danger"
                                : "bg-success"
                            }`}
                          >
                            {selectedReport.post.hidden ? "Hidden" : "Visible"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Take Action</h6>
                      </div>
                      <div className="card-body">
                        <div className="d-grid gap-2 mb-3">
                          <button
                            onClick={() =>
                              handleResolve(selectedReport.id, true)
                            }
                            className="btn btn-danger"
                          >
                            Hide Post
                          </button>
                          <button
                            onClick={() =>
                              handleResolve(selectedReport.id, false)
                            }
                            className="btn btn-warning"
                          >
                            Keep Visible
                          </button>
                        </div>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={dismissReason}
                            onChange={(e) => setDismissReason(e.target.value)}
                            placeholder="Enter reason for dismissal..."
                          />
                          <button
                            onClick={() => handleDismiss(selectedReport)}
                            disabled={!dismissReason.trim()}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report History */}
                <div className="card">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">Report History</h6>
                  </div>
                  <div className="card-body">
                    <div
                      className="table-responsive"
                      style={{ maxHeight: "200px" }}
                    >
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Reporter</th>
                            <th>Reason</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedReport.reportDetails?.map((report) => (
                            <tr key={report.id}>
                              <td>{report.reporterName}</td>
                              <td>{report.reason}</td>
                              <td>
                                {new Date(
                                  report.createDate
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
