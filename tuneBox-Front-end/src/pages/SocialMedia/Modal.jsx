import React from 'react';

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn btn-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;