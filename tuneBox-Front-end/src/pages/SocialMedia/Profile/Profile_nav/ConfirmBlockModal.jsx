import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmBlockModal = ({ show, onConfirm, onCancel }) => (
  <Modal show={show} onHide={onCancel}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Block</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Blocking this user will remove them as a friend and unfollow them. Do you want to proceed?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Block
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmBlockModal;
