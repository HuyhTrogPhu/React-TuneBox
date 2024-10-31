import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getAllOrders, updateOrderStatus } from '../../../service/EcommerceAdminOrder';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas-pro';
const ManagerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const [searchDate, setSearchDate] = useState('');  // Tìm kiếm theo ngày
  const [fromDate, setFromDate] = useState('');  // Tìm kiếm từ ngày
  const [toDate, setToDate] = useState('');      // Tìm kiếm đến ngày
  const [searchStatus, setSearchStatus] = useState(''); // Tìm kiếm theo trạng thái hóa đơn 
  const [dailyRevenue, setDailyRevenue] = useState(0); // Tổng doanh thu hôm nay

  // Fetch orders data khi component render
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();

      setOrders(response.data);
      filterOrdersByToday(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Tạo ngày hiện tại nếu trạng thái là 'Đã giao hàng'
      const deliveryDate = newStatus === 'Đã giao hàng' ? new Date().toISOString().split('T')[0] : null;
      const paymentStatus = newStatus === 'Đã giao hàng' ? 'Paid' : 'Not Paid';
      // Cập nhật trạng thái và ngày giao hàng trên backend
      await updateOrderStatus(orderId, newStatus, deliveryDate, paymentStatus);

      // Cập nhật trạng thái và ngày giao hàng trong danh sách `currentOrders`
      setCurrentOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
              ...order,
              status: newStatus,
              deliveryDate: deliveryDate || order.deliveryDate,
              paymentStatus: paymentStatus
            }
            : order
        )
      );

      // Cập nhật trạng thái và ngày giao hàng trong danh sách `orders`
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
              ...order,
              status: newStatus,
              deliveryDate: deliveryDate || order.deliveryDate,
              paymentStatus: paymentStatus
            }
            : order
        )
      );
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };


  // Hàm lọc đơn hàng của ngày hôm nay
  const filterOrdersByToday = (allOrders) => {
    const today = new Date().toISOString().split('T')[0];  // Lấy ngày hiện tại (yyyy-mm-dd)
    const todayOrders = allOrders.filter(order => order.orderDate === today);
    setCurrentOrders(todayOrders);

    // Tính tổng doanh thu hôm nay
    const totalRevenue = todayOrders.reduce((total, order) => total + order.totalPrice, 0);
    setDailyRevenue(totalRevenue);
  };

  // Hàm tìm kiếm đơn hàng theo ngày
  const searchOrdersByDate = (date) => {
    if (!date) return;
    const filteredOrders = orders.filter(order => order.orderDate === date);
    setCurrentOrders(filteredOrders);
  };

  // Hàm tìm kiếm đơn hàng từ ngày đến ngày
  const searchOrdersByRange = (from, to) => {
    if (!from || !to) return;
    const filteredOrders = orders.filter(order => order.orderDate >= from && order.orderDate <= to);
    setCurrentOrders(filteredOrders);
  };

  // Hàm tìm kiếm đơn hàng theo trạng thái
  const searchOrdersByStatus = (status) => {
    if (!status || status === "All") {
      setCurrentOrders(orders);
    } else {
      const filteredOrders = orders.filter(order => order.status === status);
      setCurrentOrders(filteredOrders);
    }
  };

  // Tính toán số lượng trang dựa trên tổng số đơn hàng và số hàng mỗi trang
  const totalPages = Math.ceil(currentOrders.length / rowsPerPage);

  // Lấy dữ liệu đơn hàng cho trang hiện tại
  const currentPaginatedOrders = currentOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Hàm xuất dữ liệu ra Excel
  const exportToExcel = () => {
    const data = currentOrders.map(order => ({
      'Order Date': order.orderDate,
      'Delivery Date': order.deliveryDate,
      'Total Price': order.totalPrice.toLocaleString('vi') + ' VND',
      'Total Items': order.totalItems,
      'Payment Method': order.paymentMethod,
      'Shipping Method': order.shippingMethod,
      'Payment Status': order.paymentStatus,
      'Status': order.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'TuneBox_admin_orders.xlsx');
  };




  // Chuyển trang
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <div className='container-fluid'>
        <div className='row'>
          {/* Search by day */}
          <div className='col-3'>
            <form onSubmit={(e) => { e.preventDefault(); searchOrdersByDate(searchDate); }}>
              <div className='mt-3'>
                <label className='form-label'>Search by day:</label>
                <input
                  type="date"
                  className='form-control'
                  placeholder='Select day'
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-primary mt-2">Search</button>
              </div>
            </form>
          </div>
          {/* Search from day to day */}
          <div className='col-3'>
            <form onSubmit={(e) => { e.preventDefault(); searchOrdersByRange(fromDate, toDate); }}>
              <div className='mt-3'>
                <label className='form-label'>From day:</label>
                <input
                  type="date"
                  className='form-control'
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <br />
                <label className='form-label'>To day:</label>
                <input
                  type="date"
                  className='form-control'
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-primary mt-2">Search</button>
              </div>
            </form>
          </div>


          {/* Search by status */}
          <div className='col-3'>
            {/* Dropdown tìm kiếm trạng thái đơn hàng */}
            <div className='mt-3'>
              <label className='form-label'>Search by status:</label>
              <select
                className='form-select'
                value={searchStatus}
                onChange={(e) => {
                  setSearchStatus(e.target.value);
                  searchOrdersByStatus(e.target.value);
                }}
              >
                <option value="All">All</option>
                <option value="Wait for confirmation">Wait for confirmation</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Delivering">Delivering</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>

          {/* Daily revenue */}
          <div className='col-3'>
            <h6>Daily revenue: {dailyRevenue ? `${(dailyRevenue).toLocaleString('vi')} VND` : 'No data'}</h6>
          </div>


        </div>

        {/* Table */}
        <div className='row mt-5'>

          <table id="orderTable" className='table'>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }} scope='col'>#</th>
                <th style={{ textAlign: "center" }} scope='col'>Order date</th>
                <th style={{ textAlign: "center" }} scope='col'>Delivery date</th>

                <th style={{ textAlign: "center" }} scope='col'>Total price</th>
                <th style={{ textAlign: "center" }} scope='col'>Total Items</th>
                <th style={{ textAlign: "center" }} scope='col'>Payment method</th>

                <th style={{ textAlign: "center" }} scope='col'>Shipping method</th>
                <th style={{ textAlign: "center" }} scope='col'>Payment status</th>
                <th style={{ textAlign: "center" }} scope='col'>Status</th>
                <th style={{ textAlign: "center" }} scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPaginatedOrders.length > 0 ? (
                currentPaginatedOrders.map((order, index) => (
                  <tr key={order.id}>
                    <th>{(currentPage - 1) * rowsPerPage + index + 1}</th>
                    <td>{order.orderDate}</td>
                    <td>{order.deliveryDate}</td>

                    <td>{(order.totalPrice).toLocaleString('vi')} VND</td>
                    <td>{order.totalItems}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.shippingMethod}</td>
                    <td>{order.paymentStatus}</td>
                    <td>

                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="form-select"
                      >
                        <option value="Wait for confirmation">Wait for confirmation</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Delivering">Delivering</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`/ecomadmin/order/detail/${order.id}`}>View</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className='col-3'>
            <button onClick={exportToExcel} className="btn btn-outline-success">
              Export Excel
            </button>

          </div>


          {/* Pagination */}
          <div className="">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center text-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)} aria-label="Previous">
                    <span aria-hidden="true">«</span>
                  </button>
                </li>
                {[...Array(totalPages).keys()].map(number => (
                  <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                    <button onClick={() => paginate(number + 1)} className="page-link">
                      {number + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)} aria-label="Next">
                    <span aria-hidden="true">»</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ManagerOrder;