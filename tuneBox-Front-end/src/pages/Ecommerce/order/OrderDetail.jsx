import React, { useEffect, useState } from 'react'
import "../../Ecommerce/order/OrderDetail.css"
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import thêm Swal nếu cần để hiện thông báo lỗi
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas-pro';
import { QRCodeSVG } from "qrcode.react";
import { images } from '../../../assets/images/images';

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

    const downloadPDF = async () => {
        const input = document.getElementById('orderDetail');
        const canvas = await html2canvas(input, { useCORS: true }); // Thêm useCORS: true
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`TuneBox_ElectronicInvoice_${orderDetails.orderId}.pdf`);
    };


    // Nếu chưa có dữ liệu đơn hàng, hiển thị thông báo đang tải
    if (!orderDetails) {
        return <div>Đang tải thông tin đơn hàng...</div>;
    }

    return (
        <div className="container" id="orderDetail" style={{marginTop: '100px'}}>
            <div className="row">
                {/* BEGIN INVOICE */}
                <div className="col-xs-12">
                    <div className="grid invoice">
                        <div className="grid-body">
                            <div className="invoice-title d-flex justify-content-between align-items-center">
                                <div>
                                    <h1>
                                        <b>Order Detail Information</b> <br />
                                        <span style={{ marginTop: '50px' }} className="small">
                                            <b>Order ID:</b> {orderDetails.orderId}
                                        </span>
                                    </h1>
                                </div>
                                <div>
                                    <img src={images.logoTuneBox} alt="Logo" width={100} />
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xs-12 ">
                                    <address>
                                        <p style={{ fontSize: '30px' }}> <b>Recipient information</b></p>
                                        <p> <b>Name: </b>{orderDetails.username}</p>

                                        <p> <b>Email: </b>{orderDetails.email}</p>
                                        <p> <b>Phone number: </b>{orderDetails.phoneNumber}</p>

                                    </address>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <address>
                                        <p > <b>Delivery address:</b>    {orderDetails.address} </p>

                                    </address>
                                    <address>
                                        <p><b>Payment method:</b> {orderDetails.paymentMethod}</p>

                                    </address>
                                    <address>
                                        <p><b>Payment status: </b>{orderDetails.paymentStatus} </p>

                                    </address>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <h3>ORDER DETAILS</h3>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr className="line">
                                                <td><strong>#</strong></td>
                                                <td className="text-center"><strong>Product name</strong></td>
                                                <td className="text-center"><strong>Image</strong></td>
                                                <td className="text-center"><strong>Price</strong></td>
                                                <td className="text-center"><strong>Quanlity</strong></td>
                                                <td className="text-center"><strong>Value</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderDetails.orderDetails.map((detail, index) => (
                                                <tr key={detail.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{detail.instrumentName}</td>
                                                    <td className='instrument-image col-2'>
                                                        <img src={detail.image} alt="" crossOrigin="anonymous" />
                                                    </td>
                                                    <td className="text-center">
                                                        {(parseFloat(detail.costPrice)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                    </td>

                                                    <td className="text-center">{detail.quantity}</td>
                                                    <td className="text-center">{(detail.costPrice * detail.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                                </tr>
                                            ))}


                                            <tr>
                                                <td colSpan={4}>

                                                </td><td className="text-right"><strong>Total</strong></td>
                                                <td className="text-right"><strong>{(orderDetails.totalPrice).toLocaleString('vi')} VND</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="qr-code">
                                        <div className="qr-code">
                                            <QRCodeSVG
                                                value={`Order ID: ${orderDetails.orderId}\nName: ${orderDetails.username}\nTotal: ${(orderDetails.totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}\nLink order: http://localhost:3000/orderDetail/${orderDetails.orderId}`}
                                                size={128}
                                            />
                                        </div>

                                    </div>
                                    <div className="text-right mt-3">
                                        <button onClick={downloadPDF} className="btn">Download PDF</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 text-right identity">
                                    <p>Order is covered by <strong>tuneBox@2024</strong></p>
                                    <p>Head office address: QTSC 9 Building, To Ky Street, Tan Chanh Hiep, District 12, Ho Chi Minh, Vietnam</p>
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
