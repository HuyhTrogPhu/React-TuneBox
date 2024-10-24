import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEcommerceUserDetails } from '../../service/EcommerceAdminUser';
import { getOrderByUserId } from '../../service/EcommerceAdminOrder';

const UserDetail = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({});
    const [orderList, setOrderList] = useState([]);
    const [totalOrderCount, setTotalOrderCount] = useState(0);
    const [totalOrderAmount, setTotalOrderAmount] = useState(0);

    useEffect(() => {
        // Fetch chi tiết người dùng
        const fetchUserDetails = async () => {
            try {
                const response = await getEcommerceUserDetails(userId);
                setUserDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };

        // Fetch danh sách đơn hàng
        const fetchUserOrders = async () => {
            try {
                const response = await getOrderByUserId(userId);
                setOrderList(response.data);
                // Tính tổng số đơn hàng và tổng giá trị đơn hàng
                const totalOrders = response.data.length;
                const totalAmount = response.data.reduce((acc, order) => acc + order.totalPrice, 0);
                setTotalOrderCount(totalOrders);
                setTotalOrderAmount(totalAmount);
            } catch (error) {
                console.error('Failed to fetch order list:', error);
            }
        };

        fetchUserDetails();
        fetchUserOrders();
    }, [userId]);

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    {/* Thông tin chi tiết người dùng */}
                    <div className='col-4'>
                        <div className='background'>
                            <img src={userDetails.background || 'default_background.jpg'} alt="Background" style={{width: '400px', }}/>
                        </div>
                        <div className='infor'>
                            <img src={userDetails.avatar || 'default_avatar.jpg'} alt="Avatar" style={{width: '200px', }}/>
                            <h6>Name: {userDetails.name}</h6>
                            <h6>Gender: {userDetails.gender}</h6>
                            <h6>Birth day: {userDetails.birthday}</h6>
                            <h6>Username: {userDetails.userName}</h6>
                            <h6>Email: {userDetails.email}</h6>
                            <h6>Phone number: {userDetails.phoneNumber}</h6>
                            <h6>Location: {userDetails.location}</h6>
                            <h6>About: {userDetails.about}</h6>
                        </div>
                    </div>
                    {/* Lịch sử đơn hàng */}
                    <div className='col-8'>
                        <h3>Order history</h3>
                        <h6>Total order: {totalOrderCount}</h6>
                        <h6>Total order amount: {totalOrderAmount.toLocaleString('vi')} VND</h6>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Order date</th>
                                    <th scope="col">Delivery date</th>
                                    <th scope="col">Tax</th>
                                    <th scope="col">Total Price</th>
                                    <th scope="col">Total Items</th>
                                    <th scope="col">Payment method</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Shipping method</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderList.map((order, index) => (
                                    <tr key={order.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td>{order.deliveryDate|| ''}</td>
                                        <td>{order.tax} %</td>
                                        <td>{(order.totalPrice).toLocaleString('vi')} VND</td>
                                        <td>{order.totalItem}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td>{order.status}</td>
                                        <td>{order.shippingMethod}</td>
                                        <td>
                                            <button className='btn btn-primary' style={{color: '#000'}}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
