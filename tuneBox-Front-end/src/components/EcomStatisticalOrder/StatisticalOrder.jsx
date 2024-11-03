import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let response;

                // Adjusting the type comparison to match the paths correctly
                if (type === 'statistical-order-unpaid') {
                    response = await getOrdersByUnpaid();
                } else if (type === 'statistical-order-paid') {
                    response = await getOrdersByPaid();
                } else if (type === 'statistical-order-confirmed') {
                    response = await getOrdersByConfirmed();
                } else if (type === 'statistical-order-delivered') {
                    response = await getOrdersByDelivered();
                } else if (type === 'statistical-order-delivering') {
                    response = await getOrdersByDelivering();
                } else if (type === 'statistical-order-canceled') {
                    response = await getOrdersByCanceled();
                } else if (type === 'statistical-order-cod') {
                    response = await getOrdersByCOD();
                } else if (type === 'statistical-order-vnpay') {
                    response = await getOrdersByVNPAY();
                } else if (type === 'statistical-order-normal') {
                    response = await getOrdersByNormal();
                } else if (type === 'statistical-order-fast') {
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
                <section className='col-12 mt-5'>
                    <h6 style={{ textAlign: 'center' }}>List orders</h6>
                    <table className='table border'>
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
                        <tbody>
                            {filteredOrders.map((order, index) => (
                                <tr key={order.id}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td style={{ textAlign: 'center' }}>{order.orderId}</td>
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
                                    <td style={{ textAlign: 'center' }}>
                                        <button className='btn btn-danger'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

export default StatisticalOrder;
