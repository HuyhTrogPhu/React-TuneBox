import React, { useEffect, useState } from 'react';
import { getOrderByOrderId } from '../../service/EcommerceAdminOrder';


const OrderDetail = ({ orderId }) => {
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

  if (!orderDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className='row'>
        {/* User information */}
        <div className='col-6'>
          <h6>User information</h6>
          <p>Username: {orderDetail.userName}</p>
          <p>Email: {orderDetail.email}</p>
          <p>Name: {orderDetail.name}</p>
          <p>Phone Number: {orderDetail.phone}</p>
          <p>Location: {orderDetail.location}</p>
        </div>

        {/* Order information */}
        <div className='col-6'>
          <h6>Order information</h6>
          <p>Order ID: {orderDetail.id}</p>
          <p>Order date: {orderDetail.orderDate}</p>
          <p>Delivery Date: {orderDetail.deliveryDate}</p>
          <p>Payment method: {orderDetail.paymentMethod}</p>
          <p>Shipping method: {orderDetail.shippingMethod}</p>
          <p>Address: {orderDetail.address}</p>
          <p>Status: {orderDetail.status}</p> 
          {/* dạng select có 4 giai đoạn đang xử lý, đang gia, đã giao, đã thanh toán sau khi select 1 trang thái nhấn update thì cập nhật status */}
          <p>Phone Number: {orderDetail.phoneNumber}</p>
        </div>
      </div>

      {/* Order detail items */}
      <div className='row mt-5'>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Category name</th>
              <th scope='col'>Brand name</th>
              <th scope='col'>Image</th>
              <th scope='col'>Cost Price</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Total price</th>
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
      </div>
    </div>
  );
};

export default OrderDetail;
