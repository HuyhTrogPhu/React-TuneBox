import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  LoadTrack
} from "../../../service/SocialMediaAdminService";
const Track = () => {
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
      const response = await LoadTrack();
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
    filterUsers(Day,Day);

  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    filterUsers(e.target.value, startDate, endDate, endDate);
  };
  const handleDayChange = (from, to) => {
    setStartDate(from);
    setEndDate(to);
    filterUsers(keyword, from, to);
  };

  const handlTodayUser = (data) => {
    if (!data) return; 
    const today = new Date().toISOString().split('T')[0]; 
    console.log(today);
    const filtered = data.filter(user => user.createDate.split('T')[0] === today);
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
  };
  

  const filterUsers = async (searchKeyword, fromDate, toDate) => {
    let filtered = users;
    if (searchKeyword) {
      filtered = filtered.filter(
        (user) =>
          user.name.includes(searchKeyword)
        
      );
    }
    if (fromDate && toDate) {
      filtered = filtered.filter(user => user.createDate.split('T')[0] >= fromDate && user.createDate.split('T')[0] <= toDate);
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
    <div className="container mt-4">
      <div className="row">
        {/* New Users */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">New Track</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>createDate</th>
                    <th>Total Likes</th>
                    <th>Total Comments</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {NewUser.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.createDate}</td>
                      <td>{user.likes.length}</td>
                      <td>{user.comments.length}</td>
                      <td>{user.description}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            navigate(`/socialadmin/TrackDetail/${user.id}`)
                          }
                        >
                          Views
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Featured Users */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">All Track</h5>
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Track name"
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
          {/* Total order count filter */}
          <div className="col-3">
          <div className="mt-3">
              <label className="form-label">New Album on</label>
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

      <div className="row">
        {/* All Users */}

        {/* Report */}
        {console.log(Report)}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">Report</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Report Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Report.map((rp) => (
                    <tr key={rp.id}>
                      <td>{rp.track.name}</td>
                      <td>{rp.createDate}</td>
                      <td>{rp.status}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleShowModal(rp.id)}
                        >
                          Views
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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

export default Track;
