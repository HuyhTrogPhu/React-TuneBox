import React, { useState, useEffect, useCallback } from "react";
import { Line, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import {
  LoadPLayList
} from "../../../service/SocialMediaAdminService";
function StaticPlayList() {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [onDay, setOnDate] = useState();
    const [user, setUser] = useState();
    const [userChart, setUserChart] = useState();
    const [user2, setUser2] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [dateLabels, setDateLabels] = useState([]);
    const [form, setForm] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [chartType, setChartType] = useState("");
    const [Typlabel, setTyplabel] = useState("");
    const [dataOnday, setDataOnday] = useState("");
    const rowsPerPage = 7;
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const getDatesInRange = useCallback((startDate, endDate) => {
      const dateArray = [];
      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Đảm bảo bao gồm cả ngày cuối cùng
      while (currentDate < end) {
        dateArray.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dateArray;
    }, []);
    const fetchUsers = async () => {
      try {
        const response = await LoadPLayList();
        setUser(response.data);
        setFilteredUsers(response.data);
        setTotalPages(Math.ceil(response.data.length / rowsPerPage));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    //check khi doi ngay
    const handleDayChange = (from, to) => {
      setStartDate(from);
      setEndDate(to);
      const datesInRange = getDatesInRange(from, to);
      setDateLabels(datesInRange);
      setChartType("line");
      filterUsers(from, to);
      fillOnChart(datesInRange);
    };
    const handlTodayUser = (from, to) => {
      event.preventDefault();
      const today = new Date().toISOString().split("T")[0];
      const filtered = user.filter((user) => user.createDate === today);
     
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage));
      //chart
      setChartType("bar");
      filterUsers([today]);
      fillOnChart([today]);
    };
    const handleOnday = (Day) => {
      event.preventDefault();
  
      const filtered = user.filter((user) => user.createDate === Day);
      
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage));
      //chart
      setChartType("bar");
      filterUsers(Day,Day);
      fillOnChart([Day]);
    };
    const handleMostFollowed = async (from, to) => {
      setChartType("bar");
      const datesInRange = getDatesInRange(from, to);
      const filtered = user.sort((a, b) => b.followerCount - a.followerCount);
  
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage));
      fillOnChartWithMostFollowed(datesInRange,filtered);
    };
    //table
    const filterUsers = async (fromDate, toDate) => {
      let filtered = user;
      if (fromDate && toDate) {
        filtered = filtered.filter(
          (user) => user.createDate >= fromDate && user.createDate <= toDate
        );
      }
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage)); // Recalculate total pages after filtering
    };
  
    const fillOnChartWithMostFollowed = (datesInRange, sortedUsers) => {
      // Tạo một đối tượng để chứa số lượng người dùng theo từng ngày trong datesInRange
      const userCountByDate = datesInRange.reduce((acc, date) => {
        // Đếm số người dùng có trong mỗi ngày
        const count = sortedUsers.filter((u) => {
          // Kiểm tra xem ngày đăng ký của người dùng có khớp với ngày trong `datesInRange`
          const userDate = new Date(u.createDate).toISOString().split("T")[0];
          return userDate === date;
        }).length;
        acc[date] = count;
        return acc;
      }, {});
    
      // Cập nhật dữ liệu vào userChart để vẽ biểu đồ
      setUserChart(userCountByDate);
    
      // Tạo dữ liệu cho biểu đồ
      const chartData = createChartData();
    
      // Sau khi có dữ liệu chartData, bạn có thể vẽ biểu đồ hoặc xử lý tiếp ở đây.
      // Ví dụ: setChartData(chartData);
    };
    
    
  
  
    const fillOnChart = (datesInRange) => {
      const userCountByDate = datesInRange.reduce((acc, date) => {
        const count = user.filter((u) => u.createDate === date).length;
        acc[date] = count;
        return acc;
      }, {});
      setUserChart(userCountByDate);
    };
  
    const paginate = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };
    const paginateUsers = () => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return filteredUsers.slice(startIndex, endIndex);
    };
  
    const createChartData = () => {
      if (!userChart) return { labels: [], datasets: [] };
      const labels = Object.keys(userChart);
      const data = Object.values(userChart);
      return {
        labels: labels,
        datasets: [
          {
            label: "User Registrations",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
        ],
      };
    };
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <form>
                <div className="mt-3">
                  <label className="form-label">Chose Day</label>
                  <div className="d-flex">
                    <input
                      type="date"
                      className="form-control"
                      placeholder="From"
                      value={startDate}
                      onChange={(e) => handleDayChange(e.target.value, endDate)}
                    />
                    -
                    <input
                      type="date"
                      className="form-control"
                      placeholder="To"
                      value={endDate}
                      onChange={(e) => handleDayChange(startDate, e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="col-3">
              <form>
              <div className="mt-3">
                <label className="form-label">New Album on</label>
                <div className="d-flex">
                  <input
                    type="date"
                    className="form-control m-2"
                    value={onDay}
                    onChange={(e) => handleOnday(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={(e) => handlTodayUser(e)}
                  >
                    Today
                  </button>
                </div>
              </div>
                </form>
           
                </div>
                <div className="col-3">
                </div>
              
          </div>
  
          {chartType === "line" ? (
            <Line className="mt-5" data={createChartData()} />
          ) : (
            <Bar
              className="mt-5"
              data={createChartData(Typlabel, dataOnday, form)}
            />
          )}
        </div>
  
        {/* Table */}
        <div className="row mt-5">
          <div className="col-12">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }} scope="col">
                    #
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                  title
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                  creator
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                  tracks
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                  createDate
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                  description
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginateUsers ? (
                  paginateUsers().map((user, index) => (
                    <tr key={user.id}>
                      <th style={{ textAlign: "center" }} scope="row">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </th>
                      <td>{user.title}</td>
                      <td>{user.creator}</td>
                      <td>{user.tracks.length}</td>
                      <td>{user.createDate}</td>
                      <td>{user.description}</td>
                      <td>
                        <Link
                          className="btn btn-primary"
                          style={{ color: "#000" }}
                          to={`/socialadmin/PlaylistDetail/${user.id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <h1>No Data</h1>
                )}
              </tbody>
            </table>
  
            {/* Pagination */}
            <div className="">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center text-center">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">«</span>
                    </button>
                  </li>
                  {[...Array(totalPages).keys()].map((number) => (
                    <li
                      key={number + 1}
                      className={`page-item ${
                        currentPage === number + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        onClick={() => paginate(number + 1)}
                        className="page-link"
                      >
                        {number + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">»</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default StaticPlayList
