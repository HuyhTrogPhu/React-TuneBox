import React, { useEffect, useState } from 'react'
import "../../Ecommerce/order/OrderDetail.css"
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import thêm Swal nếu cần để hiện thông báo lỗi

const OrderDetail = () => {
    const [orderDetails, setOrderDetails] = useState(null); // Lưu thông tin đơn hàng
    const { orderId } = useParams(); // Lấy orderId từ URL
    const navigate = useNavigate();

    // Hàm lấy chi tiết đơn hàng từ API
    const getOrderDetails = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:8080/customer/checkout/getOrderById/${orderId}`);
            setOrderDetails(response.data); // Lưu thông tin hóa đơn vào state
        } catch (error) {
            console.error('Error fetching order details:', error.response ? error.response.data : error.message);
            Swal.fire('Lỗi', 'Không thể lấy thông tin chi tiết đơn hàng. Vui lòng thử lại.', 'error');
        }
    };

    // Gọi hàm lấy thông tin đơn hàng khi component được render
    useEffect(() => {
        if (orderId) {
            getOrderDetails(orderId);
        }
    }, [orderId]);
    useEffect(() => {
        console.log(orderDetails);  // Kiểm tra dữ liệu trả về
    }, [orderDetails]);
    // Nếu chưa có dữ liệu đơn hàng, hiển thị thông báo đang tải
    if (!orderDetails) {
        return <div>Đang tải thông tin đơn hàng...</div>;
    }

    return (
        <div className="container">
            <div className="row">
                {/* BEGIN INVOICE */}
                <div className="col-xs-12">
                    <div className="grid invoice">
                        <div className="grid-body">
                            <div className="invoice-title">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <h2>Order Detail Information<br />
                                            <span className="small">Order ID: {orderDetails.orderId}</span></h2>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xs-12 ">
                                    <address>
                                        <strong>Thông tin người nhận:</strong><br />
                                        Tên: {orderDetails.username} <br />
                                        Địa chỉ: {orderDetails.address}<br />
                                        Email: {orderDetails.email}  <br />
                                        <abbr title="Phone">Số điện thoại:</abbr> {orderDetails.phoneNumber}
                                    </address>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <address>
                                        <strong>Địa chỉ giao hàng:</strong><br />
                                        {orderDetails.address}
                                    </address>
                                    <address>
                                        <strong>Phương thức thanh toán:</strong> <br />
                                        {orderDetails.paymentMethod}
                                    </address>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <h3>CHI TIẾT ĐƠN HÀNG</h3>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr className="line">
                                                <td><strong>#</strong></td>
                                                <td className="text-center"><strong>Tên sản phẩm</strong></td>
                                                <td className="text-center"><strong>Hình ảnh</strong></td>
                                                <td className="text-center"><strong>Số lượng</strong></td>
                                                <td className="text-center"><strong>Giá trị</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderDetails.orderDetails.map((detail, index) => (
                                                <tr key={detail.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{detail.instrumentName}</td>
                                                    <td className='instrument-image col-2'> 
                                                        <img src={detail.image} alt="" />
                                                    </td>
                                                    <td className="text-center">{detail.quantity}</td>
                                                    <td className="text-center">{(detail.costPrice * detail.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                                </tr>
                                            ))}
                                      
                                     
                                                <tr>
                                                    <td colSpan={3}>
                                                    </td><td className="text-right"><strong>Total</strong></td>
                                                    <td className="text-right"><strong>{(orderDetails.totalPrice).toLocaleString('vi')} VND</strong></td>
                                                </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 text-right identity">
                                    <p>Đơn hàng được bảo hộ bởi<br /><strong>tuneBox@2024</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* END INVOICE */}
            </div>
        </div>
    );
};

export default OrderDetail;
