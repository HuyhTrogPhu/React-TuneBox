import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '../../../components/ui/Alert';

const Posts = () => {
  const [newPosts, setNewPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [countPost, setCountPost] = useState(0);
  
  // Search states
  const [searchNewPosts, setSearchNewPosts] = useState("");
  const [searchAllPosts, setSearchAllPosts] = useState("");
  const [searchReportedPosts, setSearchReportedPosts] = useState("");

  // Report management states
  const [selectedReport, setSelectedReport] = useState(null);
  const [dismissReason, setDismissReason] = useState('');

  const fetchData = async () => {
    try {
      const [countResponse, newResponse, allResponse, reportedResponse] =
        await Promise.all([
          axios.get("http://localhost:8082/admin/posts/total"),
          axios.get("http://localhost:8082/admin/posts/new"),
          axios.get("http://localhost:8082/admin/posts"),
          axios.get("http://localhost:8080/api/reports/pending"),
        ]);

      setCountPost(countResponse.data);
      setNewPosts(newResponse.data);
      setAllPosts(allResponse.data);
      setReportedPosts(reportedResponse.data);
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

  // Report management handlers
  const handleResolve = async (reportId, hidePost) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reports/${reportId}/resolve?hidePost=${hidePost}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to resolve report');
      }
  
      // Làm mới dữ liệu sau khi giải quyết báo cáo
      await fetchData();
      setSelectedReport(null);
    } catch (err) {
      setErrorMessage('Failed to resolve report. Please try again.');
      console.error(err);
    }
  };
  
  
  
  const handleDismiss = async (reportId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/reports/${reportId}/dismiss?reason=${dismissReason}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to dismiss report');
        }

        await fetchData();
        setSelectedReport(null);
        setDismissReason('');
    } catch (err) {
        setErrorMessage('Failed to dismiss report. Please try again.');
        console.error(err);
    }
};

  
  const handleRestore = async (reportId) => {
    try {
      const response = await axios.put(`/api/reports/${reportId}/restore`);
      fetchData();
    } catch (err) {
      setErrorMessage('Failed to restore post. Please try again.');
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
      post.post?.postOwner?.toString().includes(searchReportedPosts.toLowerCase()) ||
      post.reporterId?.toString().includes(searchReportedPosts.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      DISMISSED: 'bg-red-100 text-red-800'
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
                        <td>{post.totalLikes || 0}</td>
                        <td>{post.totalComments || 0}</td>
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
                          {report.status === 'PENDING' ? (
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

      {/* Report Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Review Report</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold">Description:</h4>
              <p className="mt-2">{selectedReport.description}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Report Reason:</h4>
              <p className="mt-2">{selectedReport.reason}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Actions:</h4>
              <div className="mt-2 space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleResolve(selectedReport.id, true)}
                    className="btn btn-danger"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Hide Post
                  </button>
                  <button
                    onClick={() => handleResolve(selectedReport.id, false)}
                    className="btn btn-warning"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Keep Visible
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={dismissReason}
                    onChange={(e) => setDismissReason(e.target.value)}
                    placeholder="Enter reason for dismissal..."
                    className="form-control"
                  />
                  <button
                    onClick={() => handleDismiss(selectedReport.id)}
                    className="btn btn-secondary"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Dismiss Report
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedReport(null)}
                className="btn btn-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;