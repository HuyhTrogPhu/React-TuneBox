import React from "react";
import { Badge, Table } from "react-bootstrap";

const RelatedReportsTable = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return <p className="text-muted">No related reports available.</p>;
  }

  return (
    <div className="mt-4">
      <h5>Related Reports</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Reporter</th>
            <th>Reason</th>
            <th>Created Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.user?.userName || 'Unknown'}</td>
              <td>{report.reason}</td>
              <td>{new Date(report.createDate).toLocaleDateString()}</td>
              <td>
                <Badge bg={
                  report.status === "PENDING" ? "warning" :
                  report.status === "RESOLVED" ? "success" :
                  report.status === "DISMISSED" ? "secondary" :
                  "primary"
                }>
                  {report.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RelatedReportsTable