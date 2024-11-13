import React, { useState, useEffect, useCallback } from "react";
import { Line, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import {
  LoadTrack
} from "../../../service/SocialMediaAdminService";
function StaticTrack() {
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
        const response = await LoadTrack();
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
      const filtered = user.filter((user) => user.createDate.split("T")[0] === today);
     
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage));
      //chart
      setChartType("bar");
      filterUsers([today]);
      fillOnChart([today]);
    };
    const handleOnday = (Day) => {
      event.preventDefault();
  
      const filtered = user.filter((user) => user.createDate.split("T")[0] === Day);
      
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage));
      //chart
      setChartType("bar");
      filterUsers(Day,Day);
      fillOnChart([Day]);
    };

    const handleMostFollowed = async () => {
      setChartType("bar");
  
      const filtered = user.sort((a, b) => b.likes - a.likes);
      console.log("User:",user);
      console.log("Sorted:",filtered);
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage));
      fillOnChartWithMostFollowed(filtered);
    };
  
  const fillOnChartWithMostFollowed = (sortedUsers) => {
    const userCountByName = sortedUsers.slice(0, 10).reduce((acc, user) => {
      acc[user.name] = user.likes;
      return acc;
    }, {});
    setUserChart(userCountByName);
  };
    //table
    const filterUsers = async (fromDate, toDate) => {
      let filtered = user;
      if (fromDate && toDate) {
        filtered = filtered.filter(
          (user) => user.createDate.split("T")[0] >= fromDate && user.createDate.split("T")[0] <= toDate
        );
      }
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage)); // Recalculate total pages after filtering
    };

    const fillOnChart = (datesInRange) => {
      const userCountByDate = datesInRange.reduce((acc, date) => {
        const count = user.filter((u) => u.createDate.split("T")[0] === date).length;
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
                <label className="form-label">New Track on</label>
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
            <div className="mt-3">
              <label className="form-label">Statical with</label>
              <div className="d-flex">
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleMostFollowed(e)}
                >
                  Most Like
                </button>
              </div>
            </div>
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
                  Genre Name
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                  Create Date
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                 Like
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
                      <td>{user.name}</td>
                      <td>{user.userName}</td>
                      <td>{user.genreName}</td>
                      <td>{user.createDate.split("T")[0]}</td>
                      <td>{user.likes.length > 0 ? user.likes : "0"}</td>
                      <td>
                        <Link
                          className="btn btn-primary"
                          style={{ color: "#000" }}
                          to={`/socialadmin/TrackDetail/${user.id}`}
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

export default StaticTrack
