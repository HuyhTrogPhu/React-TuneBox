import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AlertCircle, Check, X, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/Alert";

const Posts = () => {
  const [newPosts, setNewPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [countPost, setCountPost] = useState(0);
  const [trendingPosts, setTrendingPost] = useState([]);

  // Search states
  const [searchNewPosts, setSearchNewPosts] = useState("");
  const [searchAllPosts, setSearchAllPosts] = useState("");
  const [searchReportedPosts, setSearchReportedPosts] = useState("");
  const [searchTrendingPosts, setSearchTrendingPosts] = useState("");

  // Report management states
  const [selectedReport, setSelectedReport] = useState(null);
  const [dismissReason, setDismissReason] = useState("");

  const fetchData = async () => {
    try {
      const [countResponse, newResponse, allResponse, reportedResponse,trendingResponse] =
        await Promise.all([
          axios.get("http://localhost:8082/admin/posts/total"),
          axios.get("http://localhost:8082/admin/posts/new"),
          axios.get("http://localhost:8082/admin/posts"),
          axios.get("http://localhost:8080/api/reports/pending"),
          axios.get("http://localhost:8082/admin/posts/trending"),
        ]);

      setCountPost(countResponse.data);
      setNewPosts(newResponse.data);
      setAllPosts(allResponse.data);
      setReportedPosts(reportedResponse.data);
      setTrendingPost(trendingResponse.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error fetching posts. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search handlers
  const handleSearchNewPosts = (e) => setSearchNewPosts(e.target.value);
  const handleSearchAllPosts = (e) => setSearchAllPosts(e.target.value);
  const handleSearchReportedPosts = (e) => setSearchReportedPosts(e.target.value);

  const handleSearchTrendingPosts = (e) => setSearchTrendingPosts(e.target.value);

  

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
      const response = await fetch(
        `http://localhost:8080/api/reports/${reportId}/dismiss?reason=${dismissReason}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search all posts..."
                value={searchAllPosts}
                onChange={handleSearchAllPosts}
              />
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
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h5>Reported Posts</h5>
            </div>
            <div className="card-body">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search reported posts..."
                value={searchReportedPosts}
                onChange={handleSearchReportedPosts}
              />
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Reporter ID</th>
                      <th>Post Owner</th>
                      <th>Description</th>
                      <th>Reason</th>
                      <th>Create Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReportedPosts.map((report, index) => (
                      <tr key={report.id}>
                        <td>{index + 1}</td>
                        <td>User {report.reporterId}</td>
                        <td>User {report.post.postOwner}</td>
                        <td>
                          {report.description?.length > 50
                            ? `${report.description.substring(0, 50)}...`
                            : report.description}
                        </td>
                        <td>{report.reason || "No reason provided"}</td>
                        <td>
                          {new Date(report.createDate).toLocaleDateString()}
                        </td>
                        <td>{getStatusBadge(report.status)}</td>
                        <td className="space-x-2">
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
                        <td>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
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
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
                <div className="mb-4">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">Report Details</h6>
                        </div>
                        <div className="card-body">
                          <p>
                            <strong>Reporter:</strong> User{" "}
                            {selectedReport.reporterId}
                          </p>
                          <p>
                            <strong>Post Owner:</strong> User{" "}
                            {selectedReport.post.postOwner}
                          </p>
                          <p>
                            <strong>Report Date:</strong>{" "}
                            {new Date(
                              selectedReport.createDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">Report Content</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <strong>Reason:</strong>
                            <p className="mt-1">
                              {selectedReport.reason || "No reason provided"}
                            </p>
                          </div>
                          <div>
                            <strong>Description:</strong>
                            <p className="mt-1">
                              {selectedReport.description ||
                                "No description provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Take Action</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="d-flex gap-2 mb-3">
                            <button
                              onClick={() =>
                                handleResolve(selectedReport.id, true)
                              }
                              className="btn btn-danger"
                            >
                              <i className="bi bi-eye-slash me-2"></i>
                              Hide Post
                            </button>
                            <button
                              onClick={() =>
                                handleResolve(selectedReport.id, false)
                              }
                              className="btn btn-warning"
                            >
                              <i className="bi bi-eye me-2"></i>
                              Keep Visible
                            </button>
                          </div>
                        </div>

                        <div className="col-12">
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
                              <i className="bi bi-x-circle me-2"></i>
                              Dismiss Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
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
