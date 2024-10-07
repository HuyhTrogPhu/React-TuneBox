import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Footer2 from '../../components/Footer/Footer2';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    try {
      await axios.post('http://localhost:8080/User/reset-password', {
        token,
        newPassword,
      });
      setMessage('Mật khẩu đã được đặt lại thành công.');
    } catch (error) {
      setMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // Inline styles
  const containerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const messageStyle = {
    marginTop: '10px',
    textAlign: 'center',
    color: 'red',
  };

  return (
    <div>
    {/* <Header2 /> */}
    <div style={containerStyle}>
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Mật khẩu mới:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Xác nhận mật khẩu:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Đặt lại mật khẩu</button>
        <div style={messageStyle}>{message}</div>
      </form>
    </div>
    {/* <Footer2/> */}
    </div>
  );
};

export default ResetPassword;
