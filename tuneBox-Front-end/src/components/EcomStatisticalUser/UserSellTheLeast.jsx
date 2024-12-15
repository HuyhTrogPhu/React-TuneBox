import React, { useEffect, useState } from 'react';
import { getTop1UserSellTheLeast, getUserSellTheLeast } from '../../service/EcommerceStatistical';
import { Bar, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas-pro';
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

const UserSellTheLeast = () => {
  const [userSellList, setUserSellList] = useState([]);
  const [topUserSell, setTopUserSell] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page

  useEffect(() => {
    // Fetch the list of users who sold the least
    getUserSellTheLeast().then((response) => {
      setUserSellList(response.data);
    });

    // Fetch the top user who sold the least
    getTop1UserSellTheLeast().then((response) => {
      setTopUserSell(response.data);
    }).catch(error => {
      console.error("Error fetching top user revenue:", error);
    });
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(userSellList.length / itemsPerPage);

  // Slice the list for the current page
  const currentUsers = userSellList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination logic
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
      "Total Revenue (VND)": user.sumTotalPrice.toLocaleString("vi") + ' VND',
    }));

    // Tạo worksheet và workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Revenue");

    // Xuất file
    XLSX.writeFile(workbook, "sell-the-least.xlsx");
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
        pdf.save("sell-the-least.pdf");
      };
    });
  };


  return (
    <div>
      <div className='container'>
        <div className='row text-center'>
          <h6>Statistical revenue user</h6>
        </div>
        {/* Bảng người dùng bán ít nhất */}
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
                    <td>
                      <Link className='btn btn-primary' style={{ color: '#E94F37' }} to={`/ecomadmin/Customer/detail/${user.userId}`}>View</Link>
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

          {/* Panigation */}
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
        </section>

        {/* Biểu đồ cột */}
        <section className='row mt-5'>
          <div className='col-12'>
            <Bar data={chartData} />
          </div>
        </section>

        {/* Doanh thu của người dùng thấp nhất */}
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

export default UserSellTheLeast;
