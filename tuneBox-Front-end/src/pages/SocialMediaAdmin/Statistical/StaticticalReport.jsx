import React, { useState, useEffect, useCallback } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  LoadAllTrackReport,
  LoadAllUserReport,
  LoadAllAlbumReport,
  LoadAllPostReport,
} from "../../../service/SocialMediaAdminService";

function StaticticalReport() {
  const [reportUser, setReportUser] = useState([]);
  const [reportTrack, setReportTrack] = useState([]);
  const [reportAlbum, setReportAlbum] = useState([]);
  const [reportPost, setReportPost] = useState([]);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {

      dates.push(currentDate.toLocaleDateString("en-CA"));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };
  
  const fetchData = async () => {
    //rp Album
    const responseLoadAllAlbumReport = await LoadAllAlbumReport();
    if (responseLoadAllAlbumReport.status) {
      setReportAlbum(responseLoadAllAlbumReport.data);
    }
    //rp user
    const responseLoadAllUserReport = await LoadAllUserReport();
    if (responseLoadAllUserReport.status) {
      setReportUser(responseLoadAllUserReport.data);
    }

    //rp Track
    const responseLoadAllTrackReport = await LoadAllTrackReport();
    if (responseLoadAllTrackReport.status) {
      setReportTrack(responseLoadAllTrackReport.data);
    }

    const responseLoadAllPostReport = await LoadAllPostReport();
    if (responseLoadAllPostReport.status) {
      setReportPost(responseLoadAllPostReport.data);
    }
  };
  // goi Api
  useEffect(() => {
    fetchData();
  }, []);

  const createChartData = (data) => {
    const dates = getDatesBetween(sevenDaysAgo, today);
    const aggregatedData = dates.map((date) => ({
      date,
      count: data.filter(
        (item) => item.createDate === date
      ).length,
    }));

    return {
      labels: dates,
      datasets: [
        {
          label: "Report Count",
          data: aggregatedData.map((item) => item.count),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const createChartRPUser = () => createChartData(reportUser);
  const createChartRPTrack = () => createChartData(reportTrack);
  const createChartRPAlbum = () => createChartData(reportAlbum);
  const createChartRPPost = () => createChartData(reportPost);

  return (
    <div>
      <label>Nearest Report</label>
      <div className="row">
        <div className="col-6">
          <label>Report User</label>
          <Line className="mt-5" data={createChartRPUser()} />
        </div>
        <div className="col-6">
          <label>Report Track</label>
          <Line className="mt-5" data={createChartRPTrack()} />
        </div>
        <div className="col-6">
          <label>Report Album</label>
          <Line className="mt-5" data={createChartRPAlbum()} />
        </div>
        <div className="col-6">
          <label>Report Post</label>
          <Line className="mt-5" data={createChartRPPost()} />
        </div>
      </div>
    </div>
  );
}

export default StaticticalReport;
