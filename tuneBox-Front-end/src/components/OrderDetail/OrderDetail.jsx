import React, { useEffect, useState } from 'react';
import { getOrderByOrderId } from '../../service/EcommerceAdminOrder';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas-pro';
const OrderDetail = () => {
  const { orderId } = useParams()
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    // Gọi API để lấy thông tin chi tiết đơn hàng
    getOrderByOrderId(orderId)
      .then((response) => {
        setOrderDetail(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
      });
  }, [orderId]);

  const exportToExcel = () => {
    if (!orderDetail) return;

    // Chuẩn bị dữ liệu cho file Excel
    const orderData = [
      {
        'Order ID': orderDetail.id,
        'Order Date': orderDetail.orderDate,
        'Delivery Date': orderDetail.deliveryDate,
        'Payment Method': orderDetail.paymentMethod,
        'Shipping Method': orderDetail.shippingMethod,
        'Status': orderDetail.status,
        'Total Price': orderDetail.orderItems.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0).toLocaleString('vi') + ' VND'
      },
    ];

    const orderItemsData = orderDetail.orderItems.map((item, index) => ({
      '#': index + 1,
      'Name': item.instrumentName,
      'Category Name': item.categoryId,
      'Brand Name': item.brandId,
      'Cost Price': item.costPrice.toLocaleString('vi') + ' VND',
      'Quantity': item.quantity,
      'Total Price': (item.costPrice * item.quantity).toLocaleString('vi') + ' VND'
    }));

    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const wsOrder = XLSX.utils.json_to_sheet(orderData);
    const wsItems = XLSX.utils.json_to_sheet(orderItemsData);

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, wsOrder, 'Order Info');
    XLSX.utils.book_append_sheet(wb, wsItems, 'Order Items');

    // Xuất file Excel
    XLSX.writeFile(wb, `OrderDetail_${orderDetail.id}.xlsx`);
  };


  if (!orderDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div id="order-detail-section" >
      <div style={{ marginTop: '10px' }}>
        <h1 style={{ fontSize: '30px' }}> <b>Order Detail</b></h1>
      </div>
      <div className='row'>
        {/* User information */}
        <div className='col-4 mt-5'>
          <h1 style={{ fontSize: '25px' }}>User information</h1>
          <p>Username: {orderDetail.userName}</p>
          <p>Email: {orderDetail.email}</p>
          <p>Name: {orderDetail.name}</p>
          <p>Phone Number: {orderDetail.phone}</p>
          <p>Location: {orderDetail.location}</p>
        </div>

        {/* Order information */}
        <div className='col-6 mt-5'>
          <h1 style={{ fontSize: '25px' }}>Order information</h1>

          <p style={{ fontWeight: '400' }}>Order ID: {orderDetail.id}</p>
          <p>Order date: {orderDetail.orderDate}</p>
          <p>Delivery Date: {orderDetail.deliveryDate}</p>
          <p>Payment method: {orderDetail.paymentMethod}</p>
          <p>Shipping method: {orderDetail.shippingMethod}</p>
          <p>Address: {orderDetail.address}</p>
          <p>Status: {orderDetail.status}</p>

          <p>Phone Number: {orderDetail.phoneNumber}</p>
        </div>
      </div>

      {/* Order detail items */}
      <div className='row mt-5'>
        <table className='table'>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }} scope='col'>#</th>
              <th style={{ textAlign: "center" }} scope='col'>Name</th>
              <th style={{ textAlign: "center" }} scope='col'>Category name</th>
              <th style={{ textAlign: "center" }} scope='col'>Brand name</th>
              <th style={{ textAlign: "center" }} scope='col'>Image</th>
              <th style={{ textAlign: "center" }} scope='col'>Cost Price</th>
              <th style={{ textAlign: "center" }} scope='col'>Quantity</th>
              <th style={{ textAlign: "center" }} scope='col'>Total price</th>
            </tr>
          </thead>
          <tbody>
            {orderDetail.orderItems.map((item, index) => (
              <tr key={item.orderDetailId}>
                <td>{index + 1}</td>
                <td>{item.instrumentName}</td>
                <td>{item.categoryId}</td>
                <td>{item.brandId}</td>
                <td>
                  <img src={item.instrumentImage} alt={item.instrumentName} style={{ width: '50px', height: '50px' }} />
                </td>
                <td>{(item.costPrice).toLocaleString('vi')} VND</td>
                <td>{item.quantity}</td>
                <td>{(item.costPrice * item.quantity).toLocaleString('vi')} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="col-3">
          <button className="btn btn-success mb-3" onClick={exportToExcel}>
            Export to Excel
          </button>
 
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
