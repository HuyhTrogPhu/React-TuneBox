import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadAllUser } from "../../../service/SocialMediaAdminService";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onDay, setOnDate] = useState();
  const rowsPerPage = 7;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await LoadAllUser();
      setUsers(response.data);
      setFilteredUsers(response.data);
      console.log(users);
      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
      handlTodayUser(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  const handleOnday = (Day) => {
    event.preventDefault();
    const filtered = users.filter((user) => user.createDate === Day);
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
    filterUsers(Day, Day);
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    filterUsers(e.target.value, startDate, endDate);
  };
  const handleDayChange = (from, to) => {
    setStartDate(from);
    setEndDate(to);
  
    if (from && to) {
      filterUsers(keyword, from, to);
    }
  };

  const handlTodayUser = (data) => {
    if (!data) return;
    const today = new Date().toISOString().split("T")[0];
    console.log(today);
    const filtered = data.filter(
      (user) => user.createDate.split("T")[0] === today
    );
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  };

  const filterUsers = async (searchKeyword, fromDate, toDate) => {
    let filtered = users;
    if (searchKeyword) {
      filtered = filtered.filter((user) => user.name.includes(searchKeyword));
    }
    if (fromDate && toDate) {
      filtered = filtered.filter(
        (user) => user.createDate >= fromDate && user.createDate <= toDate
      );
    }
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage)); // Recalculate total pages after filtering
  };

  const paginateUsers = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  // Hàm xuất Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredUsers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, "customers.xlsx");
  };

  const EXCEL_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const EXCEL_EXTENSION = ".xlsx";

  return (
    <div>
      {/* Main content */}
      <div className="container-fluid">
        <div className="row">
          {/* Search by keyword */}
          <div className="col-4">
            <form action="">
              <div className="mt-3">
                <label className="form-label">Search by keyword:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by username "
                  value={keyword}
                  onChange={handleKeywordChange}
                />
              </div>
            </form>
          </div>

          {/* Total day filter */}
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
                    onChange={(e) => handleDayChange(e.target.value, startDate)}
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
          {/* Total order count filter */}
          <div className="col-3">
            <div className="mt-3">
              <label className="form-label">New User on</label>
              <input
                type="date"
                className="form-control m-2"
                value={onDay}
                onChange={(e) => handleOnday(e.target.value)}
              />
              <div className="d-flex m-2">
                <button
                  className="btn btn-primary"
                  onClick={(e) => handlTodayUser(users)}
                >
                  Today
                </button>
              </div>
            </div>
          </div>
        </div>
      
      {/* Top Statistics */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-dark text-white">
            <div className="card-body">
              <h5 className="text-light">Total Users</h5>
              <h2 className="text-light">{users.length}</h2>
               
            </div>
          </div>
        </div>
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
                    Username
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Email
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Follower
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Friend
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Tracks
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Album
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Post
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Register Day
                  </th>
                  <th style={{ textAlign: "center" }} scope="col">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginateUsers().map((user, index) => (
                  <tr key={user.id}>
                    <th style={{ textAlign: "center" }} scope="row">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </th>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>

                    <td>{user.followerCount}</td>
                    <td>{user.friendCount}</td>
                    <td>{user.tracks.length}</td>
                    <td>{user.albumcount}</td>
                    <td>{user.postCount}</td>
                    <td>{new Date(user.createDate).toLocaleDateString('vi')}</td>

                    <td>
                      <Link
                        className="btn btn-primary"
                        style={{ color: "#000" }}
                        to={`/socialadmin/detailUser/${user.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3">
              <button className="btn btn-success" onClick={exportToExcel}>
                Excel export
              </button>
            </div>

            {/* Pagination */}
            <div className="">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center text-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
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
    </div>
  );
};
export default Users;
