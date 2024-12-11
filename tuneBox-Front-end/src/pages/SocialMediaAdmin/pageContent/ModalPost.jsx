import React, { memo } from "react";
import { Modal, Button, Form, Badge, Spinner, Table } from "react-bootstrap";
import { getStatusBadge } from "../../../../src/pages/SocialMediaAdmin/pageContent/ultil";

const RelatedReportsTable = ({ reports }) => (
  <div className="mt-4">
    <h5>Related Reports</h5>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Reporter</th>
          <th>Reason</th>
          <th>Created Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {reports?.map((report) => (
          <tr key={report.id}>
            <td>{report.reportDetails[0]?.reporterName || 'Unknown'}</td>
            <td>{report.reason}</td>
            <td>{new Date(report.createDate).toLocaleDateString()}</td>
            <td>
              <Badge bg={report.status === 'PENDING' ? 'warning' : 'secondary'}>
                {report.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

const PostModal = memo(
  ({
    isOpen,
    onClose,
    selectedPost,
    formData,
    onInputChange,
    onDismiss,
    onResolve,
    onRestore,
    loading,
    reports,
  }) => {
    // Add debug logging to check the data
    console.log('Reports data:', reports);
    console.log('Selected post:', selectedPost);
    
    return (
      <Modal show={isOpen} onHide={onClose} size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Post Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && reports?.[0] && (
            <div>
              <div className="mb-3">
                <strong>Post ID:</strong> {reports[0].post.postId}
              </div>
              <div className="mb-3">
                <strong>Post Owner:</strong> {reports[0].post.postOwner}
              </div>
              <div className="mb-3">
                <strong>Status:</strong>{" "}
                <Badge bg={reports[0].status === 'PENDING' ? 'warning' : 'secondary'}>
                  {reports[0].status}
                </Badge>
              </div>
              <div className="mb-3">
                <strong>Report Reason:</strong> {reports[0].reason}
              </div>
              <div className="mb-3">
                <strong>Post Content:</strong>
                {reports[0].post.content ? ( 
                  <div className="border p-3 mt-2 bg-light rounded">
                    {reports[0].post.content}
                  </div>
                ) : (
                  <div className="border p-3 mt-2 bg-light rounded text-muted">
                    No content available
                  </div>
                )}
              </div>
              <div className="mb-3">
                <strong>Report Date:</strong>{" "}
                {new Date(reports[0].createDate).toLocaleString()}
              </div>
              {reports[0].description && (
                <div className="mb-3">
                  <strong>Description:</strong>
                  <div className="border p-3 mt-2 bg-light rounded">
                    {reports[0].description}
                  </div>
                </div>
              )}

              {reports[0].status === "PENDING" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Resolve Reason</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="resolveReason"
                      value={formData.resolveReason}
                      onChange={onInputChange}
                      placeholder="Enter reason for resolving..."
                      disabled={loading.resolve}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Dismiss Reason</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="dismissReason"
                      value={formData.dismissReason}
                      onChange={onInputChange}
                      placeholder="Enter reason for dismissing..."
                      disabled={loading.dismiss}
                    />
                  </Form.Group>
                </>
              )}
              <RelatedReportsTable reports={reports} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {reports?.[0]?.status === "PENDING" && (
            <>
              <Button
                variant="warning"
                onClick={() => onDismiss(reports[0].post.postId)}
                disabled={!formData.dismissReason.trim() || loading.dismiss}
              >
                {loading.dismiss ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Dismissing...
                  </>
                ) : (
                  "Dismiss Reports"
                )}
              </Button>
              <Button
                variant="danger"
                onClick={() => onResolve(reports[0].id)}
                disabled={!formData.resolveReason.trim() || loading.resolve}
              >
                {loading.resolve ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Resolving...
                  </>
                ) : (
                  "Resolve & Hide"
                )}
              </Button>
            </>
          )}
          {reports?.[0]?.adminHidden && (
            <Button
              variant="success"
              onClick={() => onRestore(reports[0].post.postId)}
              disabled={loading.restore}
            >
              {loading.restore ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Restoring...
                </>
              ) : (
                "Restore Post"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
);

export default PostModal;