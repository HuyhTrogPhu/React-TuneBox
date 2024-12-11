import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Badge, Spinner, Row, Col, Form } from "react-bootstrap";
import { Eye, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import PostModal from "./ModalPost";
import { getStatusBadge } from "../../../../src/pages/SocialMediaAdmin/pageContent/ultil";

const PostManagement = () => {
  // 1. Constants và API setup
  const api = axios.create({
    baseURL: "http://localhost:8082/admin/posts",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // 2. State declarations
  const [processedPosts, setProcessedPosts] = useState([]);
  const [pendingReports, setPendingReports] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState({
    fetch: false,
    resolve: false,
    dismiss: false,
    restore: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    dismissReason: "",
    resolveReason: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [stompClient, setStompClient] = useState(null);
  const [postReports, setPostReports] = useState([]);

  const [searchCriteria, setSearchCriteria] = useState({
    specificDate: "",
    startDate: "",
    endDate: "",
  });

  // 3. API calls và helpers

  const fetchData = async (page = currentPage) => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const params = {
        page: page,
        size: 10,
        sort: "createDate,desc",
      };

      if (searchCriteria.specificDate) {
        params.specificDate = searchCriteria.specificDate;
      }
      if (searchCriteria.startDate && searchCriteria.endDate) {
        params.startDate = searchCriteria.startDate;
        params.endDate = searchCriteria.endDate;
      }

      const pendingResponse = await api.get("/pending", { params });
      const hiddenResponse = await api.get("/admin-hidden-resolved-posts");

      if (pendingResponse.data) {
        setPendingReports(pendingResponse.data);
      }
      if (hiddenResponse.data) {
        setProcessedPosts(hiddenResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
      // Reset các trường khác khi chọn một tiêu chí
      ...(name === "specificDate" && { startDate: "", endDate: "" }),
      ...(name === "startDate" && { specificDate: "" }),
      ...(name === "endDate" && { specificDate: "" }),
    }));
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchData(0);
  };

  const resetSearch = () => {
    setSearchCriteria({
      specificDate: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(0);
    fetchData(0);
  };

  // 4. Event handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pendingReports.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewPost = useCallback(async (post) => {
    console.log("Selected Post Data:", post);

    // More robust ID extraction
    const postId = post.postId || post.id || post.post?.id;

    if (!postId) {
      toast.error("Invalid post data");
      return;
    }

    try {
      // Optional: fetch reports, don't make it blocking
      const reportsResponse = await api.get(`/${postId}/reports`);
      setPostReports(reportsResponse.data || []);
    } catch (error) {
      console.error("Error fetching post reports:", error);
      toast.error("Failed to load post reports");
      setPostReports([]);
    }

    // Always set the post and open modal, even if reports fetch fails
    setSelectedPost(post);
    setFormData({ dismissReason: "", resolveReason: "" });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleResolve = async (reportId) => {
    if (!formData.resolveReason.trim()) {
      toast.warning("Please enter a reason for resolution");
      return;
    }

    setLoading((prev) => ({ ...prev, resolve: true }));
    try {
      const response = await api.put(`/${reportId}/resolve`, null, {
        params: { reason: formData.resolveReason },
      });

      if (response.data) {
        toast.success("Report resolved successfully");
        await fetchData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error resolving report:", error);
      toast.error(error.response?.data?.message || "Error resolving report");
    } finally {
      setLoading((prev) => ({ ...prev, resolve: false }));
    }
  };

  const handleDismiss = async (postId) => {
    // Robust ID extraction
    const resolvedPostId = postId || selectedPost?.id || selectedPost?.postId;

    console.log("Resolved PostID:", resolvedPostId);
    console.log("Dismiss Reason:", formData.dismissReason);
    console.log("Selected Post:", selectedPost);

    if (!resolvedPostId || isNaN(resolvedPostId)) {
      toast.error("Invalid Post ID");
      return;
    }

    if (!formData.dismissReason.trim()) {
      toast.warning("Please enter a reason for dismissal");
      return;
    }

    setLoading((prev) => ({ ...prev, dismiss: true }));
    try {
      const response = await api.put(`/${resolvedPostId}/dismiss`, null, {
        params: { reason: formData.dismissReason },
      });

      console.log("Dismiss Response:", response);

      if (response.data) {
        toast.success("Reports dismissed successfully");
        await fetchData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Full Error Object:", error);
      console.error("Error Response:", error.response);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error dismissing reports"
      );
    } finally {
      setLoading((prev) => ({ ...prev, dismiss: false }));
    }
  };

  const handleRestore = async (postId) => {
    setLoading((prev) => ({ ...prev, restore: true }));
    try {
      await api.put(`/${postId}/restore`);
      toast.success("Post restored successfully");
      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error restoring post");
    } finally {
      setLoading((prev) => ({ ...prev, restore: false }));
    }
  };

  // 5. Effects
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = () => {
      const username = localStorage.getItem("username");
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

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    console.log("Modal Open State Changed:", isModalOpen);
  }, [isModalOpen]);

  // 6. Props preparation
  const modalProps = {
    isOpen: isModalOpen,
    onClose: handleCloseModal,
    selectedPost,
    formData,
    onInputChange: handleInputChange,
    onDismiss: handleDismiss,
    onResolve: handleResolve,
    onRestore: handleRestore,
    loading,
    reports: postReports,
  };

  // 7. Render
  return (
    <div className="container-fluid p-4">
      <h2>Post Management</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Specific Date</Form.Label>
            <Form.Control
              type="date"
              name="specificDate"
              value={searchCriteria.specificDate}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={searchCriteria.startDate}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={searchCriteria.endDate}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Button variant="primary" onClick={handleSearch} className="me-2">
            Search
          </Button>
          <Button variant="secondary" onClick={resetSearch}>
            Reset
          </Button>
        </Col>
      </Row>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button
          variant="outline-primary"
          onClick={() => fetchData(currentPage)}
          disabled={loading.fetch}
        >
          <RefreshCw
            className={loading.fetch ? "animate-spin" : ""}
            size={20}
          />
        </Button>
      </div>

      {loading.fetch ? (
        <div className="text-center p-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* Pending Reports Table */}
          <div className="card mb-4">
            <div className="card-header bg-warning text-white">
              <h3 className="mb-0">Pending Reports</h3>
            </div>
            <div className="card-body">
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Report Reason</th>
                    <th>Report Date</th>
                    <th>Report Counts</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReports.content?.map((report) => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.reason}</td>
                      <td>
                        {new Date(report.createDate).toLocaleDateString()}
                      </td>
                      <td>{report.reportCount}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            handleViewPost({
                              ...report.post,
                              reportId: report.id,
                              type: "PENDING",
                              reportReason: report.reason,
                              reportDate: report.createDate,
                            })
                          }
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="mx-2">
                  Page {currentPage + 1} of {pendingReports.totalPages}
                </span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pendingReports.totalPages - 1}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Processed Posts Table */}
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Processed Posts</h3>
            </div>
            <div className="card-body">
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Post ID</th>
                    <th>Content</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processedPosts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {post.content}
                      </td>
                      <td>{getStatusBadge(post.status || "HIDDEN")}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            handleViewPost({ ...post, type: "HIDDEN" })
                          }
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}

      <PostModal {...modalProps} />
    </div>
  );
};

export default PostManagement;