import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    getOrdersByCanceled,
    getOrdersByCOD,
    getOrdersByConfirmed,
    getOrdersByDelivered,
    getOrdersByDelivering,
    getOrdersByFast,
    getOrdersByNormal,
    getOrdersByPaid,
    getOrdersByUnpaid,
    getOrdersByVNPAY
} from '../../service/EcommerceAdminOrderSta';

const StatisticalOrder = () => {
    const { type } = useParams();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchDate, setSearchDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Define how many orders per page

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let response;

                // Adjusting the type comparison to match the paths correctly
                if (type === 'unpaid') {
                    response = await getOrdersByUnpaid();
                } else if (type === 'paid') {
                    response = await getOrdersByPaid();
                } else if (type === 'confirmed') {
                    response = await getOrdersByConfirmed();
                } else if (type === 'delivered') {
                    response = await getOrdersByDelivered();
                } else if (type === 'delivering') {
                    response = await getOrdersByDelivering();
                } else if (type === 'canceled') {
                    response = await getOrdersByCanceled();
                } else if (type === 'cod') {
                    response = await getOrdersByCOD();
                } else if (type === 'vnpay') {
                    response = await getOrdersByVNPAY();
                } else if (type === 'normal') {
                    response = await getOrdersByNormal();
                } else if (type === 'fast') {
                    response = await getOrdersByFast();
                } else {
                    return;
                }

                setOrders(response.data);
                setFilteredOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [type]);

    const handleSearchByDate = (e) => {
        e.preventDefault();
        const filtered = orders.filter(order =>
            order.orderDate.startsWith(searchDate)
        );
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleSearchBetweenDates = (e) => {
        e.preventDefault();
        const filtered = orders.filter(order => {
            const orderDate = new Date(order.orderDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return orderDate >= start && orderDate <= end;
        });
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page on search
    };

    // Calculate current orders based on currentPage and itemsPerPage
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    // Pagination handler
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <div className='container'>
                {/* Search order list */}
                <section className='row'>
                    {/* Search by day */}
                    <div className='col-3'>
                        <form onSubmit={handleSearchByDate}>
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
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                    {/* Search between day */}
                    <div className='col-3'>
                        <form onSubmit={handleSearchBetweenDates}>
                            <div className='mt-3'>
                                <label className='form-label'>From:</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <label className='form-label'>To:</label>
                                <input
                                    type="date"
                                    className='form-control'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn border' style={{ backgroundColor: '#e94f37', color: '#fff' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Table */}
                <section className='row mt-5'>
                    <h6 style={{ textAlign: 'center' }}>List orders</h6>
                    <h6><strong>Total orders: </strong>{filteredOrders.length} order</h6>
                    <table className='table table-bordered col-12'>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Order ID</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Name</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Email</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Order date</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Delivery date</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Phone</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Total Price</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Total Items</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Payment method</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Status</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Shipping method</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Payment status</th>
                                <th style={{ textAlign: 'center' }} scope='col'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='table-group-divider'>
                            {currentOrders.map((order, index) => (
                                <tr key={order.oderId}>
                                    <td style={{ textAlign: 'center' }}>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                    <td style={{ textAlign: 'center' }}>{order.oderId}</td>
                                    <td style={{ textAlign: 'center' }}>{order.name}</td>
                                    <td style={{ textAlign: 'center' }}>{order.email}</td>
                                    <td style={{ textAlign: 'center' }}>{order.orderDate}</td>
                                    <td style={{ textAlign: 'center' }}>{order.deliveryDate}</td>
                                    <td style={{ textAlign: 'center' }}>{order.phone}</td>
                                    <td style={{ textAlign: 'center' }}>{order.totalPrice}</td>
                                    <td style={{ textAlign: 'center' }}>{order.totalItems}</td>
                                    <td style={{ textAlign: 'center' }}>{order.paymentMethod}</td>
                                    <td style={{ textAlign: 'center' }}>{order.status}</td>
                                    <td style={{ textAlign: 'center' }}>{order.shippingMethod}</td>
                                    <td style={{ textAlign: 'center' }}>{order.paymentStatus}</td>
                                    <td>
                                        <Link to={`/ecomadmin/order/detail/${order.oderId}`}>View</Link>
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
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(i + 1)}>
                                            {i + 1}
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
                </section>
            </div>
        </div>
    );
};

export default StatisticalOrder;
