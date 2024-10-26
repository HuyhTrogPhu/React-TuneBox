import React, { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

const ThanhCong = () => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const vnpResponseCode = queryParams.get('vnp_ResponseCode');

      // Lấy orderId từ Local Storage
      const orderId = localStorage.getItem('orderId');

      if (vnpResponseCode === '00') {
          // Thanh toán thành công
          Swal.fire({
              title: 'Success!',
              text: 'Your payment has been confirmed.',
              icon: 'success',
              confirmButtonText: 'Ok', // Thay đổi tên nút
          }).then((result) => {
              if (result.isConfirmed) {
                  navigate('/shop'); // Chuyển hướng về trang /shop khi nhấn Ok
              }
          });
      } else {
          // Thanh toán không thành công
          Swal.fire({
              title: 'Failure!',
              text: 'Your payment has been declined.',
              icon: 'error',
              confirmButtonText: 'Ok', // Thay đổi tên nút
          }).then((result) => {
              if (result.isConfirmed) {
                  navigate('/shop'); // Chuyển hướng về trang /shop khi nhấn Ok
              }
          });
      }
  }, [location, navigate]);

    return (
        <div>
      
        </div>
    );
};

export default ThanhCong;
