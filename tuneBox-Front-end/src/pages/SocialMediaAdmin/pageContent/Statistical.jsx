import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  LoadUserCountBetweenDates,
  LoadPostCountBetweenDates,
  LoadTrackCountBetweenDates,
  LoadTrackCountBetweenDatesGenre,
} from "../../../service/SocialMediaAdminService";
function Statistical() {
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(() => new Date());
  const [dateLabels, setDateLabels] = useState([]);
  const [error, setError] = useState("");
  const [registrationData, setRegistrationData] = useState([]);
  const [form, setForm] = useState("");
  const [chartType, setChartType] = useState("");
  const [genreLabels, setGenreLabels] = useState([]);
  const [trackCounts, setTrackCounts] = useState([]);

  const getDatesInRange = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);  // Thêm 1 ngày vào endDate
  
    while (currentDate < end) { // Bây giờ sẽ bao gồm cả ngày kết thúc
      dateArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dateArray;
  };
  
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
      const dates = getDatesInRange(startDate, endDate);
      console.log("Date Labels:", dates);
      setDateLabels(dates);
    }
  }, [startDate, endDate]);
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

  //newuser
  const handleDateChange = async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Ngày bắt đầu không thể sau ngày kết thúc.");
      return;
    }
    try {
      setForm("New User Regesting");
      setChartType("line");
      const response = await LoadUserCountBetweenDates(startDate, endDate);
      const registrationCounts = [];
      const dateData = response.data;
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

  //newTrack
  const handleNewTrack = async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Ngày bắt đầu không thể sau ngày kết thúc.");
      return;
    }
    try {
      setForm("New track created");
      setChartType("line");
      const response = await LoadTrackCountBetweenDates(startDate, endDate);
      const registrationCounts = [];
      const dateData = response.data;
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

  //newTrackbyGenre
  const handleTrackGenre = async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Ngày bắt đầu không thể sau ngày kết thúc.");
      return;
    }
    try {
      setForm("New track created by genre");
      setChartType("bar");
      const response = await LoadTrackCountBetweenDatesGenre(
        startDate,
        endDate
      );
      const registrationCounts = [];
      const genreData = response.data;
      const newGenreLabels  = Object.keys(genreData);
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

  const handlePost = async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Ngày bắt đầu không thể sau ngày kết thúc.");
      return;
    }

    try {
      setForm("Tổng số post theo ngày");
      setChartType("line");
      const response = await LoadPostCountBetweenDates(startDate, endDate);
      const dateData = response.data;

      // Tạo một mảng để chứa dữ liệu post được định dạng cho biểu đồ
      const normalizedCounts = {};
      for (let key in dateData) {
        const dateKey = key.split("T")[0];
        normalizedCounts[dateKey] = dateData[key];
      }

      console.log("Normalized Data:", normalizedCounts);

      // Sử dụng dateLabels để tạo postCounts
      const postCounts = dateLabels.map((date) => normalizedCounts[date] || 0);

      console.log("Post Counts:", postCounts);
      setRegistrationData(postCounts);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      setError("Có lỗi xảy ra khi lấy dữ liệu.");
    }
  };

  return (
    <div>
      <section className="row mt-5 d-flex justify-content-start gap-3">
        <div className="col-3 d-flex flex-column border rounded bg-white">
          <form className="p-3">
            <div className="mt-3">
              <label className="form-label">Form</label>
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
              <label className="form-label">To</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </form>
        </div>
      </section>
      <button onClick={handleDateChange} className="btn btn-primary m-3">
      New User Regesting
      </button>
      <button onClick={handlePost} className="btn btn-primary m-3 ">
        New post created
      </button>
      <button onClick={handleNewTrack} className="btn btn-primary m-3">
       New track created
      </button>
      <button onClick={handleTrackGenre} className="btn btn-primary m-3 ">
      New track by genre
      </button>
      <table>
        
      </table>

      {chartType === "line" ? (
        <Line
          className="mt-5"
          data={createChartData(dateLabels, registrationData, form)}
        />
      ) : (
        <Bar className="mt-5" data={createChartData(genreLabels, trackCounts, form)} />
      )}
    </div>
  );
}

export default Statistical;
