import React, { useState, useEffect, useCallback } from "react";
import { Line, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { LoadAllUser } from "../../../service/SocialMediaAdminService";
function StaticUser() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [onDay, setOnDate] = useState();
  const [startWeek, setStartWeek] = useState();
  const [endWeek, setEndWeek] = useState();
  const [WeekC1, setWeekC1] = useState();
  const [WeekC2, setWeekC2] = useState();
  const [onWeek, setOnWeek] = useState();
  const [startMonth, setStartMonth] = useState();
  const [endMonth, setEndMonth] = useState();
  const [onMonth, setOnMonth] = useState();
  const [user, setUser] = useState();
  const [userChart, setUserChart] = useState();
  const [user2, setUser2] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  const [form, setForm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [chartType, setChartType] = useState("line");
  const [Typlabel, setTyplabel] = useState("");
  const [dataOnday, setDataOnday] = useState("");
  const [timeType, setTimeType] = useState("day");
  const [chartData, setChartData] = useState(null);
  const rowsPerPage = 7;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Updated userChart:", userChart);
  }, [userChart]);

  const handleTimeTypeChange = (e) => {
    setTimeType(e.target.value);
    setDateLabels([]);
  };

  const parseWeek = (weekStr, getLastDay = false) => {
    const [year, week] = weekStr.split("-W").map(Number);
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset =
      (week - 1) * 7 -
      firstDayOfYear.getDay() +
      (firstDayOfYear.getDay() <= 1 ? 1 : -6);
    const firstDayOfWeek = new Date(
      year,
      0,
      firstDayOfYear.getDate() + daysOffset + 1
    );

    if (getLastDay) {
      firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    }
    return firstDayOfWeek;
  };

  const getDaysOfWeek = (weekStr) => {
    const firstDay = parseWeek(weekStr); // Lấy ngày đầu tiên của tuần
    const days = [];
  
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(firstDay);
      currentDay.setDate(firstDay.getDate() + i);
      days.push(currentDay.toISOString().split('T')[0]); // Định dạng yyyy-MM-dd
    }
  
    return days;
  };



  const getDatesInRange = useCallback(
    (start, endIn) => {
      const dateArray = [];
      const parseMonth = (monthStr) => {
        const [year, month] = monthStr.split("-").map(Number);
        return new Date(year, month - 1, 1); // month - 1 vì tháng trong JavaScript bắt đầu từ 0
      };

      // Kiểm tra nếu kiểu thời gian là 'day', 'week', hoặc 'month'
      switch (timeType) {
        case "day":
          let currentDate = new Date(start);
          const endDate = new Date(endIn);
          endDate.setDate(endDate.getDate() + 1); // Bao gồm ngày cuối
          while (currentDate < endDate) {
            dateArray.push(currentDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
          }
          break;

        case "week":
          let currentWeekDate = parseWeek(start);
          const endWeekDate = parseWeek(endIn, true);
          while (currentWeekDate <= endWeekDate) {
            dateArray.push(currentWeekDate.toISOString().split("T")[0]); // Đưa ra định dạng YYYY-MM-DD
            currentWeekDate.setDate(currentWeekDate.getDate() + 1);
          }
          break;

        case "month":
          // Xử lý cho loại tháng (month)
          let currentMonthDate = parseMonth(start);
          const endMonthDate = parseMonth(endIn);

          // Lặp qua từng tháng, lấy tất cả các ngày trong từng tháng
          while (currentMonthDate <= endMonthDate) {
            const monthEndDate = new Date(
              currentMonthDate.getFullYear(),
              currentMonthDate.getMonth() + 1,
              0
            );
            while (
              currentMonthDate <= monthEndDate &&
              currentMonthDate <= endMonthDate
            ) {
              dateArray.push(currentMonthDate.toISOString().split("T")[0]);
              currentMonthDate.setDate(currentMonthDate.getDate() + 1);
            }
          }
          break;

        default:
          console.error("Invalid timeType provided.");
      }

      return dateArray;
    },
    [timeType]
  );

  function getWeeksInRange(from, to) {
    // Phân tích chuỗi để lấy năm và tuần bắt đầu/kết thúc
    const [startYear, startWeek] = from.split("-W").map(Number);
    const [endYear, endWeek] = to.split("-W").map(Number);

    const weeks = [];
    let currentYear = startYear;
    let currentWeek = startWeek;

    while (
      currentYear < endYear ||
      (currentYear === endYear && currentWeek <= endWeek)
    ) {
      weeks.push(`${currentYear}-W${String(currentWeek).padStart(2, "0")}`);

      // Tăng tuần lên 1 và kiểm tra xem có cần chuyển sang năm tiếp theo
      currentWeek++;
      if (currentWeek > 52) {
        // Giả định rằng có 52 tuần trong một năm
        currentWeek = 1;
        currentYear++;
      }
    }

    return weeks;
  }

  const fetchUsers = async () => {
    try {
      const response = await LoadAllUser();
      setUser(response.data);
      setFilteredUsers(response.data);
      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
      console.log(response);
      if (response.status) {
        console.log("Calling handlTodayUser with data:", response.data);
        handlTodayUser(response.data);
      }
    } catch (error) {
      setTimeType("day");
      console.error("Failed to fetch users:", error);
    }
  };
  //check khi doi ngay
  const handleDayChange = (from, to) => {
    setStartDate(from);
    setEndDate(to);
    console.log("from:", from, "To", to);
    const datesInRange = getDatesInRange(from, to);
    setDateLabels(datesInRange);
    setChartType("line");
    filterUsers(datesInRange);
    fillOnChart(datesInRange);
  };

  //check khi chon tuan
  const handleWeekChange = (from, to) => {
    setStartWeek(from);
    setEndWeek(to);
    console.log("from:", from, "To", to);
    const datesInRange = getDatesInRange(from, to);
    const weekInRange = getWeeksInRange(from, to);
    console.log(datesInRange);
    console.log(weekInRange);
    setChartType("line");
    filterUsers(datesInRange);
    fillOnChart(weekInRange);
  };
  const handleCompareWeekChange = (w1, w2) => {
    console.log("w1:", w1, "w2:", w2);
  if (w1 !== WeekC1) setWeekC1(w1);
  if (w2 !== WeekC2) setWeekC2(w2);
  };

  useEffect(() => {
    // Chuyển đổi tuần sang danh sách ngày khi WeekC1 và WeekC2 thay đổi
    const daysOfWeekC1 = WeekC1 ? getDaysOfWeek(WeekC1) : [];
    const daysOfWeekC2 = WeekC2 ? getDaysOfWeek(WeekC2) : [];
    console.warn("Days of WeekC1:", daysOfWeekC1);
    console.warn("Days of WeekC2:", daysOfWeekC2);
    
    const data1 = fillOnChartCompareWithWeek(daysOfWeekC1);
    const data2 = fillOnChartCompareWithWeek(daysOfWeekC2);
    console.warn("Data1 for chart:", data1);
    console.warn("Data2 for chart:", data2);
    if (!data1 || !data2) {
      console.error("Data is null or undefined");
      return;
    }
  
    if (data1.length !== 7 || data2.length !== 7) {
      console.error("Data length mismatch. Ensure both datasets have 7 values.");
      return;
    }
    const newChartData = createChartCompareData(WeekC1, data1, WeekC2, data2);
  setChartData(newChartData);
  }, [WeekC1, WeekC2]);
  const fillOnChartCompareWithWeek = (datesInRange) => {
    if (user) {
      const userCountByDate = datesInRange.reduce((acc, date) => {
        const count = user.filter((u) => u.createDate === date).length;
        acc[date] = count;
        console.warn(acc); 
        return acc;
      }, {});
      return Object.values(userCountByDate); 
    }
    return []; 
  };
  
  //check khi chon thang
  const handleMonthChange = (from, to) => {
    setStartMonth(from);
    setEndMonth(to);
    console.log("from:", from, "To", to);
    const datesInRange = getDatesInRange(from, to);
    console.log(datesInRange);
  };

  const handlTodayUser = (data) => {
    if (!data) return;
    const today = new Date().toISOString().split("T")[0];
    console.warn("data", data);
    console.warn("today", today);
    const filtered = data.filter(
      (data) => data.createDate.split("T")[0] === today
    );
    console.warn(filtered);
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
    //chart
    setChartType("bar");
    filterUsers(today, today);
    fillOnChart([today]);
  };

  //onday
  const handleOnday = (Day) => {
    event.preventDefault();
    const filtered = user.filter((user) => user.createDate === Day);
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
    //chart
    setChartType("bar");
    setTimeType("day");
    filterUsers(Day, Day);
    fillOnChart([Day]);
  };

  const handleMostFollowed = async () => {
    setChartType("bar");

    const filtered = user.sort((a, b) => b.followerCount - a.followerCount);
    console.log("User:", user);
    console.log("Sorted:", filtered);
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / rowsPerPage));
    fillOnChartWithMostFollowed(filtered);
  };

  const fillOnChartWithMostFollowed = (sortedUsers) => {
    const userCountByName = sortedUsers.slice(0, 10).reduce((acc, user) => {
      acc[user.userName] = user.followerCount;
      return acc;
    }, {});
    setUserChart(userCountByName);
  };

  //table
  const filterUsers = async (datesInRange) => {
    let filtered = user;
    console.log(filtered);
    if (datesInRange && datesInRange.length > 0 && filtered) {
      filtered = filtered.filter((user) =>
        datesInRange.includes(user.createDate)
      );
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / rowsPerPage));
    }
    // Recalculate total pages after filtering
  };

  const fillOnChart = (datesInRange) => {
    //lay ngay trong tuan
    const parseWeek = (weekStr, getLastDay = false) => {
      const [year, week] = weekStr.split("-W").map(Number);
      const firstDayOfYear = new Date(year, 0, 1);
      const daysOffset =
        (week - 1) * 7 -
        firstDayOfYear.getDay() +
        (firstDayOfYear.getDay() <= 1 ? 1 : -6);
      const firstDayOfWeek = new Date(
        year,
        0,
        firstDayOfYear.getDate() + daysOffset + 1
      );

      if (getLastDay) {
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      }
      return firstDayOfWeek;
    };

    if (user) {
      switch (timeType) {
        case "day":
          const userCountByDate = datesInRange.reduce((acc, date) => {
            const count = user.filter((u) => u.createDate === date).length;
            acc[date] = count;
            return acc;
          }, {});
          setUserChart(userCountByDate);
          console.warn(userChart);
          break;
        case "week":
          const userCountByWeek = datesInRange.reduce((acc, week) => {
            const startOfWeek = parseWeek(week); // Ngày đầu tuần
            const endOfWeek = parseWeek(week, true); // Ngày cuối tuần

            // Đếm số lượng user có createDate nằm trong tuần này
            const count = user.filter((u) => {
              const createDate = new Date(u.createDate); // Giả sử createDate là chuỗi ngày
              return createDate >= startOfWeek && createDate <= endOfWeek;
            }).length;

            acc[week] = count;
            return acc;
          }, {});

          setUserChart(userCountByWeek);
          break;
        case "month":
          break;
      }
    }
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
    // Nếu userChart không có dữ liệu, sử dụng giá trị mặc định
    const labels =
      Object.keys(userChart || {}).length > 0
        ? Object.keys(userChart)
        : ["No Data"];
    const data =
      Object.values(userChart || {}).length > 0
        ? Object.values(userChart)
        : [0];

    return {
      labels: labels, // Nhãn (labels) sẽ là "No Data" nếu không có dữ liệu
      datasets: [
        {
          label: "User",
          data: data, // Dữ liệu (data) sẽ là [0] nếu không có dữ liệu
          borderColor: "rgba(75, 192, 192, 1)", // Màu viền
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền
          fill: true, // Có nền hay không
        },
      ],
    };
  };
  const createChartCompareData = (DataName1,data1,DataName2,data2) => {
   
    const labels =["day 1","day 2","day 3","day 4","day 5","day 6","day 7",]
    return {
      labels: labels, 
      datasets: [
        {
          label: DataName1,
          data: data1, 
          borderColor: "rgba(75, 192, 192, 1)", // Màu viền
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền
          fill: true, // Có nền hay không
        },
        {
          label: DataName2,
          data: data2,
          borderColor: "rgba(206, 22, 219, 1)", // Màu viền
          backgroundColor: "rgba(206, 22, 219, 0.2)", // Màu nền
          fill: true, // Có nền hay không
        },
      ],
    };
  };

  return (
    <div>
      <div className="container-fluid">
        {/*chose time type */}
        <div className="row">
          <div className="col-4">
            <div className="mt-3">
              <label className="form-label">Chọn loại thời gian</label>
              <select className="form-control" onChange={handleTimeTypeChange}>
                <option value="day">Day</option>
                <option value="week">Week</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-4">
            {/* chose day */}
            {timeType === "day" && (
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
            )}

            {/* chose Week */}
            {timeType === "week" && (
              <form>
                <div className="mt-3">
                  <label className="form-label">Chose week</label>
                  <div className="d-flex">
                    <input
                      type="week"
                      className="form-control"
                      placeholder="From"
                      value={startWeek}
                      onChange={(e) =>
                        handleWeekChange(e.target.value, endWeek)
                      }
                    />
                    -
                    <input
                      type="week"
                      className="form-control"
                      placeholder="To"
                      value={endWeek}
                      onChange={(e) =>
                        handleWeekChange(startWeek, e.target.value)
                      }
                    />
                  </div>
                </div>
              </form>
            )}

            {/* chose Month */}
            {/* {timeType === "month" && (
              <form>
                <div className="mt-3">
                  <label className="form-label">Chose month</label>
                  <div className="d-flex">
                    <input
                      type="month"
                      className="form-control"
                      placeholder="From"
                      value={startMonth}
                      onChange={(e) =>
                        handleMonthChange(e.target.value, endMonth)
                      }
                    />
                    -
                    <input
                      type="month"
                      className="form-control"
                      placeholder="To"
                      value={endMonth}
                      onChange={(e) =>
                        handleMonthChange(startMonth, e.target.value)
                      }
                    />
                  </div>
                </div>
              </form>
            )} */}
          </div>
          <div className="col-3">
            <div className="mt-3">
              <label className="form-label">New User on</label>
              <div className="d-flex">
                <input
                  type="date"
                  className="form-control m-2"
                  value={onDay}
                  onChange={(e) => handleOnday(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handlTodayUser(user)}
                >
                  Today
                </button>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="mt-3">
              <label className="form-label">Statical with</label>
              <div className="d-flex">
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleMostFollowed(e)}
                >
                  Top 5 Followed user
                </button>
              </div>
            </div>
          </div>
        </div>

        {chartType === "line" ? (
          <Line className="mt-5" data={createChartData()} />
        ) : (
          <Bar className="mt-5" data={createChartData()} />
        )}
      </div>

      {/* Table */}
      <div className="row mt-5">
        <div className="col-12">
          <h6 className="text-center mb-5">Table OF User</h6>
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
                  Following
                </th>
                <th style={{ textAlign: "center" }} scope="col">
                  Follower
                </th>
                <th style={{ textAlign: "center" }} scope="col">
                  Comment
                </th>
                <th style={{ textAlign: "center" }} scope="col">
                  Tracks
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
              {paginateUsers ? (
                paginateUsers().map((user, index) => (
                  <tr key={user.id}>
                    <th style={{ textAlign: "center" }} scope="row">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </th>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.followingCount}</td>
                    <td>{user.followerCount}</td>
                    <td>{user.commentCount}</td>
                    <td>{user.tracks.length}</td>
                    <td>{user.createDate}</td>
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


      <div className="row">
          {/* compare start */}
          <div className="col-4">
            {/* chose day */}
            {timeType === "day" && (
              <div className="mt-3">
                <label className="form-label">Compare Day</label>
                <div className="d-flex">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="From"
                    value={startDate}
                    onChange={(e) => handleDayChange(e.target.value, endDate)}
                  />
                </div>
              </div>
            )}

            {/* chose Week */}
            {timeType === "week" && (
              <form>
                <div className="mt-3">
                  <label className="form-label">Compare week</label>
                  <div className="d-flex">
                    <input
                      type="week"
                      className="form-control"
                      placeholder="To"
                      value={WeekC1}
                      onChange={(e) =>
                        handleCompareWeekChange( e.target.value,WeekC2)
                      }
                    />
                  </div>
                </div>
              </form>
            )}

            {/* chose Month */}
            {/* {timeType === "month" && (
              <form>
                <div className="mt-3">
                  <label className="form-label">Chose month</label>
                  <div className="d-flex">
                    <input
                      type="month"
                      className="form-control"
                      placeholder="From"
                      value={startMonth}
                      onChange={(e) =>
                        handleMonthChange(e.target.value, endMonth)
                      }
                    />
                    -
                    <input
                      type="month"
                      className="form-control"
                      placeholder="To"
                      value={endMonth}
                      onChange={(e) =>
                        handleMonthChange(startMonth, e.target.value)
                      }
                    />
                  </div>
                </div>
              </form>
            )} */}
          </div>


          <div className="col-4">
            {/* chose day */}
            {timeType === "day" && (
              <div className="mt-3">
                <label className="form-label">With Day</label>
                <div className="d-flex">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="From"
                    value={startDate}
                    onChange={(e) => handleDayChange(e.target.value, endDate)}
                  />
                </div>
              </div>
            )}

            {/* chose Week */}
            {timeType === "week" && (
              <form>
                <div className="mt-3">
                  <label className="form-label">With week</label>
                  <div className="d-flex">
                    <input
                      type="week"
                      className="form-control"
                      placeholder="From"
                      value={WeekC2}
                      onChange={(e) =>
                        handleCompareWeekChange(WeekC1,e.target.value)
                      }
                    />
                  </div>
                </div>
              </form>
            )}

            {/* chose Month */}
            {/* {timeType === "month" && (
              <form>
                <div className="mt-3">
                  <label className="form-label">Chose month</label>
                  <div className="d-flex">
                    <input
                      type="month"
                      className="form-control"
                      placeholder="From"
                      value={startMonth}
                      onChange={(e) =>
                        handleMonthChange(e.target.value, endMonth)
                      }
                    />
                    -
                    <input
                      type="month"
                      className="form-control"
                      placeholder="To"
                      value={endMonth}
                      onChange={(e) =>
                        handleMonthChange(startMonth, e.target.value)
                      }
                    />
                  </div>
                </div>
              </form>
            )} */}
          </div>
        </div>
        <div className="mt-5">
      {chartData ? <Line data={chartData} /> : <p>Loading...</p>}
    </div>
    </div>
  );
}

export default StaticUser;
