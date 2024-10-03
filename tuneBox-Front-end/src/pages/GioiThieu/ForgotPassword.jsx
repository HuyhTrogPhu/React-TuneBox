import React, { useState } from 'react';
import axios from 'axios';
import './css/style.css';
import Footer2 from '../../components/Footer/Footer2';
import Header2 from '../../components/Navbar/Header2';

const ForgotPassword = () => {
  const [inputValue, setInputValue] = useState(''); // Thay đổi state để lưu cả userName và email
  const [message, setMessage] = useState('');

  const handleResetPassword = async (event) => {
    event.preventDefault();
    
    const isEmail = inputValue.includes('@');
  
    try {
      const response = await axios.post('http://localhost:8081/User/forgot-password', { 
        email: isEmail ? inputValue : null,
        userName: !isEmail ? inputValue : null
      });
  
      if (response.status === 200) {
        setMessage('Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
      } else {
        setMessage('Không tìm thấy tài khoản với tên đăng nhập hoặc email này.');
      }
    } catch (error) {
      console.error('Error response:', error.response);
      setMessage(error.response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');    
    }
  };
  

  return (
    <div>
   {/* <Header2 /> */}
    <div className="container">
      <h2 className="text-center mb-4">Quên mật khẩu</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="text"
          className="form-control"
          placeholder="Nhập tên đăng nhập hoặc email của bạn"
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn btn-primary mt-3">Gửi email</button>
        <div className="text-danger mt-2">{message}</div>
      </form>
    </div>
    {/* <Footer2/> */}
    </div>
  );
};

export default ForgotPassword;
