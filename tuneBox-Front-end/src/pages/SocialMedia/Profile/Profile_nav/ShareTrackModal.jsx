import React, { useState, useEffect } from 'react';
import { images } from "../../../../assets/images/images"; // Giữ nguyên import images
import Cookies from "js-cookie";
import axios from 'axios';

const ShareTrackModal = ({ trackId, isOpen, onClose }) => {
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = Cookies.get("userId");
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
        params: { senderId: userId },
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
      alert('Please select a user to share with');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/share/track`, null, {
        params: { senderId: userId, receiverId: selectedReceiver, trackId },
      });

      if (response.status === 200) {
        alert('Track shared successfully!');
        onClose();
      } else {
        alert('Failed to share track');
      }
    } catch (error) {
      console.error('Error sharing track:', error);
      alert('Error sharing track');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Share Track</h5>
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
                      src={images.avt}
                      alt="Avatar"
                      className="rounded-circle me-2"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <span>{receiver.nickname}</span>
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
    </div>
  );
};

export default ShareTrackModal;
