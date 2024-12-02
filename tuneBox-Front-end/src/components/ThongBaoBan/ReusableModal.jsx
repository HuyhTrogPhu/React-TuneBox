// src/components/ReusableModal.js
import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../service/LoginService";
import Cookies from "js-cookie";
import axios from "axios";

const ReusableModal = ({ isOpen, onRequestClose }) => {
  const navigate = useNavigate();

  // Hàm đăng xuất
  const handleLogout = async () => {
    try {
      const userId = Cookies.get("userId"); // Lấy userId từ Cookie
      const cart = JSON.parse(localStorage.getItem("cart")) || []; // Lấy giỏ hàng từ LocalStorage
  
      if (userId && cart.length > 0) {
        // Gửi giỏ hàng lên server
        await axios.post(`http://localhost:8080/customer/cart/${userId}`, { items: cart });
      }
  
      // Xóa giỏ hàng khỏi LocalStorage
      localStorage.removeItem("cart");
  
      // Logout API
      await logout();
      Cookies.remove("userId");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Hàm đóng modal và đăng xuất, sau đó chuyển hướng
  const handleCloseModal = async () => {
    await handleLogout(); // Đăng xuất trước
    onRequestClose(); // Đóng modal 
    navigate("/introduce"); // Chuyển hướng về trang /introduce
  };

  // Chỉ đóng modal sau khi đã thực hiện xong các công việc trong handleLogout
  useEffect(() => {
    if (!isOpen) {
      // Nếu modal đã được đóng (isOpen = false), đảm bảo sẽ không gọi onRequestClose thêm lần nữa
    }
  }, [isOpen]); // Theo dõi thay đổi của isOpen

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleCloseModal} // Gọi handleCloseModal khi nhấn ngoài modal hoặc đóng
      className="custom-modal-content"
      overlayClassName="custom-modal-overlay"
      contentLabel="Thông báo"
    >
      <div>
        <h3 className="custom-modal-header">Tài khoản bị cấm</h3>
        <p className="custom-modal-body">
          Bạn không thể tiếp tục sử dụng tài khoản này. Vui lòng liên hệ quản trị viên để biết thêm thông tin.
        </p>
        <button className="custom-modal-button" onClick={handleCloseModal}>
          Đăng xuất và đóng
        </button>
      </div>
    </ReactModal>
  );
};

export default ReusableModal;
