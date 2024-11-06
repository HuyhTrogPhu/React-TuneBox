import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getOrdersByUserId } from '../../service/CheckoutService';
import { useNavigate } from 'react-router-dom';

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [searchDate, setSearchDate] = useState('');  // Search by specific date
  const [fromDate, setFromDate] = useState('');      // Search from date
  const [toDate, setToDate] = useState('');          // Search to date
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders based on search
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [ordersPerPage] = useState(5); // Orders per page
  const userIdCookie = Cookies.get('userId');
  const navigate = useNavigate();
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrdersByUserId(userIdCookie);
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleSearchDate = (e) => {
    e.preventDefault();
    const filtered = orders.filter(order =>
      new Date(order.orderDate).toDateString() === new Date(searchDate).toDateString()
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchBetweenDates = (e) => {
    e.preventDefault();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= new Date(fromDate) && orderDate <= new Date(toDate);
    });
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orderDetail/${orderId}`); // Điều hướng tới trang chi tiết của hóa đơn
  };

  // Logic for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className='row'>
        <div className='d-flex justify-content-between ps-5 pe-5'>
          <div className='col-3'>
            <form onSubmit={handleSearchDate}>
              <div className='mt-3'>
                <label className='form-label'>Select the day you want</label>
                <input
                  type="date"
                  className='form-control'
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>
              <div className='mt-3'>
                <button type="submit" className="btn btn-outline-primary mt-2">Search</button>
              </div>
            </form>
          </div>
          <div className='col-3'>
            <form onSubmit={handleSearchBetweenDates}>
              <div className='mt-3'>
                <label className='form-label'>From:</label>
                <input
                  type="date"
                  className='form-control'
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className='mt-3'>
                <label className='form-label'>To:</label>
                <input
                  type="date"
                  className='form-control'
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className='mt-3'>
                <button type="submit" className="btn btn-outline-primary mt-2">Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='order'>
        <h6>Orders</h6>
        <table className='table border'>
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
            {currentOrders.map((order, index) => (
              <tr key={order.id}>
                <th style={{ textAlign: "center" }}>{index + 1 + indexOfFirstOrder}</th>
                <td style={{ textAlign: "center" }}>{order.orderDate}</td>
                <td style={{ textAlign: "center" }}>{order.deliveryDate}</td>
                <td style={{ textAlign: "center" }}>{(order.totalPrice).toLocaleString('vi')} VND</td>
                <td style={{ textAlign: "center" }}>{order.totalItem}</td>
                <td style={{ textAlign: "center" }}>{order.paymentMethod}</td>
                <td style={{ textAlign: "center" }}>{order.shippingMethod}</td>
           
                <td style={{ textAlign: "center" }}>
                  {order.paymentStatus}
                </td>
                <td style={{ textAlign: "center" }}>{order.status}</td>
                <td style={{ textAlign: "center" }}>
                <button className="btn btn-link" style={{textDecoration: 'none', color: '#e94f37'}}  onClick={() => handleViewDetails(order.id)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
  );
};

export default CustomerOrder;
