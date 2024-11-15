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
} from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/Alert";

const Posts = () => {
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
        fetchRePort(null, null, reportedSpecificDate);
      } else if (reportedStartDate && reportedEndDate) {
        if (!validateDateRange(reportedStartDate, reportedEndDate)) {
          throw new Error("End date must be after start date");
        }
        fetchRePort(reportedStartDate, reportedEndDate, null);
      } else if (
        !reportedSpecificDate &&
        (!reportedStartDate || !reportedEndDate)
      ) {
        // If no dates are selected, fetch all reports
        fetchRePort();
      } else {
        throw new Error(
          "Please select either a specific date or both start and end dates"
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const fetchData = async () => {
    try {
      const [
        countResponse,
        newResponse,
        // reportedResponse,
        trendingResponse,
      ] = await Promise.all([
        axios.get("http://localhost:8082/admin/posts/total"),
        axios.get("http://localhost:8082/admin/posts/new"),
        // axios.get("http://localhost:8080/api/reports/pending"),
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

  const fetchPosts = async (startDate, endDate, specificDate) => {
    try {
      let url = "http://localhost:8082/admin/posts";
      const params = new URLSearchParams();

      if (specificDate) {
        params.append("specificDate", specificDate);
      } else if (startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setAllPosts(response.data);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Error fetching filtered posts. Please try again.";
      console.error("Error fetching filtered posts:", error);
      setErrorMessage(errorMsg);
    }
  };
  const fetchRePort = async (startDate, endDate, specificDate) => {
    try {
      let url = "http://localhost:8080/api/reports/pending";
      const params = new URLSearchParams();

      if (specificDate) {
        const formattedDate = formatDateForAPI(specificDate);
        if (!formattedDate) {
          throw new Error("Invalid specific date format");
        }
        params.append("specificDate", formattedDate);
      } else if (startDate && endDate) {
        const formattedStartDate = formatDateForAPI(startDate);
        const formattedEndDate = formatDateForAPI(endDate);

        if (!formattedStartDate || !formattedEndDate) {
          throw new Error("Invalid date format");
        }

        if (!validateDateRange(startDate, endDate)) {
          throw new Error("End date must be after start date");
        }

        params.append("startDate", formattedStartDate);
        params.append("endDate", formattedEndDate);
      }

      const requestUrl = params.toString()
        ? `${url}?${params.toString()}`
        : url;
      console.log("Making request to:", requestUrl);

      const response = await axios.get(requestUrl);
      setReportedPosts(response.data);
      setErrorMessage(""); // Clear any existing error messages
    } catch (error) {
      console.error("Error fetching reported posts:", error);
      let errorMessage = "Error fetching reported posts";

      if (error.response?.status === 400) {
        errorMessage = "Invalid date range or format. Please check your dates.";
      } else if (error.response) {
        errorMessage = error.response.data?.message || "Server error occurred";
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      setErrorMessage(errorMessage);
      setReportedPosts([]);
    }
  };
  useEffect(() => {
    fetchData();
    fetchPosts();
    fetchRePort();
  }, []);

  // Search handlers
  const handleSearchNewPosts = (e) => setSearchNewPosts(e.target.value);
  const handleSearchAllPosts = (e) => setSearchAllPosts(e.target.value);
  const handleSearchReportedPosts = (e) =>
    setSearchReportedPosts(e.target.value);

  const handleSearchTrendingPosts = (e) =>
    setSearchTrendingPosts(e.target.value);

  // Report management handlers
  const handleResolve = async (reportId, hidePost) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reports/${reportId}/resolve?hidePost=${hidePost}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve report");
      }

      // Làm mới dữ liệu sau khi giải quyết báo cáo
      await fetchData();
      setSelectedReport(null);
    } catch (err) {
      setErrorMessage("Failed to resolve report. Please try again.");
      console.error(err);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      const token = localStorage.getItem("jwtToken"); // hoặc từ context của bạn

      const response = await fetch(
        `http://localhost:8080/api/reports/${reportId}/dismiss?reason=${dismissReason}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to dismiss report");
      }

      await fetchData();
      setSelectedReport(null);
      setDismissReason("");
    } catch (err) {
      setErrorMessage("Failed to dismiss report. Please try again.");
      console.error(err);
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

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      RESOLVED: "bg-green-100 text-green-800",
      DISMISSED: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${styles[status]}`}>
        {status}
      </span>
    );
  };

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
        <div className="col-lg-6">
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
                            onClick={() => handleDismiss(selectedReport.id)}
                            className="btn btn-secondary"
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
