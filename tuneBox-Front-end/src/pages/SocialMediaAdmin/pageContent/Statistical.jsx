import React, { useState, useEffect, useCallback } from "react";
import { Line, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  LoadUserCountBetweenDates,
  LoadUserCountBetweenMonth,
  LoadUserCountBetweenWeek,
  LoadTrackCountBetweenDates,
  LoadTrackCountBetweenDatesGenre,
  LoadTrackCountBetweenMonth,
  LoadTrackCountBetweenWeek,
  LoadAlbumCountBetweenDates,
  LoadAlbumCountBetweenMonth,
  LoadAlbumCountBetweenWeek,
  LoadPlayListCountBetweenDates,
  LoadPlayListCountBetweenMonth,
  LoadPlayListountBetweenWeek,
  LoadMostFollowed,
  LoadMostUploader,
  LoadAlbumForTable,
  LoadUserForTable,
  LoadPlayListFortable,
  LoadTrackForTable,
} from "../../../service/SocialMediaAdminService";
function Statistical() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(() => new Date());
  const [onDate, setOnDate] = useState();
  const [startWeek, setStartWeek] = useState();
  const [endWeek, setEndWeek] = useState();
  const [onWeek, setOnWeek] = useState();
  const [startMonth, setStartMonth] = useState();
  const [endMonth, setEndMonth] = useState();
  const [onMonth, setOnMonth] = useState();
  const [dateLabels, setDateLabels] = useState([]);
  const [error, setError] = useState("");
  const [registrationData, setRegistrationData] = useState([]);
  const [form, setForm] = useState("");
  const [chartType, setChartType] = useState("");
  const [genreLabels, setGenreLabels] = useState([]);
  const [trackCounts, setTrackCounts] = useState([]);
  const [tableData, setTableData] = useState({ headers: [], rows: [] });
  const [timeType, setTimeType] = useState("day");
  const [activeHandler, setActiveHandler] = useState(null);
  const [logger, setLogger] = useState("");
  const handleTimeTypeChange = (e) => {
    setTimeType(e.target.value);
    setDateLabels([]);
  };

  const getDatesInRange = useCallback((startDate, endDate, timeType) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1); // Đảm bảo bao gồm cả ngày cuối cùng
    while (currentDate < end) {
      if (timeType === "day") {
        // Thêm từng ngày
        dateArray.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (timeType === "week") {
        const year = currentDate.getFullYear();
        const week = Math.ceil(
          ((currentDate - new Date(year, 0, 1)) / (24 * 60 * 60 * 1000) +
            currentDate.getDay() +
            1) /
            7
        );
        dateArray.push(`${year}-W${week.toString().padStart(2, "0")}`);
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (timeType === "month") {
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        dateArray.push(`${year}-${month}`);
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);
      }
    }
    return dateArray;
  }, []);

  // Hàm kiểm tra hợp lệ cho ngày bắt đầu và ngày kết thúc

  const validateDates = () => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!startDate || !endDate) {
      setError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return false;
    }
    if (start > today || end > today) {
      setError("Không thể chọn ngày trong tương lai.");
      return false;
    }
    if (start > end) {
      setError("Ngày bắt đầu không thể sau ngày kết thúc.");
      return false;
    }
    setError("");
    return true;
  };

  useEffect(() => {
    if (validateDates()) {
      const dates = getDatesInRange(startDate, endDate, timeType);
      if (JSON.stringify(dates) !== JSON.stringify(dateLabels)) {
        setDateLabels(dates);
      }
    }
    console.log(startDate, endDate);
  }, [startDate, endDate, timeType, dateLabels]);

  //tạo chart
  const createChartData = (labels, data, form) => ({
    labels: labels,
    datasets: [
      {
        label: form,
        data: data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  });

  // bắt đầu gọi API, ép data
  useEffect(() => {
    const fetchData = async (startDate, endDate) => {
      try {
        let headers = [];
        let rows = [];
        switch (activeHandler) {
          case "newUser":
            headers = ["ID", "User Name", "Registration Date", "Action"];
            const dataTrack = await LoadUserForTable(startDate, endDate);
            setLogger(dataTrack);
            rows = dataTrack.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.userName}</td>
                <td>{user.createDate}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      navigate(`/socialadmin/detailUser/${user.id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ));
            break;
          case "newTrack":
            headers = ["ID", "Track Name", "createDate", "Action"];
            const data = await LoadTrackForTable(startDate, endDate);
            setLogger(data);
            rows = data.map((user, index) => (
            
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.createDate}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      navigate(`/socialadmin/TrackDetail/${user.id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ));
            break;

          case "newAlbum":
            headers = ["ID", "Album Name", "createDate", "Action"];
            const dataAlbum = await LoadAlbumForTable(startDate, endDate);
            setLogger(dataAlbum);
            rows = dataAlbum.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.title}</td>
                <td>{user.createDate}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      navigate(`/socialadmin/AlbumDetail/${user.id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ));
            break;

          case "newPlayList":
            headers = ["ID", "PlayList Name", "createDate", "Action"];
            const dataPlayList = await LoadPlayListFortable(startDate, endDate);
            setLogger(dataPlayList);
            rows = dataPlayList.map((user, index) => (
              <tr key={index}>
                <td>{user.id}</td>
                <td>{user.title}</td>
                <td>{user.createDate}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      navigate(`/socialadmin/PlaylistDetail/${user.id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ));

            break;
        } //close switch
        setTableData({ headers, rows });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (activeHandler) {
      fetchData(startDate, endDate);
    }
  }, [activeHandler, navigate]);

  //newuser
  const handleNewUser = async (event) => {
    event.preventDefault();
    setActiveHandler("newUser");
    console.log(activeHandler);
    //static
    switch (timeType) {
      case "day":
        if (new Date(startDate) > new Date(endDate)) {
          alert("Ngày bắt đầu không thể sau ngày kết thúc.");
          return;
        }
        try {
          setForm("New User Regesting");
          const dates = getDatesInRange(startDate, endDate, "day");
          console.log("Date Labels:", dates);
          setDateLabels(dates);
          if (dates.length === 1 || onDate) {
            setChartType("bar");
            const registrationCounts = [];
            if (onDate) {
              setEndDate(onDate);
            }
            const response = await LoadUserCountBetweenDates(
              startDate,
              endDate
            );
            const genreData = response.data;
            const newGenreLabels = Object.keys(genreData);
            const newTrackCounts = Object.values(genreData);
            setGenreLabels(newGenreLabels);
            setTrackCounts(newTrackCounts);

            console.log(registrationCounts);
            setRegistrationData(registrationCounts);
          } else {
            setChartType("line");
            console.log("Fetching data for day:", startDate, endDate);
            const response = await LoadUserCountBetweenDates(
              startDate,
              endDate
            );
            console.log("Fetched data for day...", response);
            const registrationCounts = [];
            const dateData = response.data;
            dateLabels.forEach((date) => {
              registrationCounts.push(dateData[date] || 0);
            });
            console.log(registrationCounts);
            setRegistrationData(registrationCounts);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu:", error);
          setError("Đã có lỗi xảy ra khi tải dữ liệu.");
        }
        break;

      //case week
      case "week":
        try {
          setForm("New User Registering by Week");
          const response = await LoadUserCountBetweenWeek(
            startWeek,
            endWeek,
            "week"
          );
          const dateData = response.data;
          const weekLabels = Object.keys(dateData);
          const registrationCounts = Object.values(dateData);

          setDateLabels(weekLabels);
          setRegistrationData(registrationCounts);
          setChartType("line");
          console.log("Weekly Registration Counts:", registrationCounts);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu tuần:", error);
          setError("Đã có lỗi xảy ra khi tải dữ liệu tuần.");
        }
        break;

      //casemonth
      case "month":
        try {
          setForm("New User Registering by Month");
          const response = await LoadUserCountBetweenMonth(
            startMonth,
            endMonth
          );
          const dateData = response.data;
          const monthLabels = Object.keys(dateData);
          const registrationCounts = Object.values(dateData);

          setDateLabels(monthLabels);
          setRegistrationData(registrationCounts);
          setChartType("line");
          console.log("Monthly Registration Counts:", registrationCounts);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu tháng:", error);
          setError("Đã có lỗi xảy ra khi tải dữ liệu tháng.");
        }
        break;
    }
  };

  //newTrack
  const handleNewTrack = async () => {
    event.preventDefault();
    setActiveHandler("newTrack");
    console.log(activeHandler);
    switch (timeType) {
      case "day":
        if (new Date(startDate) > new Date(endDate)) {
          alert("Ngày bắt đầu không thể sau ngày kết thúc.");
          return;
        }
        try {
          setForm("New Track Regesting");
          console.log("Date inputs:", startDate, endDate);
          const dates = getDatesInRange(startDate, endDate, "day");
          console.log("Date Labels:", dates);
          setDateLabels(dates);

          if (dates.length === 1 || onDate) {
            setChartType("bar");
            setEndDate(onDate);
            const response = await LoadTrackCountBetweenDates(
              startDate,
              endDate
            );
            const genreData = response.data;
            const newGenreLabels = Object.keys(genreData);
            const newTrackCounts = Object.values(genreData);
            setGenreLabels(newGenreLabels);
            setTrackCounts(newTrackCounts);
            dateLabels.forEach((date) => {
              registrationCounts.push(dateData[date] || 0);
            });
            console.log(registrationCounts);
            setRegistrationData(registrationCounts);
          } else {
            setChartType("line");
            const response = await LoadTrackCountBetweenDates(
              startDate,
              endDate
            );
            const registrationCounts = [];
            const dateData = response.data;
            dateLabels.forEach((date) => {
              registrationCounts.push(dateData[date] || 0);
            });
            console.log(registrationCounts);
            setRegistrationData(registrationCounts);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu:", error);
          setError("Đã có lỗi xảy ra khi tải dữ liệu.");
        }
        break;

      //case week
      case "week":
        try {
          setForm("New Track Registering by Week");
          const response = await LoadTrackCountBetweenWeek(
            startWeek,
            endWeek,
            "week"
          );
          const dateData = response.data;
          const weekLabels = Object.keys(dateData);
          const registrationCounts = Object.values(dateData);

          setDateLabels(weekLabels);
          setRegistrationData(registrationCounts);
          setChartType("line");
          console.log("Weekly Registration Counts:", registrationCounts);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu tuần:", error);
          setError("Đã có lỗi xảy ra khi tải dữ liệu tuần.");
        }
        break;
      //casemonth
      case "month":
        try {
          setForm("New Track Registering by Month");
          const response = await LoadTrackCountBetweenMonth(
            startMonth,
            endMonth
          );
          const dateData = response.data;
          const monthLabels = Object.keys(dateData);
          const registrationCounts = Object.values(dateData);

          setDateLabels(monthLabels);
          setRegistrationData(registrationCounts);
          setChartType("line");
          console.log("Monthly Registration Counts:", registrationCounts);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu tháng:", error);
          setError("Đã có lỗi xảy ra khi tải dữ liệu tháng.");
        }
        break;
    }
  };

    // //newAlbum
    const handleNewAlbum = async () => {
      event.preventDefault();
      setActiveHandler("newAlbum");
      console.log(activeHandler);
      switch (timeType) {
        case "day":
          if (new Date(startDate) > new Date(endDate)) {
            alert("Ngày bắt đầu không thể sau ngày kết thúc.");
            return;
          }
          try {
            setForm("New Track Regesting");
            const dates = getDatesInRange(startDate, endDate, "day");
            console.log("Date Labels:", dates);
            setDateLabels(dates);
  
            if (dates.length === 1 || onDate) {
              setChartType("bar");
              setEndDate(onDate);
              const response = await LoadAlbumCountBetweenDates(
                startDate,
                endDate
              );
              const genreData = response.data;
              const newGenreLabels = Object.keys(genreData);
              const newTrackCounts = Object.values(genreData);
              setGenreLabels(newGenreLabels);
              setTrackCounts(newTrackCounts);
              dateLabels.forEach((date) => {
                registrationCounts.push(dateData[date] || 0);
              });
              console.log(registrationCounts);
              setRegistrationData(registrationCounts);
            } else {
              setChartType("line");
              const response = await LoadAlbumCountBetweenDates(
                startDate,
                endDate
              );
              const registrationCounts = [];
              const dateData = response.data;
              dateLabels.forEach((date) => {
                registrationCounts.push(dateData[date] || 0);
              });
              console.log(registrationCounts);
              setRegistrationData(registrationCounts);
            }
          } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setError("Đã có lỗi xảy ra khi tải dữ liệu.");
          }
          break;
  
        //case week
        case "week":
          try {
            setForm("New Track Registering by Week");
            const response = await LoadAlbumCountBetweenWeek(
              startWeek,
              endWeek,
              "week"
            );
            const dateData = response.data;
            const weekLabels = Object.keys(dateData);
            const registrationCounts = Object.values(dateData);
  
            setDateLabels(weekLabels);
            setRegistrationData(registrationCounts);
            setChartType("line");
            console.log("Weekly Registration Counts:", registrationCounts);
          } catch (error) {
            console.error("Lỗi khi tải dữ liệu tuần:", error);
            setError("Đã có lỗi xảy ra khi tải dữ liệu tuần.");
          }
          break;
        //casemonth
        case "month":
          try {
            setForm("New Track Registering by Month");
            const response = await LoadAlbumCountBetweenMonth(
              startMonth,
              endMonth
            );
            const dateData = response.data;
            const monthLabels = Object.keys(dateData);
            const registrationCounts = Object.values(dateData);
  
            setDateLabels(monthLabels);
            setRegistrationData(registrationCounts);
            setChartType("line");
            console.log("Monthly Registration Counts:", registrationCounts);
          } catch (error) {
            console.error("Lỗi khi tải dữ liệu tháng:", error);
            setError("Đã có lỗi xảy ra khi tải dữ liệu tháng.");
          }
          break;
      }
    };
    // //newPlaylist
    const handleNewPlayList = async () => {
      event.preventDefault();
      setActiveHandler("newPlayList");
      console.log(activeHandler);
      switch (timeType) {
        case "day":
          if (new Date(startDate) > new Date(endDate)) {
            alert("Ngày bắt đầu không thể sau ngày kết thúc.");
            return;
          }
          try {
            setForm("New Track Regesting");
            const dates = getDatesInRange(startDate, endDate, "day");
            console.log("Date Labels:", dates);
            setDateLabels(dates);
  
            if (dates.length === 1 || onDate) {
              setChartType("bar");
              setEndDate(onDate);
              const response = await LoadPlayListCountBetweenDates(
                startDate,
                endDate
              );
              const genreData = response.data;
              const newGenreLabels = Object.keys(genreData);
              const newTrackCounts = Object.values(genreData);
              setGenreLabels(newGenreLabels);
              setTrackCounts(newTrackCounts);
              dateLabels.forEach((date) => {
                registrationCounts.push(dateData[date] || 0);
              });
              console.log(registrationCounts);
              setRegistrationData(registrationCounts);
            } else {
              setChartType("line");
              const response = await LoadPlayListCountBetweenDates(
                startDate,
                endDate
              );
              const registrationCounts = [];
              const dateData = response.data;
              dateLabels.forEach((date) => {
                registrationCounts.push(dateData[date] || 0);
              });
              console.log(registrationCounts);
              setRegistrationData(registrationCounts);
            }
          } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setError("Đã có lỗi xảy ra khi tải dữ liệu.");
          }
          break;
  
        //case week
        case "week":
          try {
            setForm("New Track Registering by Week");
            const response = await LoadPlayListountBetweenWeek(
              startWeek,
              endWeek
            );
            const dateData = response.data;
            const weekLabels = Object.keys(dateData);
            const registrationCounts = Object.values(dateData);
  
            setDateLabels(weekLabels);
            setRegistrationData(registrationCounts);
            setChartType("line");
            console.log("Weekly Registration Counts:", registrationCounts);
          } catch (error) {
            console.error("Lỗi khi tải dữ liệu tuần:", error);
            setError("Đã có lỗi xảy ra khi tải dữ liệu tuần.");
          }
          break;
        //casemonth
        case "month":
          try {
            setForm("New Track Registering by Month");
            const response = await LoadPlayListCountBetweenMonth(
              startMonth,
              endMonth
            );
            const dateData = response.data;
            const monthLabels = Object.keys(dateData);
            const registrationCounts = Object.values(dateData);
  
            setDateLabels(monthLabels);
            setRegistrationData(registrationCounts);
            setChartType("line");
            console.log("Monthly Registration Counts:", registrationCounts);
          } catch (error) {
            console.error("Lỗi khi tải dữ liệu tháng:", error);
            setError("Đã có lỗi xảy ra khi tải dữ liệu tháng.");
          }
          break;
      }
    };

  const handleMostTrackUploader = async (event) => {
    event.preventDefault();
    try {
      setForm("Most Track uploader");
      setChartType("bar");

      let response;
      switch (timeType) {
        case "day":
          if (new Date(startDate) > new Date(endDate)) {
            alert("Ngày bắt đầu không thể sau ngày kết thúc.");
            return;
          }
          console.log("Fetching data for day:", startDate, endDate);
          response = await LoadMostUploader(startDate, endDate);
          break;

        case "week":
          console.log("Fetching data for week:", startWeek, endWeek);
          response = await LoadMostUploader(startWeek, endWeek);
          break;

        case "month":
          console.log("Fetching data for month:", startMonth, endMonth);
          response = await LoadMostUploader(startMonth, endMonth);
          break;

        default:
          console.error("Invalid time type:", timeType);
          return;
      }

      const userData = response;
      const userLabels = userData.map((item) => item.userId);
      const trackCounts = userData.map((item) => item.trackCount);
      // Cập nhật state
      setGenreLabels(userLabels); // Thiết lập nhãn cho biểu đồ là `userId`
      setTrackCounts(trackCounts); // Thiết lập dữ liệu cho biểu đồ là `trackCount`
      console.log("User Labels:", userLabels);
      console.log("Track Counts:", trackCounts);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setError("Đã có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  //newTrackbyGenre
  const handleTrackGenre = async () => {
    try {
      setForm("New track created by genre");
      setChartType("bar");
      const response = await LoadTrackCountBetweenDatesGenre(
        startDate,
        endDate
      );
      const registrationCounts = [];
      const genreData = response.data;
      const newGenreLabels = Object.keys(genreData);
      const newTrackCounts = Object.values(genreData);
      setGenreLabels(newGenreLabels);
      setTrackCounts(newTrackCounts);
      dateLabels.forEach((date) => {
        registrationCounts.push(dateData[date] || 0);
      });
      console.log(registrationCounts);
      setRegistrationData(registrationCounts);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setError("Đã có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  const handleMostFollowed = async () => {
    try {
      setForm("Most Followed");
      setChartType("bar");

      const response = await LoadMostFollowed();
      const Data = response.data;

      // Tách tên người dùng và số lượng người theo dõi từ dữ liệu trả về
      const Labels = Data.map((item) => item[0]); // Lấy tên người dùng
      const Counts = Data.map((item) => item[1]); // Lấy số lượng người theo dõi
      setGenreLabels(Labels);
      setTrackCounts(Counts);
      setRegistrationData(Counts);

      console.log("Labels:", Labels);
      console.log("Counts:", Counts);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setError("Đã có lỗi xảy ra khi tải dữ liệu.");
    }
  };

  return (
    <div>
      {/* Dropdown chọn loại thời gian */}
      <div className="col-3 d-flex flex-column border rounded bg-white">
        <form className="p-3">
          <div className="mt-3">
            <label className="form-label">Chọn loại thời gian</label>
            <select className="form-control" onChange={handleTimeTypeChange}>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </form>
      </div>

      {/* Hiển thị các section dựa trên lựa chọn */}
      {timeType === "day" && (
        <section className="row mt-5 d-flex justify-content-start gap-3">
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">From Day</label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">To Day</label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">On Day</label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setOnDate(e.target.value)}
                />
              </div>
            </form>
          </div>
        </section>
      )}

      {timeType === "week" && (
        <section className="row mt-5 d-flex justify-content-start gap-3">
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">From Week</label>
                <input
                  type="week"
                  className="form-control"
                  onChange={(e) => setStartWeek(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">To Week</label>
                <input
                  type="week"
                  className="form-control"
                  onChange={(e) => setEndWeek(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">On Week</label>
                <input
                  type="week"
                  className="form-control"
                  onChange={(e) => setOnWeek(e.target.value)}
                />
              </div>
            </form>
          </div>
        </section>
      )}

      {timeType === "month" && (
        <section className="row mt-5 d-flex justify-content-start gap-3">
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">From Month</label>
                <input
                  type="month"
                  className="form-control"
                  onChange={(e) => setStartMonth(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">To Month</label>
                <input
                  type="month"
                  className="form-control"
                  onChange={(e) => setEndMonth(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="col-3 d-flex flex-column border rounded bg-white">
            <form className="p-3">
              <div className="mt-3">
                <label className="form-label">On Month</label>
                <input
                  type="month"
                  className="form-control"
                  onChange={(e) => setOnMonth(e.target.value)}
                />
              </div>
            </form>
          </div>
        </section>
      )}
      <button onClick={handleNewUser} className="btn btn-primary m-3">
        New User Regesting
      </button>
      <button onClick={handleNewTrack} className="btn btn-primary m-3">
        New track created
      </button>
      <button onClick={handleNewAlbum} className="btn btn-primary m-3">
        New Album created
      </button>
      <button onClick={handleNewPlayList} className="btn btn-primary m-3">
        New playlist created
      </button>
      <button onClick={handleMostFollowed} className="btn btn-primary m-3 ">
        Most Followed User
      </button>
      <button
        onClick={handleMostTrackUploader}
        className="btn btn-primary m-3 "
      >
        Most Track Uploader
      </button>
      <button onClick={handleTrackGenre} className="btn btn-primary m-3 ">
        New track by genre
      </button>

      {chartType === "line" ? (
        <Line
          className="mt-5"
          data={createChartData(dateLabels, registrationData, form)}
        />
      ) : (
        <Bar
          className="mt-5"
          data={createChartData(genreLabels, trackCounts, form)}
        />
      )}
      {console.log(logger)}
      <table className=" table">
        <thead>
          <tr>
            {tableData.headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{tableData.rows}</tbody>
      </table>
    </div>
  );
}

export default Statistical;
