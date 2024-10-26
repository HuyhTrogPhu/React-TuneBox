import React, { useEffect, useState } from 'react';
import { getUserNotSell } from '../../service/EcommerceStatistical';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các phần tử của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserNotSell = () => {
  const [userSellList, setUserSellList] = useState([]);

  useEffect(() => {
    // Fetch the list of users not sell
    getUserNotSell().then((response) => {
      setUserSellList(response.data);
    });
  }, []);

  // Chuẩn bị dữ liệu cho biểu đồ cột
  const chartData = {
    labels: userSellList.map((user) => user.name),
    datasets: [
      {
        label: 'Total Revenue',
        data: userSellList.map((user) => user.sumTotalPrice),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className='container'>
        <div className='row text-center'>
          <h6>Statistical revenue user</h6>
        </div>
        {/* Bảng người dùng chưa mua hàng */}
        <section className='row mt-5'>
          <table className='table border'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Username</th>
                <th style={{ textAlign: 'center' }} scope='col'>Email</th>
                <th style={{ textAlign: 'center' }} scope='col'>Phone Number</th>
                <th style={{ textAlign: 'center' }} scope='col'>Location</th>
                <th style={{ textAlign: 'center' }} scope='col'>Total Order</th>
                <th style={{ textAlign: 'center' }} scope='col'>Total Revenue</th>
                <th style={{ textAlign: 'center' }} scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {userSellList.length > 0 ? (
                userSellList.map((user, index) => (
                  <tr key={user.userId}>
                    <th scope='row'>{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.location}</td>
                    <td>{user.totalOrder} order</td>
                    <td>{(user.sumTotalPrice).toLocaleString('vi')} VND</td>
                    <Link className='btn btn-outline-primary' style={{ color: '#000' }} to={`/ecomadmin/Customer/detail/${user.userId}`}>View</Link>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='8' className='text-center'>
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Biểu đồ cột */}
        <section className='row mt-5'>
          <div className='col-12'>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserNotSell;
