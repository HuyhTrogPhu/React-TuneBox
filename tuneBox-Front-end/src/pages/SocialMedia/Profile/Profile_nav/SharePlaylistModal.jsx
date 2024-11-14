import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap'; // Import Toast để hiển thị thông báo
import Cookies from "js-cookie";
import axios from 'axios';

const SharePlaylistModal = ({ playlistId, isOpen, onClose }) => {
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); // Quản lý thông báo toast
  const [showToast, setShowToast] = useState(false); // Quản lý trạng thái hiển thị toast
  const userId = Cookies.get("userId");

  const token = localStorage.getItem('jwtToken');
  

  useEffect(() => {
    if (isOpen && userId) {
      fetchReceivers();
    }
  }, [isOpen, userId]);

  const fetchReceivers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/share/users/receivers`, {
        params: { userId: userId },
      });
      setReceivers(response.data);
    } catch (error) {
      console.error('Error fetching receivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedReceiver) {
      setToastMessage('Please select a user to share with');
      setShowToast(true);
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/share/playlist',
        null,
        {
          params: { senderId: userId, receiverId: selectedReceiver, playlistId },
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token xác thực vào header
          },
        }
      );
  
      if (response.status === 200) {
        setToastMessage('Playlist shared successfully!');
        setShowToast(true); // Hiển thị toast
        setTimeout(() => onClose(), 1000); // Đóng modal sau khi toast hiển thị
      } else {
        setToastMessage('Failed to share playlist');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error sharing playlist:', error);
      setToastMessage('Error sharing playlist');
      setShowToast(true);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Share Playlist</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center">Loading users...</div>
            ) : (
              <div className="list-group">
                {receivers.map((receiver) => (
                  <button
                    key={receiver.id}
                    className={`list-group-item list-group-item-action d-flex align-items-center ${selectedReceiver === receiver.id ? 'active' : ''}`}
                    onClick={() => setSelectedReceiver(receiver.id)}
                  >
                    <img
                      src={receiver.avatar}
                      alt="Avatar"
                      className="rounded-circle me-2"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <div>
                      <div>{receiver.nickName}</div>
                      <div className="text-danger">@{receiver.username}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleShare}
              disabled={!selectedReceiver || loading}
            >
              Share
            </button>
          </div>
        </div>
      </div>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{ position: 'fixed', top: 20, right: 20 }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default SharePlaylistModal;
