import React, { useEffect, useState } from 'react';
import { getUserSellTheMost, getTop1UserSellTheMost } from '../../service/EcommerceStatistical';
import { Bar, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas-pro';
import { images } from '../../assets/images/images';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);

const UserSellTheMost = () => {
  const [userSellList, setUserSellList] = useState([]);
  const [topUserSell, setTopUserSell] = useState(null);

  useEffect(() => {
    // Fetch the list of users who sold the most
    getUserSellTheMost().then((response) => {
      setUserSellList(response.data);
    });

    // Fetch the top user who sold the most
    getTop1UserSellTheMost().then((response) => {
      setTopUserSell(response.data);
    }).catch(error => {
      console.error("Error fetching top user revenue:", error);
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
  const exportToExcel = () => {
    // Chuẩn bị dữ liệu
    const data = userSellList.map((user, index) => ({
      "#": index + 1,
      Name: user.name,
      Username: user.userName,
      Email: user.email,
      "Phone Number": user.phoneNumber,
      Location: user.location,
      "Total Order": user.totalOrder,
      "Total Revenue (VND)": user.sumTotalPrice.toLocaleString("vi"),
    }));

    // Tạo worksheet và workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Revenue");

    // Xuất file
    XLSX.writeFile(workbook, "user_sell_the_most.xlsx");
  };
  const exportToPDF = () => {
    const element = document.querySelector(".container");
    html2canvas(element, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // Chiều rộng PDF (A4)
      const pageHeight = 297; // Chiều cao PDF (A4)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Thêm logo vào PDF (đảm bảo logo được lưu trữ đúng vị trí)

      const logoUrl = "https://res.cloudinary.com/dslm1fjny/image/upload/v1733227547/ieedwbbhyekmka2heusc.png";
      const logo = new Image();
      logo.src = logoUrl;
      logo.onload = () => {
        // Thêm logo vào PDF
        pdf.addImage(logo, "PNG", 10, 10, 50, 30); // Vị trí và kích thước của logo (x, y, width, height)

        // Thêm nội dung từ canvas vào PDF
        pdf.addImage(imgData, "PNG", 0, 30, imgWidth, imgHeight); // Thay đổi vị trí y để tránh chồng lên logo
        heightLeft -= pageHeight;

        // Nếu nội dung dài hơn 1 trang
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(logo, "PNG", 10, 10, 50, 30); // Thêm logo vào các trang tiếp theo
          pdf.addImage(imgData, "PNG", 0, 30, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Lưu PDF
        pdf.save("user_sell_the_most.pdf");
      };
    });
  };

  return (
    <div>
      <div className='container'>
        <div className='row text-center'>
          <h6>Statistics on the list of users who have purchased the most to date</h6>
        </div>
        {/* Bảng người dùng bán nhiều nhất */}
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
            <Bar data={chartData} />
          </div>
        </section>

        {/* Doanh thu của người dùng cao nhất */}
        {topUserSell && (
          <section className='row mt-5'>
            <h4>Top 1 Revenue user: {topUserSell.name}</h4>
            <h6>Total order: {topUserSell.totalOrder} order</h6>
            <h6>Total Revenue: {(topUserSell.sumTotalPrice).toLocaleString('vi')} VND</h6>
          </section>
        )}
        <div >
          <button className="btn btn-success my-3" onClick={exportToExcel}>
            Export to Excel
          </button>
          &nbsp;
          <button className="btn btn-danger my-3" onClick={exportToPDF}>
            Export to PDF
          </button>
        </div>

      </div>

    </div>
  );
};

export default UserSellTheMost;
