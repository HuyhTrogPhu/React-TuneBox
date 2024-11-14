import React, { useState, useEffect } from 'react';
import { images } from "../../../../assets/images/images"; // Giữ nguyên import images
import Cookies from "js-cookie";
import axios from 'axios';
import { Toast } from 'react-bootstrap'; // Đảm bảo bạn đã cài đặt Bootstrap hoặc Toast

const ShareAlbumModal = ({ albumId, isOpen, onClose }) => {
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = Cookies.get("userId");
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false); 

  console.log("User ID from Cookie:", userId);

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
      const response = await axios.post(`http://localhost:8080/api/share/album`, null, {
        params: { senderId: userId, receiverId: selectedReceiver, albumId },
      });

      if (response.status === 200) {
        setToastMessage('Album shared successfully!');
        setShowToast(true); // Hiển thị toast
        // Thực hiện đóng modal sau khi thông báo đã được hiển thị
        setTimeout(() => onClose(), 1000); // Đóng modal sau khi toast đã hiển thị
      } else {
        setToastMessage('Failed to share album');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error sharing album:', error);
      setToastMessage('Error sharing album');
      setShowToast(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Share Album</h5>
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
                      src={receiver.avatar} // Hiển thị avatar từ dữ liệu API
                      alt="Avatar"
                      className="rounded-circle me-2"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <div>
                      <div>{receiver.nickName}</div> {/* Hiển thị nickname */}
                      <div className="text-danger">@{receiver.username}</div> {/* Hiển thị username */}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
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
        delay={3000} // Để toast tự đóng sau 3 giây
        autohide
        style={{ position: 'fixed', top: 20, right: 20 }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default ShareAlbumModal;
