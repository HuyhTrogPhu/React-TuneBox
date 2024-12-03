import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const XacThucUserLogin = ({ children }) => {
    const userId = document.cookie.split('; ').find(row => row.startsWith('userId='));
    console.log("Cookies:", document.cookie);

    useEffect(() => {
        // Nếu không tìm thấy cookie userId
        if (!userId) {
            // Hiển thị thông báo yêu cầu đăng nhập
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu đăng nhập',
                text: 'Vui lòng đăng nhập để tiếp tục!',
                confirmButtonText: 'Đến trang đăng nhập'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Nếu người dùng nhấn nút xác nhận, chuyển hướng đến trang đăng nhập
                    window.location.href = '/login'; // Hoặc sử dụng Navigate từ react-router-dom
                }
            });
        }
    }, [userId]); // Chạy useEffect khi userId thay đổi

    // Nếu có userId, render các children
    return userId ? children : null;
};

export default XacThucUserLogin;
