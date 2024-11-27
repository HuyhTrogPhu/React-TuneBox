import React from "react";
import { Badge } from "react-bootstrap";

export const getStatusBadge = (status) => {
  switch (status) {
    case "PENDING":
      return <Badge bg="warning">Pending</Badge>;
    case "HIDDEN":
      return <Badge bg="danger">Hidden</Badge>;
    case "RESOLVED":
      return <Badge bg="success">Resolved</Badge>;
    default:
      return <Badge bg="secondary">{status}</Badge>;
  }
};
