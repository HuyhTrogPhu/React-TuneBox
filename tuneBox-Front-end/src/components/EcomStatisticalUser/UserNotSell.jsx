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
          <table className='table table-bordered'>
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
            <tbody className='table-group-divider'>
              {userSellList.length > 0 ? (
                userSellList.map((user, index) => (
                  <tr key={user.userId}>
                    <th style={{ textAlign: 'center' }} scope='row'>{index + 1}</th>
                    <td style={{ textAlign: 'center' }}>{user.name}</td>
                    <td style={{ textAlign: 'center' }}>{user.userName}</td>
                    <td style={{ textAlign: 'center' }}>{user.email}</td>
                    <td style={{ textAlign: 'center' }}>{user.phoneNumber}</td>
                    <td style={{ textAlign: 'center' }}>{user.location}</td>
                    <td style={{ textAlign: 'center' }}>{user.totalOrder} order</td>
                    <td style={{ textAlign: 'center' }}>{(user.sumTotalPrice).toLocaleString('vi')} VND</td>
                    <td style={{ textAlign: 'center' }}>
                      <Link className='btn' style={{ color: '#000' }} to={`/ecomadmin/Customer/detail/${user.userId}`}>View</Link>
                    </td>
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
