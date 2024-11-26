import React, { memo } from "react";
import { Modal, Button, Form, Badge, Spinner, Table } from "react-bootstrap";
import { getStatusBadge } from "../../../../src/pages/SocialMediaAdmin/pageContent/ultil";
import RelatedReportsTable from "./RelatedReportsTable";

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
  }) => (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>Post Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedPost && (
          <div>
            <div className="mb-3">
              <strong>Post ID:</strong> {selectedPost.id}
            </div>
            <div className="mb-3">
              <strong>Status:</strong> {getStatusBadge(selectedPost.type)}
            </div>
            {selectedPost.reportReason && (
              <div className="mb-3">
                <strong>Report Reason:</strong> {selectedPost.reportReason}
              </div>
            )}
            {selectedPost.reportDate && (
              <div className="mb-3">
                <strong>Report Date:</strong>{" "}
                {new Date(selectedPost.reportDate).toLocaleString()}
              </div>
            )}
            <div className="mb-3">
              <strong>Content:</strong>
              <div className="border p-3 mt-2 bg-light rounded">
                {selectedPost.content}
              </div>
            </div>

            {selectedPost.type === "PENDING" && (
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
        {selectedPost?.type === "PENDING" && (
          <>
            <Button
              variant="warning"
              onClick={() => onDismiss(selectedPost.id)}
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
              onClick={() => onResolve(selectedPost.reportId)}
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
        {selectedPost?.type === "HIDDEN" && (
          <Button
            variant="success"
            onClick={() => onRestore(selectedPost.id)}
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
  )
);

export default PostModal;
