import React, { useEffect, useState } from 'react';
import { getOrderByOrderId } from '../../service/EcommerceAdminOrder';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas-pro';
import { images } from '../../assets/images/images';

const OrderDetail = () => {
  const { orderId } = useParams();
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

  const downloadPDF = async () => {
    const input = document.getElementById('order-detail-section');

    // Tăng độ phân giải của canvas để văn bản rõ nét hơn
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });

    // Thiết lập kích thước A4
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    // Đặt chiều rộng ảnh theo A4 (190mm) và tính toán chiều cao tương ứng
    const imgWidth = 190;
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Vẽ ảnh và phân trang nếu nội dung dài hơn một trang A4
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`OrderDetail_${orderDetail.id}.pdf`);
  };

  if (!orderDetail) {
    return <p>Loading...</p>;
  }

  // Tính toán tổng tiền
  const subtotal = orderDetail.orderItems.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% thuế
  const total = subtotal + tax;

  return (
    <div id="order-detail-section">
      <div className='row p-5'>
        {/* Avatar shop */}
        <div className='col-12 text-center'>
          <img src={images.logoTuneBox} alt='shop-avatar' style={{ width: '200px', height: 'auto' }} />
          <p>QTSC 9 Building, Đ. Tô Ký, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh, Việt Nam</p>
        </div>
        {/* User information */}
        <div className='col-6 mt-5 ps-5 text-start'>
          <h1 className='mb-4' style={{ fontSize: '25px' }}>User Information</h1>
          <p><strong>Name:</strong> {orderDetail.name}</p>
          <p><strong>Email:</strong> {orderDetail.email}</p>
          <p><strong>Phone Number:</strong> {orderDetail.phone}</p>
          <p><strong>Location:</strong> {orderDetail.location}</p>
        </div>

        {/* Order information */}
        <div className='col-6 mt-5 pe-5 text-end'>
          <h1 className='mb-4' style={{ fontSize: '25px' }}>Order Information</h1>
          <div className=''>
            <p><strong>Order ID: </strong> {orderDetail.id}</p>
            <p>
              <strong>Status: </strong>
              <span style={{
                color: orderDetail.status === "Canceled"
                  ? "red"
                  : orderDetail.status === "Delivered"
                    ? "green"
                    : "yellow"
              }}>
                {orderDetail.status}
              </span>
            </p>
            <p><strong>Order Date: </strong> <span style={{ color: 'blue' }}>{orderDetail.orderDate}</span></p>
            <p><strong>Delivery Date: </strong> <span style={{ color: 'blue' }}>{orderDetail.deliveryDate}</span></p>
          </div>
        </div>
      </div>

      {/* Order detail items */}
      <div className='row'>
        <hr />
        <h6 className='text-center'>Items</h6>
        <table className='table'>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }} scope='col'>#</th>
              <th style={{ textAlign: "center" }} scope='col'>Name</th>
              <th style={{ textAlign: "center" }} scope='col'>Image</th>
              <th style={{ textAlign: "center" }} scope='col'>Cost Price</th>
              <th style={{ textAlign: "center" }} scope='col'>Quantity</th>
              <th style={{ textAlign: "center" }} scope='col'>SubTotal</th>
            </tr>
          </thead>
          <tbody>
            {orderDetail.orderItems.map((item, index) => (
              <tr key={item.orderDetailId}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}>{item.instrumentName}</td>
                <td style={{ textAlign: "center" }}>
                  <img src={item.instrumentImage} alt={item.instrumentName} style={{ width: '50px', height: '50px' }} />
                </td>
                <td style={{ textAlign: "center" }}>{(item.costPrice).toLocaleString('vi')} VND</td>
                <td style={{ textAlign: "center" }}>x{item.quantity}</td>
                <td style={{ textAlign: "center" }}>{(item.costPrice * item.quantity).toLocaleString('vi')} VND</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <table className='table mt-5 mb-5'>
          <thead>
            <tr>
              <th style={{textAlign: 'center'}} scope='col'>SUBTOTAL</th>
              <th style={{textAlign: 'center'}} scope='col'>TAX(5%)</th>
              <th style={{textAlign: 'center'}} scope='col'>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{textAlign: 'center'}}>{subtotal.toLocaleString('vi')} VND</td>
              <td style={{textAlign: 'center'}}>{tax.toLocaleString('vi')} VND</td>
              <td style={{textAlign: 'center'}}>{total.toLocaleString('vi')} VND</td>
            </tr>
          </tbody>
        </table>

        {/* Order information */}
        <div className='ms-4'>
          <p><strong>Payment Method:</strong> {orderDetail.paymentMethod.toUpperCase()}</p>
          <p><strong>Shipping Method:</strong> {orderDetail.shippingMethod.toUpperCase()}</p>
          <p><strong>Phone Number:</strong> {orderDetail.phoneNumber}</p>
          <p><strong>Location:</strong> {orderDetail.address}</p>
        </div>

        {/* Button to export */}
        <hr />
        <div className='d-flex justify-content-center mb-3'>
          <button className='btn btn-success me-2' onClick={exportToExcel}>Export to Excel</button>
          <button className='btn btn-danger' onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
